import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT || 4000;

const server = express();
server.use(cors());
server.use(express.json());

server.listen(PORT, () => {
    console.log(`Server listening at ${PORT}`);
});

