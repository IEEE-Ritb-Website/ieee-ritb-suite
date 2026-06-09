import React from "react";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import { useProfileEdit } from "@/context/ProfileEditContext";
import { DebouncedSelect } from "@/components/ui/DebouncedSelect";
import { DEPARTMENTS } from "@/lib/departments";
import {
  AVAILABLE_SKILLS,
  CHAPTER_OPTIONS,
  EDIT_PROJECT_TYPE_META,
  PROJECT_TYPES,
} from "@/constants";
import { IEEE_POSITIONS } from "@astranova/catalogues";
import { errCls, FieldError } from "@/utils/helpers";
import { type ProfileFormData } from "@/lib/schema";
import {
  Lock,
  Pen,
  Terminal,
  X,
  Pin,
  Plus,
  GripVertical,
  Medal,
  ChevronDown,
  Code,
  Github,
} from "lucide-react";

export function BasicInfoSection() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<ProfileFormData>();
  const departmentValue = watch("department") || "";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="block text-xs uppercase flex gap-2 text-[rgba(200,255,232,0.45)] mb-1">
            Name <Lock size={12} />
          </label>
          <input
            {...register("name")}
            readOnly
            className="w-full bg-[rgba(0,255,157,0.02)] border border-[rgba(0,255,157,0.1)] rounded px-3 py-2 outline-none text-[rgba(200,255,232,0.5)] cursor-not-allowed"
          />
        </div>
        <div>
          <label className="block text-xs uppercase flex gap-2 text-[rgba(200,255,232,0.45)] mb-1">
            Status <Pen size={12} />
          </label>
          <input
            {...register("current_status")}
            placeholder="writing papers..."
            className={`w-full bg-[rgba(0,255,157,0.05)] border border-[rgba(0,255,157,0.2)] rounded px-3 py-2 outline-none focus:border-[#00ff9d] text-[#00ff9d] transition-colors ${errCls(!!errors.current_status)}`}
          />
          <FieldError msg={errors.current_status?.message} />
        </div>
        <div>
          <label className="block text-xs uppercase flex gap-2 text-[rgba(200,255,232,0.45)] mb-1">
            Department <Pen size={12} />
          </label>
          <DebouncedSelect
            options={DEPARTMENTS}
            value={departmentValue}
            onChange={(val) =>
              setValue("department", val, { shouldDirty: true })
            }
            placeholder="Select department..."
          />
        </div>
      </div>
      <div>
        <label className="block text-xs uppercase flex gap-2 text-[rgba(200,255,232,0.45)] mb-1">
          Bio <Pen size={12} />
        </label>
        <textarea
          {...register("bio")}
          rows={7}
          className={`w-full bg-[rgba(0,255,157,0.05)] border border-[rgba(0,255,157,0.2)] rounded px-3 py-2 outline-none focus:border-[#00ff9d] transition-colors resize-none ${errCls(!!errors.bio)}`}
        />
        <FieldError msg={errors.bio?.message} />
      </div>
    </div>
  );
}

export function SystemInfoSection() {
  const { register, watch } = useFormContext<ProfileFormData>();
  const { fullProfile } = useProfileEdit();
  const formData = watch();

  const systemFields = [
    ["USN", fullProfile?.usn || formData?.usn],
    ["Phone Number", fullProfile?.phoneNumber || formData?.phoneNumber],
    ["Batch Of", fullProfile?.batch_of || fullProfile?.batch],
    ["Year of Study", fullProfile?.year || formData?.year],
    ["IEEE Membership ID", fullProfile?.membershipId],
  ];

  return (
    <div className="border-t border-[rgba(0,255,157,0.1)] pt-6 space-y-4">
      <div className="flex items-center gap-2">
        <Lock size={16} className="text-[#00ff9d]" />
        <span className="uppercase text-sm">System Information</span>
      </div>
      <div className="text-xs max-w-2xl tracking-widest text-[rgba(200,255,232,0.45)]">
        these records are stored on the host system and are not publicly
        available. contact admins for changes.
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs uppercase flex gap-2 text-[rgba(200,255,232,0.45)] mb-1">
            Email <Lock size={12} />
          </label>
          <input
            {...register("email")}
            readOnly
            className="w-full bg-[rgba(0,255,157,0.02)] border border-[rgba(0,255,157,0.1)] rounded px-3 py-2 outline-none text-[rgba(200,255,232,0.5)] cursor-not-allowed text-xs"
          />
        </div>

        {systemFields.map(([label, value]) => (
          <div key={label as string}>
            <label className="block text-xs uppercase text-[rgba(200,255,232,0.35)] mb-1">
              {label}
            </label>
            <input
              value={value || "NOT SET"}
              readOnly
              className="w-full bg-[rgba(0,255,157,0.02)] border border-[rgba(0,255,157,0.1)] rounded px-3 py-2 outline-none text-[rgba(200,255,232,0.5)] cursor-not-allowed text-xs"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkillsSection() {
  const { setValue, watch } = useFormContext<ProfileFormData>();
  const skills = watch("skills") || [];

  return (
    <div className="space-y-4 border-t border-[rgba(0,255,157,0.1)] pt-6">
      <div className="flex items-center gap-2">
        <Terminal size={22} className="text-[#00ff9d]" />
        <label className="text-sm uppercase flex gap-2">
          Tech Stack &amp; Skills
        </label>
      </div>
      <DebouncedSelect
        options={AVAILABLE_SKILLS.filter((s) => !skills.includes(s)).map(
          (s) => ({
            value: s,
            label: s,
          }),
        )}
        value=""
        onChange={(val) => {
          if (val && !skills.includes(val)) {
            setValue("skills", [...skills, val], { shouldDirty: true });
          }
        }}
        placeholder="Search hardware / software skills..."
      />

      <div className="flex flex-wrap gap-2 pt-3 bg-[rgba(0,255,157,0.01)] border border-dashed border-[rgba(0,255,157,0.15)] p-4 rounded min-h-[60px] items-center">
        {skills.length > 0 ? (
          skills.map((skill) => (
            <span
              key={skill}
              onClick={() =>
                setValue(
                  "skills",
                  skills.filter((s) => s !== skill),
                  { shouldDirty: true },
                )
              }
              className="flex items-center gap-1.5 p-1 px-2.5 rounded-[2px] text-xs tracking-[0.05em] border border-[rgba(0,207,255,0.35)] text-[#00cfff] bg-[rgba(0,207,255,0.06)] hover:border-[#ff4fd8] hover:text-[#ff4fd8] hover:bg-[rgba(255,79,216,0.05)] transition-all cursor-pointer group"
            >
              {skill}{" "}
              <X size={10} className="opacity-60 group-hover:opacity-100" />
            </span>
          ))
        ) : (
          <span className="text-xs opacity-40 italic uppercase tracking-wider">
            {"// select skills from the dropdown above"}
          </span>
        )}
      </div>
    </div>
  );
}

export function SocialLinksSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ProfileFormData>();
  const {
    fields: linkFields,
    append: appendLink,
    remove: removeLink,
    swap: swapLinks,
  } = useFieldArray({ control, name: "social_links" });

  return (
    <div className="space-y-4 border-t border-[rgba(0,255,157,0.1)] pt-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Pin size={22} className="text-[#00ff9d]" />
          <label className="text-sm uppercase tracking-widest">Links</label>
        </div>
        <button
          type="button"
          onClick={() => appendLink({ label: "", link: "" })}
          className="text-sm flex items-center gap-2 border border-[#00ff9d] px-2 py-1 hover:bg-[rgba(0,255,157,0.1)] transition-colors"
        >
          <Plus size={14} /> Add Link
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {linkFields.map((field, idx) => (
          <div
            key={field.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", String(idx));
              e.currentTarget.classList.add("opacity-40");
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add("border-[#00ff9d]", "border");
            }}
            onDragLeave={(e) => {
              e.currentTarget.classList.remove("border-[#00ff9d]", "border");
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove("border-[#00ff9d]", "border");
              const from = parseInt(e.dataTransfer.getData("text/plain"));
              if (!isNaN(from) && from !== idx) swapLinks(from, idx);
            }}
            onDragEnd={(e) => {
              e.currentTarget.classList.remove(
                "opacity-40",
                "border-[#00ff9d]",
                "border",
              );
            }}
            className="flex gap-2 items-start w-full bg-[rgba(0,255,157,0.02)] border border-[rgba(0,255,157,0.1)] p-3 rounded cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center pt-2 text-[rgba(200,255,232,0.25)] hover:text-[#00ff9d] transition-colors flex-shrink-0">
              <GripVertical size={16} />
            </div>
            <div className="flex-1 space-y-2">
              <input
                {...register(`social_links.${idx}.label`)}
                placeholder="Label (e.g. GitHub)"
                className="w-full bg-transparent border-b border-[rgba(0,255,157,0.2)] outline-none text-sm"
              />
              <input
                {...register(`social_links.${idx}.link`)}
                placeholder="https://..."
                className={`w-full bg-transparent border-b outline-none text-sm transition-colors ${errCls(!!errors.social_links?.[idx]?.link)}`}
              />
              <FieldError msg={errors.social_links?.[idx]?.link?.message} />
            </div>
            <button
              type="button"
              onClick={() => removeLink(idx)}
              className="text-[#ff4fd8] mt-1 flex-shrink-0"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AchievementsSection() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ProfileFormData>();
  const {
    fields: achFields,
    append: appendAch,
    remove: removeAch,
    swap: swapAch,
  } = useFieldArray({ control, name: "achievements" });

  return (
    <div className="space-y-4 border-t border-[rgba(0,255,157,0.1)] pt-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Medal size={22} className="text-[#00ff9d]" />
          <label className="text-sm uppercase tracking-widest">
            Honors &amp; Achievements
          </label>
        </div>
        <button
          type="button"
          onClick={() =>
            appendAch({
              title: "",
              badge_type: "hackathon",
              date: "",
              description: "",
              link: "",
            })
          }
          className="text-sm flex items-center gap-2 border border-[#00ff9d] px-2 py-1 hover:bg-[rgba(0,255,157,0.1)] transition-colors"
        >
          <Plus size={14} /> Add Achievement
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {achFields.map((field, idx) => (
          <div
            key={field.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", String(idx));
              e.currentTarget.classList.add("opacity-40");
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add("border-[#00ff9d]", "border");
            }}
            onDragLeave={(e) => {
              e.currentTarget.classList.remove("border-[#00ff9d]", "border");
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove("border-[#00ff9d]", "border");
              const from = parseInt(e.dataTransfer.getData("text/plain"));
              if (!isNaN(from) && from !== idx) swapAch(from, idx);
            }}
            onDragEnd={(e) => {
              e.currentTarget.classList.remove(
                "opacity-40",
                "border-[#00ff9d]",
                "border",
              );
            }}
            className="bg-[rgba(0,255,157,0.02)] border border-[rgba(0,255,157,0.12)] rounded p-4 cursor-grab active:cursor-grabbing"
          >
            <div className="flex gap-2 items-start">
              <div className="flex items-center pt-2 text-[rgba(200,255,232,0.25)] hover:text-[#00ff9d] transition-colors flex-shrink-0">
                <GripVertical size={16} />
              </div>
              <div className="flex-1 space-y-2">
                <input
                  {...register(`achievements.${idx}.title`)}
                  placeholder="Achievement title (e.g. 1st Place — HackMIT 2024)"
                  className={`w-full bg-transparent border-b border-[rgba(0,255,157,0.2)] outline-none text-sm text-[#c8ffe8] placeholder:text-[rgba(200,255,232,0.25)] pb-1 transition-colors ${errCls(!!errors.achievements?.[idx]?.title)}`}
                />
                <FieldError msg={errors.achievements?.[idx]?.title?.message} />

                <div className="flex gap-2 flex-wrap items-center">
                  <div className="relative">
                    <select
                      {...register(`achievements.${idx}.badge_type`)}
                      className="appearance-none bg-[rgba(0,255,157,0.05)] border border-[rgba(0,255,157,0.2)] rounded px-3 py-1.5 pr-8 text-xs outline-none focus:border-[#00ff9d] text-[rgba(200,255,232,0.6)] cursor-pointer"
                    >
                      <option value="hackathon" className="bg-[#0d0d1a]">
                        Hackathon
                      </option>
                      <option value="internship" className="bg-[#0d0d1a]">
                        Internship
                      </option>
                      <option value="open_source" className="bg-[#0d0d1a]">
                        Open Source
                      </option>
                      <option value="certification" className="bg-[#0d0d1a]">
                        Certification
                      </option>
                      <option value="award" className="bg-[#0d0d1a]">
                        Award
                      </option>
                      <option value="other" className="bg-[#0d0d1a]">
                        Other
                      </option>
                    </select>
                    <ChevronDown
                      size={12}
                      className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#00ff9d] opacity-60"
                    />
                  </div>
                  <input
                    {...register(`achievements.${idx}.date`)}
                    placeholder="Year (e.g. 2024)"
                    className="w-28 bg-transparent border-b border-[rgba(0,255,157,0.2)] outline-none text-sm text-[rgba(200,255,232,0.6)] placeholder:text-[rgba(200,255,232,0.2)]"
                  />
                </div>

                <textarea
                  {...register(`achievements.${idx}.description`)}
                  placeholder="Brief description (optional, max 200 chars)"
                  maxLength={200}
                  rows={2}
                  className={`w-full bg-transparent border-b border-[rgba(0,255,157,0.1)] py-1 outline-none focus:border-[rgba(0,255,157,0.3)] text-sm text-[rgba(200,255,232,0.6)] placeholder:text-[rgba(200,255,232,0.2)] resize-none transition-colors ${errCls(!!errors.achievements?.[idx]?.description)}`}
                />
                <FieldError
                  msg={errors.achievements?.[idx]?.description?.message}
                />

                <input
                  {...register(`achievements.${idx}.link`)}
                  placeholder="Link (certificate URL, project, etc.)"
                  className={`w-full bg-transparent border-b border-[rgba(0,255,157,0.2)] outline-none text-sm text-[rgba(200,255,232,0.6)] placeholder:text-[rgba(200,255,232,0.2)] transition-colors ${errCls(!!errors.achievements?.[idx]?.link)}`}
                />
                <FieldError msg={errors.achievements?.[idx]?.link?.message} />
              </div>
              <button
                type="button"
                onClick={() => removeAch(idx)}
                className="text-[#ff4fd8] flex-shrink-0 mt-1"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
        {achFields.length === 0 && (
          <div className="text-xs opacity-30 italic uppercase tracking-wider text-center py-4">
            {"// hackathons, certifications, awards, contributions"}
          </div>
        )}
      </div>
    </div>
  );
}

export function ProjectsSection() {
  const { control, watch } = useFormContext<ProfileFormData>();
  const { fields: projFields, remove: removeProj } = useFieldArray({
    control,
    name: "projects",
  });
  const { setProjectModal } = useProfileEdit();
  const formData = watch();

  return (
    <div className="space-y-4 border-t border-[rgba(0,255,157,0.1)] pt-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Code size={22} className="text-[#00ff9d]" />
          <label className="text-sm uppercase tracking-widest text-[rgba(200,255,232,0.45)]">
            Projects
          </label>
        </div>
        <button
          type="button"
          onClick={() =>
            setProjectModal({
              open: true,
              editIdx: null,
              defaultValues: { type: "other", tags: [] },
            })
          }
          className="text-sm flex items-center gap-2 border border-[#00ff9d] px-2 py-1 hover:bg-[rgba(0,255,157,0.1)] transition-colors"
        >
          <Plus size={14} /> Add Project
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {projFields.map((field, idx) => {
          const proj = formData?.projects?.[idx];
          if (!proj) return null;
          const typeMeta =
            EDIT_PROJECT_TYPE_META[proj.type || "other"] ||
            EDIT_PROJECT_TYPE_META["other"];
          const { Icon: ProjIcon, iconColor, borderColor, bgColor } = typeMeta;
          const typeLabel =
            PROJECT_TYPES.find((t) => t.value === proj.type)?.label || "Other";

          return (
            <div
              key={field.id}
              onClick={() =>
                setProjectModal({
                  open: true,
                  editIdx: idx,
                  defaultValues: { ...proj },
                })
              }
              className="rounded p-3 cursor-pointer transition-all group relative hover:brightness-110"
              style={{
                background: bgColor,
                border: `1px solid ${borderColor}`,
              }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeProj(idx);
                }}
                className="absolute top-2 right-2 text-[#ff4fd8] opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
              <div className="flex items-center gap-2 mb-1.5">
                <div
                  className="flex-shrink-0 w-7 h-7 rounded-[3px] flex items-center justify-center"
                  style={{
                    background: bgColor,
                    border: `1px solid ${borderColor}`,
                  }}
                >
                  <ProjIcon size={12} style={{ color: iconColor }} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-[#00ff9d] uppercase truncate">
                    {proj.title || "Untitled Project"}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: iconColor, opacity: 0.55 }}
                  >
                    {typeLabel}
                  </div>
                </div>
              </div>
              {proj.short_description && (
                <p className="text-sm text-[rgba(200,255,232,0.5)] line-clamp-2">
                  {proj.short_description}
                </p>
              )}
              {proj.tags && proj.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {proj.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-sm opacity-40"
                      style={{ color: iconColor }}
                    >
                      #{tag}
                    </span>
                  ))}
                  {proj.tags.length > 3 && (
                    <span className="text-sm opacity-30 text-[rgba(200,255,232,0.4)]">
                      +{proj.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {projFields.length === 0 && (
          <div className="text-xs opacity-30 italic uppercase tracking-wider text-center py-4 col-span-2">
            {"// Add the projects that you're working on"}
          </div>
        )}
      </div>
    </div>
  );
}

export function TimelineSection() {
  const {
    register,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<ProfileFormData>();
  const {
    fields: tlFields,
    prepend: prependTl,
    remove: removeTl,
    swap: swapTl,
  } = useFieldArray({ control, name: "timeline" });
  const formData = watch();

  return (
    <div className="space-y-4 border-t border-[rgba(0,255,157,0.1)] pt-6">
      <div className="flex items-center gap-2">
        <span className="text-[#00ff9d] text-sm">&#x29E9;</span>
        <span className="uppercase text-sm">Timeline</span>
      </div>
      <div className="flex justify-between items-center">
        <label className="text-xs uppercase tracking-widest text-[rgba(200,255,232,0.45)]">
          IEEE Journey
        </label>
        <button
          type="button"
          onClick={() =>
            prependTl({
              year: "",
              position: "",
              chapter: "",
              description: "",
            })
          }
          className="text-sm flex items-center gap-2 border border-[#00ff9d] px-2 py-1 hover:bg-[rgba(0,255,157,0.1)] transition-colors"
        >
          <Plus size={14} /> Add Entry
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {tlFields.map((field, idx) => (
          <div
            key={field.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", String(idx));
              e.currentTarget.classList.add("opacity-40");
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add("border-[#00ff9d]", "border");
            }}
            onDragLeave={(e) => {
              e.currentTarget.classList.remove("border-[#00ff9d]", "border");
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove("border-[#00ff9d]", "border");
              const from = parseInt(e.dataTransfer.getData("text/plain"));
              if (!isNaN(from) && from !== idx) swapTl(from, idx);
            }}
            onDragEnd={(e) => {
              e.currentTarget.classList.remove(
                "opacity-40",
                "border-[#00ff9d]",
                "border",
              );
            }}
            className="bg-[rgba(0,255,157,0.02)] border border-[rgba(0,255,157,0.12)] rounded p-4 cursor-grab active:cursor-grabbing"
          >
            <div className="flex gap-2 items-start">
              <div className="flex items-center pt-2 text-[rgba(200,255,232,0.25)] hover:text-[#00ff9d] transition-colors flex-shrink-0">
                <GripVertical size={16} />
              </div>
              <div className="flex-1 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs text-[rgba(200,255,232,0.35)] mb-0.5">
                      Year
                    </label>
                    <div className="relative">
                      <select
                        {...register(`timeline.${idx}.year`)}
                        className={`w-full appearance-none bg-[rgba(0,255,157,0.05)] border border-[rgba(0,255,157,0.2)] rounded px-3 py-1.5 pr-8 text-xs outline-none focus:border-[#00ff9d] text-[#00ff9d] transition-colors cursor-pointer ${errCls(!!errors.timeline?.[idx]?.year)}`}
                      >
                        <option value="" className="bg-[#0d0d1a]">
                          Select Year
                        </option>
                        {(() => {
                          const currentYear = new Date().getFullYear();
                          const years = Array.from({ length: 16 }, (_, i) =>
                            String(currentYear - i),
                          );
                          const val = formData?.timeline?.[idx]?.year;
                          if (val && !years.includes(val)) {
                            years.push(val);
                          }
                          return years.map((y) => (
                            <option key={y} value={y} className="bg-[#0d0d1a]">
                              {y}
                            </option>
                          ));
                        })()}
                      </select>
                      <ChevronDown
                        size={12}
                        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[#00ff9d] opacity-60"
                      />
                    </div>
                    <FieldError msg={errors.timeline?.[idx]?.year?.message} />
                  </div>
                  <div>
                    <label className="block text-xs text-[rgba(200,255,232,0.35)] mb-0.5">
                      Position / Role
                    </label>
                    <Controller
                      control={control}
                      name={`timeline.${idx}.position`}
                      render={({ field }) => (
                        <DebouncedSelect
                          options={IEEE_POSITIONS.map((p) => ({
                            value: p.value,
                            label: p.name,
                          }))}
                          value={field.value || ""}
                          onChange={(val) => {
                            field.onChange(val);
                            setValue(`timeline.${idx}.position`, val, {
                              shouldDirty: true,
                            });
                            if (val === "volunteer") {
                              setValue(`timeline.${idx}.chapter`, "", {
                                shouldDirty: true,
                              });
                            }
                          }}
                          placeholder="Select position..."
                        />
                      )}
                    />
                  </div>
                  {formData?.timeline?.[idx]?.position !== "volunteer" && (
                    <div>
                      <label className="block text-xs text-[rgba(200,255,232,0.35)] mb-0.5">
                        Chapter
                      </label>
                      <Controller
                        control={control}
                        name={`timeline.${idx}.chapter`}
                        render={({ field }) => (
                          <DebouncedSelect
                            options={CHAPTER_OPTIONS}
                            value={field.value || ""}
                            onChange={(val) => {
                              field.onChange(val);
                              setValue(`timeline.${idx}.chapter`, val, {
                                shouldDirty: true,
                              });
                            }}
                            placeholder="Select chapter..."
                          />
                        )}
                      />
                    </div>
                  )}
                </div>
                <textarea
                  {...register(`timeline.${idx}.description`)}
                  placeholder="Optional description of your role and responsibilities..."
                  rows={2}
                  className="w-full bg-transparent border-b border-[rgba(0,255,157,0.1)] py-1 outline-none focus:border-[rgba(0,255,157,0.3)] text-sm text-[rgba(200,255,232,0.6)] placeholder:text-[rgba(200,255,232,0.2)] resize-none transition-colors"
                />
              </div>
              <button
                type="button"
                onClick={() => removeTl(idx)}
                className="text-[#ff4fd8] flex-shrink-0 mt-1"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ))}
        {tlFields.length === 0 && (
          <div className="text-xs opacity-30 italic uppercase tracking-wider text-center py-4">
            {"// Add your IEEE journey timeline entries"}
          </div>
        )}
      </div>
    </div>
  );
}

export function ConnectedAccountsSection() {
  const { watch } = useFormContext<ProfileFormData>();
  const formData = watch();
  const {
    setGitHubInput,
    setShowGitHubModal,
    setLeetCodeInput,
    setShowLeetCodeModal,
  } = useProfileEdit();

  return (
    <div className="border-t border-[rgba(0,255,157,0.1)] pt-6 space-y-4">
      <label className="text-xs uppercase tracking-widest text-[rgba(200,255,232,0.45)]">
        Connected Accounts
      </label>
      <div className="space-y-3">
        <div className="flex items-center justify-between bg-[rgba(0,255,157,0.02)] border border-[rgba(0,255,157,0.1)] p-3 rounded">
          <div className="flex items-center gap-3">
            <Github size={16} className="text-[rgba(200,255,232,0.4)]" />
            <div>
              <div className="text-xs uppercase tracking-wider text-[rgba(200,255,232,0.6)]">
                GitHub
              </div>
              {formData?.github_username ? (
                <div className="text-xs text-[#00ff9d] mt-0.5">
                  @{formData.github_username}
                </div>
              ) : (
                <div className="text-xs text-[rgba(200,255,232,0.25)] mt-0.5 italic">
                  Not connected
                </div>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setGitHubInput(formData?.github_username || "");
              setShowGitHubModal(true);
            }}
            className="text-xs border border-[#ff4fd8] text-[#ff4fd8] px-3 py-1 hover:bg-[rgba(255,79,216,0.1)] transition-colors uppercase tracking-wider"
          >
            {formData?.github_username ? "Edit" : "Connect"}
          </button>
        </div>
        <div className="flex items-center justify-between bg-[rgba(0,255,157,0.02)] border border-[rgba(0,255,157,0.1)] p-3 rounded">
          <div className="flex items-center gap-3">
            <Terminal size={16} className="text-[rgba(200,255,232,0.4)]" />
            <div>
              <div className="text-xs uppercase tracking-wider text-[rgba(200,255,232,0.6)]">
                LeetCode
              </div>
              {formData?.leetcode_username ? (
                <div className="text-xs text-[#ffb700] mt-0.5">
                  @{formData.leetcode_username}
                </div>
              ) : (
                <div className="text-xs text-[rgba(200,255,232,0.25)] mt-0.5 italic">
                  Not connected
                </div>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setLeetCodeInput(formData?.leetcode_username || "");
              setShowLeetCodeModal(true);
            }}
            className="text-xs border border-[#ff4fd8] text-[#ff4fd8] px-3 py-1 hover:bg-[rgba(255,79,216,0.1)] transition-colors uppercase tracking-wider"
          >
            {formData?.leetcode_username ? "Edit" : "Connect"}
          </button>
        </div>
      </div>
    </div>
  );
}

export function SecuritySection() {
  const { setShowPasswordModal, setShowEmailModal } = useProfileEdit();

  return (
    <div className="border-t border-[rgba(0,255,157,0.1)] pt-6 space-y-4">
      <div className="flex items-center gap-2">
        <Lock size={16} className="text-[#ff4fd8]" />
        <span className="uppercase text-sm">Security &amp; System Access</span>
      </div>
      <div className="text-xs max-w-2xl tracking-widest text-[rgba(200,255,232,0.45)]">
        update your profile credentials and security settings to secure your
        profile telemetry.
      </div>
      <div className="flex flex-col items-start justify-start gap-4">
        <button
          type="button"
          onClick={() => setShowEmailModal(true)}
          className="bg-[rgba(255,79,216,0.1)] border border-[#ff4fd8] text-[#ff4fd8] px-4 py-2 rounded uppercase tracking-widest hover:bg-[rgba(255,79,216,0.2)] transition-all font-bold text-xs"
        >
          Change Email
        </button>
        <button
          type="button"
          onClick={() => setShowPasswordModal(true)}
          className="bg-[rgba(255,79,216,0.1)] border border-[#ff4fd8] text-[#ff4fd8] px-4 py-2 rounded uppercase tracking-widest hover:bg-[rgba(255,79,216,0.2)] transition-all font-bold text-xs"
        >
          Change Password
        </button>
      </div>
    </div>
  );
}
