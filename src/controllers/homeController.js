import axios from 'axios';
import Newsletter from '../models/Newsletter.js';
import dotenv from 'dotenv';
import { validateContactForm, validateNewsletterSubscription, validateEmailAndPassword } from '../middlewares/validationMiddleware.js';
import { createEmailTransporter } from '../config/emailConfig.js';

const transporter = createEmailTransporter();

dotenv.config();

const contactForm = [
  validateContactForm, 

  async (req, res) => {
    const { name, email, phone, service, message, 'g-recaptcha-response': recaptchaToken } = req.body;
    if (!recaptchaToken) {
      return res.status(400).json({ success: false, message: 'reCAPTCHA token is missing.' });
    }

    try {
      // reCAPTCHA verification
      const recaptchaResponse = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: recaptchaToken,
        },
      });

      if (!recaptchaResponse.data.success) {
        return res.status(400).json({ success: false, message: 'reCAPTCHA verification failed.' });
      }

      const mailOptions = {
        from: process.env.HOST_EMAIL,
        to: process.env.HOST_EMAIL,
        subject: 'Contact Form Submission',
        text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\nMessage: ${message}`,
        replyTo: email,
      };

      const acknowledgmentMailOptions = {
        from: process.env.HOST_EMAIL,
        to: email,
        subject: 'We Have Received Your Inquiry',
        text: `Dear ${name},\n\nThank you for contacting Buildex Construction. We have received your inquiry and our team will respond to you shortly.\n\nBest regards,\nYour Handyman`,
      };

      await transporter.sendMail(mailOptions);
      await transporter.sendMail(acknowledgmentMailOptions);

      return res.status(200).json({ success: true, message: 'Form submitted and acknowledgment email sent.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'An error occurred while processing your request.' });
    }
  },
];

const newsletterSubscription = [
  validateNewsletterSubscription, 

  async (req, res) => {
    const { email } = req.body;
    try {
      const existingSubscription = await Newsletter.findOne({ email });
      if (existingSubscription) {
        return res.status(400).json({ success: false, message: 'Email is already subscribed.' });
      }

      const newSubscription = new Newsletter({ email });
      await newSubscription.save();

      return res.status(201).json({ success: true, message: 'Newsletter subscription successful.' });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'An error occurred while processing your request.' });
    }
  },
];

const subscribersData = [
  validateEmailAndPassword, 

  async (req, res) => {
    try {
      const subscribers = await Newsletter.find();
      const currentDate = new Date().toISOString().split('T')[0];
      const subscribersJson = JSON.stringify(subscribers, null, 2);
      const numberOfSubscribers = subscribers.length;

      const jsonAttachment = {
        filename: `${numberOfSubscribers} of subscribers_${currentDate}.json`,
        content: subscribersJson,
        encoding: 'utf-8',
      };
    
      const mailOptions = {
        from: process.env.HOST_EMAIL,
        to: req.body.recipientEmail,
        subject: `Subscribers List for ${currentDate}`,
        text: `Here is the list of subscribers as of ${currentDate}:`,
        attachments: [jsonAttachment],
      };
    
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ success: true, message: `Subscribers sent to your email.` });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Could not send!' });
    }
  },
];

export { contactForm, newsletterSubscription, subscribersData };
