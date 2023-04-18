module.exports = {
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/kidsapp',
  JWT_SECRET: process.env.JWT_SECRET || 'somethingsecret',
  MAIL_SERVICE_PORT: process.env.MAIL_SERVICE_PORT || 465,
  GMAIL_ADDRESS: process.env.GMAIL_ADDRESS || "",
  GMAIL_PASS: process.env.GMAIL_PASS || "",
  ADMIN_NAME: process.env.ADMIN_NAME || "Palak",
  ADMIN_MAIL: process.env.ADMIN_MAIL || "thapapalak0209@gmail.com",
  MEGA_EMAIL: process.env.MEGA_EMAIL || "",
  MEGA_PASSWORD: process.env.MEGA_PASSWORD || "",
  moduleItemsModelMap: {
    'pick-correct': 'pickCorrectModel',
    'match-correct': 'matchCorrectModel'
  }
};
