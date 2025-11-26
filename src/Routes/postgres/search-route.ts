import { Router } from "express";
import { searchController } from "../../controllers/postgres/search-controller";

const router = Router();

router.route("/get-postgres-users").get(searchController.getUsers);

export default router;