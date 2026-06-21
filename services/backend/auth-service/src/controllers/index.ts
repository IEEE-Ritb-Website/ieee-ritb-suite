import { Request, Response } from "express";
import { SampleController } from "./sample";

export class ControllerClass {
    constructor() {
        // do something
    }

    async pingController(req: Request, res: Response) {
        return res.status(201).json({ message: "Server running" });
    }

    sampleController = SampleController;
}

const Controllers = new ControllerClass();
export default Controllers;
