import React from "react";
import { type ProfileFormData } from "@/lib/schema";

export function safeParseArray<T = unknown>(val: unknown): T[] {
  if (typeof val === "string") {
    try {
      return JSON.parse(val) as T[];
    } catch {
      return [];
    }
  }
  return Array.isArray(val) ? (val as T[]) : [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function safeNormalizeProfile(data: any): ProfileFormData {
  return {
    ...data,
    skills: safeParseArray<string>(data.skills),
    social_links: safeParseArray<NonNullable<ProfileFormData["social_links"]>[number]>(data.social_links),
    achievements: safeParseArray<NonNullable<ProfileFormData["achievements"]>[number]>(data.achievements),
    projects: safeParseArray<NonNullable<ProfileFormData["projects"]>[number]>(data.projects),
    timeline: safeParseArray<NonNullable<ProfileFormData["timeline"]>[number]>(data.timeline),
    stats: data.stats && typeof data.stats === "object" ? data.stats : {},
  } as ProfileFormData;
}

export function areProfilesEqual(
  a: Partial<ProfileFormData>,
  b: Partial<ProfileFormData>,
): boolean {
  const s = (v: unknown) => (v === null || v === undefined ? "" : String(v).trim());
  if (s(a.name) !== s(b.name)) return false;
  if (s(a.image) !== s(b.image)) return false;
  if (s(a.current_status) !== s(b.current_status)) return false;
  if (s(a.bio) !== s(b.bio)) return false;
  if (s(a.email) !== s(b.email)) return false;

  const linksA = (a.social_links || []).filter((l) => s(l?.link) !== "");
  const linksB = (b.social_links || []).filter((l) => s(l?.link) !== "");
  if (linksA.length !== linksB.length) return false;
  for (let i = 0; i < linksA.length; i++) {
    if (s(linksA[i]?.label) !== s(linksB[i]?.label)) return false;
    if (s(linksA[i]?.link) !== s(linksB[i]?.link)) return false;
  }

  const achA = (a.achievements || []).filter((h) => s(h?.title) !== "");
  const achB = (b.achievements || []).filter((h) => s(h?.title) !== "");
  if (achA.length !== achB.length) return false;
  for (let i = 0; i < achA.length; i++) {
    if (s(achA[i]?.title) !== s(achB[i]?.title)) return false;
    if (s(achA[i]?.badge_type) !== s(achB[i]?.badge_type)) return false;
    if (s(achA[i]?.date) !== s(achB[i]?.date)) return false;
    if (s(achA[i]?.description) !== s(achB[i]?.description)) return false;
    if (s(achA[i]?.link) !== s(achB[i]?.link)) return false;
  }

  const projA = (a.projects || []).filter((p) => s(p?.title) !== "");
  const projB = (b.projects || []).filter((p) => s(p?.title) !== "");
  if (projA.length !== projB.length) return false;
  for (let i = 0; i < projA.length; i++) {
    if (s(projA[i]?.type) !== s(projB[i]?.type)) return false;
    if (s(projA[i]?.title) !== s(projB[i]?.title)) return false;
    if (s(projA[i]?.short_description) !== s(projB[i]?.short_description))
      return false;
    if (s(projA[i]?.long_description) !== s(projB[i]?.long_description))
      return false;
    if (s(projA[i]?.primary_link) !== s(projB[i]?.primary_link)) return false;
    if (s(projA[i]?.extra_link) !== s(projB[i]?.extra_link)) return false;
    const tA = (projA[i]?.tags || []).filter((t: string) => s(t) !== "");
    const tB = (projB[i]?.tags || []).filter((t: string) => s(t) !== "");
    if (tA.length !== tB.length) return false;
    for (let j = 0; j < tA.length; j++) {
      if (s(tA[j]) !== s(tB[j])) return false;
    }
  }

  const skillsA = a.skills || [];
  const skillsB = b.skills || [];
  if (skillsA.length !== skillsB.length) return false;
  for (let i = 0; i < skillsA.length; i++) {
    if (s(skillsA[i]) !== s(skillsB[i])) return false;
  }

  const tlA = (a.timeline || []).filter(
    (t) =>
      s(t?.year) !== "" && s(t?.position) !== "" && s(t?.chapter) !== "",
  );
  const tlB = (b.timeline || []).filter(
    (t) =>
      s(t?.year) !== "" && s(t?.position) !== "" && s(t?.chapter) !== "",
  );
  if (tlA.length !== tlB.length) return false;
  for (let i = 0; i < tlA.length; i++) {
    if (s(tlA[i]?.year) !== s(tlB[i]?.year)) return false;
    if (s(tlA[i]?.position) !== s(tlB[i]?.position)) return false;
    if (s(tlA[i]?.chapter) !== s(tlB[i]?.chapter)) return false;
    if (s(tlA[i]?.description) !== s(tlB[i]?.description)) return false;
  }

  return true;
}

export function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-[#ff4fd8] mt-1 tracking-wide">{msg}</p>;
}

export const errCls = (hasErr: boolean) =>
  hasErr ? "border-[#ff4fd8] shadow-[0_0_0_1px_rgba(255,79,216,0.35)]" : "";

export const countWords = (value: string | undefined | null) =>
  (value || "").trim().split(/\s+/).filter(Boolean).length;
