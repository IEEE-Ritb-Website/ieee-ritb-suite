
export interface IChapter {
    name: string;
    acronym: string;
    type: "tech" | "non-tech";
    shortDescription: string;
    imagePath: string;
}

export const Chapters: IChapter[] = [
    {
        name: "Computer Society",
        acronym: "CS",
        type: "tech",
        shortDescription: "",
        imagePath: "",
    },
]

export const ChapterNames = Chapters.map((c: IChapter) => c.name);
export type IChapterNames = (typeof ChapterNames)[number];
