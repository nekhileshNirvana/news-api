if (typeof process.env.NODE_ENV === 'undefined') {
    const dotenv = require('dotenv');
  
    // Set the NODE_ENV to 'development' by default
    process.env.NODE_ENV = 'development';
  
    const envFound = dotenv.config();
  
    if (envFound.error) {
      // This error should crash whole process
  
      throw new Error("⚠️  Couldn't find .env file  ⚠️");
    }
  }
  
  const configParams = {
    /**
     * Your favorite port
     */
    port: parseInt(process.env.PORT, 10),
  
    /**
     * Your secret sauce
     */
    // jwtSecret: process.env.JWT_SECRET,
    // jwtAlgorithm: process.env.JWT_ALGO,
  
    /**
     * Used by winston logger
     */
    logs: {
      level: process.env.LOG_LEVEL || 'silly',
    },
  
    /**
     * API configs
     */
    api: {
      prefix: (process.env.APP_ROOT_PATH || '') + '/api',
    },
  
  };
  
  module.exports = configParams;
  