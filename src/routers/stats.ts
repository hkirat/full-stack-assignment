import express from "express";
import getStatsHandler from "../handlers/getStats";

const statRouter = express.Router();

statRouter.get("/stats", getStatsHandler);

export default statRouter;
