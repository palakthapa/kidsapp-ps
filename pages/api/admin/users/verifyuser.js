import dbConnect from '../../../../services/dbService';
import User from '../../../../models/userModel';
import UserData from '../../../../models/userDataModel';
import { logError } from '../../../../utils/loggingUtil';
import checkAuthentication from '../../../../utils/authenticationUtil';

export default async function verifyUser(req, res) {
    try {

        await dbConnect();

        const { method } = req;
        switch (method) {
            case 'POST':

                let auth = checkAuthentication(req.headers.authorization);
                if (!(auth && auth.success)) {
                    res.status(auth.statusCode).send(auth.message);
                    break;
                }

                if(!auth.data.isAdmin) {
                    res.status(401).send("Not authorized");
                    break;
                }

                if(!req.body._id) {
                    res.status(403).send("Please provide a valid user id");
                    break;
                }

                const userData = new UserData();
                const user = await User.findByIdAndUpdate(req.body._id, {
                    "isNewUser": false,
                    "userDataRef": userData._id
                });

                if(!user) {
                    res.status(403).send("User Not Found");
                    break;
                }

                // store in database
                await userData.save();

                // use this payLoad to create a JWT Token so that later on, authorization of user
                // can be verified through it's signature verification using "JWT_SECRET" in 'config.js'
                // and then send response along with this JWT Token
                res.send({
                    "_id": user._id,
                    "email": user.email,
                    "name": user.name,
                    "isAdmin": user.isAdmin,
                    "isNewUser": user.isNewUser
                });

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
