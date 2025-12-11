import { Router } from "express";
import { getAllTools } from "../controllers/controlerTools.js";
import { celebrate } from "celebrate";
import { getAllToolsSchema } from "../validations/toolValidation.js";


const router = Router();



router.get('/tools', celebrate(getAllToolsSchema), getAllTools);


export default router;
