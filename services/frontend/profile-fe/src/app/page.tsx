"use client";

import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { ScanlineOverlay, HeaderBar } from "@/components/layout/Common";
import { Sidebar } from "@/components/layout/Sidebar";
import { ProfileView } from "@/components/views/ProfileView";
import {
  profileSchema,
  projectSchema,
  type ProfileFormData,
} from "@/lib/schema";
import { DebouncedSelect } from "@/components/ui/DebouncedSelect";
import { DEPARTMENTS } from "@/lib/departments";
import { Modal } from "@/components/ui";
import { useToast } from "@/components/ui/use-toast";
import {
  Chapters as CatalogChapters,
  IEEE_POSITIONS,
} from "@astranova/catalogues";
import {
  ChevronDown,
  GripVertical,
  Lock,
  Pen,
  X,
  Globe,
  Brain,
  Terminal,
  ShieldAlert,
  FileText,
  Cpu,
  Smartphone,
  Gamepad2,
  Wrench,
  Lightbulb,
  Github,
  UploadCloud,
  Eye,
  EyeOff,
  type LucideIcon,
  Plus,
  Pin,
  Medal,
  Code,
  EyeIcon,
  PencilIcon,
  LogOut,
  Loader2,
} from "lucide-react";
import { z } from "zod";

// ─── Project type metadata ───────────────────────────────────────────────────
const EDIT_PROJECT_TYPE_META: Record<
  string,
  { Icon: LucideIcon; iconColor: string; borderColor: string; bgColor: string }
> = {
  website: {
    Icon: Globe,
    iconColor: "#00cfff",
    borderColor: "rgba(0,207,255,0.3)",
    bgColor: "rgba(0,207,255,0.06)",
  },
  aiml: {
    Icon: Brain,
    iconColor: "#ff4fd8",
    borderColor: "rgba(255,79,216,0.3)",
    bgColor: "rgba(255,79,216,0.06)",
  },
  cli: {
    Icon: Terminal,
    iconColor: "#00ff9d",
    borderColor: "rgba(0,255,157,0.25)",
    bgColor: "rgba(0,255,157,0.05)",
  },
  cybersecurity: {
    Icon: ShieldAlert,
    iconColor: "#ffb700",
    borderColor: "rgba(255,183,0,0.3)",
    bgColor: "rgba(255,183,0,0.06)",
  },
  research: {
    Icon: FileText,
    iconColor: "rgba(200,255,232,0.6)",
    borderColor: "rgba(200,255,232,0.15)",
    bgColor: "rgba(200,255,232,0.04)",
  },
  embedded: {
    Icon: Cpu,
    iconColor: "#ff4fd8",
    borderColor: "rgba(255,79,216,0.25)",
    bgColor: "rgba(255,79,216,0.05)",
  },
  mobile: {
    Icon: Smartphone,
    iconColor: "#00cfff",
    borderColor: "rgba(0,207,255,0.25)",
    bgColor: "rgba(0,207,255,0.05)",
  },
  game: {
    Icon: Gamepad2,
    iconColor: "#ffb700",
    borderColor: "rgba(255,183,0,0.25)",
    bgColor: "rgba(255,183,0,0.05)",
  },
  devtool: {
    Icon: Wrench,
    iconColor: "#00ff9d",
    borderColor: "rgba(0,255,157,0.22)",
    bgColor: "rgba(0,255,157,0.05)",
  },
  other: {
    Icon: Lightbulb,
    iconColor: "rgba(200,255,232,0.5)",
    borderColor: "rgba(200,255,232,0.12)",
    bgColor: "rgba(200,255,232,0.03)",
  },
};

const PROJECT_TYPES = [
  { value: "website", label: "Website / Web App" },
  { value: "aiml", label: "AI / ML Project" },
  { value: "cli", label: "CLI / Tooling" },
  { value: "cybersecurity", label: "Cybersecurity" },
  { value: "research", label: "Research Paper" },
  { value: "embedded", label: "Embedded / Hardware" },
  { value: "mobile", label: "Mobile App" },
  { value: "game", label: "Game" },
  { value: "devtool", label: "Dev Tool / Library" },
  { value: "other", label: "Other" },
] as const;

const PROJECT_TAGS = [
  "web",
  "ai",
  "ml",
  "cli",
  "security",
  "hardware",
  "embedded",
  "mobile",
  "game",
  "research",
  "open-source",
  "backend",
  "frontend",
  "fullstack",
  "api",
  "database",
  "devops",
  "cloud",
  "python",
  "typescript",
  "rust",
  "go",
  "c++",
  "react",
  "next.js",
  "node.js",
  "competition",
  "ieee",
  "hackathon",
  "robotics",
  "iot",
  "blockchain",
  "networking",
];

const AVAILABLE_SKILLS = [
  "Arduino",
  "Raspberry Pi",
  "ESP32",
  "Verilog",
  "VHDL",
  "Embedded C",
  "FPGA",
  "ARM Cortex",
  "PCB Design",
  "RTOS",
  "I2C/SPI/UART",
  "Firmware Development",
  "Microcontrollers",
  "C",
  "C++",
  "C#",
  "Java",
  "Python",
  "JavaScript",
  "TypeScript",
  "Rust",
  "Go",
  "Kotlin",
  "Swift",
  "SQL",
  "Bash",
  "PHP",
  "HTML5/CSS3",
  "React",
  "Next.js",
  "Vue.js",
  "TailwindCSS",
  "Svelte",
  "Angular",
  "Flutter",
  "React Native",
  "Three.js",
  "Node.js",
  "Express",
  "FastAPI",
  "Django",
  "Spring Boot",
  "GraphQL",
  "PostgreSQL",
  "MongoDB",
  "MySQL",
  "SQLite",
  "Redis",
  "Elasticsearch",
  "Linux/Unix",
  "Git",
  "Docker",
  "Kubernetes",
  "AWS",
  "Google Cloud (GCP)",
  "Azure",
  "CI/CD (GitHub Actions)",
  "Terraform",
  "Nginx",
  "PyTorch",
  "TensorFlow",
  "OpenCV",
  "ROS (Robot Operating System)",
  "Numpy",
  "Pandas",
  "Scikit-Learn",
  "Machine Learning",
  "Deep Learning",
  "Computer Vision",
  "NLP",
  "Penetration Testing",
  "Cryptography",
  "Network Security",
  "Reverse Engineering",
  "Linux Kernel",
  "Web Security",
];

const CHAPTER_OPTIONS: { value: string; label: string }[] = [
  ...CatalogChapters.map((c) => ({ value: c.acronym, label: c.name })),
  { value: "SB", label: "Student Branch" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function safeParseArray(val: any): any[] {
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return [];
    }
  }
  return Array.isArray(val) ? val : [];
}

function safeNormalizeProfile(data: any): ProfileFormData {
  return {
    ...data,
    skills: safeParseArray(data.skills),
    social_links: safeParseArray(data.social_links),
    achievements: safeParseArray(data.achievements),
    projects: safeParseArray(data.projects),
    timeline: safeParseArray(data.timeline),
    stats: data.stats && typeof data.stats === "object" ? data.stats : {},
  } as ProfileFormData;
}

function areProfilesEqual(
  a: Partial<ProfileFormData>,
  b: Partial<ProfileFormData>,
): boolean {
  const s = (v: any) => (v === null || v === undefined ? "" : String(v).trim());
  if (s(a.name) !== s(b.name)) return false;
  if (s(a.image) !== s(b.image)) return false;
  if (s(a.current_status) !== s(b.current_status)) return false;
  if (s(a.bio) !== s(b.bio)) return false;

  const linksA = (a.social_links || []).filter((l: any) => s(l?.link) !== "");
  const linksB = (b.social_links || []).filter((l: any) => s(l?.link) !== "");
  if (linksA.length !== linksB.length) return false;
  for (let i = 0; i < linksA.length; i++) {
    if (s(linksA[i]?.label) !== s(linksB[i]?.label)) return false;
    if (s(linksA[i]?.link) !== s(linksB[i]?.link)) return false;
  }

  const achA = (a.achievements || []).filter((h: any) => s(h?.title) !== "");
  const achB = (b.achievements || []).filter((h: any) => s(h?.title) !== "");
  if (achA.length !== achB.length) return false;
  for (let i = 0; i < achA.length; i++) {
    if (s(achA[i]?.title) !== s(achB[i]?.title)) return false;
    if (s(achA[i]?.badge_type) !== s(achB[i]?.badge_type)) return false;
    if (s(achA[i]?.date) !== s(achB[i]?.date)) return false;
    if (s(achA[i]?.description) !== s(achB[i]?.description)) return false;
    if (s(achA[i]?.link) !== s(achB[i]?.link)) return false;
  }

  const projA = (a.projects || []).filter((p: any) => s(p?.title) !== "");
  const projB = (b.projects || []).filter((p: any) => s(p?.title) !== "");
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
    (t: any) =>
      s(t?.year) !== "" && s(t?.position) !== "" && s(t?.chapter) !== "",
  );
  const tlB = (b.timeline || []).filter(
    (t: any) =>
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

// ─── Field error helper ───────────────────────────────────────────────────────
function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-xs text-[#ff4fd8] mt-1 tracking-wide">{msg}</p>;
}

const errCls = (hasErr: boolean) =>
  hasErr ? "border-[#ff4fd8] shadow-[0_0_0_1px_rgba(255,79,216,0.35)]" : "";

const countWords = (value: string | undefined | null) =>
  (value || "").trim().split(/\s+/).filter(Boolean).length;

// Stricter schema for the modal, keeping validation centralized in Zod.
const projectModalSchema = projectSchema
  .extend({
    title: z.string().trim().min(1, "Title is required"),
    primary_link: z
      .string()
      .trim()
      .min(1, "Primary link is required")
      .url("Must be a valid URL"),
  })
  .superRefine((data, ctx) => {
    if (countWords(data.short_description) > 50) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Maximum 50 words allowed",
        path: ["short_description"],
      });
    }
    if (countWords(data.long_description) > 200) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Maximum 200 words allowed",
        path: ["long_description"],
      });
    }
  });

// ─── Project Modal Form ───────────────────────────────────────────────────────
type ProjectFormValues = z.infer<typeof projectModalSchema>;

interface ProjectModalProps {
  open: boolean;
  editIdx: number | null;
  defaultValues: Partial<ProjectFormValues>;
  onSave: (data: ProjectFormValues, editIdx: number | null) => void;
  onDelete: (idx: number) => void;
  onRequestClose: () => void;
}

function ProjectModal({
  open,
  editIdx,
  defaultValues,
  onSave,
  onDelete,
  onRequestClose,
}: ProjectModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectModalSchema as any),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: { type: "other", tags: [], ...defaultValues },
  });

  // Disable body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Reset form when modal opens with new data
  useEffect(() => {
    if (open) reset({ type: "other", tags: [], ...defaultValues });
  }, [open, JSON.stringify(defaultValues)]);

  const selectedType = watch("type") || "other";
  const selectedTags = watch("tags") || [];
  const shortDesc = watch("short_description") || "";
  const longDesc = watch("long_description") || "";

  const onSubmit = (data: ProjectFormValues) => {
    onSave(data, editIdx);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center p-4 overflow-y-auto">
      <div
        className="absolute inset-0 bg-[#0d0d1a]/90 backdrop-blur-md"
        onClick={onRequestClose}
      />
      <div className="relative w-full max-w-2xl bg-[#0d0d1a] border border-[#ff4fd8] rounded-[4px] shadow-[0_0_50px_rgba(255,79,216,0.15)] overflow-hidden my-8 animate-in zoom-in-95 duration-200">
        <div className="pointer-events-none absolute inset-0 z-0 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.03)_2px,rgba(0,0,0,0.03)_4px)]" />
        <div className="flex justify-between items-center px-5 py-3 border-b border-[rgba(255,79,216,0.25)] bg-[rgba(255,79,216,0.05)] relative z-10">
          <h3 className="font-vt text-xl text-[#ff4fd8] uppercase tracking-widest">
            {editIdx !== null ? "Edit Project" : "New Project"}
          </h3>
          <button
            type="button"
            onClick={onRequestClose}
            className="text-[#ff4fd8] hover:text-[#ffb700] transition-colors font-bold uppercase text-xs"
          >
            Close [X]
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 relative z-10 space-y-4 max-h-[80vh] overflow-y-auto"
        >
          {/* Project Type */}
          <div>
            <label className="block text-xs uppercase text-[rgba(200,255,232,0.45)] mb-2">
              Project Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PROJECT_TYPES.map((t) => {
                const meta = EDIT_PROJECT_TYPE_META[t.value];
                const isSelected = selectedType === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() =>
                      setValue("type", t.value as any, { shouldValidate: true })
                    }
                    className={`flex items-center gap-2 px-3 py-2 rounded border text-xs transition-all ${
                      isSelected
                        ? "border-[#ff4fd8] bg-[rgba(255,79,216,0.1)] text-[#ff4fd8]"
                        : "border-[rgba(255,79,216,0.2)] text-[rgba(200,255,232,0.4)] hover:border-[rgba(255,79,216,0.4)]"
                    }`}
                  >
                    <meta.Icon
                      size={12}
                      style={{ color: isSelected ? "#ff4fd8" : meta.iconColor }}
                    />
                    <span className="truncate">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs uppercase text-[rgba(200,255,232,0.45)] mb-1">
              Title <span className="text-[#ff4fd8]">*</span>
            </label>
            <input
              {...register("title")}
              placeholder="e.g. NeuroGrid — Real-time EEG Classifier"
              className={`w-full bg-[rgba(255,79,216,0.03)] border border-[rgba(255,79,216,0.2)] rounded px-3 py-2 outline-none focus:border-[#ff4fd8] text-sm text-[#c8ffe8] placeholder:text-[rgba(200,255,232,0.2)] transition-colors ${errCls(!!errors.title)}`}
            />
            <FieldError msg={errors.title?.message} />
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-xs uppercase text-[rgba(200,255,232,0.45)] mb-1">
              Short Description{" "}
              <span className="text-[rgba(200,255,232,0.3)] lowercase normal-case">
                · max 50 words · shown on card
              </span>
            </label>
            <textarea
              {...register("short_description")}
              placeholder="A one-liner describing what this project does..."
              rows={2}
              className={`w-full bg-[rgba(255,79,216,0.03)] border border-[rgba(255,79,216,0.2)] rounded px-3 py-2 outline-none focus:border-[#ff4fd8] text-sm text-[rgba(200,255,232,0.7)] placeholder:text-[rgba(200,255,232,0.2)] resize-none transition-colors ${errCls(!!errors.short_description)}`}
            />
            <div className="flex justify-between mt-0.5">
              <FieldError msg={errors.short_description?.message} />
              <span className="text-xs text-[rgba(200,255,232,0.3)] ml-auto">
                {shortDesc.trim().split(/\s+/).filter(Boolean).length} / 50
                words
              </span>
            </div>
          </div>

          {/* Long Description */}
          <div>
            <label className="block text-xs uppercase text-[rgba(200,255,232,0.45)] mb-1">
              Long Description{" "}
              <span className="text-[rgba(200,255,232,0.3)] lowercase normal-case">
                · max 200 words · shown in detail view
              </span>
            </label>
            <textarea
              {...register("long_description")}
              placeholder="Describe the problem, your approach, tech stack, and impact..."
              rows={5}
              className={`w-full bg-[rgba(255,79,216,0.03)] border border-[rgba(255,79,216,0.2)] rounded px-3 py-2 outline-none focus:border-[#ff4fd8] text-sm text-[rgba(200,255,232,0.7)] placeholder:text-[rgba(200,255,232,0.2)] resize-none transition-colors ${errCls(!!errors.long_description)}`}
            />
            <div className="flex justify-between mt-0.5">
              <FieldError msg={errors.long_description?.message} />
              <span className="text-xs text-[rgba(200,255,232,0.3)] ml-auto">
                {longDesc.trim().split(/\s+/).filter(Boolean).length} / 200
                words
              </span>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase text-[rgba(200,255,232,0.45)] mb-1">
                Primary Link <span className="text-[#ff4fd8]">*</span>{" "}
                <span className="text-[rgba(200,255,232,0.3)] lowercase normal-case">
                  · github / demo / paper
                </span>
              </label>
              <input
                {...register("primary_link")}
                placeholder="https://github.com/..."
                className={`w-full bg-[rgba(255,79,216,0.03)] border border-[rgba(255,79,216,0.2)] rounded px-3 py-2 outline-none focus:border-[#ff4fd8] text-xs text-[rgba(200,255,232,0.7)] placeholder:text-[rgba(200,255,232,0.2)] transition-colors ${errCls(!!errors.primary_link)}`}
              />
              <FieldError msg={errors.primary_link?.message} />
            </div>
            <div>
              <label className="block text-xs uppercase text-[rgba(200,255,232,0.45)] mb-1">
                Extra Link{" "}
                <span className="text-[rgba(200,255,232,0.3)] lowercase normal-case">
                  · optional · demo / paper / video
                </span>
              </label>
              <input
                {...register("extra_link")}
                placeholder="https://..."
                className={`w-full bg-[rgba(255,79,216,0.03)] border border-[rgba(255,79,216,0.2)] rounded px-3 py-2 outline-none focus:border-[#ff4fd8] text-xs text-[rgba(200,255,232,0.7)] placeholder:text-[rgba(200,255,232,0.2)] transition-colors ${errCls(!!errors.extra_link)}`}
              />
              <FieldError msg={errors.extra_link?.message} />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs uppercase text-[rgba(200,255,232,0.45)] mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {PROJECT_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      const next = isSelected
                        ? selectedTags.filter((t: string) => t !== tag)
                        : [...selectedTags, tag];
                      setValue("tags", next, { shouldValidate: true });
                    }}
                    className={`text-xs px-2 py-0.5 rounded-[2px] border transition-all ${
                      isSelected
                        ? "border-[#ff4fd8] bg-[rgba(255,79,216,0.12)] text-[#ff4fd8]"
                        : "border-[rgba(200,255,232,0.15)] text-[rgba(200,255,232,0.4)] hover:border-[rgba(255,79,216,0.3)]"
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-[rgba(255,79,216,0.15)]">
            <button
              type="submit"
              className="flex-1 bg-[#ff4fd8] text-[#0d0d1a] py-2.5 font-bold uppercase tracking-[0.15em] text-sm hover:opacity-90 transition-opacity rounded"
            >
              {editIdx !== null ? "Save Changes" : "Add Project"}
            </button>
            {editIdx !== null && (
              <button
                type="button"
                onClick={() => {
                  onDelete(editIdx);
                  onRequestClose();
                }}
                className="px-4 border border-[rgba(255,79,216,0.4)] text-[#ff4fd8] text-xs uppercase hover:bg-[rgba(255,79,216,0.1)] transition-colors rounded"
              >
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ProfilePage() {
  const [isEditMode, setIsEditMode] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  const [session, setSession] = useState<any>(null);
  const [fullProfile, setFullProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [stagedImageFile, setStagedImageFile] = useState<File | null>(null);
  const [stagedImagePreview, setStagedImagePreview] = useState<string | null>(
    null,
  );
  const [originalData, setOriginalData] = useState<Partial<ProfileFormData>>(
    {},
  );
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Security and Password change states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // GitHub / LeetCode linking state
  const [showGitHubModal, setShowGitHubModal] = useState(false);
  const [showLeetCodeModal, setShowLeetCodeModal] = useState(false);
  const [gitHubInput, setGitHubInput] = useState("");
  const [leetCodeInput, setLeetCodeInput] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      toast({
        title: "Validation Error",
        description: "All password fields are required.",
        variant: "destructive",
      });
      return;
    }
    if (newPassword.length < 8) {
      toast({
        title: "Security Warning",
        description: "New password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      toast({
        title: "Validation Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setIsChangingPassword(true);
    try {
      const { error } = await authClient.changePassword({
        newPassword: newPassword,
        currentPassword: currentPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        toast({
          title: "Update Denied",
          description: error.message || "Failed to update security key.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registry Updated",
          description: "System password updated and other sessions revoked.",
          variant: "success",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setShowPasswordModal(false);
      }
    } catch (err) {
      console.error("Change password error:", err);
      toast({
        title: "Connection Failure",
        description: "Security telemetry update timed out.",
        variant: "destructive",
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authClient.signOut();
      router.push("/auth/sign-in");
    } catch (e) {
      console.error("Logout failed", e);
      toast({
        title: "Logout Failed",
        description: "Failed to securely terminate host session.",
        variant: "destructive",
      });
      setIsLoggingOut(false);
    }
  };

  // Project modal state — just tracks open/editIdx; data flows via reset()
  const [projectModal, setProjectModal] = useState<{
    open: boolean;
    editIdx: number | null;
    defaultValues: Partial<z.infer<typeof projectSchema>>;
  }>({ open: false, editIdx: null, defaultValues: {} });

  // ─── Main form ────────────────────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema as any),
    defaultValues: {
      name: "",
      image: "",
      current_status: "",
      bio: "",
      skills: [],
      social_links: [],
      stats: {},
      achievements: [],
      projects: [],
      timeline: [],
    },
  });

  const {
    fields: linkFields,
    append: appendLink,
    remove: removeLink,
    swap: swapLinks,
  } = useFieldArray({ control, name: "social_links" });
  const {
    fields: achFields,
    append: appendAch,
    remove: removeAch,
    swap: swapAch,
  } = useFieldArray({ control, name: "achievements" });
  const {
    fields: projFields,
    append: appendProj,
    remove: removeProj,
    update: updateProj,
  } = useFieldArray({ control, name: "projects" });
  const {
    fields: tlFields,
    prepend: prependTl,
    remove: removeTl,
    swap: swapTl,
  } = useFieldArray({ control, name: "timeline" });

  const formData = watch();
  const hasChanges = isDirty || !areProfilesEqual(formData, originalData);

  useEffect(() => {
    return () => {
      if (stagedImagePreview) {
        URL.revokeObjectURL(stagedImagePreview);
      }
    };
  }, [stagedImagePreview]);

  const clearStagedImage = () => {
    setStagedImageFile(null);
    setStagedImagePreview(null);
  };

  // ─── Session & data fetch ─────────────────────────────────────────────────
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await authClient.getSession();
      if (!data) {
        router.push("/auth/sign-in");
        return;
      }
      setSession(data);
      try {
        const response = await fetch(`/api/profile?email=${data.user.email}`);
        const profile = response.ok
          ? await response.json()
          : {
              name: data.user.name,
              email: data.user.email,
              username: (data.user as any).username,
              chapters: [],
              social_links: [],
              stats: {},
              achievements: [],
              projects: [],
            };
        setFullProfile(profile);
        const normalized = safeNormalizeProfile(profile);
        reset(normalized);
        setOriginalData(normalized);
      } catch (e) {
        console.error("Failed to fetch profile", e);
      }
      setLoading(false);
    };
    fetchSession();
  }, [router]);

  // ─── Image staging ────────────────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (stagedImagePreview) {
      URL.revokeObjectURL(stagedImagePreview);
    }
    const previewUrl = URL.createObjectURL(file);
    setStagedImageFile(file);
    setStagedImagePreview(previewUrl);
    setValue("image", previewUrl, { shouldDirty: true, shouldValidate: true });
    setIsModalOpen(false);
  };

  // ─── Save ─────────────────────────────────────────────────────────────────
  const saveProfile = handleSubmit(
    async (data) => {
      const cleanedLinks = (data.social_links || []).filter(
        (sl: NonNullable<ProfileFormData["social_links"]>[number]) =>
          !!sl.link && sl.link.trim() !== "",
      );
      const dataToSave = { ...data, social_links: cleanedLinks };
      setIsUpdating(true);
      try {
        if (stagedImageFile) {
          setIsUploading(true);
          const fd = new FormData();
          fd.append("file", stagedImageFile);
          const uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: fd,
          });
          if (!uploadResponse.ok) {
            const err = await uploadResponse.json();
            toast({
              title: "Upload Failed",
              description: err.message || "Visual identifier update rejected.",
              variant: "destructive",
            });
            return;
          }

          const uploaded = await uploadResponse.json();
          dataToSave.image = uploaded.url;
        }

        const response = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSave),
        });
        if (response.ok) {
          const refresh = await fetch(
            `/api/profile?email=${session.user.email}`,
          );
          if (refresh.ok) {
            const updated = await refresh.json();
            const normalized = safeNormalizeProfile(updated);
            reset(normalized);
            setOriginalData(normalized);
            clearStagedImage();
            toast({
              title: "System Synced",
              description: "Telemetry profiles updated successfully.",
              variant: "success",
            });
          }
        } else {
          const err = await response.json();
          toast({
            title: "Update Denied",
            description: err.message || "Database synchronization failed.",
            variant: "destructive",
          });
        }
      } catch {
        toast({
          title: "Connection Failure",
          description: "Network error. Database sync interrupted.",
          variant: "destructive",
        });
      } finally {
        setIsUpdating(false);
        setIsUploading(false);
      }
    },
    (fieldErrors) => {
      // Show toasts for validation errors
      const seen = new Set<string>();
      const flatten = (obj: any, prefix = ""): void => {
        for (const key of Object.keys(obj)) {
          const val = obj[key];
          const path = prefix ? `${prefix} → ${key}` : key;
          if (val?.message && typeof val.message === "string") {
            const k = `${path}:${val.message}`;
            if (!seen.has(k)) {
              seen.add(k);
              toast({
                title: `Error: ${path}`,
                description: val.message,
                variant: "destructive",
              });
            }
          } else if (typeof val === "object" && val !== null) {
            flatten(val, path);
          }
        }
      };
      flatten(fieldErrors);
    },
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d1a] text-[#00ff9d] flex items-center justify-center font-mono">
        <ScanlineOverlay />
        <div className="animate-pulse tracking-[0.2em]">
          SYNCHRONIZING WITH HOST...
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#0d0d1a] text-[#c8ffe8] font-['Share_Tech_Mono',_monospace] relative overflow-x-hidden">
      <ScanlineOverlay />
      <HeaderBar />

      <div className="border-b border-[rgba(0,255,157,0.25)] bg-[rgba(0,255,157,0.02)] px-6 py-2 flex justify-between items-center relative z-20">
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`text-sm flex gap-2 items-center px-3 py-1 border transition-all uppercase tracking-widest ${
              isEditMode
                ? "bg-[#00ff9d] text-[#0d0d1a] border-[#00ff9d]"
                : "border-[rgba(0,255,157,0.4)] text-[#00ff9d] hover:bg-[rgba(0,255,157,0.1)]"
            }`}
          >
            {isEditMode ? (
              <>
                <EyeIcon size={14} /> View Profile
              </>
            ) : (
              <>
                <PencilIcon size={14} /> Edit Profile
              </>
            )}
          </button>
        </div>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`text-sm text-[#ff4fd8] flex gap-2 items-center border border-[#ff4fd8] px-3 py-1 hover:bg-[rgba(255,79,216,0.1)] transition-all uppercase tracking-widest ${
            isLoggingOut ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoggingOut ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <LogOut size={12} />
          )}
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>

      <div className="flex flex-col md:flex-row min-h-[calc(100vh-80px)]">
        <Sidebar
          user={
            {
              ...fullProfile,
              name: formData.name || fullProfile?.name,
              image: formData.image || fullProfile?.image,
              social_links: formData.social_links || fullProfile?.social_links,
              department: formData.department || fullProfile?.department,
            } as any
          }
          isEditMode={isEditMode}
          openModal={() => setIsModalOpen(true)}
        />

        <main className="flex-1 p-6 flex flex-col gap-6 max-w-5xl relative z-10 pb-24">
          {isEditMode ? (
            <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
              {/* Sticky desktop update bar */}
              <div className="hidden md:flex sticky top-0 z-30 bg-[#0d0d1a]/95 backdrop-blur-sm justify-end items-center border-b border-[rgba(0,255,157,0.25)] py-4 mb-4">
                <button
                  onClick={saveProfile}
                  disabled={isUpdating || !hasChanges}
                  className={`bg-[#00ff9d] text-[#0d0d1a] px-8 py-2 font-bold uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(0,255,157,0.3)] hover:scale-105 transition-all ${
                    isUpdating || !hasChanges
                      ? "opacity-50 cursor-not-allowed shadow-none scale-100 hover:scale-100"
                      : ""
                  }`}
                >
                  {isUpdating
                    ? "Synchronizing..."
                    : !hasChanges
                      ? "No changes"
                      : "Update Data"}
                </button>
              </div>

              {/* ── Basic Info ─────────────────────────────────────────────── */}
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
                </div>
                <div>
                  <label className="block text-xs uppercase flex gap-2 text-[rgba(200,255,232,0.45)] mb-1">
                    Bio <Pen size={12} />
                  </label>
                  <textarea
                    {...register("bio")}
                    rows={4}
                    className={`w-full bg-[rgba(0,255,157,0.05)] border border-[rgba(0,255,157,0.2)] rounded px-3 py-2 outline-none focus:border-[#00ff9d] transition-colors resize-none ${errCls(!!errors.bio)}`}
                  />
                  <FieldError msg={errors.bio?.message} />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase flex gap-2 text-[rgba(200,255,232,0.45)] mb-1">
                  Department <Pen size={12} />
                </label>
                <DebouncedSelect
                  options={DEPARTMENTS}
                  value={formData.department || ""}
                  onChange={(val) =>
                    setValue("department", val, { shouldDirty: true })
                  }
                  placeholder="Select department..."
                />
              </div>

              {/* ── System Information (readonly) ───────────────────────────── */}
              <div className="border-t border-[rgba(0,255,157,0.1)] pt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Lock size={16} className="text-[#00ff9d]" />
                  <span className="uppercase text-sm">System Information</span>
                </div>
                <div className="text-xs max-w-2xl tracking-widest text-[rgba(200,255,232,0.45)]">
                  these records are stored on the host system and are not
                  publicly available. contact admins for changes.
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    ["Email", fullProfile?.email],
                    ["USN", fullProfile?.usn || formData.usn],
                    [
                      "Phone Number",
                      fullProfile?.phoneNumber || formData.phoneNumber,
                    ],
                    ["Batch Of", fullProfile?.batch_of || fullProfile?.batch],
                    ["Year of Study", fullProfile?.year || formData.year],
                    ["IEEE Membership ID", fullProfile?.membershipId],
                  ].map(([label, value]) => (
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

              {/* ── Tech Stack & Skills ─────────────────────────────────────── */}
              <div className="space-y-4 border-t border-[rgba(0,255,157,0.1)] pt-6">
                <Terminal size={22} className="text-[#00ff9d]" />
                <label className="text-sm uppercase flex gap-2">
                  Tech Stack &amp; Skills
                </label>
                <DebouncedSelect
                  options={AVAILABLE_SKILLS.filter(
                    (s) => !(formData.skills || []).includes(s),
                  ).map((s) => ({ value: s, label: s }))}
                  value=""
                  onChange={(val) => {
                    const current = formData.skills || [];
                    if (val && !current.includes(val)) {
                      setValue("skills", [...current, val], {
                        shouldDirty: true,
                      });
                    }
                  }}
                  placeholder="Search hardware / software skills..."
                />

                <div className="flex flex-wrap gap-2 pt-3 bg-[rgba(0,255,157,0.01)] border border-dashed border-[rgba(0,255,157,0.15)] p-4 rounded min-h-[60px] items-center">
                  {(formData.skills || []).length > 0 ? (
                    (formData.skills || []).map((skill) => (
                      <span
                        key={skill}
                        onClick={() =>
                          setValue(
                            "skills",
                            (formData.skills || []).filter((s) => s !== skill),
                            { shouldDirty: true },
                          )
                        }
                        className="flex items-center gap-1.5 p-1 px-2.5 rounded-[2px] text-xs tracking-[0.05em] border border-[rgba(0,207,255,0.35)] text-[#00cfff] bg-[rgba(0,207,255,0.06)] hover:border-[#ff4fd8] hover:text-[#ff4fd8] hover:bg-[rgba(255,79,216,0.05)] transition-all cursor-pointer group"
                      >
                        {skill}{" "}
                        <X
                          size={10}
                          className="opacity-60 group-hover:opacity-100"
                        />
                      </span>
                    ))
                  ) : (
                    <span className="text-xs opacity-40 italic uppercase tracking-wider">
                      // select skills from the dropdown above
                    </span>
                  )}
                </div>
              </div>

              {/* ── Social Links ────────────────────────────────────────────── */}
              <div className="space-y-4 border-t border-[rgba(0,255,157,0.1)] pt-6">
                <Pin size={22} className="text-[#00ff9d]" />
                <div className="flex justify-between items-center">
                  <label className="text-sm uppercase tracking-widest">
                    Links
                  </label>
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
                        e.currentTarget.classList.add(
                          "border-[#00ff9d]",
                          "border",
                        );
                      }}
                      onDragLeave={(e) => {
                        e.currentTarget.classList.remove(
                          "border-[#00ff9d]",
                          "border",
                        );
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove(
                          "border-[#00ff9d]",
                          "border",
                        );
                        const from = parseInt(
                          e.dataTransfer.getData("text/plain"),
                        );
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
                        <FieldError
                          msg={errors.social_links?.[idx]?.link?.message}
                        />
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

              {/* ── Achievements ────────────────────────────────────────────── */}
              <div className="space-y-4 border-t border-[rgba(0,255,157,0.1)] pt-6">
                <Medal size={22} className="text-[#00ff9d]" />
                <div className="flex justify-between items-center">
                  <label className="text-sm uppercase tracking-widest">
                    Honors &amp; Achievements
                  </label>
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
                        e.currentTarget.classList.add(
                          "border-[#00ff9d]",
                          "border",
                        );
                      }}
                      onDragLeave={(e) => {
                        e.currentTarget.classList.remove(
                          "border-[#00ff9d]",
                          "border",
                        );
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove(
                          "border-[#00ff9d]",
                          "border",
                        );
                        const from = parseInt(
                          e.dataTransfer.getData("text/plain"),
                        );
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
                          <FieldError
                            msg={
                              (errors.achievements?.[idx]?.title as any)
                                ?.message
                            }
                          />

                          <div className="flex gap-2 flex-wrap items-center">
                            <div className="relative">
                              <select
                                {...register(`achievements.${idx}.badge_type`)}
                                className="appearance-none bg-[rgba(0,255,157,0.05)] border border-[rgba(0,255,157,0.2)] rounded px-3 py-1.5 pr-8 text-xs outline-none focus:border-[#00ff9d] text-[rgba(200,255,232,0.6)] cursor-pointer"
                              >
                                <option
                                  value="hackathon"
                                  className="bg-[#0d0d1a]"
                                >
                                  Hackathon
                                </option>
                                <option
                                  value="internship"
                                  className="bg-[#0d0d1a]"
                                >
                                  Internship
                                </option>
                                <option
                                  value="open_source"
                                  className="bg-[#0d0d1a]"
                                >
                                  Open Source
                                </option>
                                <option
                                  value="certification"
                                  className="bg-[#0d0d1a]"
                                >
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
                            msg={
                              (errors.achievements?.[idx]?.description as any)
                                ?.message
                            }
                          />

                          <input
                            {...register(`achievements.${idx}.link`)}
                            placeholder="Link (certificate URL, project, etc.)"
                            className={`w-full bg-transparent border-b border-[rgba(0,255,157,0.2)] outline-none text-sm text-[rgba(200,255,232,0.6)] placeholder:text-[rgba(200,255,232,0.2)] transition-colors ${errCls(!!errors.achievements?.[idx]?.link)}`}
                          />
                          <FieldError
                            msg={
                              (errors.achievements?.[idx]?.link as any)?.message
                            }
                          />
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
                      // hackathons, certifications, awards, contributions
                    </div>
                  )}
                </div>
              </div>

              {/* ── Projects ────────────────────────────────────────────────── */}
              <div className="space-y-4 border-t border-[rgba(0,255,157,0.1)] pt-6">
                <Code size={22} className="text-[#00ff9d]" />
                <div className="flex justify-between items-center">
                  <label className="text-sm uppercase tracking-widest text-[rgba(200,255,232,0.45)]">
                    Projects
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setProjectModal({
                        open: true,
                        editIdx: null,
                        defaultValues: { type: "other", tags: [] },
                      })
                    }
                    className="text-sm flex items-center gap-2 border border-[#ff4fd8] text-[#ff4fd8] px-2 py-1 hover:bg-[rgba(255,79,216,0.1)] transition-colors"
                  >
                    <Plus size={14} />
                    Add Project
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {projFields.map((field, idx) => {
                    const proj = formData.projects?.[idx];
                    if (!proj) return null;
                    const typeMeta =
                      EDIT_PROJECT_TYPE_META[proj.type || "other"] ||
                      EDIT_PROJECT_TYPE_META["other"];
                    const {
                      Icon: ProjIcon,
                      iconColor,
                      borderColor,
                      bgColor,
                    } = typeMeta;
                    const typeLabel =
                      PROJECT_TYPES.find((t) => t.value === proj.type)?.label ||
                      "Other";
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
                      // Add the projects that you&apos;re working on
                    </div>
                  )}
                </div>
              </div>

              {/* ── Timeline ──────────────────────────────────────────────── */}
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
                        e.currentTarget.classList.add(
                          "border-[#00ff9d]",
                          "border",
                        );
                      }}
                      onDragLeave={(e) => {
                        e.currentTarget.classList.remove(
                          "border-[#00ff9d]",
                          "border",
                        );
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.currentTarget.classList.remove(
                          "border-[#00ff9d]",
                          "border",
                        );
                        const from = parseInt(
                          e.dataTransfer.getData("text/plain"),
                        );
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
                              <input
                                {...register(`timeline.${idx}.year`)}
                                placeholder="e.g. 2024-25"
                                className={`w-full bg-[rgba(0,255,157,0.05)] border border-[rgba(0,255,157,0.2)] rounded px-3 py-1.5 text-xs outline-none focus:border-[#00ff9d] text-[#00ff9d] transition-colors ${errCls(!!errors.timeline?.[idx]?.year)}`}
                              />
                              <FieldError
                                msg={
                                  (errors.timeline?.[idx]?.year as any)?.message
                                }
                              />
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
                                      setValue(
                                        `timeline.${idx}.position`,
                                        val,
                                        { shouldDirty: true },
                                      );
                                      if (val === "volunteer") {
                                        setValue(
                                          `timeline.${idx}.chapter`,
                                          "",
                                          { shouldDirty: true },
                                        );
                                      }
                                    }}
                                    placeholder="Select position..."
                                  />
                                )}
                              />
                            </div>
                            {formData.timeline?.[idx]?.position !==
                              "volunteer" && (
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
                                        setValue(
                                          `timeline.${idx}.chapter`,
                                          val,
                                          { shouldDirty: true },
                                        );
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
                      // Add your IEEE journey timeline entries
                    </div>
                  )}
                </div>
              </div>

              {/* ── Connected Accounts (GitHub / LeetCode) ──────────────────── */}
              <div className="border-t border-[rgba(0,255,157,0.1)] pt-6 space-y-4">
                <label className="text-xs uppercase tracking-widest text-[rgba(200,255,232,0.45)]">
                  Connected Accounts
                </label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-[rgba(0,255,157,0.02)] border border-[rgba(0,255,157,0.1)] p-3 rounded">
                    <div className="flex items-center gap-3">
                      <Github
                        size={16}
                        className="text-[rgba(200,255,232,0.4)]"
                      />
                      <div>
                        <div className="text-xs uppercase tracking-wider text-[rgba(200,255,232,0.6)]">
                          GitHub
                        </div>
                        {formData.github_username ? (
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
                        setGitHubInput(formData.github_username || "");
                        setShowGitHubModal(true);
                      }}
                      className="text-xs border border-[#ff4fd8] text-[#ff4fd8] px-3 py-1 hover:bg-[rgba(255,79,216,0.1)] transition-colors uppercase tracking-wider"
                    >
                      {formData.github_username ? "Edit" : "Connect"}
                    </button>
                  </div>
                  <div className="flex items-center justify-between bg-[rgba(0,255,157,0.02)] border border-[rgba(0,255,157,0.1)] p-3 rounded">
                    <div className="flex items-center gap-3">
                      <Terminal
                        size={16}
                        className="text-[rgba(200,255,232,0.4)]"
                      />
                      <div>
                        <div className="text-xs uppercase tracking-wider text-[rgba(200,255,232,0.6)]">
                          LeetCode
                        </div>
                        {formData.leetcode_username ? (
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
                        setLeetCodeInput(formData.leetcode_username || "");
                        setShowLeetCodeModal(true);
                      }}
                      className="text-xs border border-[#ff4fd8] text-[#ff4fd8] px-3 py-1 hover:bg-[rgba(255,79,216,0.1)] transition-colors uppercase tracking-wider"
                    >
                      {formData.leetcode_username ? "Edit" : "Connect"}
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Security & System Access (Change Password) ────────────────── */}
              <div className="border-t border-[rgba(0,255,157,0.1)] pt-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Lock size={16} className="text-[#ff4fd8]" />
                  <span className="uppercase text-sm">
                    Security &amp; System Access
                  </span>
                </div>
                <div className="text-xs max-w-2xl tracking-widest text-[rgba(200,255,232,0.45)]">
                  update your access key to secure your profile telemetry.
                  establishing a new key will terminate other active sessions.
                </div>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="bg-[rgba(255,79,216,0.1)] border border-[#ff4fd8] text-[#ff4fd8] px-4 py-2 rounded uppercase tracking-widest hover:bg-[rgba(255,79,216,0.2)] transition-all font-bold text-xs"
                >
                  Change Password
                </button>
              </div>
            </div>
          ) : (
            <ProfileView
              data={
                {
                  ...formData,
                  batch_of: fullProfile?.batch_of,
                  department: fullProfile?.department,
                } as any
              }
            />
          )}
        </main>
      </div>

      {/* Mobile sticky/fixed save bar */}
      {isEditMode && (
        <div
          className={`md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[rgba(0,255,157,0.25)] bg-[#0d0d1a]/95 backdrop-blur-md px-4 py-4 flex items-center justify-between gap-4 transition-all duration-300 ease-in-out transform ${
            hasChanges
              ? "translate-y-0 opacity-100 pointer-events-auto"
              : "translate-y-full opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-mono text-[#ff4fd8] uppercase tracking-wider">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff4fd8] animate-pulse" />
            unsaved changes
          </div>
          <button
            onClick={saveProfile}
            disabled={isUpdating}
            className="bg-[#00ff9d] text-[#0d0d1a] px-5 py-2.5 font-bold uppercase tracking-[0.15em] text-xs shadow-[0_0_10px_rgba(0,255,157,0.3)] active:scale-[0.98] transition-all rounded-[2px]"
          >
            {isUpdating ? "Saving..." : "Update Data"}
          </button>
        </div>
      )}

      {/* Image Upload Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Biometric Update"
      >
        <div className="space-y-4">
          <p className="text-xs text-[rgba(200,255,232,0.6)] uppercase leading-relaxed tracking-wider">
            Select a visual identifier for system-wide recognition.
          </p>
          <div className="relative border border-dashed border-[rgba(0,255,157,0.3)] rounded p-8 flex flex-col items-center justify-center gap-4 bg-[rgba(0,255,157,0.02)] hover:bg-[rgba(0,255,157,0.05)] transition-all cursor-pointer group">
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <UploadCloud
              size={28}
              className="text-[#00ff9d] group-hover:scale-110 transition-transform"
            />
            <div className="text-xs uppercase text-[#00ff9d] font-bold">
              {isUploading
                ? "Processing Data..."
                : "Choose File or Drag & Drop"}
            </div>
          </div>
          <div className="text-xs text-[rgba(255,79,216,0.6)] uppercase text-center mt-2">
            Supported formats: JPEG, PNG, WEBP. Max size: 5MB.
          </div>
        </div>
      </Modal>

      {/* Project Add/Edit Modal */}
      <ProjectModal
        open={projectModal.open}
        editIdx={projectModal.editIdx}
        defaultValues={projectModal.defaultValues}
        onSave={(data, editIdx) => {
          if (editIdx !== null) {
            updateProj(editIdx, data as any);
          } else {
            appendProj(data as any);
          }
          setValue("projects", watch("projects"), { shouldDirty: true });
          setProjectModal({ open: false, editIdx: null, defaultValues: {} });
        }}
        onDelete={(idx) => {
          removeProj(idx);
          setValue("projects", watch("projects"), { shouldDirty: true });
        }}
        onRequestClose={() =>
          setProjectModal({ open: false, editIdx: null, defaultValues: {} })
        }
      />

      {/* Password Change Modal */}
      <Modal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setCurrentPassword("");
          setNewPassword("");
          setConfirmNewPassword("");
        }}
        title="Change Password"
      >
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[rgba(200,255,232,0.45)] mb-1">
                current password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="********"
                  className="w-full bg-[rgba(255,79,216,0.05)] border border-[rgba(255,79,216,0.2)] rounded pl-3 pr-10 py-1.5 text-sm text-[#c8ffe8] outline-none focus:border-[#ff4fd8] transition-colors"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(200,255,232,0.45)] hover:text-[#ff4fd8] transition-colors"
                >
                  {showCurrentPassword ? (
                    <EyeOff size={14} />
                  ) : (
                    <Eye size={14} />
                  )}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[rgba(200,255,232,0.45)] mb-1">
                new secure password
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  className="w-full bg-[rgba(255,79,216,0.05)] border border-[rgba(255,79,216,0.2)] rounded pl-3 pr-10 py-1.5 text-sm text-[#c8ffe8] outline-none focus:border-[#ff4fd8] transition-colors"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(200,255,232,0.45)] hover:text-[#ff4fd8] transition-colors"
                >
                  {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-[rgba(200,255,232,0.45)] mb-1">
                confirm new password
              </label>
              <div className="relative">
                <input
                  type={showConfirmNewPassword ? "text" : "password"}
                  placeholder="********"
                  className="w-full bg-[rgba(255,79,216,0.05)] border border-[rgba(255,79,216,0.2)] rounded pl-3 pr-10 py-1.5 text-sm text-[#c8ffe8] outline-none focus:border-[#ff4fd8] transition-colors"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmNewPassword(!showConfirmNewPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(200,255,232,0.45)] hover:text-[#ff4fd8] transition-colors"
                >
                  {showConfirmNewPassword ? (
                    <EyeOff size={14} />
                  ) : (
                    <Eye size={14} />
                  )}
                </button>
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={isChangingPassword}
            className="w-full bg-[rgba(255,79,216,0.1)] border border-[#ff4fd8] text-[#ff4fd8] py-2 rounded uppercase tracking-widest hover:bg-[rgba(255,79,216,0.2)] transition-all disabled:opacity-50 mt-2 font-bold text-xs"
          >
            {isChangingPassword
              ? "Updating Keys..."
              : "Establish New Access Key"}
          </button>
        </form>
      </Modal>

      {/* GitHub Username Modal */}
      <Modal
        isOpen={showGitHubModal}
        onClose={() => setShowGitHubModal(false)}
        title="Link GitHub Account"
      >
        <div className="space-y-4">
          <p className="text-xs text-[rgba(200,255,232,0.6)] uppercase tracking-wider">
            Enter your GitHub username to display your contribution graph on the
            profile.
          </p>
          <input
            value={gitHubInput}
            onChange={(e) => setGitHubInput(e.target.value)}
            placeholder="e.g. octocat"
            className="w-full bg-[rgba(0,255,157,0.05)] border border-[rgba(0,255,157,0.2)] rounded px-3 py-2 outline-none focus:border-[#00ff9d] text-sm text-[#c8ffe8] placeholder:text-[rgba(200,255,232,0.2)] transition-colors"
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setValue("github_username", gitHubInput.trim(), {
                  shouldDirty: true,
                });
                setShowGitHubModal(false);
              }}
              className="flex-1 bg-[#00ff9d] text-[#0d0d1a] py-2 font-bold uppercase tracking-[0.15em] text-sm hover:opacity-90 transition-opacity rounded"
            >
              Save
            </button>
            {formData.github_username && (
              <button
                type="button"
                onClick={() => {
                  setValue("github_username", "", { shouldDirty: true });
                  setGitHubInput("");
                  setShowGitHubModal(false);
                }}
                className="px-4 border border-[rgba(255,79,216,0.4)] text-[#ff4fd8] text-xs uppercase hover:bg-[rgba(255,79,216,0.1)] transition-colors rounded"
              >
                Disconnect
              </button>
            )}
          </div>
        </div>
      </Modal>

      {/* LeetCode Username Modal */}
      <Modal
        isOpen={showLeetCodeModal}
        onClose={() => setShowLeetCodeModal(false)}
        title="Link LeetCode Account"
      >
        <div className="space-y-4">
          <p className="text-xs text-[rgba(200,255,232,0.6)] uppercase tracking-wider">
            Enter your LeetCode username to display your submission graph on the
            profile.
          </p>
          <input
            value={leetCodeInput}
            onChange={(e) => setLeetCodeInput(e.target.value)}
            placeholder="e.g. leetcoder"
            className="w-full bg-[rgba(0,255,157,0.05)] border border-[rgba(0,255,157,0.2)] rounded px-3 py-2 outline-none focus:border-[#00ff9d] text-sm text-[#c8ffe8] placeholder:text-[rgba(200,255,232,0.2)] transition-colors"
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setValue("leetcode_username", leetCodeInput.trim(), {
                  shouldDirty: true,
                });
                setShowLeetCodeModal(false);
              }}
              className="flex-1 bg-[#00ff9d] text-[#0d0d1a] py-2 font-bold uppercase tracking-[0.15em] text-sm hover:opacity-90 transition-opacity rounded"
            >
              Save
            </button>
            {formData.leetcode_username && (
              <button
                type="button"
                onClick={() => {
                  setValue("leetcode_username", "", { shouldDirty: true });
                  setLeetCodeInput("");
                  setShowLeetCodeModal(false);
                }}
                className="px-4 border border-[rgba(255,79,216,0.4)] text-[#ff4fd8] text-xs uppercase hover:bg-[rgba(255,79,216,0.1)] transition-colors rounded"
              >
                Disconnect
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
