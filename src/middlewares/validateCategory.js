import joi from 'joi';
import { stripHtml } from 'string-strip-html';
import connection from '../database.js';

const categorySchema = joi.object({
    name: joi.string().required()
});

async function validateCategory(req, res, next) {
    try {
        const body = req.body;

        for (const key of Object.keys(body)) {
            body[key] = stripHtml(body[key]).result.trim();
        }

        const { error } = categorySchema.validate(body);
        if (error) {
            return res.sendStatus(400);
        }

        const { rows: foundCategories } = await connection.query(`
            SELECT * FROM categories
            WHERE name = $1
        `, [body.name]);
        if (foundCategories.length > 0) {
            return res.sendStatus(409);
        }

        res.locals.body = body;
        next();

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export default validateCategory;
