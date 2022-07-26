import connection from '../database.js';

export async function getGames(req, res) {
    try {
        const queryString = req.query.name;
        if (!queryString) {
            const { rows: games } = await connection.query(`
                SELECT * FROM games
            `);
            return res.status(200).send(games);
        }

        const { rows: games } = await connection.query(`
            SELECT * FROM games
            WHERE name LIKE CONCAT($1::text, '%')
        `, [queryString]);
        return res.status(200).send(games);

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function addGame(_req, res) {
    try {
        const {name, image, stockTotal, categoryId, pricePerDay } = res.locals.body;
        await connection.query(`
            INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay")
            VALUES ($1, $2, $3, $4, $5)
        `, [name, image, stockTotal, categoryId, pricePerDay]);
        return res.sendStatus(201);

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}
