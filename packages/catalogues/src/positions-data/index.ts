
export const IEEE_POSITIONS = [
    { value: "volunteer", name: "Volunteer" },
    { value: "execom", name: "Execom" },
    { value: "chair", name: "Chair" },
    { value: "vice-chair", name: "Vice Chair" },
    { value: "secretary", name: "Secretary" },
    { value: "vice-secretary", name: "Vice Secretary" },
    { value: "treasurer", name: "Treasurer" },
    { value: "vice-treasurer", name: "Vice Treasurer" },
    { value: "technical-head", name: "Technical Head" },
    { value: "vice-technical-head", name: "Vice Technical Head" },
    { value: "convenor", name: "Convenor" },
    { value: "vice-convenor", name: "Vice Convenor" },
    { value: "documentation-head", name: "Documentation Head" },
    { value: "head", name: "Head" },
    { value: "co-head", name: "Co-Head" },
] as const satisfies readonly { value: string; name: string }[];

type PositionTuple = typeof IEEE_POSITIONS;
export const PositionValues = IEEE_POSITIONS.map(p => p.value);
export type TPositionValue = PositionTuple[number]["value"];
