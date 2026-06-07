import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui";
import { useProfileEdit } from "@/context/ProfileEditContext";
import {
  PROJECT_TYPES,
  PROJECT_TAGS,
  EDIT_PROJECT_TYPE_META,
} from "@/constants";
import { z } from "zod";
import { projectSchema, type ProjectType } from "@/lib/schema";
import { errCls, countWords, FieldError } from "@/utils/helpers";
import { UploadCloud, Eye, EyeOff } from "lucide-react";

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

type ProjectFormValues = z.infer<typeof projectModalSchema>;

interface ProjectModalProps {
  open: boolean;
  editIdx: number | null;
  defaultValues: Partial<ProjectFormValues>;
  onSave: (data: ProjectFormValues, editIdx: number | null) => void;
  onDelete: (idx: number) => void;
  onRequestClose: () => void;
}

export function ProjectModal({
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
                      setValue("type", t.value as ProjectType, { shouldValidate: true })
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

export function PasswordChangeModal() {
  const {
    showPasswordModal,
    setShowPasswordModal,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmNewPassword,
    setConfirmNewPassword,
    showCurrentPassword,
    setShowCurrentPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmNewPassword,
    setShowConfirmNewPassword,
    isChangingPassword,
    handleChangePassword,
  } = useProfileEdit();

  return (
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
                {showCurrentPassword ? <EyeOff size={14} /> : <Eye size={14} />}
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
          {isChangingPassword ? "Updating Keys..." : "Establish New Access Key"}
        </button>
      </form>
    </Modal>
  );
}

export function EmailChangeModal() {
  const {
    showEmailModal,
    setShowEmailModal,
    newEmail,
    setNewEmail,
    emailPassword,
    setEmailPassword,
    showEmailPassword,
    setShowEmailPassword,
    isChangingEmail,
    handleChangeEmail,
  } = useProfileEdit();

  return (
    <Modal
      isOpen={showEmailModal}
      onClose={() => {
        setShowEmailModal(false);
        setNewEmail("");
        setEmailPassword("");
      }}
      title="Change Email"
    >
      <form onSubmit={handleChangeEmail} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-[rgba(200,255,232,0.45)] mb-1">
              new email address
            </label>
            <input
              type="email"
              placeholder="new-email@example.com"
              className="w-full bg-[rgba(255,79,216,0.05)] border border-[rgba(255,79,216,0.2)] rounded px-3 py-1.5 text-sm text-[#c8ffe8] outline-none focus:border-[#ff4fd8] transition-colors font-mono"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-[rgba(200,255,232,0.45)] mb-1">
              current password
            </label>
            <div className="relative">
              <input
                type={showEmailPassword ? "text" : "password"}
                placeholder="********"
                className="w-full bg-[rgba(255,79,216,0.05)] border border-[rgba(255,79,216,0.2)] rounded pl-3 pr-10 py-1.5 text-sm text-[#c8ffe8] outline-none focus:border-[#ff4fd8] transition-colors"
                value={emailPassword}
                onChange={(e) => setEmailPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowEmailPassword(!showEmailPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[rgba(200,255,232,0.45)] hover:text-[#ff4fd8] transition-colors"
              >
                {showEmailPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
        </div>
        <button
          type="submit"
          disabled={isChangingEmail}
          className="w-full bg-[rgba(255,79,216,0.1)] border border-[#ff4fd8] text-[#ff4fd8] py-2 rounded uppercase tracking-widest hover:bg-[rgba(255,79,216,0.2)] transition-all disabled:opacity-50 mt-2 font-bold text-xs"
        >
          {isChangingEmail ? "Updating Email..." : "Verify & Change Email"}
        </button>
      </form>
    </Modal>
  );
}

export function GitHubModal() {
  const {
    showGitHubModal,
    setShowGitHubModal,
    gitHubInput,
    setGitHubInput,
    formMethods,
  } = useProfileEdit();

  const { setValue, watch } = formMethods;
  const githubUsername = watch("github_username") || "";

  return (
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
          {githubUsername && (
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
  );
}

export function LeetCodeModal() {
  const {
    showLeetCodeModal,
    setShowLeetCodeModal,
    leetCodeInput,
    setLeetCodeInput,
    formMethods,
  } = useProfileEdit();

  const { setValue, watch } = formMethods;
  const leetcodeUsername = watch("leetcode_username") || "";

  return (
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
          {leetcodeUsername && (
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
  );
}

export function ImageUploadModal() {
  const { isModalOpen, setIsModalOpen, isUploading, handleFileChange } =
    useProfileEdit();

  return (
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
            {isUploading ? "Processing Data..." : "Choose File or Drag & Drop"}
          </div>
        </div>
        <div className="text-xs text-[rgba(255,79,216,0.6)] uppercase text-center mt-2">
          Supported formats: JPG, PNG. Max size: 5MB.
        </div>
      </div>
    </Modal>
  );
}
