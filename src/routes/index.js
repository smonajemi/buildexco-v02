import express from 'express';
import { contactForm, newsletterSubscription, subscribersData } from '../controllers/homeController.js';
import path from 'path';
import { fileURLToPath } from 'url';
import attachAdminDetails from '../middlewares/attachAdminDetails.js';
import sanitizeHtml from 'sanitize-html';
import axios from 'axios';

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

// Projects page route (Sanitized)
router.get('/projects', (req, res) => {
    const services = Array.from({ length: 29 }, (_, i) => ({
        imageUrl: sanitizeHtml(`img/prevWorks/p${i + 1}.jpeg`, {
            allowedTags: [],
            allowedAttributes: {}
        })
    }));

    res.status(200).render('partials/projects', {
        services
    });
});

// Error page route
router.get('/error', (req, res) => {
    res.status(404).render('error');
});

// Contact page route
router.get('/contact', (req, res) => {
    res.status(200).render('contact');
});

// Admin page route (Sanitized)
router.get('/admin', (req, res) => {
    res.render('partials/passwordPrompt', { 
        title: sanitizeHtml('Admin') 
    });
});

router.get('/img/logo', (req, res, next) => {
    const logoImage = path.resolve(__dirname, '../public/img/logo.png'); 
    res.sendFile(logoImage);
});

// POST Routes
router.post('/contact', contactForm);
router.post('/newsletter', newsletterSubscription);
router.post('/send-subscribers', subscribersData);
router.post('/chat', async (req, res) => {
    try {
      const { chatPrompt } = req.body;
  
      const response = await axios.post(process.env.OPENAI_API_URL, {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `
              You are a friendly and professional AI assistant for BuildExCo, a company specializing in renovations, construction, and painting in Ontario, Canada.
      
              Only answer questions related to these services and based on information found on www.buildexco.com. If asked something unrelated, politely redirect the conversation to relevant topics.
      
              Your job is to assist potential customers by:
              - Asking what type of project they’re working on (e.g., home renovation, commercial space, interior/exterior painting)
              - Asking where they are located in Ontario
              - Engaging with their specific needs (e.g., timeline, budget, preferred materials, design style)
              - Offering helpful, concise guidance and service suggestions
              - Asking follow-up questions to better understand and support their project
      
              Example:
              "Hi there! 👋 Are you planning a home renovation, a commercial build, or a painting project? Where in Ontario are you located? I'd love to hear more about your project and help you take the next steps!"
            `,
          },
          {
            role: 'user',
            content: chatPrompt,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });
  
      const result = response.data.choices[0].message.content.trim();
      res.json({ result });
  
    } catch (err) {
      console.error('OpenAI API Error:', err.response?.data || err.message);
      res.status(500).json({ error: err.message });
    }
  });
  
  

export default router;
