const { validateUsername } = require('../../utils/pattern');
const { client } = require('../../utils/mongodb');


async function deletePermission(req, res) {
    const userID = req.params.userID;
    if (!validateUsername(userID)) {
        return res.json({ message: 'Invalid user ID' });
    }
    try {
        await client.connect();
        await client.db("SA-2").collection('roomPermissions').deleteOne({ ownerID: { $eq: userID }, active: { $eq: 1 } });
        await client.close();
        res.json({ message: "Success" })
    } catch (err) {
        return res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
}

module.exports = {
    deletePermission,
};
