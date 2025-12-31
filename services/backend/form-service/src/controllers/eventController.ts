import { Request, Response } from "express";
import { getDb } from "@/db";
import { IEvent } from "@/schemas";
import { successResponse } from "@/utils";
import { NotFoundError } from "@/middlewares";

const getEventsCollection = () => getDb().collection<IEvent>("events");
export const listEvents = async (req: Request, res: Response) => {
    const {
        status = "published",
        eventType,
        page = "1",
        limit = "20",
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;


    const filter: any = {};
    if (status) filter.status = status;
    if (eventType) filter.eventType = eventType;

    // get events with pagination
    const events = await getEventsCollection()
        .find(filter)
        .sort({ startDate: -1 })
        .skip(skip)
        .limit(limitNum)
        .toArray();

    const total = await getEventsCollection().countDocuments(filter);

    res.json(
        successResponse(
            {
                events,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    totalPages: Math.ceil(total / limitNum),
                },
            },
            "Events retrieved successfully"
        )
    );
};

export const getEventById = async (req: Request, res: Response) => {
    const { eventId } = req.params;

    const event = await getEventsCollection().findOne({ _id: eventId as any });

    if (!event) {
        throw new NotFoundError("Event");
    }

    res.json(successResponse(event, "Event retrieved successfully"));
};


export const getEventBySlug = async (req: Request, res: Response) => {
    const { slug } = req.params;

    const event = await getEventsCollection().findOne({ slug });

    if (!event) {
        throw new NotFoundError("Event");
    }

    res.json(successResponse(event, "Event retrieved successfully"));
};
