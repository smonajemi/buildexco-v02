import { body, validationResult } from 'express-validator';
import axios from 'axios';
import nodemailer from 'nodemailer';
import Newsletter from '../models/Newsletter.js'; // Assuming you have this model

// Create a nodemailer transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  host: process.env.HOST_SERVICE,
  port: process.env.PORT_SERVICE,
  secure: process.env.SECURE_SERVICE === 'true',
  auth: {
    user: process.env.HOST_EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Contact Form Submission Route
export const contactForm = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('service').notEmpty().withMessage('Service type is required'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, phone, service, message, 'g-recaptcha-response': recaptchaToken } = req.body;

    // Check if reCAPTCHA token is provided
    if (!recaptchaToken) {
      return res.status(400).json({ success: false, message: 'reCAPTCHA token is missing.' });
    }

    try {
      // Verify the reCAPTCHA token with Google
      const recaptchaResponse = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        },
      });
      if (!recaptchaResponse.data.success) {
        return res.status(400).json({ success: false, message: 'reCAPTCHA verification failed.' });
      }

      // Mail options for admin
      const mailOptions = {
        from: process.env.HOST_EMAIL,
        // to: process.env.HOST_EMAIL,
        to: 'sina.monajemi@me.com',
        subject: 'Contact Form Submission',
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\nMessage: ${message}`,
        replyTo: email,
      };

      // Mail options for acknowledgment to user
      const acknowledgmentMailOptions = {
        from: process.env.HOST_EMAIL,
        to: email,
        subject: 'We Have Received Your Inquiry',
        text: `Dear ${name},\n\nThank you for contacting Buildex Construction. We have received your inquiry and our team will respond to you shortly.\n\nBest regards,\nYour Handyman`,
      };

      // Send emails
      await transporter.sendMail(mailOptions);
      await transporter.sendMail(acknowledgmentMailOptions);

      return res.status(200).json({ success: true, message: 'Form submitted and acknowledgment email sent.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'An error occurred while processing your request.' });
    }
  },
];

// Newsletter Subscription Route
export const newsletterSubscription = [
  body('email').isEmail().withMessage('Please provide a valid email address'),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email } = req.body;

    try {
      // Check if the email is already subscribed
      const existingSubscription = await Newsletter.findOne({ email });
      if (existingSubscription) {
        return res.status(400).json({ success: false, message: 'Email is already subscribed.' });
      }

      // Save the new subscription to the database
      const newSubscription = new Newsletter({ email });
      await newSubscription.save();

      // Send notification email to admin
      const mailOptions = {
        from: process.env.HOST_EMAIL,
        to: process.env.HOST_EMAIL,
        subject: 'New Newsletter Subscription',
        text: `A new email has subscribed: ${email}`,
      };

      await transporter.sendMail(mailOptions);

      return res.status(201).json({ success: true, message: 'Newsletter subscription successful.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'An error occurred while processing your request.' });
    }
  },
];
