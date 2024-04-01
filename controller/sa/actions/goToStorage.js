const axios = require('axios');
const { sa } = require('../../../config.json');
const { runQuery } = require('../../../utils/mariadb');

async function goToStorage(req, res) {
    try {
        const promises = [];
        
        const results = await runQuery(
            "SELECT id, name FROM servers WHERE status = 'offline' LIMIT 5"
        );
        
        results.forEach((row) => {
            const id = row.id;
            const name = row.name;
            const playerName = '3';
            console.log(`Forsøger at storage serveren: ${id} ${name}`);
        
            const config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: `${sa.url}${id}/control/storage?playerid=${playerName}`,
                headers: {
                    'Authorization': sa.token,
                    'Content-Type': 'application/json',
                },
            };

            const promise = axios(config)
            .catch((error) => {
                console.error(`Kunne ikke storage serveren: ${id} ${name} ` + error);
            });

            promises.push(promise);
        });
        Promise.all(promises)
        .then(() => {
            console.log("All storage requests completed");
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
    goToStorage,
};
