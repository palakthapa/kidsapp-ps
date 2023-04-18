// delete module (DELETE)
import formidable from 'formidable';
import { moduleItemsModelMap } from '../../../../../config';
import dbConnect from '../../../../../services/dbService';
import checkAuthentication from '../../../../../utils/authenticationUtil';
import { logError } from '../../../../../utils/loggingUtil';
import quizItemsModel from '../../../../../models/quizItemsModel';
import megaService from '../../../../../services/megaStorageService';
import fs from 'fs';
import { File as MegaFile } from 'megajs';
export const config = {
    api: {
        bodyParser: false,
    },
};

const deleteFile = async (link) => {
    const megaClient = await megaService();

    const oldFile = MegaFile.fromURL(link);
    try {
        await oldFile.loadAttributes();
        const files = Object.values(megaClient.files);
        const mutableFile = files.find(file => {
            return file.name === oldFile.name;
        })
        await mutableFile.delete(true);
    } catch (error) {

    }
}

const replaceFile = async (file, oldFileUrl, uuid, prefix = "") => {
    const megaClient = await megaService();

    await deleteFile(oldFileUrl);

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
            return res.status(403).send("Module not found");
        }

        const itemId = req.query.itemId;
        if (!(await quizItemsModel[moduleItemsModelMap[moduleId]].exists({ item_id: itemId }))) {
            return res.status(403).send("Item Not Found");
        }

        const megaClient = await megaService();

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

                const itemData = await quizItemsModel[moduleItemsModelMap[moduleId]].findOne({ item_id: itemId })

                const updateData = {};
                const imageFile = files.imageFile;
                const soundFile = files.soundFile;

                switch (moduleId) {
                    case "pick-correct":
                        if (fields.question && itemData.question !== fields.question) updateData.question = fields.question;
                        if (fields.options && JSON.stringify(itemData.options) !== fields.options) updateData.options = JSON.parse(fields.options);
                        if (fields.correctOption && itemData.correctOption !== parseInt(fields.correctOption)) updateData.correctOption = parseInt(fields.correctOption);

                        if (imageFile) {
                            updateData.image_url = await replaceFile(imageFile, itemData.image_url, itemData.item_id, "image_");
                        }
                        if (soundFile) {
                            updateData.sound_url = await replaceFile(soundFile, itemData.sound_url, itemData.item_id, "sound_");
                        }
                        break;

                    case "match-correct":
                        if (fields.question && itemData.question !== fields.question) updateData.question = fields.question;
                        if (fields.leftOptions && JSON.stringify(itemData.leftOptions) !== fields.leftOptions) updateData.leftOptions = JSON.parse(fields.leftOptions);
                        if (fields.rightOptions && JSON.stringify(itemData.rightOptions) !== fields.rightOptions) updateData.rightOptions = JSON.parse(fields.rightOptions);
                        if (fields.correctMatch && JSON.stringify(itemData.correctMatch) !== fields.correctMatch) updateData.correctMatch = JSON.parse(fields.correctMatch);
                        break;

                    default:
                        break;
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
