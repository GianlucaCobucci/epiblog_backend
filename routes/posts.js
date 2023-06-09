import express from 'express';
import postModel from '../models/posts.js';
import logger from '../middlewares/logger.js';
import validatePost from '../middlewares/validate.Post.js';
import multer from 'multer'
import verifyToken from '../middlewares/verifyToken.js';
import cloudinary from "cloudinary"
import {CloudinaryStorage} from 'multer-storage-cloudinary'
import dotenv from 'dotenv';
import userModel from '../models/users.js';

const router = express.Router();
dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

//CLOUD
const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: 'cloudUpload',
    format: async (req, file) => 'png',
    public_id: (req, file) => file.originalname
  }
})

const cloudUpload = multer({storage: cloudStorage})

//POST CLOUD
router.post('/posts/cloudUpload', cloudUpload.single('img'), async(req,res)=>{
  try {
    res.status(200).json({img: req.file.path})
  } catch (error) {
    res.status(500).send({
      message: "Errore durante fase di upload",
      statusCode: 500
     })
  }
})

//GET
router.get('/posts', verifyToken, logger, async (req, res) => {
  const { page = 1, pageSize = 99 } = req.query;
  const skip = (page - 1) * pageSize;

  try {
    const posts = await postModel.find()
      .populate("author", "firstName lastName email") //filtro
      .limit(parseInt(pageSize))
      .skip(parseInt(skip))
      .sort({
        createdAt: "desc"
      })
    const totalPosts = await postModel.countDocuments();

    res.status(200).send({
      count: totalPosts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / pageSize),
      statusCode: 200,
      posts,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: 'Errore interno del server',
    });
  }
});

//GET BY RATE
router.get('/posts/:rate', verifyToken, logger, async (req, res) => {
  const rate = Number(req.params.rate); // converti rate in un numero perché nel modello è stringa
  const { page = 1, pageSize = 99 } = req.query;
  const skip = (page - 1) * pageSize;

  try {
    const posts = await postModel.find({ rate: rate }) // trova i post con un certo rate
      .limit(parseInt(pageSize))
      .skip(parseInt(skip));
    const totalPosts = await postModel.countDocuments({ rate: rate });

    res.status(200).send({
      count: totalPosts,
      currentPage: page,
      totalPages: Math.ceil(totalPosts / pageSize),
      statusCode: 200,
      posts,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: 'Errore interno del server',
    });
  }
});

//POST
router.post('/posts', validatePost, async (req, res) => {
  const { title, content, rate, author, img } = req.body;

  const user = await userModel.findOne({_id: req.body.author})

  const post = new postModel({
    title,
    content,
    author: user._id,
    rate,
    img
  });

  try {
    await post.save();
    await userModel.updateOne({_id: user._id}, {$push: {posts: post}})
    res.status(201).send({
      statusCode: 201,
      message: 'Post salvato con successo nel database',
      post: post // Assicurati di inviare il nuovo post come parte della risposta
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "C'è un errore nell'invio del post",
    });
  }
});

//PATCH
router.patch('/posts/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, author, rate } = req.body;

  if (!title && !content && !author && !rate) {
    return res.status(400).send({
      statusCode: 400,
      message: 'Nessun campo da aggiornare fornito',
    });
  }

  try {
    const post = await postModel.findByIdAndUpdate(id, req.body, { new: true });

    if (!post) {
      return res.status(404).send({
        message: 'Post inesistente',
      });
    }

    res.status(200).send({
      message: 'Post modificato',
      post,
    });
  } catch (error) {
    res.status(500).send({
      message: 'Errore interno del server',
    });
  }
});

//DELETE
router.delete('/posts/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const post = await postModel.findByIdAndDelete(id);

    if (!post) {
      return res.status(404).send({
        message: 'Post inesistente',
        statusCode: 404,
      });
    }

    res.status(200).send({
      message: `Post con ID ${id} rimosso dal database`,
      statusCode: 200,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: 'Errore interno del server',
    });
  }
});

export default router
