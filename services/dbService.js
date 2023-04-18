import mongoose from 'mongoose'
import config from '../config'
import { DB_ERROR_MESSAGES } from '../errorMessages/dbErrors';
const MONGODB_URI = config.MONGODB_URI;

export default (function () {

  if (!MONGODB_URI) {
    return function () {
      const error = new Error(DB_ERROR_MESSAGES["CONN_URI_UNDEF"]);
      error.code = "CONN_URI_UNDEF";
      throw error;
    }
  }

  let cached = global.mongoose;
  if (!cached) {
    cached = global.mongoose = { conn: null, promise: null }
  }

  return async function () {
    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        bufferCommands: false,
        // bufferMaxEntries: 0,
        // useFindAndModify: true,
        // useCreateIndex: true
      };

      cached.promise = mongoose.connect(MONGODB_URI, opts).then(mongoose => {
        return mongoose
      });
    }
    cached.conn = await cached.promise;
    return cached.conn;
  }
})()