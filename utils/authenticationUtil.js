import config from '../config';
import jwtUtil from './jwtUtil';
/**
 * It checks if the token is valid, if it is, it returns the user data, else it returns an error
 * message
 * @param token - The token that is to be verified.
 * @returns An object with two properties: success and data
 * @example
 * if the token is valid
 *          {
 *              "success": true,
 *              "data": user data
 *          }
 * otherwise
 *          {
 *              "success": false,
 *              "data": Error message
 *          }
 */
export default function checkAuthentication(token) {
    try {
        // check if the token is in valid datatype, i.e. not undefined, or null.
        if (!token || typeof token == 'undefined' || token == null) {
            return {
                success: false,
                statusCode: 401,
                message: "Authorization Token Invalid"
            };
        }

        // get the data from the token and validate.
        let data = jwtUtil.decodeToken(token);
        // if some error is occured while decoding the token.
        if (!data) {
            return {
                success: false,
                statusCode: 401,
                message: "Authorization Token Invalid, Please try signing in again"
            };
        }

        // if the token is expired.
        let tokenExpired = (Math.floor(Date.now() / 1000) - data.iat) >= data.expires_in;
        if (tokenExpired) {
            return {
                success: false,
                statusCode: 401,
                message: "Authorization Token is Expired"
            };
        }

        if (jwtUtil.verifyToken(token, config.JWT_SECRET)) { // if token signature is verified
            return {
                success: true,
                data: data.userDetails
            };
        } else {
            return {
                success: false,
                statusCode: 401,
                message: "Authorization Token Invalid, Please try signing in again"
            };
        }
    } catch (error) {
        // console.error(error);
        // if some error has occurred
        return {
            success: false,
            statusCode: 500,
            message: "Something went wrong, Please try again later"
        };
    }
}
