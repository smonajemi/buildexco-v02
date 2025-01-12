import express from 'express';
import { contactForm, newsletterSubscription, subscribersData } from '../controllers/homeController.js';
import path from 'path';
import { fileURLToPath } from 'url';
import attachAdminDetails from '../middlewares/attachAdminDetails.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.use(attachAdminDetails);

// Home route
router.get('/', (req, res) => {
    res.status(200).render('index', { 
        isHome: true 
    });
});

// Projects page route
router.get('/projects', (req, res) => {
    const services = Array.from({ length: 29 }, (_, i) => ({
        imageUrl: `img/prevWorks/p${i + 1}.jpeg`
    }));
    res.status(200).render('partials/projects', {
        services
    });
});

// Error page route
router.get('/error', (req, res) => {
    res.status(200).render('error', {
    });
});

// Contact page route
router.get('/contact', (req, res) => {
    res.status(200).render('contact', {
    });
});

// Admin page route
router.get('/admin', (req, res) => {
    res.render('partials/passwordPrompt', { 
        title: 'Admin'
    });
});

// Logo page route
router.get('/img/logo', (req, res, next) => {
    const logoImage = path.resolve(__dirname, '../public/img/logo.png'); 
    res.sendFile(logoImage);
});



// POST Routes

// Contact form submission
router.post('/contact', contactForm);

// Newsletter subscription
router.post('/newsletter', newsletterSubscription);

// Subscribers data submission 
router.post('/send-subscribers', subscribersData);

export default router;
