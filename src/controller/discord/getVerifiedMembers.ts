import { Request, Response } from 'express';
import runQuery from 'modules/db';

async function getVerifiedMembers(req: Request, res: Response): Promise<void> {
    try {
        const results = await runQuery(
            "SELECT players.username, discordAccounts.discordID " +
            "FROM players " +
            "JOIN discordAccounts ON players.id = discordAccounts.playerID"
        );

        res.json(results);
    } catch (err: any) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
        return;
    }
}

export default getVerifiedMembers;
