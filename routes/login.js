import express from 'express';
import userModel from '../models/users.js';
import bcrypt from 'bcrypt';
import jwt  from 'jsonwebtoken';
const router = express.Router();


//POST
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  // Controllo se l'utente non esiste
  if (!user) {
    return res.status(404).send({
      statusCode: 404,
      message: 'Utente non trovato',
    });
  }

  const validPassword = await bcrypt.compare(password, user.password) //(password login, password trovata su mongodb)
  if(!validPassword){
    return res.status(400).send({
      statusCode: 400,
      message: 'Password errata',
    });
  }

  //Generiamo token da mandare a frontend
  const token = jwt.sign({
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    age: user.age,
    id: user._id
    },process.env.SECRET_JWT_KEY, {expiresIn: '24h'})

  //visto che ho generato un token, non ha senso restituire questo sotto...
  /* res.status(200).send({
    user,
    message: "Login effettuato con successo"
  }); */

  //...ma ci verrà restituito
  res.header('auth', token).status(200).send({
    token,
    user
  })
  
});

export default router;
