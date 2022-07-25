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
            WHERE name = $1
        `, [queryString]);
        return res.status(200).send(games);

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function addGame(_req, res) {
    try {
        const body = res.locals.body;
        await connection.query(`
            INSERT INTO games (name, image, "stockTotal", "categoryId", "pricePerDay")
            VALUES ($1, $2, $3, $4, $5)
        `, [body.name, body.image, body.stockTotal, body.categoryId, body.pricePerDay]);
        return res.sendStatus(201);

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}
