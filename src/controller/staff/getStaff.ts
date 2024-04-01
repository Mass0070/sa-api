import { updateStaff } from 'modules/functions';
import { Request, Response } from 'express';
import runQuery from 'modules/db';

async function getStaff(req: Request, res: Response): Promise<void> {
    try {
        const results = await runQuery(`
                SELECT * FROM (
                    SELECT
                    p.username,
                    CASE
                    WHEN p.uuid = '264aed13-8842-40b9-86bd-1225c1f962bd' THEN 'seniormod'
                    WHEN p.role = 'bygger' THEN 'Bygger'
                    WHEN p.role = 'developer' THEN 'Udvikler'
                        ELSE p.role
                        END AS role,
                    p.uuid
                    FROM players p
                    WHERE p.role != 'player' AND p.id != -1
                ) t
                WHERE role IN ('bygger', 'support', 'mod', 'seniormod', 'udvikler', 'admin')
                ORDER BY role ASC, username ASC
        `);

        if (req.body.updateStaff == 1) {
            //await updateDocs();
            await updateStaff(results);
        }

        res.json(results);
    } catch (err: any) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
        return;
    }
}

export default getStaff;
