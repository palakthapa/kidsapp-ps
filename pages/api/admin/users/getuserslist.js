// import crypto from 'crypto';
import dbConnect from '../../../../services/dbService';
import User from '../../../../models/userModel';
import checkAuthentication from '../../../../utils/authenticationUtil';
// import UserData from '../../../models/userDataModel';
// import jwtUtil from '../../../utils/jwtUtil';
import { logError } from '../../../../utils/loggingUtil';

export default async function getUsers(req, res) {
    try {

        await dbConnect();

        const { method } = req;
        switch (method) {
            case 'GET':
                let auth = checkAuthentication(req.headers.authorization);
                if (!(auth && auth.success)) {
                    res.status(auth.statusCode).send(auth.message);
                    break;
                }

                if (!auth.data.isAdmin) {
                    res.status(401).send("Not authorized");
                    break;
                }

                const users = await User.find({ isAdmin: false }, { hash: false, salt: false, userDataRef: false });

                res.status(200).send(users);
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
