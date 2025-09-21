import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements } from 'better-auth/plugins/organization/access';

const statement = {
    ...defaultStatements,
    event: ["create", "share", "update", "delete"],
    user: ["read", "update", "delete"],
    system: ["manage"], // For root-level operations
} as const;

const ac = createAccessControl(statement);

const member = ac.newRole({
    event: ["share"],
    user: ["read"],
});

const orgAdmin = ac.newRole({
    event: ["create", "share", "update", "delete"],
    organization: ["update"],
    user: ["read", "update"],
});

const rootAdmin = ac.newRole({
    event: ["create", "share", "update", "delete"],
    organization: ["update", "delete"],
    user: ["read", "update", "delete"],
    system: ["manage"],
});

export { ac, member, orgAdmin, rootAdmin, statement };
