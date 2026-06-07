import Controllers from "@/controllers";
import {
  validationMiddleware,
  withResponseValidation,
} from "@/middlewares/validationMiddleware";
import { ResponseCreator } from "@/utils/responseCreator";
import {
  GetUsersRequestValidator,
  GetUsersResponseValidator,
  IGetUsersResponse,
} from "@/validators";
import { Router } from "express";

const userRouter = Router();

userRouter.get(
  "/users",
  validationMiddleware(GetUsersRequestValidator),
  withResponseValidation<IGetUsersResponse, typeof GetUsersRequestValidator>(
    GetUsersResponseValidator,
    (validatedData, res) => {
      return Controllers.getUsers(
        validatedData,
        res,
        new ResponseCreator<IGetUsersResponse>("getUsers"),
      );
    },
  ),
);

export default userRouter;
