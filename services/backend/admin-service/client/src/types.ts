export interface ChangePasswordRequest {
  params?: Record<string, never>;
  query?: Record<string, never>;
  body: {
    email: string;
    newPassword: string;
  };
}

export interface ChangePasswordResponse {
  success: true;
  message: string;
}

export interface CreateChapterRequest {
  params?: Record<string, never>;
  query?: Record<string, never>;
  body?: {
    name: string;
    logo: string;
    chapterType: string;
    // TODO: any;
    faculty?: string;
    facultyImage?: string;
  };
}

export interface CreateChapterResponse {
  success: true;
  message: string;
}

export interface CreateChapterAdminRequest {
  params?: Record<string, never>;
  query?: Record<string, never>;
  body: {
    email: any;
    name: string;
    password: string;
    chapter: any;
  };
}

export interface CreateChapterAdminResponse {
  success: true;
  message: string;
}

export interface CreateChapterExecomRequest {
  params?: Record<string, never>;
  query?: Record<string, never>;
  body: {
    email: any;
    name: string;
    password: string;
  };
}

export interface CreateChapterExecomResponse {
  success: true;
  message: string;
}

export interface SignInRequest {
  params?: Record<string, never>;
  query?: Record<string, never>;
  body: {
    email: string;
    password: string;
  };
}

export interface SignInResponse {
  success: true;
  message: string;
  redirect: boolean;
  url?: string;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    emailVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
}
