import express from 'express';
import dotenv from 'dotenv';
import { contactForm, newsletterSubscription, subscribersData} from '../controllers/homeController.js';

dotenv.config();

const router = express.Router();

// Helper function 
const getAdminDetails = () => {
    const { BUILDEX_ADMIN_EMAIL, BUILDEX_ADMIN_PHONE, BUILDEX_ADMIN_INSTAGRAM } = process.env;
    return { BUILDEX_ADMIN_EMAIL, BUILDEX_ADMIN_PHONE, BUILDEX_ADMIN_INSTAGRAM };
};

// GET Routes

// Home route
router.get('/', (req, res) => {
    const { BUILDEX_ADMIN_EMAIL, BUILDEX_ADMIN_PHONE, BUILDEX_ADMIN_INSTAGRAM } = getAdminDetails();
    res.status(200).render('index', { 
        title: 'Buildex Construction', 
        isHome: true, 
        adminEmail: BUILDEX_ADMIN_EMAIL, 
        adminPhone: BUILDEX_ADMIN_PHONE, 
        adminInstagram: BUILDEX_ADMIN_INSTAGRAM 
    });
});

// Projects page route
router.get('/projects', (req, res) => {
    const services = Array.from({ length: 29 }, (_, i) => ({
        imageUrl: `img/prevWorks/p${i + 1}.jpeg`
    }));
    const { BUILDEX_ADMIN_EMAIL, BUILDEX_ADMIN_PHONE, BUILDEX_ADMIN_INSTAGRAM } = getAdminDetails();
    res.status(200).render('partials/projects', {
        title: 'Buildex Construction',
        adminEmail: BUILDEX_ADMIN_EMAIL,
        adminPhone: BUILDEX_ADMIN_PHONE,
        adminInstagram: BUILDEX_ADMIN_INSTAGRAM,
        services
    });
});

// Error page route
router.get('/error', (req, res) => {
    const { BUILDEX_ADMIN_EMAIL, BUILDEX_ADMIN_PHONE, BUILDEX_ADMIN_INSTAGRAM } = getAdminDetails();
    res.status(200).render('error', {
        title: 'Buildex Construction',
        adminEmail: BUILDEX_ADMIN_EMAIL,
        adminPhone: BUILDEX_ADMIN_PHONE,
        adminInstagram: BUILDEX_ADMIN_INSTAGRAM
    });
});

// Contact page route
router.get('/contact', (req, res) => {
    const { BUILDEX_ADMIN_EMAIL, BUILDEX_ADMIN_PHONE, BUILDEX_ADMIN_INSTAGRAM } = getAdminDetails();
    res.status(200).render('contact', {
        title: 'Buildex Construction',
        adminEmail: BUILDEX_ADMIN_EMAIL,
        adminPhone: BUILDEX_ADMIN_PHONE,
        adminInstagram: BUILDEX_ADMIN_INSTAGRAM
    });
});

// Subscribers route (Admin page)
router.get('/admin', (req, res) => {
      const { BUILDEX_ADMIN_EMAIL, BUILDEX_ADMIN_PHONE, BUILDEX_ADMIN_INSTAGRAM } = getAdminDetails();
    res.render('partials/passwordPrompt', { 
        title: 'Admin'.
        adminEmail: BUILDEX_ADMIN_EMAIL,
        adminPhone: BUILDEX_ADMIN_PHONE,
        adminInstagram: BUILDEX_ADMIN_INSTAGRAM
    });
});

// POST Routes

// Contact form submission
router.post('/contact', contactForm);

// Newsletter subscription
router.post('/newsletter', newsletterSubscription);

// Subscribers data submission 
router.post('/send-subscribers', subscribersData);

export default router;
