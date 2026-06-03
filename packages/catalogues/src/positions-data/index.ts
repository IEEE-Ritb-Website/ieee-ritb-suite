
export const IEEE_POSITIONS = [
    { value: "volunteer", name: "Volunteer" },
    { value: "execom", name: "Execom" },
    { value: "chair", name: "Chair" },
    { value: "secretary", name: "Secretary" },
    { value: "treasurer", name: "Treasurer" },
    { value: "technical-head", name: "Technical Head" },
    { value: "convenor", name: "Convenor" },
    { value: "documentation-head", name: "Documentation Head" },
    { value: "head", name: "Head" },
    { value: "co-head", name: "Co-Head" },
    { value: "vice-chair", name: "Vice Chair" },
    { value: "vice-secretary", name: "Vice Secretary" },
    { value: "vice-treasurer", name: "Vice Treasurer" },
    { value: "vice-technical-head", name: "Vice Technical Head" },
    { value: "vice-convenor", name: "Vice Convenor" },
] as const satisfies readonly { value: string; name: string }[];

type PositionTuple = typeof IEEE_POSITIONS;
export const PositionValues = IEEE_POSITIONS.map(p => p.value);
export type TPositionValue = PositionTuple[number]["value"];
