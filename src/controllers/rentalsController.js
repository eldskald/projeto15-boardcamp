import connection from '../database.js';
import dayjs from 'dayjs';

export async function getRentals(req, res) {
    try {
        const queryCustomer = req.query.customerId;
        const queryGame = req.query.gameId;
        let query = 'SELECT * FROM rentals';
        let bindParams = [];

        if (queryCustomer && queryGame) {
            query += ' WHERE "customerId" = $1 AND "gameId" = $2';
            bindParams = [queryCustomer, queryGame];
        } else if (queryCustomer && !queryGame) {
            query += ' WHERE "customerId" = $1';
            bindParams = [queryCustomer];
        } else if (!queryCustomer && queryGame) {
            query += ' WHERE "gameId" = $1';
            bindParams = [queryGame];
        }

        const { rows: rentals } = await connection.query(query, bindParams);
        for (let rental of rentals) {
            rental.rentDate = dayjs(rental.rentDate).format('YYYY-MM-DD');
            if (rental.returnDate) {
                rental.returnDate = dayjs(rental.returnDate).format('YYYY-MM-DD');
            }
        }
        return res.status(200).send(rentals);

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function addRental(_req, res) {
    try {
        const body = res.locals.body;
        const game = res.locals.game;

        const { rows: rentedUnits } = await connection.query(`
            SELECT * FROM rentals
            WHERE "gameId" = $1
        `, [body.gameId]);
        if (rentedUnits.length >= game.stockTotal) {
            return res.sendStatus(400);
        }

        await connection.query(`
            INSERT INTO rentals (
                "customerId",
                "gameId",
                "daysRented",
                "rentDate",
                "originalPrice",
                "returnDate",
                "delayFee"
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [
            body.customerId,
            body.gameId,
            body.daysRented,
            dayjs().format('YYYY-MM-DD'),
            game.pricePerDay * body.daysRented,
            null,
            null
        ]);
        return res.sendStatus(201);

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function returnRental(req, res) {
    try {
        const rentalId = req.params.id;
        const { rows: rentalQuery } = await connection.query(`
            SELECT * FROM rentals
            WHERE id = $1
        `, [rentalId]);
        if (rentalQuery.length === 0) {
            return res.sendStatus(404);
        }
        
        const rental = rentalQuery[0];
        if (rental.returnDate) {
            return res.sendStatus(400);
        }

        const returnDate = dayjs().format('YYYY-MM-DD');
        const pricePerDay = rental.originalPrice / rental.daysRented;
        const totalDays = dayjs(rental.rentDate).diff(dayjs());
        const delay = totalDays - rental.daysRented;
        const delayFee = Math.max(delay, 0) * pricePerDay;

        await connection.query(`
            UPDATE rentals
            SET
                "returnDate" = $2,
                "delayFee" = $3
            WHERE id = $1
        `, [rentalId, returnDate, delayFee]);
        return res.sendStatus(200);

    } catch (err) {
        console.log(err);
        return res.sendStatus(500);
    }
}

export async function deleteRental(req, res) {
    return;
}

