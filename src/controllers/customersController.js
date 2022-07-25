import connection from '../database.js';
import dayjs from 'dayjs';

export async function getCustomers(req, res) {
    try {
        const queryString = req.query.cpf;
        if (!queryString) {
            const { rows: customers } = await connection.query(`
                SELECT * FROM customers
            `);
            for (let customer of customers) {
                const date = dayjs(customer.birthday);
                customer.birthday = date.format('YYYY-MM-DD')
            }
            return res.status(200).send(customers);
        }

        const { rows: customers } = await connection.query(`
            SELECT * FROM customers
            WHERE cpf LIKE CONCAT($1::text, '%')
        `, [queryString]);
        for (let customer of customers) {
            const date = dayjs(customer.birthday);
            customer.birthday = date.format('YYYY-MM-DD')
        }
        return res.status(200).send(customers);
        
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function getCustomerById(req, res) {
    try {
        const customerId = req.params.id;
        const { rows: customer } = await connection.query(`
            SELECT * FROM customers
            WHERE id = $1
        `, [customerId]);
        
        if (customer.length === 0) {
            return res.sendStatus(404);
        }

        const date = dayjs(customer[0].birthday);
        customer.birthday = date.format('YYYY-MM-DD');
        return res.status(200).send(customer[0]);

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function addCustomer(_req, res) {
    try {
        const { name, phone, cpf, birthday } = res.locals.body;
        await connection.query(`
            INSERT INTO customers (name, phone, cpf, birthday)
            VALUES ($1, $2, $3, $4)
        `, [name, phone, cpf, birthday]);
        return res.sendStatus(201);

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    } 
}

export async function updateCustomer(req, res) {
    try {
        const customerId = req.params.id;
        const { name, phone, cpf, birthday } = res.locals.body;
        await connection.query(`
            UPDATE customers
            SET name = $1, phone = $2, cpf = $3, birthday = $4
            WHERE id = $5
        `, [name, phone, cpf, birthday, customerId]);
        return res.sendStatus(200);

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

