import dotenv from 'dotenv';

dotenv.config();

const config = {
  recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY,
  hostEmail: process.env.HOST_EMAIL,
  emailPassword: process.env.EMAIL_PASSWORD,
  emailService: process.env.EMAIL_SERVICE,
  secureService: process.env.SECURE_SERVICE,
  portService: process.env.PORT_SERVICE,
  mongoUri: process.env.MONGO_URI,
  sessionSecret: process.env.SESSION_SECRET,
  nodeEnv: process.env.NODE_ENV,
  port: process.env.PORT,
  buildexAdminEmail: process.env.BUILDEX_ADMIN_EMAIL,
  buildexAdminPhone: process.env.BUILDEX_ADMIN_PHONE,
  buildexInstagramUrl: process.env.BUILDEX_INSTAGRAM_URL,
  buildexCalendarUrl: process.env.BUILDEX_CALENDAR_URL,
  buildexGoogleUrl: process.env.BUILDEX_GOOGLE_URL,
  buildexAPPName: process.env.BUILDEX_APP_NAME,
  adminPassword: process.env.ADMIN_PASSWORD,


};

export default config;
