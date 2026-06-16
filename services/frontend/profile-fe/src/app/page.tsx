"use client";

import React from "react";
import { FormProvider, useFieldArray } from "react-hook-form";
import { ScanlineOverlay, HeaderBar } from "@/components/layout/Common";
import { Sidebar } from "@/components/layout/Sidebar";
import { ProfileView } from "@/components/views/ProfileView";
import {
  ProfileEditProvider,
  useProfileEdit,
} from "@/context/ProfileEditContext";
import {
  BasicInfoSection,
  SystemInfoSection,
  SkillsSection,
  SocialLinksSection,
  AchievementsSection,
  ProjectsSection,
  TimelineSection,
  ConnectedAccountsSection,
  SecuritySection,
  ProjectModal,
  PasswordChangeModal,
  EmailChangeModal,
  GitHubModal,
  LeetCodeModal,
  ImageUploadModal,
} from "@/components/views/ProfileEdit";
import { areProfilesEqual } from "@/utils/helpers";
import { EyeIcon, PencilIcon, LogOut, Loader2 } from "lucide-react";

function ProfileEditor() {
  const {
    isEditMode,
    setIsEditMode,
    loading,
    isUpdating,
    stagedImageFile,
    isLoggingOut,
    session,
    fullProfile,
    originalData,
    formMethods,
    saveProfile,
    handleLogout,
    projectModal,
    setProjectModal,
    setIsModalOpen,
  } = useProfileEdit();

  const {
    watch,
    setValue,
    control,
    formState: { isDirty },
  } = formMethods;

  const {
    append: appendProj,
    remove: removeProj,
    update: updateProj,
  } = useFieldArray({ control, name: "projects" });

  const formData = watch();
  const hasChanges =
    isDirty ||
    !areProfilesEqual(formData, originalData) ||
    stagedImageFile !== null;

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
            className={`text-sm flex gap-2 items-center px-3 py-1 border transition-all uppercase tracking-widest ${isEditMode
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
          className={`text-sm text-[#ff4fd8] flex gap-2 items-center border border-[#ff4fd8] px-3 py-1 hover:bg-[rgba(255,79,216,0.1)] transition-all uppercase tracking-widest ${isLoggingOut ? "opacity-50 cursor-not-allowed" : ""
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
                  className={`bg-[#00ff9d] text-[#0d0d1a] px-8 py-2 font-bold uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(0,255,157,0.3)] hover:scale-105 transition-all ${isUpdating || !hasChanges
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

              {/* Form sections */}
              <FormProvider {...formMethods}>
                <BasicInfoSection />
                <SystemInfoSection />
                <SkillsSection />
                <SocialLinksSection />
                <AchievementsSection />
                <ProjectsSection />
                <TimelineSection />
                <ConnectedAccountsSection />
                <SecuritySection />
              </FormProvider>
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
          className={`md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[rgba(0,255,157,0.25)] bg-[#0d0d1a]/95 backdrop-blur-md px-4 py-4 flex items-center justify-between gap-4 transition-all duration-300 ease-in-out transform ${hasChanges
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

      {/* Modals */}
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

      <PasswordChangeModal />
      <EmailChangeModal />
      <GitHubModal />
      <LeetCodeModal />
      <ImageUploadModal />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProfileEditProvider>
      <ProfileEditor />
    </ProfileEditProvider>
  );
}
