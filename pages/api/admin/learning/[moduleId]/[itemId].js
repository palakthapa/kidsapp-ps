// get items Data (GET)
// edit module (POST)
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

        const itemId = req.query.itemId;
        if (!Item.exists({ item_id: itemId })) {
            res.status(403).send("Item Not Found");
            return;
        }

        const megaClient = await megaService();
        // if (!megaClient) {
        //     return res.status(500).json({ error: "Something Went wrong." });
        // }

        const { method } = req;
        switch (method) {
            case 'PATCH':

                const form = new formidable.IncomingForm({ keepExtensions: true });
                const { fields, files } = await new Promise((resolve, reject) => {
                    form.parse(req, async (err, fields, files) => {
                        if (err) reject("Error Occured Parsing Form : " + err.message);
                        else resolve({ fields, files });
                    });
                })

                const itemData = await Item.findOne({ item_id: itemId });

                const updateData = {};
                if (fields.itemName && itemData.name !== fields.itemName) updateData.name = fields.itemName;

                const imageFile = files.imageFile;
                if (imageFile) {
                    const imageOldFile = MegaFile.fromURL(itemData.image_url);
                    try {
                        await imageOldFile.loadAttributes();
                        const files = Object.values(megaClient.files);
                        const mutableFile = files.find(file => {
                            return file.name === imageOldFile.name;
                        })
                        await mutableFile.delete(true);
                    } catch (error) {

                    }

                    const imageMegaOpts = {
                        name: "image_" + itemData.item_id + "." + imageFile.originalFilename.split(".").pop(),
                        size: imageFile.size,
                        attributes: { type: imageFile.mimetype }
                    };
                    const imageUploadedFile = await megaClient.upload(imageMegaOpts, fs.readFileSync(imageFile.filepath)).complete;
                    updateData.image_url = await imageUploadedFile.link();
                }

                const soundFile = files.soundFile;
                if (soundFile) {
                    const soundOldFile = MegaFile.fromURL(itemData.sound_url);
                    try {
                        await soundOldFile.loadAttributes();
                        const files = Object.values(megaClient.files);
                        const mutableFile = files.find(file => {
                            return file.name === soundOldFile.name;
                        })
                        mutableFile.delete(true);
                    } catch (error) {

                    }

                    const soundMegaOpts = {
                        name: "sound_" + itemData.item_id + "." + soundFile.originalFilename.split(".").pop(),
                        size: soundFile.size,
                        attributes: { type: soundFile.mimetype }
                    };
                    const soundUploadedFile = await megaClient.upload(soundMegaOpts, fs.readFileSync(soundFile.filepath)).complete;
                    updateData.sound_url = await soundUploadedFile.link();
                }

                await itemData.updateOne({ ...updateData });
                res.status(200).json({ message: 'Item updated successfully' });

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
