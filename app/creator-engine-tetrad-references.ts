import type { TetradKey } from "./creator-engine-model";

export type TetradReferenceExample = {
  foundation: string;
  signature: string;
  support: Partial<Record<TetradKey, string>>;
};

export type SentenceReferenceExample = {
  gameplay: {
    identity: string;
    verb: string;
    goal: string;
    constraint: string;
  };
  experience: {
    audience: string;
    feeling: string;
    dynamic: string;
    alternative: string;
  };
  hypothesis: {
    mechanism: string;
    behavior: string;
    experience: string;
    signal: string;
  };
};

export type PlayerReferenceExample = {
  firstLook: {
    theme: string;
    genre: string;
    references: string;
    expectation: string;
  };
  firstTen: {
    fulfilment: string;
    outcome: string;
    uniqueExperience: string;
    nextGoal: string;
  };
  arc: {
    source: string;
    finale: string;
  };
};

export type TetradReferenceGame = {
  title: string;
  sentence: SentenceReferenceExample;
  player: PlayerReferenceExample;
  examples: Record<TetradKey, TetradReferenceExample>;
};

// 三句话、玩家侧构思与四个支柱共用这一批游戏和固定顺序，方便横向比较同一作品。
export const tetradReferenceGames: TetradReferenceGame[] = [
  {
    title: "《命运石之门》",
    sentence: {
      gameplay: { identity: "试图改变命运的实验室成员", verb: "阅读信息、操作手机并追踪线索", goal: "保护同伴并抵达理想世界线", constraint: "信息有限，关键选择会把未来推向不同分支" },
      experience: { audience: "喜欢角色与悬疑的玩家", feeling: "逐渐理解因果、又害怕选择代价的紧张感", dynamic: "信息选择和世界线回溯", alternative: "动作战斗" },
      hypothesis: { mechanism: "在不同世界线中比较细节变化", behavior: "主动推测消息与事件的因果", experience: "自己正在与命运博弈", signal: "玩家能指出一次选择造成的后续差异" },
    },
    player: {
      firstLook: { theme: "时间循环与世界线选择", genre: "都市科幻视觉小说", references: "日式 Galgame 与时间循环题材作品", expectation: "了解角色并改变命运" },
      firstTen: { fulfilment: "会", outcome: "还能", uniqueExperience: "手机操作悄然改变信息顺序与角色回应的因果感", nextGoal: "弄清实验异常" },
      arc: { source: "世界线偏移造成的严重后果与关系累积", finale: "在感情与因果之间做出关键选择" },
    },
    examples: {
      narrative: {
        foundation: "日式 Galgame",
        signature: "以时间循环、角色关系和多分支选择逐步揭示真相。",
        support: {
          mechanics: "手机操作与关键选择成为进入分支、改变世界线的核心动作。",
          aesthetics: "角色立绘、文字框与都市科幻意象集中表现人物关系。",
          technology: "要求对话树、条件标记、存档与回溯系统稳定记录分支。",
        },
      },
      mechanics: {
        foundation: "手机触发分支",
        signature: "玩家通过收发消息和关键选择改变关系状态与故事路线。",
        support: {
          narrative: "有限但关键的操作让世界线变化由玩家亲自触发。",
          aesthetics: "手机界面与视觉小说画面共同维持都市科幻的代入感。",
          technology: "明确需要条件判断、分支追踪与多存档回溯能力。",
        },
      },
      aesthetics: {
        foundation: "都市科幻视觉小说",
        signature: "写实秋叶原背景、角色立绘与故障化演出并置，制造日常失真的感觉。",
        support: {
          narrative: "熟悉街景与异常视觉的反差强化世界线偏移。",
          mechanics: "稳定的界面层级让玩家专注阅读、选择与手机操作。",
          technology: "以静态资源和局部演出为主，适合高密度文本与多分支内容。",
        },
      },
      technology: {
        foundation: "条件分支脚本系统",
        signature: "用变量、标记和存档管理大量对白、事件与多条世界线。",
        support: {
          narrative: "保证非线性分支在回溯后仍能保持因果一致。",
          mechanics: "让手机事件和玩家选择可靠改变后续内容。",
          aesthetics: "统一调度立绘、背景、音效与故障演出，控制阅读节奏。",
        },
      },
    },
  },
  {
    title: "《塞尔达传说：旷野之息》",
    sentence: {
      gameplay: { identity: "失去记忆的勇者", verb: "探索、攀爬、战斗和组合环境规则", goal: "恢复力量并挑战灾厄", constraint: "体力、天气、敌人与有限资源持续约束路线" },
      experience: { audience: "喜欢自由探索的玩家", feeling: "由好奇心驱动、靠自己发现解法的冒险感", dynamic: "开放地形和系统互动", alternative: "固定任务顺序" },
      hypothesis: { mechanism: "依据远景地标前往多数可见地形", behavior: "自行选择路线并在途中改变计划", experience: "世界真正开放", signal: "玩家能讲述一段偏离任务后产生的个人经历" },
    },
    player: {
      firstLook: { theme: "失忆勇者重返辽阔荒野", genre: "开放世界动作冒险", references: "自由探索与系统交互类作品", expectation: "所见即可达并自由寻找解法" },
      firstTen: { fulfilment: "会", outcome: "还能", uniqueExperience: "用攀爬、滑翔与环境规则形成自己的解法", nextGoal: "前往下一个醒目地标" },
      arc: { source: "新能力、装备、记忆与世界知识", finale: "用自选路线完成一场个人英雄旅程" },
    },
    examples: {
      narrative: {
        foundation: "碎片化开放世界叙事",
        signature: "玩家按自己的探索顺序找回记忆，并从环境遗迹拼合历史。",
        support: {
          mechanics: "失落记忆为自由探索、攀爬和寻找地标提供动机。",
          aesthetics: "荒野留白与遗迹景观强化衰败后重生的主题。",
          technology: "需要任务与记忆片段以非线性顺序触发并保持一致。",
        },
      },
      mechanics: {
        foundation: "开放世界系统探索",
        signature: "攀爬、滑翔、元素与物理规则可自由组合，形成多种解法。",
        support: {
          narrative: "玩家亲自选择路线，形成属于自己的冒险顺序。",
          aesthetics: "“看得见就能去”让远景地标同时成为构图与目标。",
          technology: "统一交互规则明确物理、碰撞和流式加载的技术重点。",
        },
      },
      aesthetics: {
        foundation: "清新水彩荒野",
        signature: "柔和色彩、辽阔远景和自然声景营造孤独但自由的旅行感。",
        support: {
          narrative: "遗迹与荒野的视觉对比让失落王国的历史无需密集对白也能被感知。",
          mechanics: "清晰地标、天气与材质反馈帮助玩家判断路线和环境规则。",
          technology: "风格化材质降低写实细节压力，同时保留远景辨识度。",
        },
      },
      technology: {
        foundation: "无缝世界流式加载",
        signature: "远景、地形和互动对象在持续移动中稳定出现，尽量不打断探索。",
        support: {
          narrative: "连续世界让寻找记忆与重走海拉鲁保持空间连贯。",
          mechanics: "攀爬、滑翔和远距离移动不被频繁读盘切断。",
          aesthetics: "远景地标可以长期可见，维持“所见即可达”的画面承诺。",
        },
      },
    },
  },
  {
    title: "《哈迪斯》",
    sentence: {
      gameplay: { identity: "试图逃离冥界的王子", verb: "战斗、选择祝福和调整武器", goal: "突破层层守卫", constraint: "死亡会终止本轮构筑并把玩家送回起点" },
      experience: { audience: "喜欢动作挑战和角色故事的玩家", feeling: "失败也有收获、逐渐掌握战斗的推进感", dynamic: "随机构筑与死亡后的新对白", alternative: "单纯惩罚失败" },
      hypothesis: { mechanism: "把每次死亡转化为新能力、信息或关系回应", behavior: "将失败理解为下一轮准备并立即规划新构筑", experience: "失败也在推动进度", signal: "玩家死亡后能立即说出下一轮尝试计划" },
    },
    player: {
      firstLook: { theme: "冥界王子反复逃脱与家庭冲突", genre: "神话题材 Roguelite 动作", references: "高速动作与随机地牢类作品", expectation: "用华丽构筑反复挑战冥界" },
      firstTen: { fulfilment: "会", outcome: "还能", uniqueExperience: "死亡回城仍会推进对白与角色关系的持续进展感", nextGoal: "用新构筑再次尝试逃脱" },
      arc: { source: "新武器形态、祝福组合与家庭真相", finale: "把反复失败转化为和解与战斗精通" },
    },
    examples: {
      narrative: {
        foundation: "循环死亡叙事",
        signature: "每次失败都推进角色关系、对白与世界信息，而不是简单重置。",
        support: {
          mechanics: "死亡回城自然解释 Roguelite 的重复挑战循环。",
          aesthetics: "鲜明角色造型和冥界场景持续承载家族冲突。",
          technology: "需要条件对白根据失败次数、武器和关系状态组合触发。",
        },
      },
      mechanics: {
        foundation: "Roguelite 动作循环",
        signature: "随机祝福、武器构筑与永久成长让每次逃脱尝试都不同。",
        support: {
          narrative: "反复失败成为主角持续反抗与修复家庭关系的过程。",
          aesthetics: "高辨识度攻击特效让高速构筑组合仍然清楚可读。",
          technology: "要求随机房间、状态叠加和战斗反馈稳定组合。",
        },
      },
      aesthetics: {
        foundation: "手绘暗黑神话",
        signature: "高饱和角色、锐利轮廓与华丽神力特效重新诠释希腊冥界。",
        support: {
          narrative: "角色肖像和场景装饰快速建立神祇身份与家族关系。",
          mechanics: "不同神祇的颜色、图标和音效帮助玩家识别祝福构筑。",
          technology: "模块化角色演出与特效资源支持大量对白和技能组合。",
        },
      },
      technology: {
        foundation: "状态驱动对白系统",
        signature: "按死亡次数、装备、遭遇和关系进度筛选大量情境对白。",
        support: {
          narrative: "让角色记得玩家经历，使重复循环持续产生新故事。",
          mechanics: "把战斗结果和构筑选择转化为回城后的专属回应。",
          aesthetics: "协调肖像、配音和场景演出，保持高速战斗后的叙事节奏。",
        },
      },
    },
  },
  {
    title: "《杀戮尖塔》",
    sentence: {
      gameplay: { identity: "登塔者", verb: "打牌、构筑卡组和选择路线", goal: "击败高层敌人", constraint: "生命、能量、随机奖励和不可回头的路线迫使玩家长期取舍" },
      experience: { audience: "喜欢策略组合的玩家", feeling: "从弱小卡组逐渐形成强力体系的掌控感", dynamic: "可预判战斗与卡牌协同", alternative: "即时操作" },
      hypothesis: { mechanism: "查看敌人意图并稳定组合卡牌效果", behavior: "围绕未来回合规划出牌与构筑", experience: "胜负源于自己的判断", signal: "玩家能解释一次保留资源或放弃卡牌的理由" },
    },
    player: {
      firstLook: { theme: "用卡牌构筑攀登危险高塔", genre: "回合制卡组构筑", references: "Roguelike 随机挑战与桌面卡牌作品", expectation: "组合卡牌并逐步登顶" },
      firstTen: { fulfilment: "会", outcome: "还能", uniqueExperience: "删牌、遗物与路线选择共同决定长期强度的构筑感", nextGoal: "完成当前流派的雏形" },
      arc: { source: "更完整的卡组协同、更复杂的敌人与更紧张的资源压力", finale: "用亲手构筑的体系破解高塔" },
    },
    examples: {
      narrative: {
        foundation: "轻叙事登塔冒险",
        signature: "以角色身份、怪物、遗物和事件碎片构成可反复解读的高塔世界。",
        support: {
          mechanics: "不断登塔和失败重来为卡组构筑提供明确旅程结构。",
          aesthetics: "怪诞角色和遗物图像用少量信息暗示高塔生态。",
          technology: "事件文本需要根据路线、角色与资源状态动态出现。",
        },
      },
      mechanics: {
        foundation: "回合制卡组构筑",
        signature: "短期战斗决策与长期路线、遗物和卡组取舍相互叠加。",
        support: {
          narrative: "持续向上和失败重来形成清晰的冒险结构。",
          aesthetics: "卡牌图形、状态图标和敌人意图优先服务信息可读性。",
          technology: "要求效果结算、状态叠加和随机种子可预测且便于扩展。",
        },
      },
      aesthetics: {
        foundation: "手绘卡牌奇幻",
        signature: "粗粝线条、异形生物与统一图标构成神秘而易读的桌游感。",
        support: {
          narrative: "卡图、遗物和场景以碎片方式补充高塔世界。",
          mechanics: "颜色、能量、意图和状态图标让复杂结算可快速判断。",
          technology: "以二维卡图和模块化界面承载大量可扩展内容。",
        },
      },
      technology: {
        foundation: "数据驱动卡牌系统",
        signature: "把卡牌、遗物、状态和敌人行为定义为可组合、可扩展的数据。",
        support: {
          narrative: "事件与遗物可按条件插入简短世界故事。",
          mechanics: "统一结算顺序让大量组合既能涌现又可预测。",
          aesthetics: "复用卡牌模板、图标和动画快速呈现新增内容。",
        },
      },
    },
  },
  {
    title: "《双人成行》",
    sentence: {
      gameplay: { identity: "被变成玩偶的伴侣之一", verb: "使用互补能力、沟通和同步操作", goal: "穿越家庭世界并恢复身体", constraint: "任何一方都无法独自完成关键机关" },
      experience: { audience: "伴侣或朋友玩家", feeling: "必须互相依赖、共同发现惊喜的合作感", dynamic: "持续变化的双人能力与关卡", alternative: "重复刷取" },
      hypothesis: { mechanism: "先让双方各自获得一半的机关信息", behavior: "主动交流、分工并关注同伴", experience: "合作不可替代", signal: "双方会自然分工并复盘一次配合失误" },
    },
    player: {
      firstLook: { theme: "玩偶伴侣穿越家庭记忆并修复关系", genre: "双人合作平台冒险", references: "玩具世界与合作解谜类作品", expectation: "和同伴一起完成无法独自解决的挑战" },
      firstTen: { fulfilment: "会", outcome: "还能", uniqueExperience: "双方能力始终互补、必须交流才能推进的依赖感", nextGoal: "完成下一次合作挑战" },
      arc: { source: "每章全新能力与新的关系课题", finale: "通过共同冒险重新理解同伴关系" },
    },
    examples: {
      narrative: {
        foundation: "关系修复公路叙事",
        signature: "一对关系破裂的伴侣穿越家庭记忆，在共同冒险中重新理解彼此。",
        support: {
          mechanics: "每段关系课题都转化为必须协作完成的双人行动。",
          aesthetics: "夸张家庭物件和微缩世界把情感问题变成可见场景。",
          technology: "需要双角色剧情状态、分屏镜头和联机事件同步。",
        },
      },
      mechanics: {
        foundation: "双人合作解谜",
        signature: "两名玩家拥有互补能力，必须沟通并同步行动。",
        support: {
          narrative: "合作动作直接表达两位主角修复关系的过程。",
          aesthetics: "关卡以夸张玩具化场景清楚区分双方可交互目标。",
          technology: "要求分屏、联机同步与双角色状态保持一致。",
        },
      },
      aesthetics: {
        foundation: "3D 玩具世界",
        signature: "日常物件被夸张成多彩微缩关卡，每个章节都有鲜明材质主题。",
        support: {
          narrative: "家庭空间与旧物让伴侣和女儿的共同记忆具象化。",
          mechanics: "色彩和材质区分两名玩家的能力目标与合作路径。",
          technology: "模块化场景与分级细节兼顾双视角下的丰富度和性能。",
        },
      },
      technology: {
        foundation: "分屏联机同步",
        signature: "本地或在线状态下同时呈现两个玩家视角，并同步合作机关与演出。",
        support: {
          narrative: "双方持续看见彼此处境，让共同经历成为关系叙事核心。",
          mechanics: "保证互补能力、同步操作和跨场景合作可靠成立。",
          aesthetics: "独立镜头可分别展示角色动作，又在关键时刻统一演出。",
        },
      },
    },
  },
  {
    title: "《守望先锋》",
    sentence: {
      gameplay: { identity: "拥有独特能力的英雄", verb: "与队友射击、使用技能和争夺目标", goal: "赢得团队对战", constraint: "阵容克制、冷却时间和对手配合限制个人发挥" },
      experience: { audience: "喜欢团队竞技的玩家", feeling: "扮演鲜明英雄、与队友形成精彩配合的高光感", dynamic: "角色职责和技能联动", alternative: "所有人使用相同武器" },
      hypothesis: { mechanism: "辨认每名英雄的职责、威胁与技能反馈", behavior: "根据战况协作或更换英雄", experience: "团队策略正在改变比赛", signal: "玩家能指出一次阵容调整带来的局势变化" },
    },
    player: {
      firstLook: { theme: "鲜明英雄在未来战场进行团队攻防", genre: "英雄团队射击", references: "角色技能与目标争夺类竞技作品", expectation: "找到适合自己的英雄并参与团队配合" },
      firstTen: { fulfilment: "会", outcome: "还能", uniqueExperience: "坦克、输出与支援配合显著改变战局的团队作用感", nextGoal: "掌握一个英雄的核心连招" },
      arc: { source: "更深入的地图理解、阵容博弈与团队配合", finale: "在高速混战中与队友共同完成关键逆转" },
    },
    examples: {
      narrative: {
        foundation: "群像英雄叙事",
        signature: "通过英雄背景、阵营关系和世界事件构成可持续扩展的近未来群像。",
        support: {
          mechanics: "角色身份与能力设定相互对应，帮助玩家理解战斗职责。",
          aesthetics: "服装、口音和地图细节快速传达地域与阵营背景。",
          technology: "需要语音、互动台词和赛季内容按角色与场景条件触发。",
        },
      },
      mechanics: {
        foundation: "英雄团队射击",
        signature: "不同定位、技能与终极能力促使队伍组合、协作和临场换角。",
        support: {
          narrative: "每套能力都把英雄身份和经历转化为可操作特征。",
          aesthetics: "角色轮廓与技能特效围绕战斗职责建立辨识度。",
          technology: "需要低延迟同步、命中判定和多人技能交互保持稳定。",
        },
      },
      aesthetics: {
        foundation: "3D 卡通渲染",
        signature: "鲜明轮廓、角色色彩和夸张动作让高速战斗仍容易辨认。",
        support: {
          narrative: "服装、表情和场景细节快速传达英雄身份与世界背景。",
          mechanics: "轮廓、特效颜色和音效提示帮助识别角色与技能威胁。",
          technology: "风格化材质控制细节密度，便于多人场景维持性能与清晰度。",
        },
      },
      technology: {
        foundation: "低延迟多人同步",
        signature: "服务器持续协调移动、弹道、技能与命中结果，维持团队对战可信度。",
        support: {
          narrative: "稳定承载角色互动台词和持续更新的世界事件。",
          mechanics: "让射击、位移、护盾和控制技能可以被精确判断。",
          aesthetics: "稳定帧率与准确时序保证动作、特效和音效反馈一致。",
        },
      },
    },
  },
  {
    title: "《星露谷物语》",
    sentence: {
      gameplay: { identity: "继承农场的新居民", verb: "种植、经营、探索和交往", goal: "重建生活与社区", constraint: "每日时间、体力和季节变化迫使玩家安排优先级" },
      experience: { audience: "偏好舒缓成长的玩家", feeling: "可掌控生活、逐渐建立归属的安定感", dynamic: "日程安排和关系积累", alternative: "高压竞争" },
      hypothesis: { mechanism: "在一天内面对多个无法全部完成的有意义目标", behavior: "形成自己的生活节奏并规划明日事项", experience: "下一个清晨值得期待", signal: "玩家结束一天时能主动说出明天最想做的事" },
    },
    player: {
      firstLook: { theme: "经营农场并融入像素小镇生活", genre: "轻松生活经营", references: "田园种植与社区交往类作品", expectation: "获得治愈成长并建立自己的日常" },
      firstTen: { fulfilment: "会", outcome: "还能", uniqueExperience: "时间与体力迫使自己安排日程的生活掌控感", nextGoal: "迎接第一次作物收获" },
      arc: { source: "新季节、人物关系、生产链与社区工程", finale: "在小镇建立属于自己的生活与归属" },
    },
    examples: {
      narrative: {
        foundation: "小镇生活叙事",
        signature: "通过日常交往、季节节庆和个人事件逐步建立社区归属。",
        support: {
          mechanics: "关系成长与小镇故事为种植、送礼和日程安排提供长期动机。",
          aesthetics: "人物肖像和四季变化强化时间流逝与居民个性。",
          technology: "需要日历、好感度和条件事件系统共同管理角色进展。",
        },
      },
      mechanics: {
        foundation: "农场经营日程",
        signature: "玩家在每日时间和体力限制下安排种植、采集、探索与社交。",
        support: {
          narrative: "重复拜访和季节节奏让人物关系自然长期展开。",
          aesthetics: "作物成长、天气和节庆把经营进度转化为可见变化。",
          technology: "要求持久世界状态、日历事件和大量物品配方稳定运行。",
        },
      },
      aesthetics: {
        foundation: "像素田园美术",
        signature: "温暖色彩、季节变化和轻柔音乐营造可长期停留的日常感。",
        support: {
          narrative: "人物肖像与小镇四季强化社区关系和时间流逝。",
          mechanics: "作物阶段、天气和可拾取物用清楚像素形态传达状态。",
          technology: "有限规格的精灵图和图块地图降低内容扩展与多平台适配成本。",
        },
      },
      technology: {
        foundation: "图块地图与持久存档",
        signature: "持续记录农场布局、作物状态、日历、关系与大量可交互物件。",
        support: {
          narrative: "长期保存居民关系和事件结果，让小镇记住玩家选择。",
          mechanics: "支持跨季节经营、物品生产链和自由布置农场。",
          aesthetics: "图块与精灵资源便于组合四季地图和丰富装饰。",
        },
      },
    },
  },
  {
    title: "《地狱边境》",
    sentence: {
      gameplay: { identity: "孤身男孩", verb: "奔跑、跳跃、观察和操纵物理机关", goal: "穿越危险黑暗世界", constraint: "陷阱隐藏、信息稀少且错误通常会立即致命" },
      experience: { audience: "喜欢氛围解谜的玩家", feeling: "在未知压迫中谨慎试探、突然理解机关的释然感", dynamic: "环境线索和死亡反馈", alternative: "文字说明" },
      hypothesis: { mechanism: "通过死亡结果观察机关规则并迅速重试", behavior: "根据失败改变行动时机或路线", experience: "恐惧正在转化为理解", signal: "玩家下一次尝试会采用与上次不同的解法" },
    },
    player: {
      firstLook: { theme: "孤身男孩在黑白世界追寻未知目标", genre: "氛围物理解谜", references: "剪影平台跳跃与环境叙事类作品", expectation: "在危险和留白中谨慎探索" },
      firstTen: { fulfilment: "会", outcome: "还能", uniqueExperience: "无提示陷阱突然致命、死亡本身揭示规则的压迫感", nextGoal: "理解下一个机关的运行规则" },
      arc: { source: "更复杂的物理机关、追逐压力与意象空间", finale: "穿越一段无法完全解释的噩梦旅程" },
    },
    examples: {
      narrative: {
        foundation: "环境留白叙事",
        signature: "几乎不使用对白，以追寻、危险和模糊意象让玩家自行解释旅程。",
        support: {
          mechanics: "每个机关和死亡结果都成为理解敌意世界的叙事信息。",
          aesthetics: "黑白剪影隐藏细节，为故事保留不确定与想象空间。",
          technology: "需要物理事件、镜头与环境演出精确控制无对白节奏。",
        },
      },
      mechanics: {
        foundation: "物理解谜平台跳跃",
        signature: "观察环境、试错死亡和利用物理机关构成连续谜题。",
        support: {
          narrative: "脆弱行动与残酷结果直接讲述男孩所处世界的危险。",
          aesthetics: "简化操作让玩家更关注剪影空间、运动与声音线索。",
          technology: "要求碰撞、绳索、重力和机关时序表现稳定。",
        },
      },
      aesthetics: {
        foundation: "黑白剪影美学",
        signature: "高反差轮廓、雾气与克制音效制造未知和压迫感。",
        support: {
          narrative: "不说明背景的剪影世界保留故事解释空间。",
          mechanics: "关键机关与角色轮廓必须在黑暗环境中保持可辨认。",
          technology: "光照、景深和分层滚动成为画面实现的核心技术能力。",
        },
      },
      technology: {
        foundation: "2D 物理与分层渲染",
        signature: "用稳定刚体、关节、光照和景深共同构成可交互剪影空间。",
        support: {
          narrative: "可控环境演出让追逐、死亡和意象在无对白下成立。",
          mechanics: "可信物理反馈让玩家通过观察和试错解决机关。",
          aesthetics: "多层雾气、光影与滚动制造黑白世界的空间纵深。",
        },
      },
    },
  },
  {
    title: "《原神》",
    sentence: {
      gameplay: { identity: "寻找亲人的旅行者", verb: "探索开放世界、切换角色、组合元素和培养队伍", goal: "解开诸国故事", constraint: "资源、敌人和角色能力限制推进方式" },
      experience: { audience: "喜欢幻想旅行与角色收集的玩家", feeling: "不断发现新地域、组建个人队伍的陪伴感", dynamic: "元素战斗和持续世界更新", alternative: "单一线性关卡" },
      hypothesis: { mechanism: "依据地标、地区规则与元素机会自由探索", behavior: "主动偏离任务并调整队伍组合", experience: "旅程持续保持新鲜", signal: "玩家能指出一次环境发现或元素组合带来的惊喜" },
    },
    player: {
      firstLook: { theme: "旅行者穿越幻想大陆寻找亲人", genre: "二次元开放世界动作 RPG", references: "角色收集、元素战斗与长线冒险作品", expectation: "探索新地域并组建个人队伍" },
      firstTen: { fulfilment: "会", outcome: "还能", uniqueExperience: "切换角色并组合元素反应解决战斗与环境问题的策略感", nextGoal: "抵达下一个地标或扩充队伍" },
      arc: { source: "新国家、新角色队伍、元素构筑与版本故事", finale: "与伙伴走遍世界并持续追索真相" },
    },
    examples: {
      narrative: {
        foundation: "章节式世界旅行",
        signature: "以不同国家、角色篇章与版本事件持续展开跨地域旅程。",
        support: {
          mechanics: "寻找亲人与探索诸国为移动、解谜和角色培养提供长期目标。",
          aesthetics: "每个国家以独立建筑、音乐和色彩表达文化主题。",
          technology: "需要任务状态、跨平台账户与版本内容持续兼容。",
        },
      },
      mechanics: {
        foundation: "元素反应动作 RPG",
        signature: "角色切换、元素组合、探索与成长构成持续扩展的战斗循环。",
        support: {
          narrative: "不同角色能力与地区探索把旅伴和世界设定转化为行动。",
          aesthetics: "元素颜色、技能动画和角色造型强化队伍差异。",
          technology: "要求多角色状态、元素结算和开放世界资源稳定协同。",
        },
      },
      aesthetics: {
        foundation: "二次元卡通渲染",
        signature: "动漫化角色、明亮开放世界与地域化音乐形成统一而多样的幻想旅行感。",
        support: {
          narrative: "角色造型与地区景观迅速区分国家、阵营和人物身份。",
          mechanics: "元素色彩和技能特效让角色切换与反应结果更易识别。",
          technology: "分级材质、光照和特效在不同设备上维持统一风格。",
        },
      },
      technology: {
        foundation: "多平台 Unity",
        signature: "同一内容覆盖移动端、主机与 PC，并维持统一账户体验。",
        support: {
          narrative: "跨平台持续更新让长线世界故事可以分版本展开。",
          mechanics: "输入适配、资源管理和联网框架支撑探索与实时战斗。",
          aesthetics: "分级画质与着色方案在不同设备上维持统一卡通风格。",
        },
      },
    },
  },
  {
    title: "《火箭联盟》",
    sentence: {
      gameplay: { identity: "火箭动力赛车驾驶者", verb: "加速、跳跃、传球和射门", goal: "在竞技场取得更多进球", constraint: "车辆惯性、球体物理和对手防守限制控制精度" },
      experience: { audience: "喜欢短局竞技的玩家", feeling: "从笨拙碰球到完成空中配合的技巧成长感", dynamic: "统一物理规则和团队对抗", alternative: "角色数值" },
      hypothesis: { mechanism: "在一致的车辆与球体物理下反复练习", behavior: "预测落点并尝试更复杂的击球动作", experience: "自己的操作技术真实提升", signal: "玩家会主动调整站位并稳定复现一次击球" },
    },
    player: {
      firstLook: { theme: "火箭动力赛车在霓虹球场踢足球", genre: "载具足球竞技", references: "体育对抗与物理驾驶类作品", expectation: "用高速操作完成传球与进球" },
      firstTen: { fulfilment: "会", outcome: "还能", uniqueExperience: "跳跃、加速与球路预测形成高技巧空间的成长感", nextGoal: "完成第一次稳定传球或进球" },
      arc: { source: "空中控制、轮转站位与团队默契", finale: "凭反复练习完成高速配合与逆转" },
    },
    examples: {
      narrative: {
        foundation: "玩家生成竞技叙事",
        signature: "不依赖固定剧情，由逆转、配合、失误与赛季成长形成每位玩家的比赛故事。",
        support: {
          mechanics: "开放的物理对抗不断制造可复盘的关键时刻。",
          aesthetics: "进球庆祝、竞技场和车体装扮放大个人与团队记忆。",
          technology: "需要可靠回放、比赛记录和联网结果保存玩家历程。",
        },
      },
      mechanics: {
        foundation: "载具足球对抗",
        signature: "驾驶、加速、跳跃和空中击球围绕统一物理规则形成高技巧竞技。",
        support: {
          narrative: "每次配合、扑救和逆转自然产生可讲述的比赛故事。",
          aesthetics: "球路、速度和碰撞反馈围绕高速可读性设计。",
          technology: "要求球体物理、车辆控制与网络判定高度一致。",
        },
      },
      aesthetics: {
        foundation: "霓虹竞技场美学",
        signature: "明亮球场、夸张车体和强烈进球演出营造未来体育转播感。",
        support: {
          narrative: "队伍色彩、装扮与庆祝动作形成玩家自己的竞技身份。",
          mechanics: "高对比球体、边线与推进特效帮助判断高速运动。",
          technology: "模块化车体和特效可扩展外观，同时保持竞技画面清晰。",
        },
      },
      technology: {
        foundation: "物理预测与网络同步",
        signature: "高速车辆、球体物理和碰撞结果需要在所有玩家端保持可信。",
        support: {
          narrative: "稳定比赛与赛季记录形成玩家自己的竞技历程。",
          mechanics: "预测、校正和服务器判定保证击球与对抗可以精确练习。",
          aesthetics: "稳定帧率与清楚特效让高速运动仍然易读。",
        },
      },
    },
  },
];
