import { ObjectId } from "mongodb";
import { ValidationError } from "@/middlewares";

// Route params arrive as strings while Mongo stores ObjectIds.
// Converts a param to ObjectId, rejecting malformed ids with a 400.
export const toObjectId = (id: string, resource: string): ObjectId => {
    if (!ObjectId.isValid(id)) {
        throw new ValidationError(`Invalid ${resource} id`);
    }
    return new ObjectId(id);
};
