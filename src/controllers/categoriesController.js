import connection from '../database.js';

export async function getCategories(_req, res) {
    try {
        const { rows: categories } = await connection.query(`
            SELECT * FROM categories
        `);
        return res.status(200).send(categories);

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function addCategory(_req, res) {
    try {
        const { name } = res.locals.body;
        await connection.query(`
            INSERT INTO categories (name)
            VALUES ($1)
        `, [name]);
        return res.sendStatus(201);

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}
