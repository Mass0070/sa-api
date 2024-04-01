import NodeCache from 'node-cache';
import { Request, Response } from 'express';
import runQuery from 'modules/db';
import { validateUsername } from 'modules/pattern';

const cache = new NodeCache({ stdTTL: 3600 });

async function getServerinfo(req: Request, res: Response): Promise<void> {
    const { server } = req.params;

    if (!server || !validateUsername(server)) {
        res.json({ message: 'Invalid server' });
        return;
    }

    const cacheKey = `/sa/servers/${server}`;

    const cachedData = cache.get<any[]>(cacheKey);
    if (cachedData) {
        console.log(`[Cache] Returning cached response for server ${server}`);
        if (cachedData[0]) {
            res.json({ ...cachedData[0], cached: true });
            return;
        }
            res.json({ ...cachedData, cached: true });
            return;
    }

    const serverInfo = await fetchServerInfo(server);
    cache.set(cacheKey, serverInfo);

    if (serverInfo[0]) {
        res.json({ ...serverInfo[0], cached: false });
        return;
    }
    res.json({ ...serverInfo, cached: false });
}

async function fetchServerInfo(server: string): Promise<any> {
    try {
        if (!server || !validateUsername(server)) {
            return { message: 'Invalid server' };
        }

        const results = await runQuery(`
            SELECT
                s.name AS server, 
                p.username AS username, 
                p.uuid AS uuid
            FROM servers s
            LEFT JOIN players p ON s.ownerID = p.id
            WHERE s.name = ?
        `, [server]);

        if (results.length === 0) {
            return { message: 'Invalid server' };
        }
        return results;
    } catch (err) {
        return { message: 'Internal Server Error', err };
    }
}

export default getServerinfo;
