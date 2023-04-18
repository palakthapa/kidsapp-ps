// delete module (DELETE)
import formidable from 'formidable';
import { moduleItemsModelMap } from '../../../../../config'
import dbConnect from '../../../../../services/dbService';
import checkAuthentication from '../../../../../utils/authenticationUtil';
import { logError } from '../../../../../utils/loggingUtil';
import quizItemsModel from '../../../../../models/quizItemsModel';
import megaService from '../../../../../services/megaStorageService';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
export const config = {
    api: {
        bodyParser: false,
    },
};

const uploadFile = async (file, uuid, prefix = "") => {
    if (!file) return null;

    const megaClient = await megaService();

    const fileMegaOpts = {
        name: prefix + uuid + "." + file.originalFilename.split(".").pop(),
        size: file.size,
        attributes: { type: file.mimetype }
    };

    const fileUploadStream = megaClient.upload(fileMegaOpts);
    fs.createReadStream(file.filepath).pipe(fileUploadStream);

    const uploadedFile = await fileUploadStream.complete;
    return await uploadedFile.link();
}

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
        if (!Object.keys(moduleItemsModelMap).includes(moduleId)) {
            res.status(403).send("Module Id is not correct");
        }

        const megaClient = await megaService();
        // if (!megaClient) {
        //     return res.status(500).json({ error: "Something Went wrong." });
        // }

        const { method } = req;
        switch (method) {
            case 'GET':
                const itemsData = await quizItemsModel[moduleItemsModelMap[moduleId]].find({}, { _id: false, __v: false })
                const items = [];
                itemsData.forEach(element => {
                    items.push({
                        ...element._doc,
                        ... (element.image_url ? { "image_url": "/api/file/quiz/" + moduleId + "/" + element.item_id + "/image" } : {}),
                        ... (element.sound_url ? { "sound_url": "/api/file/quiz/" + moduleId + "/" + element.item_id + "/sound" } : {}),
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

                let newItemData = null;
                switch (moduleId) {

                    case "pick-correct":
                        if (!itemSoundFile) {
                            res.status(403).json({ error: "Sound file not found" });
                            return;
                        }

                        newItemData = {
                            "item_id": uuid,
                            "question": itemFields.question,
                            "options": JSON.parse(itemFields.options),
                            "correctOption": parseInt(itemFields.correctOption),
                            "sound_url": await uploadFile(itemSoundFile, uuid, "sound_")
                        };

                        if (itemImageFile) newItemData.image_url = await uploadFile(itemImageFile, uuid, "image_");

                        break;

                    case "match-correct":

                        newItemData = {
                            "item_id": uuid,
                            "question": itemFields.question,
                            "leftOptions": JSON.parse(itemFields.leftOptions),
                            "rightOptions": JSON.parse(itemFields.rightOptions),
                            "correctMatch": JSON.parse(itemFields.correctMatch)
                        }

                        break;
                        
                    default:
                        break;
                }

                if (newItemData) {
                    const newItem = new quizItemsModel[moduleItemsModelMap[moduleId]](newItemData);
                    await newItem.save();
                }
                res.status(200).json({ message: 'Item created successfully' });

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
