const Mega = require('megajs');
import config from '../config'
import { MEGA_ERROR_MESSAGES } from '../errorMessages/megaErrors';
const EMAIL = config.MEGA_EMAIL;
const PASSWORD = config.MEGA_PASSWORD;

export default (function () {
    // if email and password are not specified
    if (!(EMAIL && PASSWORD)) {
        return function () {
            const error = new Error(MEGA_ERROR_MESSAGES["CONN_CREDS_UNDEF"]);
            error.code = "CONN_CREDS_UNDEF";
            throw error;
        }
    }

    // return a promise that resolves in an object instance of MEGA Connection
    let megaInstance = null;
    return async function () {
        if (megaInstance) return megaInstance;

        const megaClient = new Mega({ email: EMAIL, password: PASSWORD });
        await megaClient.ready;
        megaInstance = megaClient;
        return megaInstance;
    }
})();