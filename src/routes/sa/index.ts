import { Router, Request, Response } from "express";
import { normalAuthenticated } from "auth/normal";

import goToStorage from 'controller/sa/actions/goToStorage';
import goOffline from 'controller/sa/actions/goOffline';

import getPlayerinfo from 'controller/sa/getPlayerinfo';
import getPlayerinfoV2 from 'controller/sa/getPlayerinfoV2';
import getServerinfo from 'controller/sa/getServerinfo';

export const router = Router();

router.get('/', async (req: Request, res: Response) => {
    res.json("Velkommen til, du lugter...");
});

router.get('/goToStorage', normalAuthenticated, async (req: Request, res: Response) => {
    goToStorage(req, res);
})
router.get('/goOffline', normalAuthenticated, async (req: Request, res: Response) => {
    goOffline(req, res);
});

router.get('/playerinfo/:username', normalAuthenticated, async (req: Request, res: Response) => {
    getPlayerinfo(req, res);
});

router.get('/playerinfoV2/:uuid', normalAuthenticated, async (req: Request, res: Response) => {
    getPlayerinfoV2(req, res);
});

router.get('/server/:server', normalAuthenticated, async (req: Request, res: Response) => {
    getServerinfo(req, res);
});
