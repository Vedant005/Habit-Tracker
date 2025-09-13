import { Router } from "express";
import { createHabits, deleteHabits, editHabits, getHabits } from "../controllers/habit";


const router = Router();

router.route("/").get(getHabits);
router.route("/create").post(createHabits);
router.route("/edit").patch(editHabits);
router.route("/delete").delete(deleteHabits);


export default router