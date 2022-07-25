import joi from 'joi';
import { stripHtml } from 'string-strip-html';
import connection from '../database.js';

const rentalSchema = joi.object({
    customerId: joi.number().required(),
    gameId: joi.number().required(),
    daysRented: joi.number().positive().required()
});

async function validateRental(req, res, next) {
    try {
        const body = req.body;

        for (const key of Object.keys(body)) {
            body[key] = stripHtml(body[key]).result.trim();
        }

        const { error } = rentalSchema.validate(body);
        if (error) {
            return res.sendStatus(400);
        }

        const { rows: customerQuery } = await connection.query(`
            SELECT * FROM customers
            WHERE id = $1
        `, [body.customerId]);
        if (customerQuery.length === 0) {
            return res.sendStatus(400);
        }

        const { rows: gameQuery } = await connection.query(`
            SELECT * FROM games
            WHERE id = $1
        `, [body.gameId]);
        if (gameQuery.length === 0) {
            return res.sendStatus(400)
        }

        res.locals.body = body;
        res.locals.customer = customerQuery[0];
        res.locals.game = gameQuery[0];
        next();

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export default validateRental;
