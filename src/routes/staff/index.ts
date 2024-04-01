import { Router, Request, Response } from "express";
import { normalAuthenticated } from "auth/normal";

//import updateEmail from 'controller/staff/updateEmail';
import getStaff from 'controller/staff/getStaff';
import getOldStaff from 'controller/staff/getOldStaff';
import removeStaff from 'controller/staff/removeStaff';

export const router = Router();

router.get('/', async (req: Request, res: Response) => {
    res.json("Velkommen til, tester...");
});

//router.post('/staffs', normalAuthenticated, async (req, res) => {
//    updateEmail(req, res);
//});

router.get('/staffs', normalAuthenticated, async (req, res) => {
    getStaff(req, res);
});

router.get('/oldstaffs', normalAuthenticated, async (req, res) => {
    getOldStaff(req, res);
});

router.delete('/oldstaffs/:uuid', normalAuthenticated, async (req, res) => {
    removeStaff(req, res);
});
