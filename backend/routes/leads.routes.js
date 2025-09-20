import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createLeads, deleteLeads, fetchAllLeads, fetchLeadsById, updateLeads } from "../controllers/leads.controller.js";

const router=Router();

router.post('/leads', createLeads)
router.get('/leads',fetchAllLeads)
router.get('/leads/:id',fetchLeadsById)
router.put('/leads/:id',updateLeads)
router.delete('/leads/:id',deleteLeads)

export default router