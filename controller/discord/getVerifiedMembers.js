const { runQuery } = require('../../utils/mariadb');

async function getVerifiedMembers(req, res) {
    try {
        const results = await runQuery(
            "SELECT players.username, discordAccounts.discordID "+
            "FROM players "+
            "JOIN discordAccounts ON players.id = discordAccounts.playerID"
        );
        
        res.json(results);
    } catch (err) {
        return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
}

module.exports = {
    getVerifiedMembers,
};
