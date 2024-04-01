
const cors = require('cors');
const { requiredAuthenticated } = require('../auth.js');
const { serverAuthenticated } = require('../authServer.js');
const { goToStorage } = require('../controller/sa/actions/goToStorage');
const { goOffline } = require('../controller/sa/actions/goOffline');
const { getPlayerinfo } = require('../controller/sa/getPlayerinfo');
const { getPlayerinfoV2 } = require('../controller/sa/getPlayerinfoV2');
const { getServerinfo } = require('../controller/sa/getServerinfo');

module.exports = (app, corsOptions) => {
    app.get('/api/sa/goToStorage', cors(corsOptions), requiredAuthenticated, async (req, res) => {
        goToStorage(req, res);
    });

    app.get('/api/sa/goOffline', cors(corsOptions), requiredAuthenticated, async (req, res) => {
        goOffline(req, res);
    });

    app.get('/api/sa/playerinfo/:username', cors(corsOptions), requiredAuthenticated, async (req, res) => {
        getPlayerinfo(req, res);
    });

    app.get('/api/sa/player/:uuid', cors(corsOptions), requiredAuthenticated, async (req, res) => {
        getPlayerinfoV2(req, res);
    });

    app.get('/api/sa/server/:server', cors(corsOptions), serverAuthenticated, async (req, res) => {
        getServerinfo(req, res);
    });

};
