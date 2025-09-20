import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { createLeads, deleteLeads, fetchAllLeads, fetchLeadsById, updateLeads } from "../controllers/leads.controller";

const router=Router();

router.use('/leads',verifyJWT, createLeads)
router.use('/leads',verifyJWT,fetchAllLeads)
router.use('/leads/:id',verifyJWT,fetchLeadsById)
router.use('/leads',verifyJWT,updateLeads)
router.use('/leads',verifyJWT,deleteLeads)

export default router