import { body, validationResult } from 'express-validator';


const validateEmailAndPassword = [
  body('recipientEmail')
  .isEmail()
  .withMessage('Invalid email address.')
  .bail(),

  body('dataPassword')
  .custom((value) => {
    if (!value || value !== process.env.ADMIN_PASSWORD) {
      return false;
    }
    return true;
  })
  .withMessage('Invalid password. Access denied.')
  .bail(),


  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((error) => ({
          param: error.param,
          msg: error.msg,
        })),
      });
    }
    next();
  },
];
const validateContactForm = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('phone').notEmpty().withMessage('Phone number is required'),
  body('service').notEmpty().withMessage('Service type is required'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];
const validateNewsletterSubscription = [
  body('email').isEmail().withMessage('Please provide a valid email address'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

export { validateEmailAndPassword, validateContactForm, validateNewsletterSubscription };
