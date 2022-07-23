import dotenv from 'dotenv';
dotenv.config();

const connection = new Poo({
    connectionString: process.env.DATABASE_URL,
});
