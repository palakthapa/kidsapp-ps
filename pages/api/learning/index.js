import dbConnect from '../../../services/dbService';
import checkAuthentication from '../../../utils/authenticationUtil';
import { logError } from '../../../utils/loggingUtil';
import LearningModule from '../../../models/learningModulesModel';

export default async function getLearningModules(req, res) {
    try {

        await dbConnect();

        let auth = checkAuthentication(req.headers.authorization);
        if (!(auth && auth.success)) {
            res.status(auth.statusCode).send(auth.message);
            return;
        }

        const { method } = req;
        switch (method) {
            case 'GET':
                const modulesData = await LearningModule.find({}, { items: false, image_url: false, included_in: false });

                const modules = [];
                modulesData.forEach(element => {
                    modules.push({
                        "module_id": element.module_id,
                        "name": element.name,
                        "image_url": "/api/file/learning/" + element.module_id + "/image",
                        "timestamp": element.timestamp
                    });
                });
                res.status(200).json(modules);
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
