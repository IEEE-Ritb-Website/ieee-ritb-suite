import { IEvent } from "@/schemas";

export interface FormField {
    name: string;
    type: "text" | "email" | "tel" | "number" | "textarea" | "select" | "multiselect" | "file" | "date";
    label: string;
    required: boolean;
    placeholder?: string;
    options?: string[];
    validation?: {
        minLength?: number;
        maxLength?: number;
        min?: number;
        max?: number;
        pattern?: string;
    };
    condition?: {
        field: string;
        value: any;
    };
}

export interface FormModel {
    eventId: string;
    eventTitle: string;
    eventSlug: string;
    registrationType: "individual" | "team" | "both";
    fields: FormField[];
    metadata: {
        registrationOpen: Date;
        registrationClose: Date;
        maxParticipants?: number;
        maxTeams?: number;
        requiresApproval: boolean;
        autoApprove: boolean;
        teamConfig?: {
            minSize: number;
            maxSize: number;
            allowMixedInstitutions: boolean;
            requireTeamName: boolean;
        };
    };
}

/**
 * Generate a form model from an event configuration
 * This transforms the event's registration and form config into a frontend-ready form schema
 */
export const generateFormModel = (event: IEvent): FormModel => {
    const fields: FormField[] = [];

    // Base fields - always required
    fields.push({
        name: "name",
        type: "text",
        label: "Full Name",
        required: true,
        placeholder: "Enter your full name",
        validation: {
            minLength: 2,
            maxLength: 100,
        },
    });

    fields.push({
        name: "email",
        type: "email",
        label: "Email Address",
        required: true,
        placeholder: "your.email@example.com",
        validation: {
            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
        },
    });

    // Registration type field (if both individual and team are allowed)
    if (event.registrationConfig.type === "both") {
        fields.push({
            name: "registrationType",
            type: "select",
            label: "Registration Type",
            required: true,
            options: ["individual", "team"],
        });
    }

    // Default fields based on event configuration
    const defaultFields = event.formConfig.defaultFields;

    if (defaultFields) {
        // Phone
        if (defaultFields.collectPhone) {
            fields.push({
                name: "phone",
                type: "tel",
                label: "Phone Number",
                required: true,
                placeholder: "+91 XXXXXXXXXX",
                validation: {
                    pattern: "^[+]?[0-9]{10,15}$",
                },
            });
        }

        // Department
        if (defaultFields.collectDepartment) {
            fields.push({
                name: "department",
                type: "select",
                label: "Department",
                required: true,
                options: event.registrationConfig.allowedDepartments || [
                    "Computer Science",
                    "Information Science",
                    "Electronics & Communication",
                    "Electrical & Electronics",
                    "Mechanical",
                    "Civil",
                    "Other",
                ],
            });
        }

        // Year of Study
        if (defaultFields.collectYear) {
            fields.push({
                name: "year",
                type: "select",
                label: "Year of Study",
                required: true,
                options: (event.registrationConfig.allowedYears || [1, 2, 3, 4]).map(
                    (y) => `Year ${y}`
                ),
            });
        }

        // USN (University Seat Number)
        if (defaultFields.collectUSN) {
            fields.push({
                name: "usn",
                type: "text",
                label: "USN / Roll Number",
                required: true,
                placeholder: "Enter your USN",
                validation: {
                    minLength: 5,
                    maxLength: 20,
                },
            });
        }

        // Institution
        if (defaultFields.collectInstitution) {
            fields.push({
                name: "institution",
                type: "text",
                label: "Institution Name",
                required: true,
                placeholder: "Enter your institution name",
                validation: {
                    minLength: 3,
                    maxLength: 200,
                },
            });
        }

        // IEEE Membership
        if (event.registrationConfig.requireIEEEMembership) {
            fields.push({
                name: "ieeeMembershipId",
                type: "text",
                label: "IEEE Membership ID",
                required: true,
                placeholder: "Enter your IEEE membership ID",
            });
        }

        // Resume
        if (defaultFields.collectResume) {
            fields.push({
                name: "resume",
                type: "file",
                label: "Resume / CV",
                required: true,
            });
        }

        // ID Card
        if (defaultFields.collectIdCard) {
            fields.push({
                name: "idCard",
                type: "file",
                label: "ID Card",
                required: true,
            });
        }

        // Additional custom questions
        if (defaultFields.additionalQuestions && defaultFields.additionalQuestions.length > 0) {
            defaultFields.additionalQuestions.forEach((question, index) => {
                fields.push({
                    name: `customQuestion_${index}`,
                    type: question.type as any,
                    label: question.question,
                    required: question.required,
                    options: question.options,
                });
            });
        }
    }

    // Team-specific fields
    if (
        event.registrationConfig.type === "team" ||
        event.registrationConfig.type === "both"
    ) {
        const teamConfig = event.registrationConfig.team;

        fields.push({
            name: "teamName",
            type: "text",
            label: "Team Name",
            required: teamConfig?.requireTeamName ?? true,
            placeholder: "Enter your team name",
            validation: {
                minLength: 3,
                maxLength: 100,
            },
            condition: {
                field: "registrationType",
                value: "team",
            },
        });

        fields.push({
            name: "teamSize",
            type: "number",
            label: "Team Size",
            required: true,
            validation: {
                min: teamConfig?.minSize || 2,
                max: teamConfig?.maxSize || 10,
            },
            condition: {
                field: "registrationType",
                value: "team",
            },
        });

        fields.push({
            name: "teamMembers",
            type: "textarea",
            label: "Team Members (Name, Email, Phone - one per line)",
            required: true,
            placeholder: "John Doe, john@example.com, +91 9876543210\nJane Smith, jane@example.com, +91 9876543211",
            condition: {
                field: "registrationType",
                value: "team",
            },
        });
    }

    // Build the complete form model
    const formModel: FormModel = {
        eventId: String(event._id || ""),
        eventTitle: event.title,
        eventSlug: event.slug,
        registrationType: event.registrationConfig.type,
        fields,
        metadata: {
            registrationOpen: event.registrationOpenDate,
            registrationClose: event.registrationCloseDate,
            maxParticipants: event.registrationConfig.maxParticipants,
            maxTeams: event.registrationConfig.maxTeams,
            requiresApproval: event.registrationConfig.requireApproval,
            autoApprove: event.registrationConfig.autoApprove,
            teamConfig: event.registrationConfig.team
                ? {
                    minSize: event.registrationConfig.team.minSize,
                    maxSize: event.registrationConfig.team.maxSize,
                    allowMixedInstitutions:
                        event.registrationConfig.team.allowMixedInstitutions,
                    requireTeamName: event.registrationConfig.team.requireTeamName,
                }
                : undefined,
        },
    };

    return formModel;
};
