export const CONFIG = {
  PROFILE_BASE_URL:
    import.meta.env.VITE_PROFILE_BASE_URL ?? "https://profile.ritb.in",
  PROFILE_API_BASE:
    import.meta.env.VITE_PROFILE_API_URL ?? "https://profile.ritb.in",
} as const;
