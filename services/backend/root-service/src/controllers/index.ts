import { Request, Response } from "express";
import { ChaptersController} from "./chapters";

export class ControllerClass {
    constructor() {
        // do something
    }

    async pingController(req: Request, res: Response) {
        return res.status(201).json({ message: "Server running" });
    }

    chaptersController = ChaptersController;
    
}

const Controllers = new ControllerClass();
export default Controllers;
