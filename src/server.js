import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './router.js';

dotenv.config();
const PORT = process.env.PORT || 4000;

const server = express();
server.use(cors());
server.use(express.json());
server.use(router);
server.listen(PORT, () => {
    console.log(`Server listening at ${PORT}`);
});

