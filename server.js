import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
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
import githubRoute from './routes/gitHubAuth.js'

const app = express();

//static files middleware
app.use('/uploads', express.static(join(__dirname, './uploads')));

//middleware globali, usati per tutte le rotte
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Use connect-mongo for sessions
const store = MongoStore.create({ mongoUrl: process.env.DB_URL });
app.use(
    session({
        secret: process.env.GITHUB_CLIENT_SECRET,
        resave: false, 
        saveUninitialized: false,
        store: store
    })
);

//rotte
app.use('/', usersRoute);
app.use('/', postsRoute);
app.use('/', loginRoute);
app.use('/', sendEmailsRoute)
app.use('/', githubRoute)

const db = mongoose.connection;

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
//console.log(process.env.DB_URL)

db.on('error', console.error.bind(console, 'Errore di connessione al server DB'));
db.once('open', () => {
  console.log('Server DB connesso correttamente');
});

app.listen(PORT, () => {
  console.log(`Server avviato sulla porta ${PORT}`);
});



/* import express from "express";
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
import githubRoute from './routes/gitHubAuth.js'

const app = express();

//static files middleware
app.use('/uploads', express.static(join(__dirname, './uploads')));

//middleware globali, usati per tutte le rotte
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

//rotte
app.use('/', usersRoute);
app.use('/', postsRoute);
app.use('/', loginRoute);
app.use('/', sendEmailsRoute)
app.use('/', githubRoute)

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
 */