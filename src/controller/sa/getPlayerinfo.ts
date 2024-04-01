import NodeCache from 'node-cache';
import { Request, Response } from 'express';
import runQuery from 'modules/db';
import { validateUsername, validateUUID } from 'modules/pattern';

const cache = new NodeCache({ stdTTL: 3600 });

async function getPlayerinfo(req: Request, res: Response): Promise<void> {
    const { username } = req.params;
    let uuid = '';

    if (!username || !validateUsername(username) && !validateUUID(username)) {
        res.json({ message: 'Invalid username' });
        return;
    }

    if (validateUUID(username)) {
        console.log("Valid UUID for playerinfo.\n%s", username);
        uuid = username;
    }

    const cacheKey = `/sa/playerinfo/${username}`;

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

    const playerInfo = await fetchPlayerInfo(username, uuid);
    cache.set(cacheKey, playerInfo);

    if (playerInfo[0]) {
        res.json({ ...playerInfo[0], cached: false });
        return;
    }
    res.json({ ...playerInfo, cached: false });
}

async function fetchPlayerInfo(username: string, uuid: string): Promise<any> {
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

        results.forEach((result: any) => {
            result.bans = JSON.parse(result.bans);
            result.mutes = JSON.parse(result.mutes);
        });

        if (results.length === 0)
            return { message: 'Invalid username' };
        return results;

    } catch (err) {
        return { message: 'Internal player Error', err };
    }
}

export default getPlayerinfo;
