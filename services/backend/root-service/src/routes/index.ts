import { Router } from "express";
import chapterRouter from "./chapter";
import userRouter from "./user";
import { CONFIG } from "@/configs";
import Controllers from "@/controllers";
import {
  validationMiddleware,
  withResponseValidation,
} from "@/middlewares/validationMiddleware";
import { ResponseCreator } from "@/utils/responseCreator";
import {
  CronRequestValidator,
  CronResponseValidator,
  ICronResponse,
} from "@/validators";

const router = Router();

router.use(chapterRouter);
router.use(userRouter);

// cron job endpoint — secured with x-cron-secret header
router.get(
  "/cron",
  (req, res, next) => {
    const secret = req.headers["x-cron-secret"];
    if (!secret || secret !== CONFIG.cronSecret) {
      return res.status(401).json({
        success: false,
        error: { type: "unauthorized", message: "Invalid cron secret" },
      });
    }
    next();
  },
  validationMiddleware(CronRequestValidator),
  withResponseValidation<ICronResponse, typeof CronRequestValidator>(
    CronResponseValidator,
    (validatedData, res) => {
      return Controllers.cronHandler(
        validatedData,
        res,
        new ResponseCreator<ICronResponse>("cron"),
      );
    },
  ),
);

export default router;
