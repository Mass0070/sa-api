import { Request, Response } from 'express';
import runQuery from 'modules/db';

async function getOldStaff(req: Request, res: Response): Promise<void> {
    try {
        const results = await runQuery(`
                SELECT 
                    username, role, uuid
                FROM staff_alltime sa
                WHERE sa.deleteEmote IS NULL
                ORDER BY role ASC, username ASC
        `);

        res.json(results);
    } catch (err: any) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
        return;
    }
}

export default getOldStaff;