export const CONFIG = {
  PROFILE_BASE_URL:
    import.meta.env.VITE_PROFILE_BASE_URL ?? "https://profile.ritb.in",
  PROFILE_API_BASE:
    import.meta.env.VITE_PROFILE_API_URL ?? "https://profile.ritb.in",
  UNIFIED_API_BASE:
    import.meta.env.VITE_API_URL ?? "http://localhost:3000",
} as const;
