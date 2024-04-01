const axios = require('axios');
const { sa } = require('../../../config.json');
const { runQuery } = require('../../../utils/mariadb');

async function goOffline(req, res) {
    try {
        const promises = [];
        
        const results = await runQuery(`
            SELECT
                s.id,
                s.name,
                s.status,
                COUNT(p.id) AS players
            FROM servers s
            LEFT JOIN players p ON p.currentServerID = s.id AND p.status = "online"
            WHERE s.status = "online"
            GROUP BY
                s.name
            HAVING
                COUNT(p.id) = 0
            ORDER BY
                s.name ASC;
        `);
        
        results.forEach((row) => {
            const id = row.id;
            const name = row.name;
            const playerName = '3';
            console.log(`Forsøger at stoppe serveren: ${id} ${name}`);
        
            const config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${sa.url}${id}/control/stop?playerid=${playerName}`,
                headers: {
                    'Authorization': sa.token,
                    'Content-Type': 'application/json',
                },
            };

            const promise = axios(config)
            .catch((error) => {
                console.error(`Kunne ikke stoppe serveren: ${id} ${name} ` + error);
            });

            promises.push(promise);
        });
        Promise.all(promises)
        .then(() => {
            console.log("All stop requests completed");
            res.json({ message: "Success" })
        })
        .catch((error) => {
            console.error(error);
        });

    } catch (err) {
        return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
}

module.exports = {
    goOffline,
};
