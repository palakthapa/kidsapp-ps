import { File } from 'megajs'
import dbConnect from '../../../../../services/dbService';
import checkAuthentication from '../../../../../utils/authenticationUtil';
import { logError } from '../../../../../utils/loggingUtil';
import PnSModule from '../../../../../models/pnsModulesModel';
import megaService from '../../../../../services/megaStorageService';
export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function getLearningModules(req, res) {
    try {

        await dbConnect();
        await megaService()

        const userAuthToken = req.headers.cookie?.match(/(?<=user_auth_token=)[^;]+/)?.[0].trim();
        if (!userAuthToken || userAuthToken === '') {
            return res.status(401).send("Not authorized");
        }
        let auth = checkAuthentication(userAuthToken);
        if (!(auth && auth.success)) {
            res.status(auth.statusCode).send(auth.message);
            return;
        }

        const moduleId = req.query.moduleId;
        if(!await PnSModule.exists({module_id: moduleId})) {
            return res.status(404).send("Module not found");
        }

        const { method } = req;
        switch (method) {
            case 'GET':
                const moduleData = await PnSModule.findOne({ module_id: moduleId }, { sound_url: true });
                if (!moduleData) {
                    return res.status(404).send("File not found");
                }

                // Get the file object from the URL
                try {
                    const file = File.fromURL(moduleData.sound_url);
                    await file.loadAttributes();
                    file.download().pipe(res);
                } catch (error) {
                    fs.createReadStream("./pages/api/file/broken_sound.mp3").pipe(res);
                }

                break;

            default:
                res.status(400).json("Path not found");
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
