import { Router } from "express";
import { getAllNotes } from "../controllers/controlerTools.js";


const router = Router();



router.get('/Tool', getAllNotes);


export default router;
