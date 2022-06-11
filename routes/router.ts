import express from "express";

const router = express.Router();

import token from "../controllers/token";
import ping from "../controllers/ping";
import solana from "../controllers/solana";

router.get("/ping", ping);
router.get("/token", token);
router.get("/solana", solana);

export default router;
