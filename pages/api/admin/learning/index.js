import formidable from 'formidable';
import dbConnect from '../../../../services/dbService';
import checkAuthentication from '../../../../utils/authenticationUtil';
import { logError } from '../../../../utils/loggingUtil';
import LearningModule from '../../../../models/learningModulesModel';
import megaService from '../../../../services/megaStorageService';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function getLearningModules(req, res) {
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

        const { method } = req;
        switch (method) {
            case 'GET':
                const modulesData = await LearningModule.find({}, { items: false, image_url: false });

                const modules = [];
                modulesData.forEach(element => {
                    modules.push({
                        "module_id": element.module_id,
                        "name": element.name,
                        "image_url": "/api/file/learning/" + element.module_id + "/image",
                        "included_in": element.included_in,
                        "timestamp": element.timestamp
                    });
                });
                res.status(200).json(modules);
                break;

            case 'POST':

                const form = new formidable.IncomingForm({ keepExtensions: true });
                const { fields, files } = await new Promise((resolve, reject) => {
                    form.parse(req, async (err, fields, files) => {
                        if (err) reject("Error Occured Parsing Form : " + err.message);
                        else resolve({ fields, files });
                    });
                })

                const megaClient = await megaService();
                if (!megaClient) {
                    return res.status(500).json({ error: "Something Went wrong." });
                }

                const uuid = uuidv4();
                const file = files.imageFile;
                if (!file) return res.status(403).json({ error: "Image File Not found." });
                const megaOpts = {
                    name: uuid + "." + file.originalFilename.split(".").pop(),
                    size: file.size,
                    attributes: { type: file.mimetype }
                };

                const uploadStream = megaClient.upload(megaOpts);
                fs.createReadStream(file.filepath).pipe(uploadStream);

                const uploadedFile = await uploadStream.complete;
                const newModule = new LearningModule({
                    "module_id": uuid,
                    "name": fields.moduleName,
                    "image_url": await uploadedFile.link(),
                    "included_in": JSON.parse(fields.includedIn)
                })

                await newModule.save();
                res.status(200).json({ message: 'Module saved successfully' });

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
                message = "Something went wrong; Please try again later";
                break;
        }
        res.status(500).send(message);
    }
}
