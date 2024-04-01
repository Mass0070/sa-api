import { Request, Response } from 'express';
import runQuery from 'modules/db';

async function goOffline(req: Request, res: Response): Promise<void> {
    const { server } = req.params;
    
    const results = await runQuery(`
            SELECT
                s.name AS server, 
                p.username AS username, 
                p.uuid AS uuid
            FROM servers s
            LEFT JOIN players p ON s.ownerID = p.id
            WHERE s.name = ?
        `, [server]);
}

export default goOffline;
