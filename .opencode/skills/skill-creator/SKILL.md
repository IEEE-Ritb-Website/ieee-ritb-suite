---
name: skill-creator
description: Create new skills, modify and improve existing skills, and measure skill performance. Use when users want to create a skill from scratch, edit, or optimize an existing skill, run evals to test a skill, benchmark skill performance, or optimize a skill's description for better triggering accuracy.
---

# Skill Creator

A skill for creating new skills and iteratively improving them for OpenCode.

At a high level, the process of creating a skill goes like this:

- **Capture Intent**: Decide what you want the skill to do and roughly how it should do it.
- **Draft the Skill**: Write a draft of the skill in `SKILL.md` inside a dedicated subdirectory under `.opencode/skills/`.
- **Verify and Iterate**: Test the skill with typical prompts and refine its instructions based on performance.
- **Optimize Triggering**: Improve the skill's description in the YAML frontmatter to ensure it triggers correctly.

## Structure of a Skill

All skills must be located in `.opencode/skills/<skill-name>/` and follow this structure:

```
.opencode/skills/<skill-name>/
├── SKILL.md (required)
│   ├── YAML frontmatter (name, description required)
│   └── Markdown instructions
└── references/ (optional, for additional documentation/context)
```

### Frontmatter Format

Every `SKILL.md` must start with a YAML frontmatter block containing:

- `name`: The unique identifier of the skill (matching the directory name).
- `description`: A clear, pushy description explaining when the skill should trigger.

Example:

```yaml
---
name: sample-skill
description: Performs sample operations. Trigger this skill whenever the user asks for samples, demo tasks, or mock data operations.
---
```

## Skill Design Best Practices

1. **Clear Objectives**: Define precisely what the skill does and what outputs it produces.
2. **Imperative Tone**: Use direct, action-oriented instructions ("Do X", "Write Y") rather than explanatory or educational text.
3. **Progressive Disclosure**: Keep `SKILL.md` under 500 lines. Move large reference documentation, schemas, or templates into a `references/` subdirectory and reference them in the main instructions.
4. **No Placeholders**: Provide concrete examples or structures instead of using `TODO` or placeholders.
