import { Request, Response } from 'express';
import runQuery from 'modules/db';
import { validateUUID } from 'modules/pattern';
import { removeFromPartner } from 'modules/functions';

async function removeStaff(req: Request, res: Response): Promise<void> {
    try {
        const { uuid } = req.params;
        if (!validateUUID(uuid)) {
            res.json({ message: 'Invalid uuid' });
            return;
        }

        const results = await runQuery(
            "UPDATE staff_alltime SET deleteStaff = 1 WHERE uuid = ?",
            [uuid]
        );

        if (results.affectedRows > 0) {
            res.json({ message: "Success" })
        } else {
            res.json({ message: "Failed to delete user" })
        }

        await removeFromPartner(uuid)
        //await removeFromDocs(uuid);
    } catch (err: any) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
        return;
    }
}

export default removeStaff;