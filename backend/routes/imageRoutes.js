import express from 'express';
const router = express.Router();
import { getDestinationImg } from '../controllers/imageController.js';
router.get("/", getDestinationImg);
export default router;