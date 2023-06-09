import express from 'express';
import userModel from '../models/users.js';
import bcrypt from 'bcrypt'
import logger from '../middlewares/logger.js';
import validateUser from '../middlewares/validateUser.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

//GET
router.get('/users', logger, verifyToken, async (req, res) => {
  const { page = 1 , pageSize = 99} = req.query;
  const skip = (page - 1) * pageSize;

  try {
    const users = await userModel.find()
    .populate('posts', 'title content') //filtro
    .limit(parseInt(pageSize))
    .skip(parseInt(skip));

    const totalUsers = await userModel.count();

    res.status(200).send({
      statusCode: 200,
      count : totalUsers,
      currentPage: +page,
      totalPages: Math.ceil(totalUsers/pageSize),
      users
    });
  } catch (error) {
    res.status(500).send({
      message: 'Errore interno del server',
    });
  }
});

//POST
const saltRounds = 10;

router.post('/users', validateUser, async (req, res) => {
  const { firstName, lastName, email, password, age } = req.body;

  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.status(409).send({
        statusCode: 409,
        message: "L'utente esiste già",
      });
    }

    const hashPassword = await bcrypt.hash(password, saltRounds);

    const user = new userModel({
      firstName,
      lastName,
      email,
      password: hashPassword,
      age,
    });

    const newUser = await user.save();

    res.status(201).send({
      message: 'Utente salvato con successo nel database',
      newUser,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Errore interno del server',
    });
  }
});


//PATCH
router.patch('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, password, age } = req.body;

  if (!firstName && !lastName && !email && !password && !age) {
    return res.status(400).send({
      statusCode: 400,
      message: 'Nessun campo da aggiornare fornito',
    });
  }

  try {
    const user = await userModel.findByIdAndUpdate(id, req.body, { new: true });

    if (!user) {
      return res.status(404).send({
        message: 'Utente inesistente',
      });
    }

    res.status(200).send({
      message: 'Utente modificato',
      user,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Errore interno del server',
    });
  }
});

//DELETE
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await userModel.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).send({
        message: 'Utente inesistente',
        statusCode: 404,
      });
    }

    res.status(200).send({
      message: `Utente con ID ${id} rimosso dal database`,
      statusCode: 200,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: 'Errore interno del server',
    });
  }
});

export default router;

