import { Request, Response } from 'express';
import runQuery from 'modules/db';
import { validateUsername } from 'modules/pattern';

async function updateDiscordUser(req: Request, res: Response): Promise<void> {
    try {
        const { username, discordID } = req.query as { username: string, discordID: string };
        if (validateUsername(username) && validateUsername(discordID)) {
            console.log(`Username ${username}`)
            console.log(`ID ${discordID}`)

            const results = await runQuery(
                "SELECT players.username, discordAccounts.discordID " +
                "FROM players " +
                "JOIN discordAccounts ON players.id = discordAccounts.playerID " +
                "WHERE players.username = ? AND discordAccounts.discordID = ?", [username, discordID]
            );
            console.log(results)
            res.json(results);

        } else {
            res.json("ERROR");
        }
    } catch (err: any) {
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
        return;
    }
}

export default updateDiscordUser;
