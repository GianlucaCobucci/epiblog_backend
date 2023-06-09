import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 5050;

//routes import
import usersRoute from './routes/users.js';
import postsRoute from './routes/posts.js';
import loginRoute from './routes/login.js';
import sendEmailsRoute from './routes/sendEmails.js';

const app = express();

//static files middleware
app.use('/uploads', express.static(join(__dirname, './uploads')));

//middleware globali, usati per tutte le rotte
app.use(express.json());
app.use(cors());

//rotte
app.use('/', usersRoute);
app.use('/', postsRoute);
app.use('/', loginRoute);
app.use('/', sendEmailsRoute)

const db = mongoose.connection;

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

db.on('error', console.error.bind(console, 'Errore di connessione al server DB'));
db.once('open', () => {
  console.log('Server DB connesso correttamente');
});

app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});
