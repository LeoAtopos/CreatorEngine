# CreatorEngine

[中文说明](README.zh-CN.md)

Most game engines are *production engines*. CreatorEngine is a *creation engine*: a tool that helps game creators think through a concept. Starting from the earliest idea, it uses structured fill-in-the-blank prompts to help creators articulate and organize a game concept.

What cannot be explained clearly is often difficult to make clearly. The foundation of CreatorEngine is **design articulation**—turning design thinking into language. It encourages creators to think ahead, reducing overlooked decisions and wasted time caused by an underdeveloped concept.

What cannot be explained clearly is also difficult to make consistently. A game made by many people requires deep alignment of thought. Spending substantial time on explicit, in-depth communication early in development is therefore essential.

## 1. Use it now

- Web app: [Open CreatorEngine](https://leoatopos.github.io/CreatorEngine/)
- Windows portable app: [Download CreatorEngine.exe](https://github.com/LeoAtopos/CreatorEngine/releases/latest/download/CreatorEngine.exe)
- Windows x64 installer: [Download CreatorEngine_x64-setup.exe](https://github.com/LeoAtopos/CreatorEngine/releases/latest/download/CreatorEngine_x64-setup.exe)
- GitHub: [CreatorEngine GitHub](https://github.com/LeoAtopos/CreatorEngine)

## 2. Fill it out through a Codex skill

This repository includes the optional [`creator-engine-dialogue`](.agents/skills/creator-engine-dialogue/SKILL.md) skill. Starting with the initial idea, it discusses one design decision at a time, proposes wording and alternative directions from confirmed context, and ultimately produces a Markdown report with a diagnosis of the design problems it reveals.

The CreatorEngine web and desktop apps remain local, AI-free software. This skill is a separate conversational option that runs only when a creator chooses to use Codex.

### Install the skill

Use the ChatGPT desktop app with Codex, Codex CLI, or the Codex IDE extension, all of which support standalone skills. See the [official Codex skill documentation](https://learn.chatgpt.com/docs/build-skills) for discovery and invocation details.

**Option A: install it from GitHub as a personal skill (recommended)**

Invoke `$skill-installer` in Codex and send:

```text
Install the creator-engine-dialogue skill from this GitHub path:
https://github.com/LeoAtopos/CreatorEngine/tree/main/.agents/skills/creator-engine-dialogue
```

A personal skill remains available in other projects. If it does not appear immediately after installation, restart Codex.

**Option B: use it as a repository skill**

```bash
git clone https://github.com/LeoAtopos/CreatorEngine.git
cd CreatorEngine
```

Open the repository root in Codex. Codex automatically discovers `.agents/skills/creator-engine-dialogue`; no copy to a personal directory is required.

### Usage steps

1. Start a new task with `$creator-engine-dialogue` and include your initial idea, for example:

   ```text
   $creator-engine-dialogue

   I want to make a game about recovering other people's memories from a sunken city.
   Start from the initial idea and help me complete the design report one item at a time.
   ```

2. The skill handles one field per turn and offers one recommended entry. Accept it, request other options, enter your own wording, leave the field blank, or go back.
3. Work through the working title, three sentences, four design pillars, and player-side concept. You can revise earlier decisions at every section boundary.
4. To move faster, ask for “quick mode.” The skill will handle one complete sentence or pillar per turn, while still asking for confirmation.
5. Ask for a partial report at any time. A complete report lists confirmed content, deferred fields, untested hypotheses, and the design contradictions, information gaps, and highest-priority next steps revealed by the current report.
6. To save a file, explicitly provide a filename, such as “Save the complete report as `creator-engine-report.md`.” Otherwise, the report is returned only in the conversation.

To resume from an existing CreatorEngine Markdown report, attach it and enter:

```text
$creator-engine-dialogue
Read this report and continue from the first incomplete field. Do not repeat confirmed content.
```

## 3. Practical uses

1. Before production, clarify the creative direction and identify missing considerations.
2. Before production, compare candidate concepts and decide which projects are worth pursuing.
3. During production, keep the document current so that the team maintains a shared and clear understanding.
4. After production, review the design again, adjust it in response to feedback, and locate gaps or problems.
5. Study other games and strengthen the ability to think about game design as a whole.
6. Summarize games you have played, clarify the experience they create, and better understand their creators.

## 4. In-depth guide

The following sections explain the purpose of each step and the questions that can be derived from it.

### 1. Initial Idea

This section records the idea from which the game began. Writing down that original intention honestly supports several kinds of design thinking:

1. Clarify the creative motivation and remember how strongly you felt about it at the time.
2. Preserve the original intention so that you can later check whether it has been forgotten or the project has drifted away from it. The original intention may change, but that moment of change matters and should be recorded.
3. Understand where later design decisions began: whether they extend, realize, reinforce, or conflict with the initial idea.

### 2. Three Sentences

Following the 30-second elevator principle, a creator should be able to explain the game in 30 seconds. That is roughly enough time for three sentences.

The three sentences answer three questions: What is the game? What experience does it offer? How can that experience be verified?

In reverse, these sentences also serve as tools for developing the concept itself.

```
The player is ___identity___, repeatedly ___core action___ in order to ___goal___; but ___constraint or reversal___.
```

This is the most concise sentence for explaining what the game is.

**Identity**, or role, is the subject position that the player inhabits.

- An identity that is both familiar and fresh can create anticipation and quickly bring the player into the Fantasy.
- Identities such as assassin, hunter, or craftsperson can quickly establish goals and expected capabilities, helping the player understand the mechanics.
- A dull or emotionally empty identity can make the player lose interest or find the game strange and difficult to understand.

**Core action** is the mechanical center of the game. The action expressed by a verb is the foundation of interactive design.

- A game needs a highly repeatable core action to sustain meaningful playtime.
- The core action fundamentally defines the game's genre and character. Mechanics should develop around it and should not normally conflict with it.
- An action without a core, or a core that is not an action, can become a major obstacle to establishing gameplay.

**Goal** describes the player's motivation at the narrative and meaning-making level.

- A strong goal is desirable, creates anticipation, and can generate intermediate goals.
- A clear goal keeps players engaged instead of losing them to confusion.
- A missing or unappealing goal breaks the shared focus between creator and player, weakening understanding and resonance.

**Constraint or reversal** identifies the obstacle or problem—the source of interest in the premise.

- It reveals the game's distinctive character and flavor.
- A strong constraint or reversal usually conflicts with the identity or core action and creates tension with the goal.
- Without a clear constraint or reversal, the game is likely to feel flat.

```
Provide ___core feeling___ for ___target players___, primarily through ___key dynamics___ rather than relying on ___conventional approach___.
```

This sentence focuses on the game experience.

**Target players** are the people for whom the game is being created. A concrete sense of this audience is essential when making design tradeoffs.

- No game is suitable for everyone. A good game is always good for a particular group of people.
- People outside the target audience may still enjoy the game, but the creator must first identify and serve the target players before considering everyone else.
- Target players guide every aspect of the design, including the barrier to entry and the selection of mechanics.

**Core feeling** summarizes the experiential value of the game from the target player's perspective.

- Feelings are genuinely difficult to describe, so recognizing them takes references and practice.
- Relaxation, tension, profundity, light stimulation, exploration, challenge—some words can always be found. The description will continue to evolve and become clearer during concept development and production.
- Secondary feelings can add useful variation, but they must not undermine the core feeling.

**Key dynamics** are the events and narratives that can emerge during play—the process that produces the core feeling.

- Describing the key dynamics explains where the core feeling comes from and allows the creator to judge the relationship intuitively.
- The most important question is whether player behavior and feedback during play actually support that feeling.

**Conventional approach** means the methods that other games commonly use to produce the same core feeling, from which this game needs to distinguish itself.

- This prompts the creator to study other games pursuing a similar direction. If the field cannot be completed, the creator may not understand the genre deeply enough and may be unknowingly repeating work that others have already done.
- Understanding conventional approaches is also the basis for innovation.
- They clarify which solutions later design work may need to avoid.

```
If players ___mechanic they perform___, they will ___resulting behavior or strategy___, leading them to feel ___target experience___; the observable evidence will be ___signal___.
```

This sentence tests how the target experience will be achieved. Its theoretical foundation is the Mechanics–Dynamics–Aesthetics (MDA) model.

The **target experience** is the center of the sentence and should be stated first.

- It restates and confirms the “what experience” described in the previous sentence.
- It corresponds to A in MDA: aesthetics in the broad sense.
- It does not describe every experience in the game, only the most important one.

The **mechanic players perform** is the condition they observe and the action they take to reach the target experience.

- It is not a general description of the game's mechanics or a list of every mechanic. It is the mechanic most directly connected to the target experience.
- The text should describe the process of performing it—in other words, how the player interacts with it.
- It corresponds to M in MDA and is usually a core or signature mechanic.

The **resulting behavior or strategy** is the dynamic response that emerges after the player acts within the mechanic.

- It describes D in MDA: dynamics.
- It explains the patterns of action or strategic ideas that arise from the player's interaction with the mechanic.
- It considers behavior from the player's point of view.

The **observable signal** is a testable hypothesis: an expected player behavior and an interpretation of it.

- Predicting specific behaviors and expressions provides evidence for how the target experience will emerge through MDA.
- It prepares the creator to observe playtests and feedback without losing sight of what matters.
- Without an observable signal, the creator is at serious risk of mistaking personal enthusiasm for evidence that the design works.

### 3. Four Design Pillars

The four pillars—narrative, mechanics, aesthetics, and technology—come from *The Art of Game Design: A Book of Lenses*.

A game can be analyzed from countless perspectives and cross-sections. These four pillars provide a useful structure that represents the design relatively comprehensively without excessive overlap.

Each pillar uses a **type plus stylistic character** structure. This mirrors how people understand things: first, what something broadly is; then, what makes its details distinctive. We rarely create something entirely from zero to one. We develop and innovate on existing foundations. This descriptive structure helps creators understand both the foundation and individuality of their work.

- Completing the four pillars reveals strengths, weaknesses, and areas that have not received enough thought.
- An unclear foundation or type suggests insufficient research and references, increasing the chance of repeating mistakes already made by others.
- An unclear stylistic character suggests a weak experience that cannot become a reason to buy or play the game.
- A game experience is indeed a whole, but concrete design work and problem analysis inevitably require decomposition.
- A game may be weak in one area, but no area can be entirely absent, and at least one area needs to be particularly strong.

After describing each pillar, the engine asks for its **guidance, support, and requirements for the other three**. This prevents the framework from becoming disconnected.

- Internal contradiction is a common design problem, especially contradiction among the four pillars.
- Each pillar may appear reasonable on its own, yet weak relationships or conflicts among them can produce disastrous results.
- Asking each pillar to guide, support, or constrain the others forces consideration of their organic relationships. This makes the game more coherent and harmonious, and it also provides criteria for choosing among design alternatives.
- The richer the relationships among the four pillars, the more unified the game experience and the less fragmented it feels.

When game development is divided among collaborators, the articulated descriptions of the four pillars become shared principles that guide different disciplines toward the same work.

### 4. Player-Side Concept

One of the things game creators overlook most often is thinking from the player's perspective, which can leave the project trapped in creator-centric self-indulgence.

To realize an experience for the player, we must imagine how the player will actually encounter the game.

The three player-side sentences describe an idealized journey from discovering the game, to beginning play, to receiving the intended experience.

Every player will experience the game differently, but the designer must at least imagine a standard journey. This makes it possible to test design expectations and respond to feedback from actual play.

```
After seeing the title and key art, players will think this is a ___genre___ game about ___theme___. They will connect and compare it with ___related games___, forming an expectation of ___expected experience___.
```

Creators often overlook the experience before the player enters the game, even though it strongly affects how many people the work can reach.

**Theme**, or subject matter, classifies what the content is about.

- How mainstream or niche the theme is directly affects the size of the audience. The creator should adjust audience expectations accordingly.
- Creators should ideally choose subject matter they know well and aim for a depth of understanding within the top 5%. If they are not there yet, they need to study it further.
- A necessary question is whether the title and key art communicate the theme clearly. If not, some target players will inevitably be lost, while unsuitable players may be attracted instead.

**Genre** classifies the game primarily by its mechanics.

- Like theme, genre helps players establish expectations for the experience that will follow.

**Related games** provide an important foundation for those expectations.

- Many players, especially early adopters who first encounter the work, are likely to be experienced players. When they see the title and key art, they will make associations and compare the game with other relevant works.
- Those games become the starting point from which expectations are formed.
- If players cannot tell which other games the work relates to, they will struggle to form clear expectations and may lack motivation to try it.
- If the creator does not know which games players will associate with the work, player research is necessary. Otherwise, the creator cannot accurately understand expectations and may unknowingly produce later designs that violate them.

**Expected experience** is the expectation formed before the player enters the game.

- The creator's target experience cannot simply be treated as the player's expected experience.
- Expectations are determined by the information available before play. A deliberate gap between expectation and reality can sometimes be useful, but it must be understood and controlled.
- In most cases, it is better to establish expectations deliberately so players anticipate the experience the creator intends to deliver.

```
Within the first 10 minutes, players ___will/will not___ receive the expected experience; they ___will also/will instead___ receive ___distinctive experience___. This will keep them playing and give them the goal or expectation of ___next motivation___.
```

This sentence examines the first 10 minutes from the player's point of view.

The game's first impression is extremely important. During this period, players make a critical decision about whether to continue.

**Will … and will also … / will not … but will instead …** means either fulfilling the pre-play expectation and adding a distinctive experience, or challenging that expectation and providing a new experience strong enough to overturn it.

- Not every game's fate is decided in the first 10 minutes, but most games lack dominant marketing campaigns or major influencer endorsements. Player patience is limited, so creators must consider how those opening minutes will impress them.
- The distinctive experience should appear early. Not every unique quality needs to be compressed into 10 minutes, but players should encounter enough of it to avoid boredom.

**Goal or expectation** means the motivation to continue after the first 10 minutes.

- Establishing a goal and creating motivation to play are primary tasks of the opening experience.
- Missing expectations and unclear goals are important causes of player drop-off.
- This section reveals problems in early guidance, narrative, and mechanic design.

```
The mid-to-late game experience changes through the arrival of ___mechanic/content___, ultimately giving players the final experience of ___game experience___ when the game ends.
```

This sentence describes how players feel after substantially completing the game. That feeling ultimately shapes their evaluation, influencing word of mouth and how the game spreads.

**Mechanic/content** refers to changes and additions introduced during the middle and later stages of the game.

- Without changes in mechanics and content, the mid-to-late game becomes repetitive and dull.
- A throughline of change in mechanics or content is an important way to increase the game's value.
- Emergence, reversals, and long-form objectives are all directions worth considering.

**Game experience** here means a final experience that becomes complete only near the end and remains part of the creator's overall target experience.

- A game should not only satisfy expectations; much of its added value comes from exceeding them.
- The final experience determines the game's ceiling.
- It is often connected to a larger narrative or an elevation of meaning.
- A game can exist without such a final experience, but its perceived value may be lower.

## 5. Interface and data

CreatorEngine detects the operating system language. It uses Chinese when the language begins with `zh` and English otherwise. A language button in the top navigation lets users switch at any time, and the preference is saved on the current device.

Project data is stored in browser `localStorage` on the current device. No sign-in is required, and no project content is sent to an external service. Downloaded Markdown files can be loaded again to continue editing.

## 6. Run locally

```bash
npm install
npm run dev -- --port 3100
```

Open `http://localhost:3100/`.

Production mode:

```bash
npm run build
npm run start -- --port 3100
```

## 7. Check

```bash
npm run lint
npm test
```

## 8. Pages and desktop builds

Both distribution targets reuse the interface and data logic in `app/`. Install the desktop frontend dependencies before the first build:

```bash
npm ci
npm ci --prefix fortauri
```

Generate the GitHub Pages static files:

```bash
npm run build:pages
```

The static output is written to `forpages/` and is published by GitHub Actions after it is pushed to `main`.

On Windows, generate the Tauri portable executable and NSIS installer with:

```bash
npm run build:tauri
```

The resulting files are written under `fortauri/src-tauri/target/release/` and its `bundle/nsis/` directory.
