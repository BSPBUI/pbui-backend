import express, { Router } from 'express';
import { db } from '../../db/db';
import { eq } from 'drizzle-orm';
import { pools, maps } from '../../db/schema';

const router: Router = express.Router();

router.get('/:poolid', async (req, res) => {
    const poolid = Number(req.params.poolid.split('?')[0]);

    if (isNaN(poolid)) {
        res.status(400).send({ status: 'error', error: 'Invalid pool or ID' });
        return;
    }

    let pool = await db.query.pools.findFirst({
        where: eq(pools.id, poolid)
    });

    if (!pool) {
        res.status(404).send({ status: 'error', error: 'Pool with this ID not found.' });
        return;
    }

    let data: any = { details: pool };

    if (req.query.maps == 'true') {
        const poolMaps = await db.query.maps.findMany({
            where: eq(maps.poolId, poolid)
        });

        data = {...data, maps: poolMaps};
    }

    res.send({ status: 'success', ...data });
})

export default router;