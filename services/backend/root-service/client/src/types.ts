export interface GetChaptersRequest {
  params?: Record<string, never>;
  query?: {
    name?: string;
    acronym?: string;
    type?: "tech" | "non-tech";
  };
  body?: Record<string, never>;
}

export interface GetChaptersResponse {
  success: true;
  data: {
    name: string;
    type: "tech" | "non-tech";
    acronym: string;
    shortDescription: string;
    logoUrl: string;
  }[];
}

export interface GetUsersRequest {
  params?: Record<string, never>;
  query?: {
    limit?: number;
    offset?: number;
    position?: string;
    chapters?: string;
    onlySeniorPositions: boolean;
    onlyJuniorPositions: boolean;
    onlyExecoms: boolean;
  };
  body?: Record<string, never>;
}

export interface GetUsersResponse {
  success: true;
  data:
    | {
        name: string;
        image: string | null;
        username: string;
        chapters: {
          name: string;
          acronym: string;
          position: string;
        }[];
        department: string;
        year: string;
        term: string;
      }[]
    | null;
  message?: string;
}
