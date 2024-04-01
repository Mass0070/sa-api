const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 });

const { runQuery } = require('../../utils/mariadb');
const { validateUUID } = require('../../utils/pattern');

async function getPlayerinfoV2(req, res) {
    const { uuid } = req.params;

    if (!uuid || !validateUUID(uuid)) {
        return res.json({ message: 'Invalid uuid' });
    }

    const cacheKey = `/api/sa/player/${uuid}`;

    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        console.log(`[Cache] Returning cached response for playerinfoV2 ${uuid}`);
        if (cachedData[0])
            return res.json({ ...cachedData[0], cached: true });
        return res.json({ ...cachedData, cached: true });
    }

    const playerInfo = await fetchPlayerInfo(uuid, uuid);
    cache.set(cacheKey, playerInfo);

    if (playerInfo[0])
        return res.json({ ...playerInfo[0], cached: false });
    return res.json({ ...playerInfo, cached: false });
}


async function fetchPlayerInfo(uuid, uuid) {
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
        return { message: 'Internal Server Error', error: err.message };
    }
}

module.exports = {
    getPlayerinfoV2,
};
