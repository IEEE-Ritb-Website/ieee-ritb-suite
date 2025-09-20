import { Request, Response } from "express";
import { SampleController } from "./sample";
import { mongodbClient } from "@/db";

export class ControllerClass {
    constructor() {
        // do something
        mongodbClient.init();
    }

    async pingController(req: Request, res: Response) {
        return res.status(201).json({ message: "Server running on 3000" });
    }

    sampleController = SampleController;
}

const Controllers = new ControllerClass();
export default Controllers;
