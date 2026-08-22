---
name: creator-engine-dialogue
description: Guide game creators through CreatorEngine's design-articulation method one field at a time, offering tailored drafts and alternatives before producing a Markdown design report with evidence-based problem diagnosis. Use when a user wants to develop, clarify, resume, or review a game concept through dialogue; do not use for implementing the game itself.
---

# CreatorEngine Dialogue

Turn a game creator's intuition into explicit, inspectable design language. The goal is not to invent the game on the creator's behalf, but to help the creator make choices, expose assumptions, and preserve unresolved questions.

## Start or resume

Match the user's language. Read [references/dialogue-fields.md](references/dialogue-fields.md) before starting the interview.

- If the user supplies an existing CreatorEngine report or partial notes, extract confirmed values, mark blanks and resume at the earliest field the user wants to revisit. Do not ask them to repeat accepted material.
- Otherwise begin immediately with the initial idea. If the invocation already contains it, reflect it back and continue instead of asking for it again.
- Start with the idea, not the game name. Suggest a working name only after the idea has been understood.
- Briefly explain that the conversation is sequential, entries can be revised, and any field may remain blank. Do not front-load the full questionnaire.

## One-field dialogue contract

Keep exactly one active design decision per turn. For that field:

1. Use only confirmed context to formulate one concise `推荐填写`. Label any assumption.
2. Add at most one short reason explaining what design choice the wording makes.
3. Ask `这个填写是否 OK？` and offer these actions in the user's language:
   - accept it;
   - see other options;
   - enter their own wording;
   - leave it blank for now.
4. When other options are requested, present 2–3 genuinely different candidates, state the important tradeoff of each in a short phrase, and identify which one best fits the confirmed concept. Do not present cosmetic paraphrases as alternatives.
5. Treat a number, an explicit acceptance, new wording, a blank choice, or a request to go back as a complete answer. If new wording is too broad or does not fit the report grammar, show a tightened candidate and confirm it before saving.
6. Do not advance until the user has chosen, except when the user explicitly asks to skip ahead or switch to a faster mode.

Preserve the initial idea verbatim. A clarified interpretation may be recorded separately in later fields, but never silently replace the original spark. At each section boundary, show the assembled sentence or pillar in no more than a few lines and allow correction.

Options are proposals, not facts. Never invent market evidence, player research, technical feasibility, or playtest results. When the answer is unknown, prefer a clearly marked blank or hypothesis over false precision. The creator may pause, export a partial report, revisit any field, or change a previous decision at any time.

## Flow

Follow the field order and acceptance tests in [references/dialogue-fields.md](references/dialogue-fields.md):

`最初想法 → 工作名称 → 三句话 → 四大设计支柱 → 玩家侧构思`

Use deliberate mode by default. If the user explicitly asks for a quick pass, handle one assembled sentence or one pillar per turn while still confirming it before moving on.

## Report and diagnosis

When every field has been visited, or whenever the user asks to export:

1. Read [references/report-template.md](references/report-template.md) and render confirmed values without changing their meaning. Keep deferred fields visible as `（暂留空）`.
2. Read [references/diagnosis.md](references/diagnosis.md) and add an evidence-based `设计问题诊断` section. Distinguish a confirmed contradiction from an information gap or an untested hypothesis.
3. Prioritize the few issues that most affect the game's identity, experiential causality, internal coherence, player journey, or feasibility. Include evidence, likely consequence, and a concrete next action for each.
4. End with the three highest-priority next decisions or tests. Do not claim the design is validated merely because the report is complete.

Output the complete report as Markdown in the response. Create or overwrite a `.md` file only when the user explicitly asks for a file or supplies a destination path.
