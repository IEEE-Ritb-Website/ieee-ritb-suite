import z from "zod";

export enum ChapterType {
    TECH = "tech",
    NON_TECH = "non-tech",
}

export interface IChapter {
    name: string;
    acronym: string;
    type: ChapterType;
    shortDescription: string;
}

export const Chapters = [
    {
        name: "Antennas and Propagation Society",
        acronym: "APS",
        type: ChapterType.TECH,
        shortDescription: "APS (Antenna and Propagation Society) is a technical society within the IEEE that focuses (but not limited to) on the theory and practice of antennas, electromagnetism, and microwave theory.",
    },
    {
        name: "Communications Society",
        acronym: "ComSoc",
        type: ChapterType.TECH,
        shortDescription: "ComSoc in our college is part of the IEEE student chapter that promotes learning and innovation in communication technologies. Through activities like events and talks, it connects students with advancements in Internet and networking fields.",
    },
    {
        name: "Computational Intelligence Society",
        acronym: "CIS",
        type: ChapterType.TECH,
        shortDescription: "The IEEE CIS Chapter in our college is a technical chapter that focuses on key areas of our curriculum like artificial intelligence, machine learning, neural networks, and data science. The chapter encourages interdisciplinary learning, supports research and innovation, and provides opportunities to work on impactful tech problems beyond the classroom.",
    },
    {
        name: "Computer Society",
        acronym: "CS",
        type: ChapterType.TECH,
        shortDescription: "IEEE Computer Society (IEEE CS) is a technical society of IEEE that focuses on computing and information technology and research.",
    },
    {
        name: "Engineering in Medicine and Biology Society",
        acronym: "EMBS",
        type: ChapterType.TECH,
        shortDescription: "IEEE Engineering in Medicine and Biology Society (IEEE EMBS) is a technical society of IEEE that connects engineering with medicine and biology. It encourages innovation in healthcare through technical events, research initiatives, and collaborative learning, empowering members to explore and develop impactful biomedical technologies and solutions.",
    },
    {
        name: "IEEE Xtreme",
        acronym: "IX",
        type: ChapterType.TECH,
        shortDescription: "IEEEXtreme is a global 24-hour coding competition for IEEE student members. In our college, we conduct regular coding challenges and share strategies to enhance  coding and problem-solving skills.",
    },
    {
        name: "Microwave Theory and Technology Society",
        acronym: "MTTS",
        type: ChapterType.TECH,
        shortDescription: "IEEE RIT-B MTT-S is dedicated to advancing knowledge in Microwave and RF engineering. We bridge the gap between academia and industry, fostering innovation, hands-on learning, and research-driven skill development.",
    },
    {
        name: "Signal Processing Society",
        acronym: "SPS",
        type: ChapterType.TECH,
        shortDescription: "The IEEE Signal Processing Society Student Chapter is a vibrant community dedicated to the fascinating field of signal processing. We aim to inspire innovation, foster technical growth, and provide practical experiences through workshops, projects, and industry collaborations. With a focus on both theoretical learning and hands-on applications, we create an environment where students can explore cutting-edge techniques",
    },
    {
        name: "Robotics and Automation Society",
        acronym: "RAS",
        type: ChapterType.TECH,
        shortDescription: "RAS (Robotics and Automation Society) is an IEEE community where we explore robotics and automation through hands-on projects, workshops, and competitions.",
    },
    {
        name: "Sensors Council",
        acronym: "SC",
        type: ChapterType.TECH,
        shortDescription: "The IEEE Sensors Council Student Chapter is a close-knit community that explores the world of sensor technologies. We aim to spark curiosity, encourage innovation, and provide hands-on exposure through events, projects, and industry interactions. With a focus on learning by doing, we strive to build a space where ideas grow and students connect through shared passion and purpose.",
    },
    {
        name: "Women in Engineering",
        acronym: "WIE",
        type: ChapterType.TECH,
        shortDescription: "IEEE Women in Engineering is one of the world’s largest international professional organizations dedicated to promoting women engineers and scientists, and inspiring girls around the globe to follow their academic interests in a career in engineering. Through mentorship, technical events, and outreach programs,WIE aims to empower women to break barriers, spark change, and drive the future of technology.",
    },
    {
        name: "Power and Energy Society",
        acronym: "PES",
        type: ChapterType.TECH,
        shortDescription: "IEEE Power & Energy Society (PES) is a global community of students, engineers, and professionals focused on electric power and energy.",
    },
    {
        name: "Web Resources",
        acronym: "Web",
        type: ChapterType.NON_TECH,
        shortDescription: "Maintains and updates the club's website. Manages web functionality to create an accessible, user-friendly site.",
    },
    {
        name: "Public Relations & Sponsorship Team",
        acronym: "PRSP",
        type: ChapterType.NON_TECH,
        shortDescription: "Manages publicity, partnerships, and sponsorships. Promotes events across social media, newsletters, and other channels. Builds relationships with sponsors to support events and projects. Helps in securing resources and support for major initiatives.",
    },
    {
        name: "Creativity",
        acronym: "CRTY",
        type: ChapterType.NON_TECH,
        shortDescription: "Adds creative flair to club projects and events. Provides creative ideas and design inputs for events. Collaborates with other teams to enhance the aesthetics and engagement of club initiatives. Supports the Design and PR teams by brainstorming fresh concepts.",
    },
    {
        name: "Digital Design",
        acronym: "DIGI",
        type: ChapterType.NON_TECH,
        shortDescription: "Creates visual content for the club's events. Designs posters, social media posts, banners, and flyers. Maintains the club’s visual identity across platforms.",
    },
    {
        name: "Coverage",
        acronym: "COVR",
        type: ChapterType.NON_TECH,
        shortDescription: "Coverage and Social Media Team. Instagram Page Handling. Video Editing",
    },
] as const satisfies readonly IChapter[];

type ChapterTuple = typeof Chapters;
type ChapterNameTuple = ChapterTuple[number]["name"];
type ChapterAcronymTuple = ChapterTuple[number]["acronym"];

export const ChapterNames = Chapters.map(c => c.name);
export const ChapterAcronyms = Chapters.map(c => c.acronym);
export type IChapterNames = ChapterNameTuple;
export type IChapterAcronyms = ChapterAcronymTuple;

export const ChapterNameSchema = z.enum(
    Chapters.map(c => c.name)
);
