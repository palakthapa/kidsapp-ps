import dbConnect from '../../services/dbService';
import User from '../../models/userModel';
import { logError } from '../../utils/loggingUtil';
import jwtUtil from '../../utils/jwtUtil';
import checkAuthentication from '../../utils/authenticationUtil';
import config from '../../config';

export default async function userprofile(req, res) {

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

                let user = await User.findById(auth.data._id);
                if (!user) {
                    res.status(400).send("User not found");
                    break;
                }

                let payload = {
                    "_id": user._id,
                    "email": user.email,
                    "name": user.name,
                    "isAdmin": user.isAdmin,
                    "isNewUser": user.isNewUser
                };

                if(user.isNewUser != auth.data.isNewUser) {
                    payload = {
                        "userDetails": payload,
                        "expires_in": 24 * 60 * 60
                    }
                    
                    payload.token = jwtUtil.createToken(payload);
                }

                res.status(200).send(payload);

                break;

            default:
                res.status(400).json("Path not found")
                break;
        }

    } catch (error) {
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
};