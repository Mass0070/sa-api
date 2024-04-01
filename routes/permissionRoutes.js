const cors = require('cors');
const { requiredAuthenticated  } = require('../auth.js');
const { changePermission } = require('../controller/permissions/changePermissions');
const { getPermission } = require('../controller/permissions/getPermissions');
const { deletePermission } = require('../controller/permissions/deletePermissions');


module.exports = (app, corsOptions) => {
    app.post('/api/permission', cors(corsOptions), requiredAuthenticated, async (req, res) => {
        await changePermission(req, res);
    });

    //app.post('/api/permission/:userID', cors(corsOptions), requiredAuthenticated, async (req, res) => {
    //});

    app.get('/api/permission/:userID', cors(corsOptions), requiredAuthenticated, async (req, res) => {
        await getPermission(req, res);
    });

    //app.put('/api/permission/:userID', requiredAuthenticated, async (req, res) => {
    //});

    app.delete('/api/permission/:userID', cors(corsOptions), requiredAuthenticated, async (req, res) => {
        await deletePermission(req, res);
    });
};