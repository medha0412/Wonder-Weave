require('dotenv').config()


module.exports = {
    jwtSecret: process.env.JWT_SECRET,
    jwtExpire: process.env.JWT_EXPIRE,
    mongoURI: process.env.MONGO_URI,
    node_env: process.env.NODE_ENV,
  };
  