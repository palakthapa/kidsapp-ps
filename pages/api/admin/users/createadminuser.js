import crypto from 'crypto';
import dbConnect from '../../../../services/dbService';
import User from '../../../../models/userModel';
import UserData from '../../../../models/userDataModel';
import jwtUtil from '../../../../utils/jwtUtil';
import { logError } from '../../../../utils/loggingUtil';

export default async function createAdmin(req, res) {
    try {

        await dbConnect();

        const { method } = req;
        switch (method) {
            case 'POST':
                // check if the user for the given email already exists in database
                if (await User.exists({ email: req.body.email })) { // if user already exists,
                    // send an unsuccessful attempt indication to client 
                    res.status(403).send("user already exists");
                } else { // otherwise create a new user entry in database with
                    // salt and hash for password verification at later times
                    let inputPass = req.body.password;
                    let salt = crypto.randomBytes(10).toString('base64');
                    let hash = crypto.createHash('sha256')
                        .update(inputPass + salt)
                        .digest('hex');

                    let userData = new UserData();
                    userData.save();

                    // store in database
                    let user = new User({
                        "name": req.body.name,
                        "email": req.body.email,
                        "hash": hash,
                        "salt": salt,
                        "userDataRef": userData._id,
                        "isAdmin": true,
                        "isNewUser": false,
                    });
                    await user.save();

                    // use this payLoad to create a JWT Token so that later on, authorization of user
                    // can be verified through it's signature verification using "JWT_SECRET" in 'config.js'
                    // and then send response along with this JWT Token
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
                    res.send(payLoad);
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
