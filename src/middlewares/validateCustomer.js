import joi from 'joi';
import { stripHtml } from 'string-strip-html';
import connection from '../database.js';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

const customerSchema = joi.object({
    name: joi.string().required(),
    phone: joi.string().pattern(/^[0-9]{10,11}$/).required(),
    cpf: joi.string().pattern(/^[0-9]{11}$/).required(),
    birthday: joi.string().required()
});

async function validateCustomer(req, res, next) {
    try {
        const body = req.body;

        for (const key of Object.keys(body)) {
            body[key] = stripHtml(body[key]).result.trim();
        }

        const { error } = customerSchema.validate(body);
        if (error) {
            return res.sendStatus(400);
        }

        const { rows: cpfQuery } = await connection.query(`
            SELECT * FROM customers
            WHERE cpf = $1
        `, [body.cpf]);
        if (cpfQuery.length > 0) {
            return res.sendStatus(409);
        }
        
        dayjs.extend(customParseFormat);
        if (!dayjs(body.birthday, 'YYYY-MM-DD', true).isValid()) {
            return res.sendStatus(400);
        }

        res.locals.body = body;
        next();

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export default validateCustomer;
