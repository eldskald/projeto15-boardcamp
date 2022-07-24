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
