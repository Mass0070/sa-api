import NodeCache from 'node-cache';
import { Request, Response } from 'express';
import runQuery from 'modules/db';
import { validateUUID } from 'modules/pattern';

const cache = new NodeCache({ stdTTL: 3600 });

async function getPlayerinfoV2(req: Request, res: Response): Promise<void> {
    const { uuid } = req.params;

    if (!uuid || !validateUUID(uuid)) {
        res.json({ message: 'Invalid uuid' });
        return;
    }

    const cacheKey = `/sa/playerinfoV2/${uuid}`;

    const cachedData = cache.get<any[]>(cacheKey);
    if (cachedData) {
        console.log(`[Cache] Returning cached response for playerinfoV2 ${uuid}`);
        if (cachedData[0]) {
            res.json({ ...cachedData[0], cached: true });
            return;
        }
            res.json({ ...cachedData, cached: true });
            return;
    }

    const playerInfo = await fetchPlayerInfo(uuid);
    cache.set(cacheKey, playerInfo);

    if (playerInfo[0]) {
        res.json({ ...playerInfo[0], cached: false });
        return;
    }
    res.json({ ...playerInfo, cached: false });
}

async function fetchPlayerInfo(uuid: string): Promise<any> {
    try {
        if (!uuid || !validateUUID(uuid)) {
            return { message: 'Invalid uuid' };
        }

        const results = await runQuery(`
            SELECT
                p.username,
                p.uuid,
                p.status,
                IF(p.vipDays > 0, true, false) AS vip,
                p.role,
                s.name AS "primary"
            FROM players p
            LEFT JOIN servers s ON s.id = p.SMServerID
            WHERE p.uuid = ?
        `, [uuid]);

        if (results.length === 0)
            return { message: 'Invalid uuid' };
        return results;

    } catch (err) {
        return { message: 'Internal Server Error', err };
    }
}

export default getPlayerinfoV2;
