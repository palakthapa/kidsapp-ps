// delete module (DELETE)
import formidable from 'formidable';
import dbConnect from '../../../../../services/dbService';
import checkAuthentication from '../../../../../utils/authenticationUtil';
import { logError } from '../../../../../utils/loggingUtil';
import LearningModule from '../../../../../models/learningModulesModel';
import Item from '../../../../../models/itemsModel';
import megaService from '../../../../../services/megaStorageService';
import { File as MegaFile } from 'megajs'
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function learningModulesData(req, res) {
    try {

        await dbConnect();

        let auth = checkAuthentication(req.headers.authorization);
        if (!(auth && auth.success)) {
            res.status(auth.statusCode).send(auth.message);
            return;
        }

        if (!auth.data.isAdmin) {
            res.status(401).send("Not authorized");
            return;
        }

        const moduleId = req.query.moduleId;
        if (!LearningModule.exists({ module_id: moduleId })) {
            res.status(403).send("Module Not Found");
            return;
        }

        const megaClient = await megaService();
        // if (!megaClient) {
        //     return res.status(500).json({ error: "Something Went wrong." });
        // }

        const { method } = req;
        switch (method) {
            case 'GET':
                const moduleData = await LearningModule.findOne({ module_id: moduleId }, { _id: false, items: true })
                await moduleData.populate("items");
                const items = [];
                moduleData.items.forEach(element => {
                    items.push({
                        "item_id": element.item_id,
                        "name": element.name,
                        "image_url": "/api/file/learning/" + moduleId + "/" + element.item_id + "/image",
                        "sound_url": "/api/file/learning/" + moduleId + "/" + element.item_id + "/sound",
                        "timestamp": element.timestamp
                    });
                });
                res.status(200).json(items);

                break;

            case 'POST':

                const itemForm = new formidable.IncomingForm({ keepExtensions: true });
                const { fields: itemFields, files: itemFiles } = await new Promise((resolve, reject) => {
                    itemForm.parse(req, async (err, fields, files) => {
                        if (err) reject("Error Occured Parsing Form : " + err.message);
                        else resolve({ fields, files });
                    });
                })

                const uuid = uuidv4();
                const itemImageFile = itemFiles.imageFile;
                const itemSoundFile = itemFiles.soundFile;

                if (!(itemImageFile && itemSoundFile)) return res.status(403).json({ error: "Image and Sound files not found." });

                const itemImageMegaOpts = {
                    name: "image_" + uuid + "." + itemImageFile.originalFilename.split(".").pop(),
                    size: itemImageFile.size,
                    attributes: { type: itemImageFile.mimetype }
                };
                const itemSoundMegaOpts = {
                    name: "sound_" + uuid + "." + itemSoundFile.originalFilename.split(".").pop(),
                    size: itemSoundFile.size,
                    attributes: { type: itemSoundFile.mimetype }
                };

                const itemImageUploadStream = megaClient.upload(itemImageMegaOpts);
                fs.createReadStream(itemImageFile.filepath).pipe(itemImageUploadStream);

                const itemSoundUploadStream = megaClient.upload(itemSoundMegaOpts);
                fs.createReadStream(itemSoundFile.filepath).pipe(itemSoundUploadStream);

                const itemImageUploadedFile = await itemImageUploadStream.complete;
                const itemSoundUploadedFile = await itemSoundUploadStream.complete;

                const newItem = new Item({
                    "item_id": uuid,
                    "name": itemFields.itemName,
                    "image_url": await itemImageUploadedFile.link(),
                    "sound_url": await itemSoundUploadedFile.link()
                })

                await newItem.save();
                await LearningModule.findOneAndUpdate({ module_id: moduleId }, {
                    "$push": {
                        items: newItem._id
                    }
                });

                res.status(200).json({ message: 'Item saved successfully' });

                break;

            case 'PATCH':

                const moduleForm = new formidable.IncomingForm({ keepExtensions: true });
                const { fields: moduleFields, files: moduleFiles } = await new Promise((resolve, reject) => {
                    moduleForm.parse(req, async (err, fields, files) => {
                        if (err) reject("Error Occured Parsing Form : " + err.message);
                        else resolve({ fields, files });
                    });
                })

                const editModuleData = await LearningModule.findOne({ module_id: moduleId }, { items: false });

                const updateData = {};
                if (moduleFields.moduleName && editModuleData.name !== moduleFields.moduleName) updateData.name = moduleFields.moduleName;
                if (moduleFields.includedIn && JSON.stringify(editModuleData.included_in) !== JSON.stringify(moduleFields.includedIn)) updateData.included_in = JSON.parse(moduleFields.includedIn);

                const moduleImageFile = moduleFiles.imageFile;
                if (moduleImageFile) {
                    const imageOldFile = MegaFile.fromURL(editModuleData.image_url);
                    try {
                        await imageOldFile.loadAttributes();
                        const files = Object.values(megaClient.files);
                        const mutableFile = files.find(file => {
                            return file.name === imageOldFile.name;
                        })
                        await mutableFile.delete(true);
                    } catch (error) {

                    }

                    const moduleImageMegaOpts = {
                        name: editModuleData.module_id + "." + moduleImageFile.originalFilename.split(".").pop(),
                        size: moduleImageFile.size,
                        attributes: { type: moduleImageFile.mimetype }
                    };

                    const moduleImageUploadStream = megaClient.upload(moduleImageMegaOpts);
                    fs.createReadStream(moduleImageFile.filepath).pipe(moduleImageUploadStream);

                    const moduleImageUploadedFile = await moduleImageUploadStream.complete;
                    updateData.image_url = await moduleImageUploadedFile.link();
                }

                await editModuleData.updateOne({ ...updateData });
                res.status(200).json({ message: 'Module updated successfully' });

                break;

            case 'DELETE':
                res.status(200).send("success")
                break;

            default:
                res.status(400).json("Path not found")
                break;

        }
    } catch (error) {
        // if anything goes wrong
        let code = error.code;
        let message = error.message;

        logError(code, message);

        switch (code) {
            case 'CLIENT_ERROR':
                break;
            case 'EREFUSED':
            default:
                message = "Some went wrong; Please try again later";
                break;
        }
        res.status(500).send(message);
    }
}
