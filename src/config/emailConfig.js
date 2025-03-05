import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const createEmailTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    host: process.env.HOST_SERVICE,
    port: process.env.PORT_SERVICE,
    secure: process.env.SECURE_SERVICE === 'true',
    auth: {
      user: process.env.HOST_EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

export { createEmailTransporter };
