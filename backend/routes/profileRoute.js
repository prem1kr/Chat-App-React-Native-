import express from 'express';
import { GetAllProfile, GetProfile, ProfileEdit } from '../controllers/profileController.js';

const profileRouter = express.Router();

profileRouter.post('/edit', ProfielEdit);
profileRouter.get('/get/:userId', GetProfile);
profileRouter.get('/get-all', GetAllProfile);


export default profileRouter;
