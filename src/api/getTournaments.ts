import express, { Router } from 'express';
import { db } from '../../db/db';
import { eq } from 'drizzle-orm';
import { tournaments, pools } from '../../db/schema';

const router: Router = express.Router();

router.get('/', async (req, res) => {
    try {
        const tourneys = await db.query.tournaments.findMany();
        if (tourneys.length != 0) {
            res.status(200).send({ status: 'success', tourneys });
            return;
        } else {
            res.status(200).send({ status: 'success', tourneys });
            return;
        }
    } catch (error) {
        res.status(500).send({ status: 'error', error: error });
    }
});

router.get('/:tourneyid', async (req, res) => {
    const tourneyid = Number(req.params.tourneyid.split('?')[0]);

    if (isNaN(tourneyid)) {
        res.status(400).send({ status: 'error', error: 'Invalid tournament or ID' });
        return;
    }
    
    let tourney = await db.query.tournaments.findFirst({
        where: eq(tournaments.id, tourneyid)
    });

    if (!tourney) {
        res.status(404).send({ status: 'error', error: 'Tournament with this ID not found.' });
        return;
    }

    let data: any = { details: tourney };

    if (req.query.pools == 'true') {
        const tourneyPools = await db.query.pools.findMany({
            where: eq(pools.tournamentId, tourneyid)
        });

        data = {...data, pools: tourneyPools};
    }

    res.send({ status: 'success', ...data });
});

// SLUGSSSSSSSS
router.get('/slug/:tourneyslug', async (req, res) => {
    const tourneyslug = req.params.tourneyslug.split('?')[0];

    if (!tourneyslug) {
        res.status(400).send({ status: 'error', error: 'You forgot the slug. What are you, stupid?'});
        return;
    }

    let tourney = await db.query.tournaments.findFirst({
        where: eq(tournaments.slug, tourneyslug)
    });

    if (!tourney) {
        res.status(404).send({ status: 'error', error: 'Tournament with this slug not found.' });
        return;
    }

    let data: any = { details: tourney };

    if (req.query.pools == 'true') {
        const tourneyPools = await db.query.pools.findMany({
            where: eq(pools.tournamentId, tourney.id)
        });

        data = {...data, pools: tourneyPools};
    }

    res.send({ status: 'success', ...data });
})

export default router;