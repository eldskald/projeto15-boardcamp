import connection from '../database.js';

export async function getRentals(req, res) {
    try {
        const queryCustomer = req.query.customerId;
        const queryGame = req.query.gameId;
        const query = 'SELECT * FROM rentals';
        const bindParams = [];

        if (queryCustomer && queryGame) {
            query += ' WHERE "customerId" = $1 AND "gameId" = $2';
            bindParams = [queryCustomer, queryGame];
        } else if (queryCustomer && !queryGame) {
            query += ' WHERE "customerId" = $1';
            bindParams = [queryCustomer];
        } else if (!queryCustomer && queryGame) {
            query += ' WHERE ¨gameId" = $1';
            bindParams = [queryGame];
        }

        const { rows: rentals } = await connection.query(query, bindParams);
        return res.status(200).send(rentals);

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function addRental(_req, res) {
    return;
}

export async function returnRental(req, res) {
    return;
}

export async function deleteRental(req, res) {
    return;
}

