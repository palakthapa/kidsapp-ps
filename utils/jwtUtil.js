import jwt from 'jsonwebtoken';
import config from '../config';

// A simple utility class to provide functionalities for creation and verification of a JWT Token
class JwtUtil {
    constructor() { }

    static createToken(data, sign = config.JWT_SECRET) {
        try {
            const token = jwt.sign(data, sign);
            return token;
        } catch (error) {
            // console.error(error);
            return ;
        }
    }

    static verifyToken(token, sign = config.JWT_SECRET) {
        try {
            const verified = jwt.verify(token, sign);
            return verified;
        } catch (error) {
            // console.error(error);
            return ;
        }
    }

    static decodeToken(token){
        try {
            const data = jwt.decode(token);
            return data;
        } catch (error) {
            // console.error(error);
            return ;
        }
    }
}

module.exports = JwtUtil;