import { check, validationResult } from 'express-validator';

export const validateUser = [
  check('firstName')
    .isLength({ min: 1 })
    .withMessage('Il nome è richiesto')
    .trim()
    .escape(),
  check('lastName')
    .isLength({ min: 1 })
    .withMessage('Il cognome è richiesto')
    .trim()
    .escape(),
  check('email')
    .isEmail()
    .withMessage('Inserisci una email valida')
    .normalizeEmail(), // normalizza l'email
  check('password')
    .isLength({ min: 8 })
    .withMessage('La password deve avere almeno 8 caratteri'),
  check('age')
    .isNumeric()
    .withMessage('L\'età deve essere un numero')
    .toInt(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export default validateUser;
