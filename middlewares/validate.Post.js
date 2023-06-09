import { check, validationResult } from 'express-validator';

export const validatePost = [
  check('title')
    .isLength({ min: 1 })
    .withMessage('Il titolo è richiesto')
    .trim() // rimuove spazi bianchi all'inizio e alla fine
    .escape(), // sostituisce i caratteri HTML speciali con le loro entità HTML corrispondenti
  check('content')
    .isLength({ min: 1 })
    .withMessage('Il contenuto è richiesto')
    .trim()
    .escape(),
  check('author')
    .isLength({ min: 1 })
    .withMessage("L'autore è richiesto")
    .trim()
    .escape(),
  check('rate')
    .isNumeric()
    .withMessage('Il voto deve essere un numero')
    .toInt(), // converte il voto in un numero intero
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];


export default validatePost