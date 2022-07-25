import connection from '../database.js';

export async function getCustomers(req, res) {
    try {
        const queryString = req.query.cpf;
        if (!queryString) {
            const { rows: customers } = await connection.query(`
                SELECT * FROM customers
            `);
            return res.status(200).send(customers);
        }

        const { rows: customers } = await connection.query(`
            SELECT * FROM customers
            WHERE cpf = $1
        `, [queryString]);
        return res.status(200).send(customers);
        
    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}
