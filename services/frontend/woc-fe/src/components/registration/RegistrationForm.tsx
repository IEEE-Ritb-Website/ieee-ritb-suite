"use client";

import { useState, type FormEvent } from "react";
import {
  ACADEMIC_YEARS,
  RegistrationNotConfiguredError,
  submitRegistration,
  validateRegistrationForm,
  type RegistrationErrors,
  type RegistrationField,
} from "@/lib/registration";

interface RegistrationFormProps {
  projectId: string;
  suggestedSkills: string[];
  initialName?: string;
  initialEmail?: string;
}

const FIELD_IDS: Record<RegistrationField, string> = {
  fullName: "reg-full-name",
  email: "reg-email",
  githubProfileUrl: "reg-github-url",
  college: "reg-college",
  academicYear: "reg-academic-year",
  interest: "reg-interest",
};

const FIELD_ORDER: RegistrationField[] = [
  "fullName",
  "email",
  "githubProfileUrl",
  "college",
  "academicYear",
  "interest",
];

type SubmitState =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "not-connected" }
  | { kind: "failed"; message: string }
  | { kind: "succeeded" };

function focusFirstError(errors: RegistrationErrors): void {
  const first = FIELD_ORDER.find((field) => errors[field]);
  if (first) document.getElementById(FIELD_IDS[first])?.focus();
}

function inputClassName(hasError: boolean): string {
  return `w-full border bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 dark:bg-zinc-950 dark:text-zinc-100 dark:placeholder:text-zinc-500 ${
    hasError
      ? "border-red-400 dark:border-red-600"
      : "border-zinc-900/15 dark:border-zinc-100/15"
  }`;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm leading-6 text-red-700 dark:text-red-400">
      {message}
    </p>
  );
}

export default function RegistrationForm({
  projectId,
  suggestedSkills,
  initialName = "",
  initialEmail = "",
}: RegistrationFormProps) {
  const [fullName, setFullName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [githubProfileUrl, setGithubProfileUrl] = useState("");
  const [college, setCollege] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [interest, setInterest] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkills, setCustomSkills] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [errors, setErrors] = useState<RegistrationErrors>({});
  const [submitState, setSubmitState] = useState<SubmitState>({ kind: "idle" });

  const isSubmitting = submitState.kind === "submitting";

  function toggleSkill(skill: string): void {
    setSelectedSkills((current) =>
      current.includes(skill)
        ? current.filter((item) => item !== skill)
        : [...current, skill],
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    if (isSubmitting) return;

    const fieldErrors = validateRegistrationForm({
      fullName,
      email,
      githubProfileUrl,
      college,
      academicYear,
      interest,
    });
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      focusFirstError(fieldErrors);
      return;
    }

    const extraSkills = customSkills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill.length > 0 && !selectedSkills.includes(skill));

    setSubmitState({ kind: "submitting" });
    try {
      const result = await submitRegistration({
        problemStatementId: projectId,
        fullName: fullName.trim(),
        email: email.trim(),
        githubProfileUrl: githubProfileUrl.trim(),
        college: college.trim(),
        academicYear,
        interest: interest.trim(),
        skills: [...selectedSkills, ...extraSkills],
        additionalInfo: additionalInfo.trim(),
      });
      if (result.status === "success") {
        setSubmitState({ kind: "succeeded" });
      } else if (result.status === "duplicate") {
        setSubmitState({
          kind: "failed",
          message:
            result.message ??
            "You have already registered for this problem statement.",
        });
      } else if (result.status === "session-expired") {
        setSubmitState({
          kind: "failed",
          message:
            "Your session expired. Sign in again, then resubmit — your entries above are preserved.",
        });
      } else if (result.status === "network-error") {
        setSubmitState({
          kind: "failed",
          message:
            "Could not reach the server. Check your connection and try again — nothing was lost.",
        });
      } else {
        setSubmitState({
          kind: "failed",
          message:
            result.message ??
            "The server could not accept your registration. Try again later.",
        });
      }
    } catch (error) {
      if (error instanceof RegistrationNotConfiguredError) {
        setSubmitState({ kind: "not-connected" });
      } else {
        setSubmitState({
          kind: "failed",
          message: "Something went wrong. Try again in a moment.",
        });
      }
    }
  }

  if (submitState.kind === "succeeded") {
    return (
      <div
        role="status"
        className="border border-blue-700/30 bg-blue-50 px-6 py-10 text-center dark:border-blue-400/30 dark:bg-blue-950"
      >
        <h2 className="font-mono text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Registration submitted
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-zinc-600 dark:text-zinc-400">
          The backend confirmed your registration for this problem statement.
          Watch your dashboard for updates during the submission period
          (October 15 – October 31).
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Problem statement registration form">
      {submitState.kind === "not-connected" && (
        <div
          role="status"
          className="mb-8 border border-amber-300 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200"
        >
          Registration submission is not connected yet — the backend has not
          published a registration endpoint. Your entries above are preserved;
          nothing was sent and no success is claimed.
        </div>
      )}
      {submitState.kind === "failed" && (
        <div
          role="alert"
          className="mb-8 border border-red-300 bg-red-50 px-4 py-3 text-sm leading-6 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-200"
        >
          {submitState.message}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label htmlFor={FIELD_IDS.fullName} className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Full name <span aria-hidden="true" className="text-blue-700 dark:text-blue-400">*</span>
          </label>
          <input
            id={FIELD_IDS.fullName}
            name="fullName"
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            aria-invalid={Boolean(errors.fullName)}
            aria-describedby={errors.fullName ? `${FIELD_IDS.fullName}-error` : undefined}
            className={`mt-2 ${inputClassName(Boolean(errors.fullName))}`}
          />
          <FieldError id={`${FIELD_IDS.fullName}-error`} message={errors.fullName} />
        </div>

        <div>
          <label htmlFor={FIELD_IDS.email} className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Email address <span aria-hidden="true" className="text-blue-700 dark:text-blue-400">*</span>
          </label>
          <input
            id={FIELD_IDS.email}
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${FIELD_IDS.email}-error` : undefined}
            className={`mt-2 ${inputClassName(Boolean(errors.email))}`}
          />
          <FieldError id={`${FIELD_IDS.email}-error`} message={errors.email} />
        </div>

        <div>
          <label htmlFor={FIELD_IDS.githubProfileUrl} className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
            GitHub profile URL <span aria-hidden="true" className="text-blue-700 dark:text-blue-400">*</span>
          </label>
          <input
            id={FIELD_IDS.githubProfileUrl}
            name="githubProfileUrl"
            type="url"
            inputMode="url"
            autoComplete="url"
            required
            placeholder="https://github.com/octocat"
            value={githubProfileUrl}
            onChange={(event) => setGithubProfileUrl(event.target.value)}
            aria-invalid={Boolean(errors.githubProfileUrl)}
            aria-describedby={errors.githubProfileUrl ? `${FIELD_IDS.githubProfileUrl}-error` : undefined}
            className={`mt-2 ${inputClassName(Boolean(errors.githubProfileUrl))}`}
          />
          <FieldError id={`${FIELD_IDS.githubProfileUrl}-error`} message={errors.githubProfileUrl} />
        </div>

        <div>
          <label htmlFor={FIELD_IDS.college} className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
            College or institution <span aria-hidden="true" className="text-blue-700 dark:text-blue-400">*</span>
          </label>
          <input
            id={FIELD_IDS.college}
            name="college"
            type="text"
            autoComplete="organization"
            required
            value={college}
            onChange={(event) => setCollege(event.target.value)}
            aria-invalid={Boolean(errors.college)}
            aria-describedby={errors.college ? `${FIELD_IDS.college}-error` : undefined}
            className={`mt-2 ${inputClassName(Boolean(errors.college))}`}
          />
          <FieldError id={`${FIELD_IDS.college}-error`} message={errors.college} />
        </div>

        <div>
          <label htmlFor={FIELD_IDS.academicYear} className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Current academic year <span aria-hidden="true" className="text-blue-700 dark:text-blue-400">*</span>
          </label>
          <select
            id={FIELD_IDS.academicYear}
            name="academicYear"
            required
            value={academicYear}
            onChange={(event) => setAcademicYear(event.target.value)}
            aria-invalid={Boolean(errors.academicYear)}
            aria-describedby={errors.academicYear ? `${FIELD_IDS.academicYear}-error` : undefined}
            className={`mt-2 ${inputClassName(Boolean(errors.academicYear))}`}
          >
            <option value="">Select your academic year</option>
            {ACADEMIC_YEARS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <FieldError id={`${FIELD_IDS.academicYear}-error`} message={errors.academicYear} />
        </div>

        <div>
          <label htmlFor={FIELD_IDS.interest} className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Why are you interested in this project?{" "}
            <span aria-hidden="true" className="text-blue-700 dark:text-blue-400">*</span>
          </label>
          <textarea
            id={FIELD_IDS.interest}
            name="interest"
            required
            rows={5}
            value={interest}
            onChange={(event) => setInterest(event.target.value)}
            aria-invalid={Boolean(errors.interest)}
            aria-describedby={errors.interest ? `${FIELD_IDS.interest}-error` : undefined}
            className={`mt-2 ${inputClassName(Boolean(errors.interest))}`}
          />
          <FieldError id={`${FIELD_IDS.interest}-error`} message={errors.interest} />
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Relevant skills
          </legend>
          <p className="mt-1 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Select what applies, or add your own comma-separated below.
          </p>
          {suggestedSkills.length > 0 ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {suggestedSkills.map((skill) => {
                const checked = selectedSkills.includes(skill);
                return (
                  <label
                    key={skill}
                    className={`cursor-pointer border px-3 py-1.5 font-mono text-xs transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-blue-700 ${
                      checked
                        ? "border-blue-700 bg-blue-700 text-white dark:border-blue-400 dark:bg-blue-400 dark:text-zinc-950"
                        : "border-zinc-900/15 text-zinc-700 hover:border-zinc-900/40 dark:border-zinc-100/15 dark:text-zinc-300 dark:hover:border-zinc-100/40"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleSkill(skill)}
                      className="sr-only"
                    />
                    {skill}
                  </label>
                );
              })}
            </div>
          ) : (
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
              No skill suggestions were published for this problem statement —
              list your own below.
            </p>
          )}
          <label htmlFor="reg-custom-skills" className="mt-4 block text-sm text-zinc-700 dark:text-zinc-300">
            Other skills (comma-separated, optional)
          </label>
          <input
            id="reg-custom-skills"
            name="customSkills"
            type="text"
            placeholder="e.g. Figma, SQL"
            value={customSkills}
            onChange={(event) => setCustomSkills(event.target.value)}
            className={`mt-2 ${inputClassName(false)}`}
          />
        </fieldset>

        <div>
          <label htmlFor="reg-additional-info" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
            Additional information <span className="font-normal text-zinc-500">(optional)</span>
          </label>
          <textarea
            id="reg-additional-info"
            name="additionalInfo"
            rows={4}
            value={additionalInfo}
            onChange={(event) => setAdditionalInfo(event.target.value)}
            className={`mt-2 ${inputClassName(false)}`}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center bg-blue-700 px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700 sm:w-auto"
        >
          {isSubmitting ? "Submitting…" : "Submit Registration"}
        </button>
      </div>
    </form>
  );
}
