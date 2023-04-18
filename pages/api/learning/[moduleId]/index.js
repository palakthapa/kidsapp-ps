import dbConnect from '../../../../services/dbService';
import checkAuthentication from '../../../../utils/authenticationUtil';
import { logError } from '../../../../utils/loggingUtil';
import LearningModule from '../../../../models/learningModulesModel';
import Item from '../../../../models/itemsModel';

export default async function learningModulesData(req, res) {
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
                const moduleId = req.query.moduleId;
                if (!LearningModule.exists({ module_id: moduleId })) {
                    res.status(403).send("Module Not Found");
                    return;
                }

                if (req.query.items && req.query.items === '1') {
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
                } else {
                    const moduleData = await LearningModule.findOne({ module_id: moduleId }, { items: false })
                    const data = {
                        "module_id": moduleData.module_id,
                        "name": moduleData.name,
                        "image_url": "/api/file/learning/" + moduleData.module_id + "/image",
                        "timestamp": moduleData.timestamp
                    }
                    res.status(200).json(data);
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
