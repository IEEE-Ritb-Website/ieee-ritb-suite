import { WithResponsePromise } from "@/types";
import { ControllerClass } from "..";
import {
  GetUsersRequest,
  GetUsersResponse,
  IGetUsersResponse,
} from "@/validators";
import { ResponseCreator } from "@/utils/responseCreator";
import { getAstraLogger } from "astralogger";
import {
  Chapters as ChaptersCatalogue,
  IEEE_POSITIONS,
} from "@astranova/catalogues";
import { mongodbClient } from "@/db";
import { Document } from "mongodb";

interface IDBUser {
  name?: string;
  image?: string | null;
  username?: string;
  chapters?: Array<{
    name?: string;
    acronym?: string;
    position?: string;
  }>;
}

export async function GetUsersController(
  this: ControllerClass,
  req: GetUsersRequest,
  res: GetUsersResponse,
  responseCreator: ResponseCreator<IGetUsersResponse>,
): WithResponsePromise<IGetUsersResponse> {
  try {
    const {
      position,
      chapters,
      onlySeniorPositions,
      onlyJuniorPositions,
      onlyExecoms,
    } = req.query;
    const limit = parseInt(String(req.query.limit ?? 20), 10);
    const offset = parseInt(String(req.query.offset ?? 0), 10);

    const db = mongodbClient.getDb();

    // Dynamically find the latest term present in the user collection to show the active team
    const latestUserDoc = await db
      .collection("user")
      .findOne({}, { sort: { term: -1 } });

    const activeTerm = latestUserDoc?.term || "2026-27";

    // Query builder starting with the active term filter
    const query: Document = {
      term: activeTerm,
    };

    // Parse chapters to build array of full names to match
    const chapterNamesToFilter: string[] = [];
    if (chapters) {
      const splitChapters = chapters
        .split(",")
        .map((c) => c.trim().toLowerCase());
      for (const item of splitChapters) {
        const matched = ChaptersCatalogue.find(
          (c) =>
            c.name.toLowerCase() === item || c.acronym.toLowerCase() === item,
        );
        if (matched) {
          chapterNamesToFilter.push(matched.name);
        }
      }
    }

    // Determine target position filters from query flags
    let positionFilter: { $regex: RegExp } | null = null;
    if (onlyExecoms) {
      positionFilter = { $regex: new RegExp("^Execom$", "i") };
    } else if (onlyJuniorPositions) {
      const juniorPositions = IEEE_POSITIONS.filter((p) =>
        p.value.includes("vice"),
      ).map((p) => p.name);
      positionFilter = {
        $regex: new RegExp(`^(?:${juniorPositions.join("|")})$`, "i"),
      };
    } else if (onlySeniorPositions) {
      const seniorPositions = IEEE_POSITIONS.filter(
        (p) => p.value !== "volunteer" && !p.value.includes("vice"),
      ).map((p) => p.name);
      positionFilter = {
        $regex: new RegExp(`^(?:${seniorPositions.join("|")})$`, "i"),
      };
    } else if (position) {
      positionFilter = { $regex: new RegExp(`^${position}$`, "i") };
    }

    // Combine chapters and positions into $elemMatch if active
    if (chapterNamesToFilter.length > 0) {
      const elemMatch: Document = {
        name: { $in: chapterNamesToFilter },
      };
      if (positionFilter) {
        elemMatch.position = positionFilter;
      }
      query.chapters = { $elemMatch: elemMatch };
    } else if (positionFilter) {
      query.chapters = {
        $elemMatch: {
          position: positionFilter,
        },
      };
    }

    // Fetch paginated user list from MongoDB
    const users = (await db
      .collection("user")
      .find(query)
      .project({
        _id: 0,
        name: 1,
        image: 1,
        username: 1,
        chapters: 1,
      })
      .skip(offset)
      .limit(limit)
      .toArray()) as unknown as IDBUser[];

    // Normalize response data to match schema
    const formattedUsers = users.map((u) => ({
      name: u.name || "",
      image: u.image || null,
      username: u.username || "",
      chapters: (u.chapters || []).map((ch) => ({
        name: ch.name || "",
        acronym: ch.acronym || "",
        position: ch.position || "",
      })),
    }));

    return responseCreator.ok({
      success: true,
      data: formattedUsers,
      message: "Users retrieved successfully",
    });
  } catch (error) {
    getAstraLogger().fatal(`Error at GetUsersController: ${error}`);
    return responseCreator.fatal("Internal server error");
  }
}
