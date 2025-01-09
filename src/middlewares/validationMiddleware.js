import { body, validationResult } from 'express-validator';

const validateEmailAndPassword = [
  body('recipientEmail')
    .isEmail()
    .withMessage('Invalid email address.')
    .bail(),  // Stop further validations 

  body('dataPassword')
    .custom((value) => {
      if (!value || value !== process.env.ADMIN_PASSWORD) {
        throw new Error('Invalid password. Access denied.');
      }
      return true;
    })
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

export default validateEmailAndPassword;
