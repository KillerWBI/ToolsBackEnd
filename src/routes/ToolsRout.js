import { Router } from "express";
import { getAllNotes } from "../controllers/controlerTools.js";
import { authenticate } from "../middleware/authenticate.js";


const router = Router();

router.use("/Tool", authenticate);

router.get('/Tool', getAllNotes);


export default router;
