import formidable from 'formidable';
import dbConnect from '../../../../services/dbService';
import checkAuthentication from '../../../../utils/authenticationUtil';
import { logError } from '../../../../utils/loggingUtil';
import PnSModule from '../../../../models/pnsModulesModel';
import megaService from '../../../../services/megaStorageService';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function getPnSModules(req, res) {
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
                const modulesData = await PnSModule.find({});

                const modules = [];
                modulesData.forEach((element) => {
                    let data = {
                        "module_id": element.module_id,
                        "name": element.name,
                        "content": element.content,
                        "images": [],
                        "timestamp": element.timestamp
                    }
                    for (let i = 0; i < element.images.length; i++) {
                        data.images[i] = "/api/file/pns/" + element.module_id + "/image?n=" + i;
                    }
                    modules.push(data);
                });
                res.status(200).json(modules);
                break;

            case 'POST':

                const form = new formidable.IncomingForm({ keepExtensions: true, multiples: true });
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
                const imageFiles = files.imageFiles;
                console.log(imageFiles)
                if (!imageFiles) return res.status(403).json({ error: "Image Files Not found." });
                const uploadedFiles = [];
                let i = 0;
                for (const file of imageFiles) {
                    const megaOpts = {
                        name: "image_" + i + "_" + uuid + "." + file.originalFilename.split(".").pop(),
                        size: file.size,
                        attributes: { type: file.mimetype }
                    };

                    const uploadStream = megaClient.upload(megaOpts);
                    fs.createReadStream(file.filepath).pipe(uploadStream);

                    const uploadedFile = await uploadStream.complete;
                    uploadedFiles.push(await uploadedFile.link());
                }

                const soundFile = files.soundFile;
                if (!soundFile) return res.status(403).json({ error: "Sound File Not found." });

                const megaOpts = {
                    name: "sound_" + uuid + "." + soundFile.originalFilename.split(".").pop(),
                    size: soundFile.size,
                    attributes: { type: soundFile.mimetype }
                };

                const uploadStream = megaClient.upload(megaOpts);
                fs.createReadStream(soundFile.filepath).pipe(uploadStream);

                const uploadedFile = await uploadStream.complete;

                const newModule = new PnSModule({
                    "module_id": uuid,
                    "name": fields.moduleName,
                    "content": fields.moduleContent,
                    "images": uploadedFiles,
                    "sound_url": await uploadedFile.link()
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
