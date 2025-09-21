import z from "zod";

export interface IChapter {
    name: string;
    acronym: string;
    type: "tech" | "non-tech";
    shortDescription: string;
    imagePath: string;
}

export const Chapters = [
    {
        name: "Computer Society",
        acronym: "CS",
        type: "tech",
        shortDescription: "",
        imagePath: "",
    },
    {
        name: "Electronics Society",
        acronym: "ES",
        type: "tech",
        shortDescription: "",
        imagePath: "",
    },
] as const satisfies readonly IChapter[];

type ChapterTuple = typeof Chapters;
type ChapterNameTuple = ChapterTuple[number]["name"];

export const ChapterNames = Chapters.map(c => c.name);
export type IChapterNames = ChapterNameTuple;

export const ChapterNameSchema = z.enum(
    Chapters.map(c => c.name)
);
