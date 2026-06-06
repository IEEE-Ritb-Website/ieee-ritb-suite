import { WithResponsePromise } from "@/types";
import { ControllerClass } from "..";
import { ResponseCreator } from "@/utils/responseCreator";
import { getAstraLogger } from "astralogger";
import { CronRequest, CronResponse, ICronResponse } from "@/validators";

export async function CronHandlerController(
  this: ControllerClass,
  req: CronRequest,
  res: CronResponse,
  responseCreator: ResponseCreator<ICronResponse>,
): WithResponsePromise<ICronResponse> {
  try {
    getAstraLogger().info("Cron job executed successfully");
    return responseCreator.ok({
      success: true,
      data: {
        timestamp: new Date().toISOString(),
        message: "Cron job executed successfully",
      },
      message: "Cron job completed",
    });
  } catch (error) {
    getAstraLogger().fatal(`Error in CronHandlerController: ${error}`);
    return responseCreator.fatal();
  }
}
