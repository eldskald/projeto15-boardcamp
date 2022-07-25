import joi from 'joi';
import { stripHtml } from 'string-strip-html'; 
import connection from '../database.js';

const gameSchema = joi.object({
    name: joi.string().required(),
    image: joi.string(),
    stockTotal: joi.number().positive().required(),
    categoryId: joi.number().required(),
    pricePerDay: joi.number().positive().required()
});

async function validateGame(req, res, next) {
    try {
        const body = req.body;

        for (const key of Object.keys(body)) {
            body[key] = stripHtml(body[key]).result.trim();
        }

        const { error } = gameSchema.validate(body);
        if (error) {
            return res.sendStatus(400);
        }

        const { rows: nameQuery } = await connection.query(`
            SELECT * FROM games
            WHERE name = $1
        `, [body.name]);
        if (nameQuery.length > 0) {
            return res.sendStatus(409);
        }

        const { rows: categoryQuery } = await connection.query(`
            SELECT * FROM categories
            WHERE id = $1
        `, [body.categoryId]);
        if (categoryQuery.length === 0) {
            return res.sendStatus(400);
        }

        res.locals.body = body;
        next();

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export default validateGame;

