import express from 'express';
import { createTransport } from 'nodemailer';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

const transporter = createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'rodrick.mohr@ethereal.email',
      pass: 'ETtKQa4v69hebYCSYW'
  }
});

router.post('/sendMail', verifyToken, async (req, res) => {
  const { subject, message } = req.body;

  const mailOptions = {
    from: 'admin@epicodetest.com',
    to: 'ciao@gmail.com',
    subject,
    message
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Email non inviata');
      res.status(500).send('Email non inviata');
    } else {
      console.log('Email inviata correttamente');
      res.status(200).send('Email inviata correttamente');
    }
  });
});

export default router;
