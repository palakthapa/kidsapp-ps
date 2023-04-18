import { File } from 'megajs'
import dbConnect from '../../../../../services/dbService';
import checkAuthentication from '../../../../../utils/authenticationUtil';
import { logError } from '../../../../../utils/loggingUtil';
import LearningModule from '../../../../../models/learningModulesModel';
import megaService from '../../../../../services/megaStorageService';
import fs from 'fs';
import path from 'path';
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function getLearningModules(req, res) {
    try {

        await dbConnect();
        await megaService();

        const userAuthToken = req.headers.cookie?.match(/(?<=user_auth_token=)[^;]+/)?.[0].trim();
        if (!userAuthToken || userAuthToken === '') {
            return res.status(401).send("Not authorized");
        }
        let auth = checkAuthentication(userAuthToken);
        if (!(auth && auth.success)) {
            res.status(auth.statusCode).send(auth.message);
            return;
        }

        const { method } = req;
        switch (method) {
            case 'GET':
                const modulesData = await LearningModule.findOne({ module_id: req.query.moduleId }, { image_url: true });
                if (!modulesData) {
                    return res.status(404).send("File not found");
                }

                // Get the file object from the URL
                try {
                    const file = File.fromURL(modulesData.image_url);
                    await file.loadAttributes();
                    file.download().pipe(res);
                } catch (error) {
                    fs.createReadStream("./pages/api/file/broken_img.png").pipe(res);
                }


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
