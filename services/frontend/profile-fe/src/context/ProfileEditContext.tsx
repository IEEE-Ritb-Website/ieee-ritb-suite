"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { profileSchema, type ProfileFormData } from "@/lib/schema";
import { safeNormalizeProfile } from "@/utils/helpers";

interface ProjectFormValues {
  type?:
    | "website"
    | "aiml"
    | "cli"
    | "cybersecurity"
    | "research"
    | "embedded"
    | "mobile"
    | "game"
    | "devtool"
    | "other";
  title?: string;
  short_description?: string;
  long_description?: string;
  primary_link?: string;
  extra_link?: string;
  tags?: string[];
  description?: string;
  link?: string;
}

interface ProjectModalState {
  open: boolean;
  editIdx: number | null;
  defaultValues: Partial<ProjectFormValues>;
}

interface AuthSession {
  user: {
    id: string;
    email: string;
    name: string;
    image?: string | null;
    username?: string;
  };
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
  };
}

interface FullProfile extends Partial<ProfileFormData> {
  id?: string;
  usn?: string;
  phoneNumber?: string;
  batch_of?: string;
  batch?: string;
  year?: string;
  membershipId?: string;
}

interface ProfileEditContextType {
  session: AuthSession | null;
  setSession: React.Dispatch<React.SetStateAction<AuthSession | null>>;
  fullProfile: FullProfile | null;
  setFullProfile: React.Dispatch<React.SetStateAction<FullProfile | null>>;
  originalData: Partial<ProfileFormData>;
  setOriginalData: React.Dispatch<
    React.SetStateAction<Partial<ProfileFormData>>
  >;
  isEditMode: boolean;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isUpdating: boolean;
  setIsUpdating: React.Dispatch<React.SetStateAction<boolean>>;
  isUploading: boolean;
  setIsUploading: React.Dispatch<React.SetStateAction<boolean>>;
  stagedImageFile: File | null;
  setStagedImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  stagedImagePreview: string | null;
  setStagedImagePreview: React.Dispatch<React.SetStateAction<string | null>>;
  isLoggingOut: boolean;
  setIsLoggingOut: React.Dispatch<React.SetStateAction<boolean>>;
  showPasswordModal: boolean;
  setShowPasswordModal: React.Dispatch<React.SetStateAction<boolean>>;
  showEmailModal: boolean;
  setShowEmailModal: React.Dispatch<React.SetStateAction<boolean>>;
  showGitHubModal: boolean;
  setShowGitHubModal: React.Dispatch<React.SetStateAction<boolean>>;
  showLeetCodeModal: boolean;
  setShowLeetCodeModal: React.Dispatch<React.SetStateAction<boolean>>;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  projectModal: ProjectModalState;
  setProjectModal: React.Dispatch<React.SetStateAction<ProjectModalState>>;
  newEmail: string;
  setNewEmail: React.Dispatch<React.SetStateAction<string>>;
  emailPassword: string;
  setEmailPassword: React.Dispatch<React.SetStateAction<string>>;
  showEmailPassword: boolean;
  setShowEmailPassword: React.Dispatch<React.SetStateAction<boolean>>;
  isChangingEmail: boolean;
  setIsChangingEmail: React.Dispatch<React.SetStateAction<boolean>>;
  currentPassword: string;
  setCurrentPassword: React.Dispatch<React.SetStateAction<string>>;
  newPassword: string;
  setNewPassword: React.Dispatch<React.SetStateAction<string>>;
  confirmNewPassword: string;
  setConfirmNewPassword: React.Dispatch<React.SetStateAction<string>>;
  showCurrentPassword: boolean;
  setShowCurrentPassword: React.Dispatch<React.SetStateAction<boolean>>;
  showNewPassword: boolean;
  setShowNewPassword: React.Dispatch<React.SetStateAction<boolean>>;
  showConfirmNewPassword: boolean;
  setShowConfirmNewPassword: React.Dispatch<React.SetStateAction<boolean>>;
  isChangingPassword: boolean;
  setIsChangingPassword: React.Dispatch<React.SetStateAction<boolean>>;
  gitHubInput: string;
  setGitHubInput: React.Dispatch<React.SetStateAction<string>>;
  leetCodeInput: string;
  setLeetCodeInput: React.Dispatch<React.SetStateAction<string>>;
  formMethods: UseFormReturn<ProfileFormData>;
  clearStagedImage: () => void;
  saveProfile: () => void;
  handleChangePassword: (e: React.FormEvent) => Promise<void>;
  handleChangeEmail: (e: React.FormEvent) => Promise<void>;
  handleLogout: () => Promise<void>;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileEditContext = createContext<ProfileEditContextType | undefined>(
  undefined,
);

export function ProfileEditProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { toast } = useToast();
  const router = useRouter();

  // Basic States
  const [session, setSession] = useState<AuthSession | null>(null);
  const [fullProfile, setFullProfile] = useState<FullProfile | null>(null);
  const [originalData, setOriginalData] = useState<Partial<ProfileFormData>>(
    {},
  );
  const [isEditMode, setIsEditMode] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [stagedImageFile, setStagedImageFile] = useState<File | null>(null);
  const [stagedImagePreview, setStagedImagePreview] = useState<string | null>(
    null,
  );
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Modal Toggles
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showGitHubModal, setShowGitHubModal] = useState(false);
  const [showLeetCodeModal, setShowLeetCodeModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectModal, setProjectModal] = useState<ProjectModalState>({
    open: false,
    editIdx: null,
    defaultValues: {},
  });

  // Security Credentials Inputs
  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");
  const [showEmailPassword, setShowEmailPassword] = useState(false);
  const [isChangingEmail, setIsChangingEmail] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Connection Integrations
  const [gitHubInput, setGitHubInput] = useState("");
  const [leetCodeInput, setLeetCodeInput] = useState("");

  // React Hook Form Initialization
  const formMethods = useForm<ProfileFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      email: "",
    },
  });

  const { reset, setValue, handleSubmit } = formMethods;

  // Cleanup Preview Image Urls
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

  // Fetch session & profile data
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
              username: (data.user as { username?: string }).username,
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
  }, [router, reset]);

  // Image File Upload Checks
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type (only jpg/png)
    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Format Not Allowed",
        description: "Visual identifier must be in JPG or PNG format.",
        variant: "destructive",
      });
      e.target.value = "";
      return;
    }

    // Validate size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "Image Size Too Large",
        description:
          "Visual identifier file size exceeds the 5MB transmission limit.",
        variant: "destructive",
      });
      e.target.value = "";
      return;
    }

    if (stagedImagePreview) {
      URL.revokeObjectURL(stagedImagePreview);
    }
    const previewUrl = URL.createObjectURL(file);
    setStagedImageFile(file);
    setStagedImagePreview(previewUrl);
    setValue("image", previewUrl, { shouldDirty: true, shouldValidate: true });
    setIsModalOpen(false);
  };

  // Submit Profile Form
  const saveProfile = handleSubmit(
    async (data) => {
      const email = session?.user?.email;
      if (!email) return;

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
            let errMsg = "Upload error. Please try again later.";
            let errTitle = "Upload Failed";
            try {
              const err = await uploadResponse.json();
              errMsg = err.message || errMsg;
              if (
                errMsg.toLowerCase().includes("size") ||
                errMsg.toLowerCase().includes("exceeds")
              ) {
                errTitle = "Image Size Too Large";
              } else if (
                errMsg.toLowerCase().includes("format") ||
                errMsg.toLowerCase().includes("unsupported")
              ) {
                errTitle = "Format Not Allowed";
              }
            } catch (jsonErr) {
              console.error(
                "Failed to parse upload error response JSON:",
                jsonErr,
              );
              errMsg = `Server error (${uploadResponse.status}): ${uploadResponse.statusText || "Upload rejected by gateway."}`;
            }
            toast({
              title: errTitle,
              description: errMsg,
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
          const refresh = await fetch(`/api/profile?email=${email}`);
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
          } else {
            console.error(
              "Profile refresh failed with status:",
              refresh.status,
            );
            toast({
              title: "System Synced",
              description:
                "Telemetry profiles updated, but local view refresh failed. Please reload the page.",
              variant: "destructive",
            });
          }
        } else {
          let errMsg = "Database synchronization failed.";
          try {
            const err = await response.json();
            errMsg = err.message || errMsg;
          } catch (jsonErr) {
            console.error(
              "Failed to parse profile error response JSON:",
              jsonErr,
            );
            errMsg = `Server error (${response.status}): ${response.statusText || "Internal Server Error"}`;
          }
          toast({
            title: "Update Denied",
            description: errMsg,
            variant: "destructive",
          });
        }
      } catch (err) {
        console.error("Profile saving error:", err);
        toast({
          title: "Connection Failure",
          description:
            err instanceof Error
              ? err.message
              : "Network error. Database sync interrupted.",
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
      const flatten = (obj: Record<string, unknown>, prefix = ""): void => {
        for (const key of Object.keys(obj)) {
          const val = obj[key];
          const path = prefix ? `${prefix} → ${key}` : key;
          if (
            val &&
            typeof val === "object" &&
            "message" in val &&
            typeof (val as { message: unknown }).message === "string"
          ) {
            const msg = (val as { message: string }).message;
            const k = `${path}:${msg}`;
            if (!seen.has(k)) {
              seen.add(k);
              toast({
                title: `Error: ${path}`,
                description: msg,
                variant: "destructive",
              });
            }
          } else if (val && typeof val === "object" && val !== null) {
            flatten(val as Record<string, unknown>, path);
          }
        }
      };
      flatten(fieldErrors as unknown as Record<string, unknown>);
    },
  );

  // Security Credentials Functions
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

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) {
      toast({
        title: "Validation Error",
        description: "Please enter a new email address.",
        variant: "destructive",
      });
      return;
    }
    if (newEmail.trim().toLowerCase() === session?.user?.email?.toLowerCase()) {
      toast({
        title: "Validation Error",
        description: "New email must be different from current email.",
        variant: "destructive",
      });
      return;
    }

    setIsChangingEmail(true);
    try {
      const res = await fetch("/api/auth/change-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail: newEmail.trim() }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast({
          title: "Email Change Failed",
          description:
            (data as { message?: string }).message ||
            "Failed to send verification email.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Verification Email Sent",
          description: `A confirmation link has been dispatched to ${newEmail.trim()}. Click it and enter your password to complete the change.`,
          variant: "success",
        });
        setNewEmail("");
        setEmailPassword("");
        setShowEmailModal(false);
      }
    } catch (err) {
      console.error("Change email error:", err);
      toast({
        title: "Connection Failure",
        description: "Email update request timed out.",
        variant: "destructive",
      });
    } finally {
      setIsChangingEmail(false);
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

  return (
    <ProfileEditContext.Provider
      value={{
        session,
        setSession,
        fullProfile,
        setFullProfile,
        originalData,
        setOriginalData,
        isEditMode,
        setIsEditMode,
        loading,
        setLoading,
        isUpdating,
        setIsUpdating,
        isUploading,
        setIsUploading,
        stagedImageFile,
        setStagedImageFile,
        stagedImagePreview,
        setStagedImagePreview,
        isLoggingOut,
        setIsLoggingOut,
        showPasswordModal,
        setShowPasswordModal,
        showEmailModal,
        setShowEmailModal,
        showGitHubModal,
        setShowGitHubModal,
        showLeetCodeModal,
        setShowLeetCodeModal,
        isModalOpen,
        setIsModalOpen,
        projectModal,
        setProjectModal,
        newEmail,
        setNewEmail,
        emailPassword,
        setEmailPassword,
        showEmailPassword,
        setShowEmailPassword,
        isChangingEmail,
        setIsChangingEmail,
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
        setIsChangingPassword,
        gitHubInput,
        setGitHubInput,
        leetCodeInput,
        setLeetCodeInput,
        formMethods,
        clearStagedImage,
        saveProfile,
        handleChangePassword,
        handleChangeEmail,
        handleLogout,
        handleFileChange,
      }}
    >
      {children}
    </ProfileEditContext.Provider>
  );
}

export function useProfileEdit() {
  const context = useContext(ProfileEditContext);
  if (context === undefined) {
    throw new Error("useProfileEdit must be used within a ProfileEditProvider");
  }
  return context;
}
