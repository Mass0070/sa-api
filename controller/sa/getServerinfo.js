const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 });

const { runQuery } = require('../../utils/mariadb');
const { validateUsername } = require('../../utils/pattern');

async function getServerinfo(req, res) {
    const { server } = req.params;

    if (!server || !validateUsername(server)) {
        return res.json({ message: 'Invalid server' });
    }

    const cacheKey = `/api/sa/servers/${server}`;

    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        console.log(`[Cache] Returning cached response for server ${server}`);
        if (cachedData[0])
            return res.json({ ...cachedData[0], cached: true });
        return res.json({ ...cachedData, cached: true });
    }

    const serverInfo = await fetchServerInfo(server);
    cache.set(cacheKey, serverInfo);

    if (serverInfo[0])
        return res.json({ ...serverInfo[0], cached: false });
    return res.json({ ...serverInfo, cached: false });
}

async function fetchServerInfo(server) {
    try {
        if (!server || !validateUsername(server)) {
            return ({ message: 'Invalid server' });
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

        if (results.length === 0)
            return { message: 'Invalid server' };
        return results;

    } catch (err) {
        return { message: 'Internal Server Error', err };
    }
}

module.exports = {
    getServerinfo,
};
