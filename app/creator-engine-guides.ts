import type { Language, TetradKey } from "./creator-engine-model";

export type GuideTarget =
  | { step: "welcome" | "idea" | "summary" }
  | { step: "sentences"; tab: "gameplay" | "experience" | "hypothesis" }
  | { step: "tetrad"; pillar: TetradKey }
  | { step: "player"; tab: "firstLook" | "firstTen" | "arc" };

export type GuideBlock = {
  title?: string;
  paragraphs?: string[];
  bullets?: string[];
  ordered?: boolean;
  template?: string;
};

export type GuideDocument = {
  title: string;
  source: string;
  intro?: string[];
  blocks: GuideBlock[];
};

const zh = {
  source: "摘自《创作引擎》",
  welcome: {
    title: "为什么使用创作引擎？",
    intro: [
      "现在的游戏引擎都是“制作引擎”，而这是一个辅助游戏创作者构思的“创作引擎”。它从最初的想法出发，通过结构化的文本填空，帮助创作者梳理游戏构思。",
      "说不清楚的，往往也做不明白。创作引擎的基础理论是言语化设计。它促使创作者提前思考，以免因构思不充分而遗漏设计、浪费时间。",
      "说不清楚的，往往也做不统一。若游戏由多人完成，就需要进行大量、深入的思想同步。因此，前期花费大量时间进行深入的言语化沟通，是绝对必要的。",
    ],
    blocks: [],
  },
  idea: {
    title: "如何填写最初想法？",
    intro: ["这里记录构思游戏时的最初想法。诚实地写下初心，可用于以下设计思考："],
    blocks: [{
      ordered: true,
      bullets: [
        "明确创作动力，感知当时情绪的强烈程度。",
        "记录初心，用于检查之后是否偏离或遗忘。初心并非不能改变，但如果发生变化，这个时刻就很关键，需要留下记录作为提醒。",
        "用于理解之后各项设计的思路起点：是补充、落地或加强，还是存在冲突。",
      ],
    }],
  },
  gameplay: {
    title: "三句话之一：什么游戏",
    intro: [
      "根据“30 秒电梯原则”，创作者应具备在 30 秒内介绍清楚游戏的能力。30 秒应该只够说三句话。",
      "第一句话回答“这是什么游戏”，是对游戏最简练的说明。",
    ],
    blocks: [
      { template: "玩家作为___身份___，反复___核心动作___，以___目标___；但___约束或反转___。" },
      { title: "身份", paragraphs: ["身份，或者说角色，是玩家可以代入的主体视角。"], bullets: ["一个玩家熟悉而又新鲜的身份，可以让玩家产生足够的期待，快速进入 Fantasy。", "杀手、猎人、工匠等身份，还可以快速建立游戏目标和能力认知，让玩家迅速理解游戏机制。", "无聊、无感的身份会让玩家失去兴趣，感到怪异或难以理解。"] },
      { title: "核心动作", paragraphs: ["核心动作是游戏的机制核心。动词所表达的动作，是游戏互动设计的根本。"], bullets: ["游戏只有具备可高度重复的核心动作，才能为玩家提供足够的游戏时长。", "核心动作从根本上定义了游戏的类型和特色。游戏机制应围绕核心动作展开，通常不应与之冲突。", "动作没有核心，或核心不是动作，都会成为妨碍游戏性建立的重大问题。"] },
      { title: "目标", paragraphs: ["目标阐述游戏在叙事和意义层面的玩家动机。"], bullets: ["好的目标让人向往、充满期待，并能延伸出更多中间目标。", "明确的目标让玩家更投入，不会因迷茫而流失。", "缺少目标，或目标缺乏吸引力，会切断创作者与玩家之间的共同关注点，进而失去理解和共鸣。"] },
      { title: "约束或反转", paragraphs: ["约束或反转点出游戏中的障碍与难题，也就是问题的有趣之处。"], bullets: ["约束或反转能够展现游戏的与众不同和风格特点。", "好的约束或反转通常需要与身份或核心动作产生冲突，与目标形成矛盾。", "缺少明确的约束或反转，会使游戏平淡无味。"] },
    ],
  },
  experience: {
    title: "三句话之二：什么体验",
    intro: ["第二句话重点表达游戏体验。"],
    blocks: [
      { template: "为___目标玩家___提供___核心感受___，主要通过___关键动态___来实现，而不是依赖___常规方案___。" },
      { title: "目标玩家", paragraphs: ["目标玩家是游戏创作的对象。明确对象感，对于创作中的取舍非常重要。"], bullets: ["没有适合所有人的游戏。好游戏永远是相对于某一类人而言的。", "目标玩家之外的人当然也可能喜欢你的游戏，但创作者必须先明确并服务好目标玩家，再考虑其他人。", "目标玩家会指导游戏的一切设计，包括游玩门槛、机制取舍等。"] },
      { title: "核心感受", paragraphs: ["核心感受是从目标玩家的角度总结游戏所带来的感受价值。"], bullets: ["感受确实难以描述，因此需要大量参考和训练才能把握。", "无论是放松、紧张、深刻、轻度刺激、探索，还是挑战体验，总能挤出一些词来描述。这个感受也会在游戏构思和开发过程中逐渐更新、明晰。", "非核心感受也可以成为有益的调剂，但不能破坏核心感受。"] },
      { title: "关键动态", paragraphs: ["关键动态是游戏中能够发生的事件及其叙事，也是生成核心感受的过程。"], bullets: ["需要描述关键动态，以说明核心感受的来源，并感性地判断二者之间的关联。", "游戏中发生的玩家行为和反馈是否支持核心感受，是这里最重要的问题。"] },
      { title: "常规方案", paragraphs: ["常规方案是指其他游戏在实现相同核心感受时通常采用的办法，本作需要与之形成区别。"], bullets: ["这是在提醒创作者研究同方向的其他游戏。写不出来，说明对该类型的研究不够深入，可能仍在重复造轮子、重复他人的做法。", "了解常规方案，也是做出创新的基点。", "常规方案还可以指导后续设计，明确需要避免的做法。"] },
    ],
  },
  hypothesis: {
    title: "三句话之三：如何验证",
    intro: ["这句话用于验证游戏的目标体验如何达成。其理论基础是“机制—动态—美学”的 MDA 模型。"],
    blocks: [
      { template: "如果让玩家___执行的机制___，那么他们会___产生的行为或策略___，进而感到___目标体验___；证据是___可观察信号___。" },
      { title: "目标体验", paragraphs: ["目标体验是这句话的核心，需要先说明。"], bullets: ["目标体验就是上一句中“什么体验”的概括，也是对它的重复确认。", "目标体验对应 MDA 中的 A，即广义的美感。", "目标体验并非游戏的全部体验，而是游戏最核心的体验。"] },
      { title: "执行的机制", paragraphs: ["执行的机制，是为了达成目标体验，需要玩家观察的条件和采取的行为。"], bullets: ["这里的机制不是对机制的笼统概括，也不是所有机制，而是与目标体验关系最紧密的机制。", "文本需要描述玩家执行这一机制的过程，也就是玩家与机制互动的过程。", "执行的机制对应 MDA 中的 M，即机制部分，通常是游戏的核心机制或特色机制。"] },
      { title: "产生的行为或策略", paragraphs: ["产生的行为或策略，是玩家执行某些机制行为后产生的动态反应。"], bullets: ["这里描述的是 MDA 中的 D，即动态部分。", "它说明玩家在机制中行动后，会形成怎样的行动模式或策略想法。", "这是从玩家视角出发考虑的行为。"] },
      { title: "可观察信号", paragraphs: ["可观察信号是一种验证性、假设性的描述，也是对玩家行为的预期与解读。"], bullets: ["通过预测具体的行为与表征，为目标体验如何通过 MDA 达成提供证据。", "这会促使创作者提前做好观察准备，避免在观察玩家试玩和反馈时迷失方向。", "缺少可观察信号的构思，极有可能让创作者陷入自我感动之中。"] },
    ],
  },
  tetrad: {
    intro: [
      "叙事、机制、美学、技术这四大设计支柱，来自《全景探秘游戏设计艺术》一书。",
      "游戏可以从无数角度或切面进行分析，但这四大设计支柱能够较为全面且互不重叠地展现游戏设计概念，是一种良好的结构。",
      "四个支柱都采用了“类型化加风格特色”的描述结构。这符合人们认知事物的过程：先了解它大致是什么，再理解它的独特细节。我们总是在已有设计的基础上发展与创新。这样的描述结构，有利于创作者理解自己的地基和个性。",
    ],
    blocks: [
      { title: "填写基础框架与风格特点", bullets: ["填写四大设计支柱，可以帮助创作者了解自己的强项、弱项及考虑不足之处。", "缺少明晰的基础框架（类型化），说明这方面的研究和参考还不够深入，可能要重踩前人踩过的许多坑。", "缺少明晰的风格特点，说明这方面的体验较弱，无法成为购买和游玩的理由。", "游戏体验的确是一个整体，但在进行具体设计和分析具体问题时，必然需要拆解。", "游戏可以在某一方面不强，但不能完全没有，而且需要在某一方面足够强。"] },
      { title: "连接其他三根支柱", paragraphs: ["描述完一根支柱后，需要补充它对其他三项的指导、支持和要求。这是为了避免游戏框架过于松散。"], bullets: ["游戏中常见的设计问题就是内在矛盾，尤其是四大设计支柱之间的矛盾。", "四大支柱单独看都没有问题，但如果彼此关联不大或存在矛盾，就会造成灾难性的结果。", "让单个设计支柱对其他支柱提出指导、支持或要求，是在促使创作者思考四者之间的有机关系。这不仅能让游戏更加完整、和谐，也是筛选设计的重要参考标准。", "四大设计支柱之间的关联越丰富，游戏体验就越完整，割裂感也越少。"] },
      { paragraphs: ["在游戏协作分工中，四大设计支柱的言语化描述，会成为指导不同工种协同工作的思想原则。"] },
    ],
  },
  firstLook: {
    title: "玩家侧之一：进入游戏前",
    intro: ["玩家侧的三句话，概括了玩家从接触游戏、开始游玩到获得游戏体验的全过程。虽然每个玩家的体验都不相同，但设计者至少需要想象出一个标准过程。"],
    blocks: [
      { template: "玩家看到游戏名称、介绍图，会认为这是一个关于___主题___的___类型___游戏，会与___关联游戏___联系并进行比较，进而形成___体验预期___。" },
      { paragraphs: ["玩家进入游戏前的体验往往被创作者忽略，但这会严重影响游戏作品能够触达多少玩家。"] },
      { title: "主题", paragraphs: ["主题，或者说题材，是侧重于“内容关于什么”的分类。"], bullets: ["题材的大众或小众程度，会直接影响玩家受众的规模。创作者需要根据题材调整对游戏受众的预期。", "创作者最好选择自己熟悉的题材，对该题材的理解深度应尽可能达到前 5%。如果尚未做到，就需要在这方面补课。", "玩家看到游戏名称和介绍图后，能否明确认知其题材？如果不能，就必然会流失一部分目标玩家，也可能吸引一些并不合适的玩家。"] },
      { title: "类型", paragraphs: ["类型是侧重于游戏机制的分类。它的作用与主题类似，能够帮助玩家建立后续的体验预期。"] },
      { title: "关联游戏", paragraphs: ["关联游戏是形成预期的重要基础。"], bullets: ["最初接触作品的尝鲜玩家，很可能是深度玩家。他们看到游戏名称和介绍图时，会产生联想，并与其他相关游戏进行比较。", "这些关联游戏会成为他们形成游戏期待的起点。", "如果玩家不清楚作品与哪些游戏相关，就很难形成明确预期，也会缺少体验动力。", "如果创作者不清楚会有哪些关联游戏，就需要进行玩家调查，否则将无法准确感知玩家的预期。"] },
      { title: "体验预期", paragraphs: ["体验预期是玩家进入游戏前形成的预期。"], bullets: ["不能把创作者的目标体验直接当作玩家侧的体验预期。", "体验预期由进入游戏前获得的信息决定。有时可以故意制造体验预期与实际体验的差异，但这种差异必须清晰、可控。", "最好做好预期建设，让玩家形成创作者希望他们拥有的体验预期。"] },
    ],
  },
  firstTen: {
    title: "玩家侧之二：前 10 分钟",
    intro: ["这一句从玩家侧构思进入游戏后前 10 分钟的体验。游戏的第一印象十分重要，玩家会在这个时候作出是否继续游戏的重要判断。"],
    blocks: [
      { template: "玩家在体验游戏 10 分钟内___会/不会___获得体验预期，___还能/而是___获得___独特体验___，玩家因此不会离开游戏，并产生___目标/期待___。" },
      { title: "会……还能…… / 不会……而是……", paragraphs: ["满足游戏前的预期后，再提供更多独特体验；或挑战游戏前的预期后，提供足以扭转预期的新体验。"], bullets: ["大部分游戏没有强势的市场宣传和大 V 背书。玩家的耐心有限，因此必须考虑如何在前 10 分钟惊艳玩家。", "独特体验需要尽早呈现。不是所有独特体验都要挤在前 10 分钟，但至少要让玩家感受到独特之处，而不觉得无聊。"] },
      { title: "目标 / 期待", paragraphs: ["它指玩家在前 10 分钟后获得的、继续游戏的动力。"], bullets: ["建立目标预期，形成游玩动力，是游戏早期的首要任务。", "缺少期待、目标不明，是玩家流失的重要原因。", "这部分将反映游戏前期的引导、叙事和机制设计中存在的问题。"] },
    ],
  },
  arc: {
    title: "玩家侧之三：中后期与终极体验",
    intro: ["这一句描述玩家基本完成游戏后的感受。它将最终决定玩家对游戏的评价，进而影响游戏的口碑和传播效果。"],
    blocks: [
      { template: "玩家中后期体验的变化来自___机制/内容___的出现，并最终在游戏结束时获得___游戏体验___这一终极体验。" },
      { title: "机制 / 内容", paragraphs: ["机制或内容是指游戏中后期出现的变化与新增内容。"], bullets: ["缺少中后期机制和内容的变化，会使游戏变得单调、无聊。", "机制或内容上的某种主线变化，是提升游戏价值的重要手段。", "涌现、反转、长任务，都是可以考虑的方向。"] },
      { title: "游戏体验", paragraphs: ["在这里指一种到后期才趋于完整的终极体验，也是创作者目标体验的一部分。"], bullets: ["游戏不仅要满足预期，其提升价值还体现在超出预期的部分。", "终极体验决定了游戏的上限。", "终极体验通常与某种宏大叙事或价值升华关联在一起。", "缺少终极体验并非不可以，只是游戏的价值感会相对较低。"] },
    ],
  },
  summary: {
    title: "如何使用设计摘要？",
    intro: ["设计摘要不是终点。保持更新，并在不同阶段重新阅读，它可以承担以下用途："],
    blocks: [{ ordered: true, bullets: ["制作游戏前，理清创作思路，查漏补缺。", "制作游戏前，用于比较、筛选可做的项目。", "制作游戏时，持续更新，保持团队认知同步和理解清晰。", "制作游戏后，再次检查并根据反馈调整，找到差异和问题所在。", "用于研究其他游戏，锻炼整体设计构思能力。", "概括玩过的游戏，理清游玩体验，达成与创作者的共鸣。"] }],
  },
};

const en: typeof zh = {
  source: "Adapted from “CreatorEngine”",
  welcome: {
    title: "Why use a creation engine?",
    intro: [
      "Most game engines are production engines. CreatorEngine is a creation engine: a tool that helps game creators think through a concept. Starting from the earliest idea, it uses structured prompts to help creators articulate and organize a game concept.",
      "What cannot be explained clearly is often difficult to make clearly. CreatorEngine is founded on design articulation—turning design thinking into language. It encourages creators to think ahead, reducing overlooked decisions and wasted time caused by an underdeveloped concept.",
      "What cannot be explained clearly is also difficult to make consistently. A game made by many people requires deep alignment of thought, so explicit and in-depth communication early in development is essential.",
    ],
    blocks: [],
  },
  idea: {
    title: "How should I write the initial idea?",
    intro: ["Record the idea from which the game began. Writing down that original intention honestly supports several kinds of design thinking:"],
    blocks: [{ ordered: true, bullets: ["Clarify the creative motivation and remember how strongly you felt about it at the time.", "Preserve the original intention so you can later check whether it has been forgotten or the project has drifted. It may change, but that moment of change matters and should be recorded.", "Understand where later design decisions began: whether they extend, realize, reinforce, or conflict with the initial idea."] }],
  },
  gameplay: {
    title: "Sentence one: What game?",
    intro: ["Following the 30-second elevator principle, a creator should be able to explain the game in 30 seconds—roughly enough time for three sentences.", "The first sentence answers “What is the game?” in the most concise possible form."],
    blocks: [
      { template: "The player is ___identity___, repeatedly ___core action___ in order to ___goal___; but ___constraint or reversal___." },
      { title: "Identity", paragraphs: ["Identity, or role, is the subject position the player inhabits."], bullets: ["An identity that is both familiar and fresh creates anticipation and quickly brings the player into the Fantasy.", "Identities such as assassin, hunter, or craftsperson quickly establish goals and expected capabilities.", "A dull or emotionally empty identity can make the game feel strange and difficult to understand."] },
      { title: "Core action", paragraphs: ["The core action is the mechanical center of the game. The action expressed by a verb is the foundation of interactive design."], bullets: ["A highly repeatable core action sustains meaningful playtime.", "It fundamentally defines the game's genre and character. Mechanics should develop around it and should not normally conflict with it.", "An action without a core, or a core that is not an action, can prevent gameplay from taking shape."] },
      { title: "Goal", paragraphs: ["The goal describes the player's motivation at the narrative and meaning-making level."], bullets: ["A strong goal is desirable, creates anticipation, and can generate intermediate goals.", "A clear goal keeps players engaged instead of losing them to confusion.", "A missing or unappealing goal breaks the shared focus between creator and player."] },
      { title: "Constraint or reversal", paragraphs: ["This identifies the obstacle or problem—the source of interest in the premise."], bullets: ["It reveals the game's distinctive character and flavor.", "A strong constraint or reversal usually conflicts with the identity or core action and creates tension with the goal.", "Without one, the game is likely to feel flat."] },
    ],
  },
  experience: {
    title: "Sentence two: What experience?",
    intro: ["The second sentence focuses on the game experience."],
    blocks: [
      { template: "Provide ___core feeling___ for ___target players___, primarily through ___key dynamics___ rather than relying on ___conventional approach___." },
      { title: "Target players", paragraphs: ["These are the people for whom the game is being created. A concrete sense of this audience is essential when making tradeoffs."], bullets: ["No game is suitable for everyone. A good game is always good for a particular group.", "People outside the target audience may still enjoy it, but the creator must first identify and serve the target players.", "Target players guide every aspect of the design, including the barrier to entry and mechanic selection."] },
      { title: "Core feeling", paragraphs: ["The core feeling summarizes experiential value from the target player's perspective."], bullets: ["Feelings are difficult to describe, so recognizing them takes references and practice.", "Relaxation, tension, profundity, stimulation, exploration, challenge—some words can always be found, and the description will become clearer during development.", "Secondary feelings can add useful variation but must not undermine the core feeling."] },
      { title: "Key dynamics", paragraphs: ["Key dynamics are the events and narratives that emerge during play—the process that produces the core feeling."], bullets: ["Describe them to explain where the feeling comes from and judge the relationship intuitively.", "The essential question is whether player behavior and feedback actually support the feeling."] },
      { title: "Conventional approach", paragraphs: ["This means methods other games commonly use to produce the same feeling, from which this game needs to distinguish itself."], bullets: ["If this field cannot be completed, the creator may not understand comparable games deeply enough and may be repeating existing work.", "Understanding conventional approaches is the basis for innovation.", "They also clarify which later solutions may need to be avoided."] },
    ],
  },
  hypothesis: {
    title: "Sentence three: How to test it",
    intro: ["This sentence tests how the target experience will be achieved. Its theoretical foundation is the Mechanics–Dynamics–Aesthetics (MDA) model."],
    blocks: [
      { template: "If players ___mechanic they perform___, they will ___resulting behavior or strategy___, leading them to feel ___target experience___; the observable evidence will be ___signal___." },
      { title: "Target experience", paragraphs: ["The target experience is the center of this sentence and should be stated first."], bullets: ["It confirms the experience described in the previous sentence.", "It corresponds to A in MDA: aesthetics in the broad sense.", "It describes the game's most important experience, not every experience."] },
      { title: "Mechanic players perform", paragraphs: ["This is the condition players observe and the action they take to reach the target experience."], bullets: ["It is not every mechanic, but the one most directly connected to the target experience.", "Describe the process of performing it—how the player interacts with it.", "It corresponds to M in MDA and is usually a core or signature mechanic."] },
      { title: "Resulting behavior or strategy", paragraphs: ["This is the dynamic response that emerges after players act within the mechanic."], bullets: ["It describes D in MDA: dynamics.", "It explains the patterns of action or strategic ideas that arise.", "It considers behavior from the player's point of view."] },
      { title: "Observable signal", paragraphs: ["This is a testable hypothesis: an expected player behavior and an interpretation of it."], bullets: ["Predicting specific behavior provides evidence for how the experience will emerge through MDA.", "It prepares the creator to observe playtests without losing sight of what matters.", "Without it, personal enthusiasm can easily be mistaken for evidence that the design works."] },
    ],
  },
  tetrad: {
    intro: ["The four pillars—narrative, mechanics, aesthetics, and technology—come from The Art of Game Design: A Book of Lenses.", "A game can be analyzed from countless perspectives. These four pillars represent the design relatively comprehensively without excessive overlap.", "Each uses a type plus stylistic character structure: first, what something broadly is; then, what makes it distinctive. This helps creators understand both the foundation and individuality of their work."],
    blocks: [
      { title: "Foundation and signature qualities", bullets: ["Completing the pillars reveals strengths, weaknesses, and areas that need more thought.", "An unclear foundation or type suggests insufficient research and increases the chance of repeating old mistakes.", "Unclear stylistic qualities suggest an experience too weak to become a reason to buy or play.", "The experience is a whole, but concrete design work inevitably requires decomposition.", "A game may be weak in one area, but no area can be entirely absent, and at least one needs to be particularly strong."] },
      { title: "Connect the other three pillars", paragraphs: ["After describing one pillar, state its guidance, support, and requirements for the other three. This prevents the framework from becoming disconnected."], bullets: ["Internal contradiction—especially among the four pillars—is a common design problem.", "Each pillar may work alone, yet weak relationships or conflicts among them can be disastrous.", "Making each pillar guide, support, or constrain the others forces consideration of their organic relationships and provides criteria for choosing designs.", "The richer the relationships, the more unified the experience and the less fragmented it feels."] },
      { paragraphs: ["In collaborative development, articulated descriptions of the four pillars become shared principles that guide different disciplines toward the same work."] },
    ],
  },
  firstLook: {
    title: "Player side one: Before play",
    intro: ["The three player-side sentences describe the journey from discovering the game, to beginning play, to receiving the intended experience. Every player differs, but the designer must imagine at least one standard journey."],
    blocks: [
      { template: "After seeing the title and key art, players will think this is a ___genre___ game about ___theme___. They will connect and compare it with ___related games___, forming an expectation of ___expected experience___." },
      { paragraphs: ["Creators often overlook the experience before play, even though it strongly affects how many people the work can reach."] },
      { title: "Theme", paragraphs: ["Theme, or subject matter, classifies what the content is about."], bullets: ["How mainstream or niche the theme is directly affects audience size.", "Creators should ideally choose subject matter they know deeply, or study it further.", "Ask whether the title and key art communicate the theme clearly. If not, target players will be lost and unsuitable players may be attracted."] },
      { title: "Genre", paragraphs: ["Genre classifies the game primarily by its mechanics. Like theme, it helps players establish expectations."] },
      { title: "Related games", paragraphs: ["Related games provide a foundation for expectations."], bullets: ["Early adopters are often experienced players who immediately compare the game with relevant works.", "Those games become the starting point for expectations.", "If the relationship is unclear, players struggle to form expectations and may lack motivation to try it.", "If the creator does not know which games players will associate with it, player research is necessary."] },
      { title: "Expected experience", paragraphs: ["This is the expectation formed before entering the game."], bullets: ["The creator's target experience cannot simply be treated as the player's expectation.", "Expectations come from information available before play. A deliberate gap can work, but it must be understood and controlled.", "Usually, expectations should be established deliberately around the intended experience."] },
    ],
  },
  firstTen: {
    title: "Player side two: The first 10 minutes",
    intro: ["This sentence examines the first 10 minutes from the player's point of view. The first impression is critical because players decide whether to continue."],
    blocks: [
      { template: "Within the first 10 minutes, players ___will/will not___ receive the expected experience; they ___will also/will instead___ receive ___distinctive experience___. This will keep them playing and give them the goal or expectation of ___next motivation___." },
      { title: "Will … also / will not … instead", paragraphs: ["Either fulfill the pre-play expectation and add something distinctive, or challenge it and provide a new experience strong enough to overturn it."], bullets: ["Most games lack dominant marketing or major influencer endorsements. Player patience is limited, so the opening must make an impression.", "The distinctive experience should appear early. It need not all fit into 10 minutes, but enough must appear to prevent boredom."] },
      { title: "Goal or expectation", paragraphs: ["This is the motivation to continue after the first 10 minutes."], bullets: ["Establishing a goal and motivation to play are primary tasks of the opening.", "Missing expectations and unclear goals cause player drop-off.", "This section reveals problems in early guidance, narrative, and mechanic design."] },
    ],
  },
  arc: {
    title: "Player side three: Mid-to-late and final experience",
    intro: ["This sentence describes how players feel after substantially completing the game. That feeling shapes evaluation, word of mouth, and how the game spreads."],
    blocks: [
      { template: "The mid-to-late game experience changes through the arrival of ___mechanic/content___, ultimately giving players the final experience of ___game experience___ when the game ends." },
      { title: "Mechanic / content", paragraphs: ["This means changes and additions introduced during the middle and later stages."], bullets: ["Without them, the game becomes repetitive and dull.", "A throughline of change is an important way to increase value.", "Emergence, reversals, and long-form objectives are all worth considering."] },
      { title: "Game experience", paragraphs: ["Here this means a final experience that becomes complete only near the end and remains part of the overall target experience."], bullets: ["A game should satisfy expectations, but added value often comes from exceeding them.", "The final experience determines the game's ceiling.", "It is often connected to a larger narrative or elevation of meaning.", "A game can exist without it, but its perceived value may be lower."] },
    ],
  },
  summary: {
    title: "How should I use the design summary?",
    intro: ["The summary is not an endpoint. Keep it current and revisit it at different stages so it can serve these purposes:"],
    blocks: [{ ordered: true, bullets: ["Before production, clarify the direction and identify missing considerations.", "Before production, compare concepts and select projects worth pursuing.", "During production, maintain a clear shared understanding across the team.", "After production, review and adjust the design in response to feedback.", "Study other games and strengthen holistic design thinking.", "Summarize games you have played and better understand their creators."] }],
  },
};

const pillarNames = {
  zh: { narrative: "叙事", mechanics: "机制", aesthetics: "美学", technology: "技术" },
  en: { narrative: "Narrative", mechanics: "Mechanics", aesthetics: "Aesthetics", technology: "Technology" },
} as const;

export function getGuideDocument(language: Language, target: GuideTarget): GuideDocument {
  const copy = language === "zh" ? zh : en;
  if (target.step === "welcome" || target.step === "idea" || target.step === "summary") {
    return { ...copy[target.step], source: copy.source };
  }
  if (target.step === "sentences") return { ...copy[target.tab], source: copy.source };
  if (target.step === "player") return { ...copy[target.tab], source: copy.source };
  if (target.step === "tetrad") {
    return {
      ...copy.tetrad,
      title: language === "zh" ? `四大设计支柱 · ${pillarNames.zh[target.pillar]}` : `Four Design Pillars · ${pillarNames.en[target.pillar]}`,
      source: copy.source,
    };
  }
  throw new Error(`Unsupported guide target: ${target.step}`);
}
