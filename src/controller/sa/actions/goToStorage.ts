import axios from 'axios';
import { Request, Response } from 'express';
import runQuery from 'modules/db';
const { sa } = require('config/config');

async function goToStorage(req: Request, res: Response): Promise<void> {
    try {
        const promises: any[] = [];

        const results = await runQuery(`
            SELECT id, name FROM servers WHERE status = 'offline' LIMIT 5
        `);

        results.forEach((row: any) => {
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
            .catch((error: Error) => {
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

    } catch (err: any) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
        return;
    }

}

export default goToStorage;
