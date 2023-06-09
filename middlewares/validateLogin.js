import { check, validationResult } from 'express-validator';

export const validateLogin = [
  check('email')
    .isEmail()
    .withMessage('Inserisci una email valida')
    .normalizeEmail(),
  check('password')
    .isLength({ min: 1 })
    .withMessage('La password è richiesta'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export default validateLogin