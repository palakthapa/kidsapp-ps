import dbConnect from '../../../services/dbService';
import checkAuthentication from '../../../utils/authenticationUtil';
import { logError } from '../../../utils/loggingUtil';
import quizItemsModel from '../../../models/quizItemsModel';
import { moduleItemsModelMap } from '../../../config';

export default async function quizModulesData(req, res) {
    try {

        await dbConnect();

        let auth = checkAuthentication(req.headers.authorization);
        if (!(auth && auth.success)) {
            res.status(auth.statusCode).send(auth.message);
            return;
        }

        const moduleId = req.query.moduleId;
        if (!Object.keys(moduleItemsModelMap).includes(moduleId)) {
            res.status(403).send("Module Id is not correct");
        }

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
