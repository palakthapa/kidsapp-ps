import dbConnect from '../../../services/dbService';
import checkAuthentication from '../../../utils/authenticationUtil';
import { logError } from '../../../utils/loggingUtil';
import PnSModule from '../../../models/pnsModulesModel';

export default async function getPnSModules(req, res) {
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
