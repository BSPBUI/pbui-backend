import express, { Router } from 'express';
import { db } from '../../db/db';
import { tournaments, pools, maps } from '../../db/schema';

const router: Router = express.Router();

router.get('/', async (req, res) => {
    try {
        if (!req.query) {
            const { name, slug } = req.body;

            if (!name || !slug) {
                res.status(400).send({ status: 'error', error: 'Name or slug not provided' });
                return;
            }

            const data = await db.insert(tournaments).values({
                name: name,
                slug: slug
            });

            res.status(200).send({ status: 'success', data });
        } else {
            if (req.query.pool == 'true') {
                const { tourneyId, poolName } = req.body;

                if (!tourneyId || !poolName) {
                    res.status(400).send({ status: 'error', error: 'Tournament id or pool name not provided' });
                    return;
                }

                const data = await db.insert(pools).values({
                    tournamentId: tourneyId,
                    name: poolName
                });

                res.status(200).send({ status: 'success', data });
            }

            if (req.query.map == 'true') {
                const { poolId, hash, diff } = req.body;

                if (!poolId || !hash) {
                    res.status(400).send({ status: 'error', error: 'Pool id or map hash not provided' });
                    return;
                }

                const response = await fetch(`https://api.beatsaver.com/maps/hash/${hash}`);
                const map = await response.json();

                const data = await db.insert(maps).values({
                    poolId: poolId,
                    hash: hash,
                    bsr: map.id,
                    name: map.name,
                    artist: map.metadata.songAuthorName,
                    length: map.metadata.duration,
                    mapper: map.uploader.name,
                    coverUrl: map.versions[0].coverUrl,
                    dateUploaded: map.updatedAt.split('T')[0],
                    bpm: map.metadata.bpm,
                    difficulty: diff
                });

                res.status(200).send({ status: 'success', data });
            }

            if (req.query.update == 'true') {

            }
        }
    } catch (err) {
        console.error('DB insert error:', err);
        res.status(500).send({ status: 'error', error: err});
    }
});

export default router;