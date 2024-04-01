const { requiredAuthenticated  } = require('../auth.js');
const { changePermission } = require('../controller/permissions/changePermissions');
const { getPermission } = require('../controller/permissions/getPermissions');
const { deletePermission } = require('../controller/permissions/deletePermissions');


module.exports = (app) => {
    app.post('/api/permission', requiredAuthenticated, async (req, res) => {
        await changePermission(req, res);
    });

    //app.post('/api/permission/:userID', requiredAuthenticated, async (req, res) => {
    //  // Handle POST request logic here
    //});

    app.get('/api/permission/:userID', requiredAuthenticated, async (req, res) => {
        await getPermission(req, res);
    });

    //app.put('/api/permission/:userID', requiredAuthenticated, async (req, res) => {
    //    // Handle PUT request logic here
    //});

    app.delete('/api/permission/:userID', requiredAuthenticated, async (req, res) => {
        await deletePermission(req, res);
    });
};