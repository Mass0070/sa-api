const cors = require('cors');
const { requiredAuthenticated } = require('../auth.js');
const { updateEmail } = require('../controller/staffs/updateEmail');
const { getStaff } = require('../controller/staffs/getStaff');
const { getOldStaff } = require('../controller/staffs/getOldStaff');
const { removeStaff } = require('../controller/staffs/removeStaff');


module.exports = (app, corsOptions) => {
    app.post('/api/staff/staffs', cors(corsOptions), requiredAuthenticated, async (req, res) => {
        updateEmail(req, res);
    });

    app.get('/api/staff/staffs', cors(corsOptions), requiredAuthenticated, async (req, res) => {
        getStaff(req, res);
    });

    app.get('/api/staff/oldstaffs', cors(corsOptions), requiredAuthenticated, async (req, res) => {
        getOldStaff(req, res);
    });

    app.delete('/api/staff/oldstaffs/:uuid', cors(corsOptions), requiredAuthenticated, async (req, res) => {
        removeStaff(req, res);
    });
};
