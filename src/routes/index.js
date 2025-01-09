import express from 'express';
import { contactForm, newsletterSubscription, subscribersData } from '../controllers/homeController.js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import Newsletter from '../models/Newsletter.js'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const router = express.Router();
dotenv.config();


// GET
router.get('/', (req, res, next) => {
    const { BUILDEX_ADMIN_EMAIL: adminEmail, BUILDEX_ADMIN_PHONE: adminPhone, BUILDEX_ADMIN_INSTAGRAM: adminInstagram } = process.env;
    res.status(200).render('index', { title: 'Buildex Construction', isHome: true, adminEmail, adminPhone, adminInstagram })
});

router.get('/projects', (req, res, next) => {
    const services = Array.from({ length: 29 }, (_, i) => ({
        imageUrl: `img/prevWorks/p${i + 1}.jpeg`,
    }));

    const { BUILDEX_ADMIN_EMAIL: adminEmail, BUILDEX_ADMIN_PHONE: adminPhone, BUILDEX_ADMIN_INSTAGRAM: adminInstagram } = process.env;
    res.status(200).render('partials/projects', {
        title: 'Buildex Construction',
        adminEmail,
        adminPhone,
        adminInstagram,
        services
    });
});

router.get('/error', (req, res, next) => {
    const { BUILDEX_ADMIN_EMAIL: adminEmail, BUILDEX_ADMIN_PHONE: adminPhone, BUILDEX_ADMIN_INSTAGRAM: adminInstagram } = process.env;
    res.status(200).render('error', { title: 'Buildex Construction', adminEmail, adminPhone, adminInstagram })
});

router.get('/contact', (req, res, next) => {
    const { BUILDEX_ADMIN_EMAIL: adminEmail, BUILDEX_ADMIN_PHONE: adminPhone, BUILDEX_ADMIN_INSTAGRAM: adminInstagram } = process.env;
    res.status(200).render('contact', { title: 'Buildex Construction', adminEmail, adminPhone, adminInstagram })
});


// Ensure the folder exists
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const subscribersDir = join(__dirname, '..', 'subscribers');

const ensureDirectoryExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

router.get('/subscribers', subscribersData);
// POST
router.post('/contact', contactForm);

router.post('/newsletter', newsletterSubscription);



export default router;
