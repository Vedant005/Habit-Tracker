import { Router } from "express";
import { createCheckIn, getCheckIns } from "../controllers/checkIn";


const router = Router();

router.route("/:habitId").get(getCheckIns);
router.route("/:habitId").post(createCheckIn);

export default router;