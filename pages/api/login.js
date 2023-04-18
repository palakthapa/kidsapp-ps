import crypto from 'crypto';
import dbConnect from '../../services/dbService';
import User from '../../models/userModel';
import jwtUtil from '../../utils/jwtUtil';
import { logError } from '../../utils/loggingUtil';

export default async function login(req, res) {

    try {

        await dbConnect();

        const { method } = req;
        switch (method) {
            case 'POST':

                let email = req.body.email;
                // if "email" is not specified, or it is something other than string
                if (!req.body.email || typeof req.body.email != 'string') {
                    const error = new Error("Email is not specified");
                    error.code = "CLIENT_ERROR";
                    throw error;
                }
                let user = await User.findOne({ email: email });
                // if user does not exists,
                // send an unsuccessful attempt indication to client
                if (!user) {
                    const error = new Error("User Does Not Exist");
                    error.code = "CLIENT_ERROR";
                    throw error;
                } else { // otherwise send a jwt authentication token
                    let hash = user.hash;
                    let salt = user.salt;

                    let inputPass = req.body.password;

                    let newHash = crypto.createHash('sha256')
                        .update(inputPass + salt)
                        .digest('hex');

                    // if hash in database matches with new hash created through
                    // password by client and salt from database
                    if (hash == newHash) {
                        // use this payLoad to create a JWT Token with
                        // user's data and `jwt_secret_key` in user's database
                        const payLoad = {
                            "userDetails": {
                                "_id": user._id,
                                "email": user.email,
                                "name": user.name,
                                "isAdmin": user.isAdmin,
                                "isNewUser": user.isNewUser
                            },
                            "expires_in": 24 * 60 * 60
                        }

                        payLoad.token = jwtUtil.createToken(payLoad);
                        res.status(200).json(payLoad);
                    } else {
                        const error = new Error("Invalid Email or Password");
                        error.code = "CLIENT_ERROR";
                        throw error;
                    }
                    // otherwise send an unsuccessful attempt indication to client
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