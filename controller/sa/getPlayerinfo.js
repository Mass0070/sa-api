const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 });

const { runQuery } = require('../../utils/mariadb');
const { validateUsername, validateUUID } = require('../../utils/pattern');

async function getPlayerinfo(req, res) {
    const { username } = req.params;
    let uuid = '';

    if (!username || !validateUsername(username) && !validateUUID(username)) {
        return res.json({ message: 'Invalid username' });
    }

    if (validateUUID(username)) {
        console.log("Valid UUID for playerinfo.\n%s", username);
        uuid = username;
    }

    const cacheKey = `/api/sa/playerinfo/${username}`;

    const cachedData = cache.get(cacheKey);
    if (cachedData) {
        console.log(`[Cache] Returning cached response for playerinfo ${username}`);
        if (cachedData[0])
            return res.json({ ...cachedData[0], cached: true });
        return res.json({ ...cachedData, cached: true });
    }

    const playerInfo = await fetchPlayerInfo(username, uuid);
    cache.set(cacheKey, playerInfo);

    if (playerInfo[0])
        return res.json({ ...playerInfo[0], cached: false });
    return res.json({ ...playerInfo, cached: false });
}


async function fetchPlayerInfo(username, uuid) {
    try {
        if (!username || !validateUsername(username) && !validateUUID(username)) {
            return { message: 'Invalid username' };
        }
    
        if (validateUUID(username)) {
            uuid = username;
        }

        const results = await runQuery(`
            SELECT
                p.id,
                p.username,
                p.uuid,
                p.vipDays,
                p.role,
                (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                    'ban_reason', sb.reason,
                    'ban_by', p2.username,
                    'ban_state', sb.state,
                    'ban_time', CONVERT_TZ(FROM_UNIXTIME(sb.time / 1000), @@session.time_zone, '+00:00'),
                    'ban_until', CONVERT_TZ(FROM_UNIXTIME(sb.until / 1000), @@session.time_zone, '+00:00')
                    )
                )
                FROM straf_bans sb
                JOIN players p2 ON sb.banned_by_id = p2.id
                WHERE sb.playerid = p.id
                    AND sb.active = 1
                    AND (sb.until > UNIX_TIMESTAMP() * 1000 OR sb.until = -1)
                ) AS bans,
                (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                    'mute_reason', sm.reason,
                    'mute_by', p2.username,
                    'mute_state', sm.state,
                    'mute_time', CONVERT_TZ(FROM_UNIXTIME(sm.time / 1000), @@session.time_zone, '+00:00'),
                    'mute_until', CONVERT_TZ(FROM_UNIXTIME(sm.until / 1000), @@session.time_zone, '+00:00')
                    )
                )
                FROM straf_mutes sm
                JOIN players p2 ON sm.muted_by_id = p2.id
                WHERE sm.playerid = p.id
                    AND sm.active = 1
                    AND (sm.until > UNIX_TIMESTAMP() * 1000 OR sm.until = -1)
                ) AS mutes
            FROM players p
            WHERE (p.username = ? OR p.uuid = ?)
            GROUP BY p.id
        `, [username, uuid]);

        results.forEach((result) => {
            result.bans = JSON.parse(result.bans);
            result.mutes = JSON.parse(result.mutes);
        });

        if (results.length === 0)
            return { message: 'Invalid username' };
        return results;

    } catch (err) {
        return { message: 'Internal Server Error', error: err.message };
    }
}

module.exports = {
    getPlayerinfo,
};
