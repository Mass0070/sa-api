import { Router, Request, Response } from "express";
import { normalAuthenticated } from "auth/normal";

import getVerifiedMembers from 'controller/discord/getVerifiedMembers';
import updateDiscordUser from 'controller/discord/updateDiscordUser';

export const router = Router();

router.get('/', async (req: Request, res: Response) => {
    res.json("Velkommen til, du lugter endnu mere...");
});

router.get('/members', normalAuthenticated, async (req: Request, res: Response) => {
    getVerifiedMembers(req, res);
})

router.get('/update', normalAuthenticated, async (req: Request, res: Response) => {
    updateDiscordUser(req, res);
})