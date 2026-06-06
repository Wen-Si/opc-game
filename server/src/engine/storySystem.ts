// ============================================================
// OPC 创业模拟RPG - 剧情/章节系统
// 7个章节，跌宕起伏的创业故事
// ============================================================

import { GameEvent, Chapter } from '../types';

/** 章节定义 */
export const CHAPTERS: Chapter[] = [
  {
    number: 10,
    title: '梦想启航',
    dayRange: [1, 30],
    description: '一切从零开始。你怀揣着改变世界的梦想，踏上了创业的征途。注册公司、找办公地点、确定业务方向——每一步都充满未知与挑战。',
  },
  {
    number: 20,
    title: '艰难起步',
    dayRange: [31, 90],
    description: '创业的蜜月期结束了。第一个项目的压力、第一个客户的挑剔、竞争对手的阴影……现实远比想象残酷。资金在燃烧，信心在动摇。',
  },
  {
    number: 30,
    title: '初见曙光',
    dayRange: [91, 180],
    description: '熬过了最艰难的时期，业务开始有了起色。稳定客户的出现让你看到了希望，但更大的诱惑和挑战也在前方等待。',
  },
  {
    number: 4,
    title: '至暗时刻',
    dayRange: [181, 270],
    description: '就在你以为一切都在好转的时候，命运给了你沉重一击。核心客户流失、法律纠纷、合伙人离开……这是对你意志力的终极考验。',
  },
  {
    number: 50,
    title: '浴火重生',
    dayRange: [271, 360],
    description: '从废墟中站起来，你决定重新出发。转型、创新、突破——这一次，你比任何时候都更强大。',
  },
  {
    number: 60,
    title: '王者归来',
    dayRange: [361, 450],
    description: '你的公司开始快速成长，行业内的目光纷纷投来。但规模扩张带来了新的管理挑战，成功的诱惑也让你面临道德困境。',
  },
  {
    number: 7,
    title: '传奇终章',
    dayRange: [451, 540],
    description: '创业旅程即将画上句号。上市、保持独立还是出售？每一个选择都将决定你和公司的最终命运。',
  },
];

/** 根据天数获取当前章节 */
export function getChapterByDay(day: number): Chapter {
  for (const chapter of CHAPTERS) {
    if (day >= chapter.dayRange[0] && day <= chapter.dayRange[1]) {
      return chapter;
    }
  }
  // 超过最后一章，返回最后一章
  return CHAPTERS[CHAPTERS.length - 1];
}

/** 获取章节所有事件 */
export function getEventsByChapter(chapter: number): GameEvent[] {
  return ALL_EVENTS.filter(e => e.chapter === chapter);
}

// ============================================================
// 全部剧情事件定义
// ============================================================

const ALL_EVENTS: GameEvent[] = [
  // ============================================================
  // 第1章：梦想启航（第1-30天）
  // ============================================================

  // --- 主线事件 ---
  {
    id: 'ch1_main1',
    type: 'story',
    title: '踏上征程',
    description: '你站在出租屋的窗前，看着城市的灯火。今天，你做出了一个改变人生的决定——辞职创业。你的积蓄只有10万元，但你的梦想是无价的。你深吸一口气，打开了笔记本电脑……',
    chapter: 1,
    choices: [
      {
        id: 'ch1_main1_a',
        text: '先注册公司，把一切正规化',
        effects: {
          cash: -30000,
          experience: 200,
          morale: 100,
          reputation: 500,
        },
        outcomeText: '你花了3000元注册了公司，拿到了营业执照。虽然钱包瘪了一些，但看着印有自己公司名字的名片，你感到无比自豪。',
        riskLevel: 'low',
      },
      {
        id: 'ch1_main1_b',
        text: '先不注册，用最小成本验证想法',
        effects: {
          experience: 1500,
          morale: 500,
          energy: -500,
        },
        outcomeText: '你决定先不注册公司，用个人身份接单试水。这样省下了注册费用，但你也清楚，没有正式的公司身份，很多大客户不会信任你。',
        riskLevel: 'low',
      },
      {
        id: 'ch1_main1_c',
        text: '找朋友合伙，分担风险',
        effects: {
          cash: 15000,
          experience: 100,
          morale: 500,
          networking: 100,
        },
        outcomeText: '你的大学室友小王听说你要创业，二话不说拿出了1.5万元。你们约定按6:4分配股权。有了伙伴，你不再孤单，但未来的分歧也埋下了种子。',
        riskLevel: 'medium',
      },
    ],
  },

  {
    id: 'ch1_main2',
    type: 'story',
    title: '办公地点的选择',
    description: '公司需要一个"根据地"。你面临三个选择：在家办公、租一个共享工位、或者咬牙租一个小办公室。每个选择都有利有弊。',
    chapter: 1,
    choices: [
      {
        id: 'ch1_main2_a',
        text: '在家办公，省下每一分钱',
        effects: {
          cash: 0,
          energy: -100,
          morale: -500,
          mentalHealth: -500,
        },
        outcomeText: '你把卧室的一角改造成了"办公室"。虽然省了钱，但工作和生活的界限变得模糊，你发现自己经常工作到凌晨，而床就在三步之外。',
        riskLevel: 'low',
      },
      {
        id: 'ch1_main2_b',
        text: '租共享工位，性价比之选',
        effects: {
          cash: -20000,
          energy: 500,
          morale: 500,
          networking: 100,
          monthlyExpense: 15000,
        },
        outcomeText: '你花20000元在联合办公空间租了一个工位。这里不仅有免费的咖啡，更重要的是你认识了几个同样在创业的年轻人。人脉，在不知不觉中积累。',
        riskLevel: 'low',
      },
      {
        id: 'ch1_main2_c',
        text: '租小办公室，要有公司的样子',
        effects: {
          cash: -80000,
          morale: 1500,
          reputation: 100,
          monthlyExpense: 50000,
        },
        outcomeText: '你咬咬牙租了一间200平米的小办公室，还简单装修了一下。虽然每月50000元的租金让你心疼，但当你第一次在门上贴上公司Logo时，那种感觉——你终于有了自己的公司。',
        riskLevel: 'medium',
      },
    ],
  },

  // --- 随机事件 ---
  {
    id: 'ch1_rand1',
    type: 'random',
    title: '朋友的忠告',
    description: '你的好朋友老张约你喝咖啡。他看着你疲惫的脸，叹了口气说："兄弟，创业哪有那么容易？你看街上那些倒闭的店……要不你还是回去上班吧，稳定多好。"他的话像一盆冷水浇在你头上。',
    chapter: 1,
    choices: [
      {
        id: 'ch1_rand1_a',
        text: '"谢谢你的关心，但我不会放弃。"',
        effects: {
          morale: 100,
          resilience: 500,
          energy: -500,
        },
        outcomeText: '老张摇了摇头，但你从他的眼神里看到了一丝敬佩。你更加坚定了自己的决心——这条路，跪着也要走完。',
        riskLevel: 'low',
      },
      {
        id: 'ch1_rand1_b',
        text: '认真思考他的话，有些动摇',
        effects: {
          morale: -1500,
          mentalHealth: -100,
          burnoutRisk: 100,
          energy: 500,
        },
        outcomeText: '老张的话让你失眠了一整夜。也许他说得对？你开始怀疑自己的决定。但第二天早上，你看到桌上的商业计划书，又重新燃起了斗志。',
        riskLevel: 'low',
      },
      {
        id: 'ch1_rand1_c',
        text: '"等我成功了，请你吃大餐！"',
        effects: {
          morale: 500,
          networking: 500,
          energy: 500,
        },
        outcomeText: '老张笑了："行，我等着。"你们碰了一下咖啡杯。你知道，无论结果如何，真正的朋友会一直支持你。',
        riskLevel: 'low',
      },
    ],
  },

  {
    id: 'ch1_rand2',
    type: 'opportunity',
    title: '第一个潜在客户',
    description: '在一场行业交流会上，一位中年企业家递给你一张名片："小伙子，我听说你在做XX方面的业务？我们公司正好有需求，你下周来给我做个方案吧。"这是你的第一个机会！',
    chapter: 1,
    choices: [
      {
        id: 'ch1_rand2_a',
        text: '全力以赴准备方案',
        effects: {
          energy: -200,
          experience: 300,
          morale: 500,
        },
        requirements: { technical: 200 },
        outcomeText: '你花了整整三天准备方案，查阅了无数资料，反复修改了十几版。虽然累得够呛，但你对自己提交的方案很有信心。',
        riskLevel: 'low',
      },
      {
        id: 'ch1_rand2_b',
        text: '先了解一下对方的需求和预算',
        effects: {
          energy: -100,
          experience: 200,
          networking: 100,
        },
        requirements: { networking: 1500 },
        outcomeText: '你先约对方吃了个饭，详细了解了他的需求和预算范围。有了这些信息，你的方案更加有的放矢。这位企业家对你的专业态度印象深刻。',
        riskLevel: 'low',
      },
      {
        id: 'ch1_rand2_c',
        text: '报低价先拿下这个客户',
        effects: {
          energy: -100,
          morale: -500,
          reputation: -500,
        },
        outcomeText: '你决定以极低的价格接下这个项目，先建立关系再说。虽然成功拿下了客户，但低价策略让你几乎没什么利润，而且可能影响后续报价。',
        riskLevel: 'medium',
      },
    ],
  },

  {
    id: 'ch1_rand3',
    type: 'crisis',
    title: '资金紧张',
    description: '你打开银行App，看着余额上不断减少的数字，心里一紧。按照目前的消耗速度，你的资金最多撑两个月。是时候认真考虑财务问题了。',
    chapter: 1,
    choices: [
      {
        id: 'ch1_rand3_a',
        text: '严格控制开支，自己做饭带饭',
        effects: {
          cash: 20000,
          energy: -1500,
          morale: -500,
          health: -500,
          monthlyExpense: -10000,
        },
        outcomeText: '你开始精打细算，每天自己做饭带饭。虽然省下了一些钱，但长期营养不良让你精力不济。',
        riskLevel: 'low',
      },
      {
        id: 'ch1_rand3_b',
        text: '向家人借一些周转资金',
        effects: {
          cash: 200000,
          morale: -100,
          mentalHealth: -500,
        },
        outcomeText: '你鼓起勇气给父母打了电话。妈妈二话不说转了20万块钱过来，还叮嘱你注意身体。你挂了电话，眼眶有些湿润——你暗暗发誓一定要成功，不辜负他们的信任。',
        riskLevel: 'low',
      },
      {
        id: 'ch1_rand3_c',
        text: '加速寻找付费客户',
        effects: {
          energy: -200,
          morale: -500,
          experience: 1500,
          networking: 100,
        },
        outcomeText: '你开始疯狂地打电话、发邮件、参加各种活动推销自己的服务。虽然被拒绝了很多次，但你的销售技巧在快速提升。',
        riskLevel: 'medium',
      },
    ],
  },

  {
    id: 'ch1_rand4',
    type: 'random',
    title: '深夜的灵感',
    description: '凌晨30点，你还在加班。突然，一个绝妙的想法闪过脑海——如果能实现这个功能/服务，绝对能打动客户！你兴奋地拿起笔开始记录……',
    chapter: 1,
    choices: [
      {
        id: 'ch1_rand4_a',
        text: '立刻开始实现这个想法',
        effects: {
          energy: -2500,
          health: -500,
          creativity: 100,
          experience: 200,
          productQuality: 500,
          burnoutRisk: 100,
        },
        outcomeText: '你通宵达旦地工作，把灵感变成了原型。虽然身体疲惫，但看到成果的那一刻，你觉得一切都值得。这就是创业者的激情。',
        riskLevel: 'medium',
      },
      {
        id: 'ch1_rand4_b',
        text: '先记录下来，明天再好好做',
        effects: {
          energy: -500,
          creativity: 500,
          morale: 500,
          mentalHealth: 500,
        },
        outcomeText: '你把想法详细记录在笔记本上，然后强迫自己上床睡觉。第二天醒来时，你发现昨晚的想法确实不错，而且休息充分让你效率更高。',
        riskLevel: 'low',
      },
    ],
  },

  {
    id: 'ch1_rand5',
    type: 'opportunity',
    title: '免费培训机会',
    description: '你收到一封邮件：当地创业孵化器正在举办为期一周的免费创业培训课程，涵盖商业模式、融资、法律等多个方面。',
    chapter: 1,
    choices: [
      {
        id: 'ch1_rand5_a',
        text: '报名参加，系统学习创业知识',
        effects: {
          energy: -1500,
          experience: 400,
          networking: 1500,
          finance: 500,
          leadership: 500,
        },
        outcomeText: '一周的培训让你受益匪浅。你不仅学到了很多实用的创业知识，还认识了一群志同道合的创业者。其中一位导师对你特别欣赏，表示愿意后续提供指导。',
        riskLevel: 'low',
      },
      {
        id: 'ch1_rand5_b',
        text: '太忙了，没时间参加',
        effects: {
          energy: 500,
          morale: -500,
        },
        outcomeText: '你觉得自己太忙了，没时间参加培训。但后来你发现，那些参加培训的创业者很多都拿到了投资或者找到了合作伙伴。你开始怀疑自己是不是错过了什么。',
        riskLevel: 'low',
      },
    ],
  },

  // ============================================================
  // 第2章：艰难起步（第31-90天）
  // ============================================================

  // --- 主线事件 ---
  {
    id: 'ch2_main1',
    type: 'story',
    title: '第一个项目',
    description: '终于，你接到了第一个正式项目！客户是一家小型企业，预算不高但要求不少。你需要在两周内交付。这是证明自己的机会，也是巨大的压力。',
    chapter: 2,
    choices: [
      {
        id: 'ch2_main1_a',
        text: '亲力亲为，确保每个细节完美',
        effects: {
          energy: -300,
          health: -100,
          experience: 400,
          productQuality: 100,
          morale: 100,
          burnoutRisk: 1500,
        },
        outcomeText: '你几乎不眠不休地工作了两周。项目按时交付，客户非常满意，甚至主动介绍了两个新客户给你。但你的身体发出了警告信号——头疼、失眠、胃痛。',
        riskLevel: 'medium',
      },
      {
        id: 'ch2_main1_b',
        text: '合理分配时间，保证质量的同时注意休息',
        effects: {
          energy: -1500,
          experience: 300,
          productQuality: 800,
          morale: 500,
        },
        outcomeText: '你制定了详细的项目计划，每天工作100小时，保证充足的休息。项目交付质量不错，客户表示满意。你学会了创业中最重要的技能——时间管理。',
        riskLevel: 'low',
      },
      {
        id: 'ch2_main1_c',
        text: '外包部分工作，自己把控核心',
        effects: {
          cash: -30000,
          energy: -100,
          experience: 2500,
          productQuality: 600,
          networking: 500,
        },
        outcomeText: '你花30000元在外包平台上找了一个帮手处理基础工作，自己专注于核心部分。项目按时交付，虽然有些细节不够完美，但你学会了如何利用外部资源。',
        riskLevel: 'medium',
      },
    ],
  },

  {
    id: 'ch2_main2',
    type: 'story',
    title: '第一笔收入',
    description: '客户打来了第一笔项目款！你看着银行通知上的数字，激动得差点跳起来。这是你创业以来赚到的第一笔钱。但同时，你也需要面对一个现实问题：这笔钱怎么用？',
    chapter: 2,
    choices: [
      {
        id: 'ch2_main2_a',
        text: '全部投入公司运营和发展',
        effects: {
          cash: 0,
          morale: 100,
          reputation: 500,
          experience: 100,
        },
        outcomeText: '你把第一笔收入全部投入了公司：升级设备、购买软件许可证、做了一些简单的宣传。虽然个人账户依然紧张，但你知道这些投入会在未来带来回报。',
        riskLevel: 'low',
      },
      {
        id: 'ch2_main2_b',
        text: '留一半作为个人生活费',
        effects: {
          cash: -50000,
          morale: 1500,
          health: 100,
          mentalHealth: 100,
          energy: 100,
        },
        outcomeText: '你取出了50000元作为生活费，给自己买了一些久违的"奢侈品"——一件新衣服和一顿好的晚餐。适当的犒劳让你重新充满了能量。',
        riskLevel: 'low',
      },
      {
        id: 'ch2_main2_c',
        text: '存起来作为应急资金',
        effects: {
          cash: 0,
          morale: 500,
          resilience: 500,
          mentalHealth: 500,
        },
        outcomeText: '你把这笔钱存了起来作为公司的应急资金。虽然现在手头紧，但你知道创业路上充满不确定性，有一笔备用金能让你在危机来临时不至于手足无措。',
        riskLevel: 'low',
      },
    ],
  },

  // --- 随机事件 ---
  {
    id: 'ch2_rand1',
    type: 'crisis',
    title: '客户要求降价',
    description: '你的客户打来电话："你们做的不错，但是预算有限，能不能打个八折？不然我们可能要考虑其他供应商了。"你陷入了两难。',
    chapter: 2,
    choices: [
      {
        id: 'ch2_rand1_a',
        text: '坚持原价，强调价值而非价格',
        effects: {
          morale: 500,
          reputation: 500,
          networking: 500,
        },
        requirements: { marketing: 2500 },
        outcomeText: '你耐心地向客户解释了你们服务的价值和独特之处。客户犹豫了一下，最终同意了原价。你保住了利润，也赢得了客户的尊重。',
        riskLevel: 'medium',
      },
      {
        id: 'ch2_rand1_b',
        text: '同意降价，留住客户',
        effects: {
          cash: -20000,
          morale: -100,
          reputation: -500,
        },
        outcomeText: '你同意了降价。虽然保住了这个客户，但利润空间被压缩了。你开始担心——如果每个客户都要求降价怎么办？',
        riskLevel: 'low',
      },
      {
        id: 'ch2_rand1_c',
        text: '提出折中方案：降价但减少服务范围',
        effects: {
          cash: -10000,
          morale: 500,
          experience: 1500,
        },
        outcomeText: '你提出了一个折中方案：适当降价，但调整服务范围。客户觉得合理，同意了。你学会了谈判的艺术——双赢才是最好的结果。',
        riskLevel: 'low',
      },
    ],
  },

  {
    id: 'ch2_rand2',
    type: 'crisis',
    title: '技术难题',
    description: '项目中遇到了一个棘手的技术难题。你尝试了各种方法都无法解决，截止日期越来越近。焦虑开始吞噬你……',
    chapter: 2,
    choices: [
      {
        id: 'ch2_rand2_a',
        text: '通宵研究，一定要自己解决',
        effects: {
          energy: -2500,
          health: -100,
          experience: 2500,
          technical: 100,
          burnoutRisk: 1500,
          mentalHealth: -500,
        },
        outcomeText: '你连续三天泡在技术文档里，终于在第72个小时找到了解决方案。虽然身体极度疲惫，但攻克难题的成就感让你兴奋不已。你的技术能力又上了一个台阶。',
        riskLevel: 'high',
      },
      {
        id: 'ch2_rand2_b',
        text: '在技术社区求助',
        effects: {
          energy: -100,
          experience: 1500,
          technical: 500,
          networking: 100,
        },
        outcomeText: '你在技术论坛上发帖求助，很快就有几位热心的大牛给出了建议。你结合他们的方案，半天就解决了问题。你意识到，善于求助也是一种能力。',
        riskLevel: 'low',
      },
      {
        id: 'ch2_rand2_c',
        text: '花钱请专家咨询',
        effects: {
          cash: -20000,
          energy: -500,
          experience: 200,
          technical: 800,
        },
        outcomeText: '你花20000元请了一位资深顾问，他只用了一个小时就帮你理清了思路。虽然花了不少钱，但你学到的解决问题的方法论是无价的。',
        riskLevel: 'low',
      },
    ],
  },

  {
    id: 'ch2_rand3',
    type: 'random',
    title: '竞争对手出现',
    description: '你发现市场上出现了一个和你做类似业务的竞争对手。他们的价格比你低300%，而且已经拿到了几个客户。你感到了前所未有的压力。',
    chapter: 2,
    choices: [
      {
        id: 'ch2_rand3_a',
        text: '研究对手，找到差异化优势',
        effects: {
          energy: -1500,
          experience: 200,
          marketing: 100,
          morale: 500,
        },
        outcomeText: '你仔细研究了竞争对手的产品和服务，发现他们在某些方面确实有优势，但在质量和定制化方面远不如你。你决定走差异化路线，专注于高端定制服务。',
        riskLevel: 'low',
      },
      {
        id: 'ch2_rand3_b',
        text: '降价迎战',
        effects: {
          cash: -30000,
          morale: -100,
          reputation: -500,
          marketShare: 500,
        },
        outcomeText: '你宣布全面降价200%。虽然短期内保住了一些客户，但利润大幅下降，而且你担心这会演变成一场没有赢家的价格战。',
        riskLevel: 'high',
      },
      {
        id: 'ch2_rand3_c',
        text: '不理会，专注做好自己的事',
        effects: {
          morale: -500,
          productQuality: 500,
          experience: 100,
        },
        outcomeText: '你决定不理会竞争对手，把精力集中在提升自己的产品和服务质量上。"最好的防守就是进攻"，你相信只要做得足够好，客户自然会来。',
        riskLevel: 'low',
      },
    ],
  },

  {
    id: 'ch2_rand4',
    type: 'crisis',
    title: '资金即将耗尽',
    description: '你算了算账，按照目前的消耗速度，公司的资金只能再撑一个月了。你必须尽快做出决定。',
    chapter: 2,
    choices: [
      {
        id: 'ch2_rand4_a',
        text: '找银行申请小额贷款',
        effects: {
          cash: 500000,
          monthlyExpense: 30000,
          morale: -500,
          mentalHealth: -500,
        },
        outcomeText: '你向银行申请了一笔50万元的小额贷款，年利率8%，每月需还款约450元。虽然增加了财务压力，但至少给了你喘息的时间。',
        riskLevel: 'medium',
      },
      {
        id: 'ch2_rand4_b',
        text: '找天使投资人',
        effects: {
          cash: 1000000,
          morale: 100,
          networking: 1500,
          reputation: 100,
        },
        requirements: { networking: 200, marketing: 200 },
        outcomeText: '通过朋友的介绍，你见到了一位天使投资人。他听了你的商业计划后很感兴趣，决定投资100万元，占股10%。有了这笔资金，你终于可以安心发展业务了。',
        riskLevel: 'medium',
      },
      {
        id: 'ch2_rand4_c',
        text: '接更多项目，加速造血',
        effects: {
          energy: -2500,
          health: -100,
          experience: 200,
          morale: -100,
          burnoutRisk: 1500,
        },
        outcomeText: '你开始疯狂接项目，同时做三四个项目。虽然收入增加了，但你的身体和精神都到了极限。你开始怀疑这种模式是否可持续。',
        riskLevel: 'high',
      },
    ],
  },

  {
    id: 'ch2_rand5',
    type: 'opportunity',
    title: '媒体采访邀请',
    description: '一个本地科技博客的记者联系你，想采访你关于"年轻人创业"的故事。这是一个免费的宣传机会！',
    chapter: 2,
    choices: [
      {
        id: 'ch2_rand5_a',
        text: '欣然接受，精心准备',
        effects: {
          energy: -100,
          reputation: 1500,
          marketing: 100,
          morale: 100,
          clients: 100,
        },
        outcomeText: '你精心准备了采访内容，讲述了自己的创业故事和理念。文章发表后引起了不错的反响，甚至有两位潜在客户通过文章找到了你。',
        riskLevel: 'low',
      },
      {
        id: 'ch2_rand5_b',
        text: '婉拒，现在还不是时候',
        effects: {
          energy: 500,
          morale: -500,
        },
        outcomeText: '你觉得公司还不够成熟，不想过早曝光。记者表示理解，说等你们有了更多成绩再联系。你错过了一个宣传机会，但也避免了可能的风险。',
        riskLevel: 'low',
      },
    ],
  },

  // ============================================================
  // 第3章：初见曙光（第91-180天）
  // ============================================================

  // --- 主线事件 ---
  {
    id: 'ch3_main1',
    type: 'story',
    title: '大客户来了',
    description: '一家知名企业通过之前的客户推荐找到了你。他们有一个大型项目需要外包，预算丰厚。但要求也很高——需要你在一个月内提交详细的方案，并且通过了他们的审核才能正式合作。',
    chapter: 3,
    choices: [
      {
        id: 'ch3_main1_a',
        text: '全力以赴，组建临时团队来应对',
        effects: {
          cash: -80000,
          energy: -200,
          experience: 500,
          morale: 1500,
          networking: 100,
        },
        requirements: { leadership: 300 },
        outcomeText: '你花了8000元请了两个自由职业者组成临时团队，分工合作准备方案。一个月后，你们提交了一份出色的方案。大客户非常满意，正式签约！这是你创业以来的最大单笔合同。',
        riskLevel: 'medium',
      },
      {
        id: 'ch3_main1_b',
        text: '自己一个人做，保持高利润',
        effects: {
          energy: -300,
          health: -1500,
          experience: 400,
          morale: 100,
          burnoutRisk: 200,
          mentalHealth: -100,
        },
        outcomeText: '你决定自己一个人完成方案，这样可以保持更高的利润。你几乎把自己逼到了极限，最终提交了一份不错的方案。客户基本满意，但提出了一些修改意见。',
        riskLevel: 'high',
      },
      {
        id: 'ch3_main1_c',
        text: '坦诚告知需要更长时间，但保证质量',
        effects: {
          energy: -1500,
          experience: 300,
          reputation: 100,
          morale: 500,
        },
        outcomeText: '你坦诚地告诉客户，为了确保最高质量，需要延长两周准备时间。客户欣赏你的诚实和专业态度，同意了延期。最终方案质量很高，客户非常满意。',
        riskLevel: 'low',
      },
    ],
  },

  {
    id: 'ch3_main2',
    type: 'story',
    title: '收购邀约',
    description: '一家行业内的中型企业向你发出了收购邀约。他们愿意出20万元收购你的公司，条件是你需要加入他们公司工作至少两年。这是你创业以来面临的最大抉择。',
    chapter: 3,
    choices: [
      {
        id: 'ch3_main2_a',
        text: '接受收购，落袋为安',
        effects: {
          cash: 2000000,
          morale: -200,
          reputation: 100,
          mentalHealth: 500,
        },
        outcomeText: '你接受了收购邀约。200万到手，你瞬间从"创业者"变成了"百万富翁"。但当你看到自己辛辛苦苦建立的公司改了名字，心里五味杂陈。也许，这不是你想要的成功方式……',
        riskLevel: 'medium',
      },
      {
        id: 'ch3_main2_b',
        text: '拒绝收购，继续独立发展',
        effects: {
          morale: 200,
          reputation: 1500,
          resilience: 1500,
          mentalHealth: -500,
        },
        outcomeText: '你礼貌地拒绝了收购邀约。收购方表示尊重你的决定，并说"随时欢迎再来谈"。你选择了更艰难的道路，但你相信自己的公司值得更多。',
        riskLevel: 'medium',
      },
      {
        id: 'ch3_main2_c',
        text: '提出战略合作而非收购',
        effects: {
          cash: 30000,
          morale: 100,
          reputation: 100,
          networking: 1500,
          marketShare: 500,
        },
        requirements: { networking: 3500, leadership: 300 },
        outcomeText: '你提出了一个替代方案：不卖公司，但愿意进行战略合作。对方觉得这个提议很有意思，最终同意了战略合作，并预付了3万元作为合作定金。你既保住了公司，又获得了一个强大的合作伙伴。',
        riskLevel: 'low',
      },
    ],
  },

  // --- 随机事件 ---
  {
    id: 'ch3_rand1',
    type: 'opportunity',
    title: '合作伙伴的背叛',
    description: '你信任的合作伙伴小王突然提出要离开公司，并且带走了两个重要客户。他说是"理念不合"，但你怀疑他是在背后接私活。你感到愤怒和失望。',
    chapter: 3,
    choices: [
      {
        id: 'ch3_rand1_a',
        text: '冷静处理，通过法律途径维权',
        effects: {
          cash: -50000,
          energy: -1500,
          morale: -1500,
          reputation: 500,
          clients: -200,
          legal: true,
        },
        requirements: { finance: 300 },
        outcomeText: '你花了5000元请律师发了律师函。虽然最终只追回了一个客户，但你建立了完善的合同和保密制度，防止类似事件再次发生。这次教训让你更加成熟。',
        riskLevel: 'medium',
      },
      {
        id: 'ch3_rand1_b',
        text: '放手，专注于发展新客户',
        effects: {
          energy: -100,
          morale: -100,
          clients: -200,
          experience: 200,
          resilience: 100,
        },
        outcomeText: '你决定不纠缠于过去，把精力放在开拓新客户上。虽然短期内损失了两个客户，但你很快找到了替代客户，而且这次经历让你学会了不把鸡蛋放在一个篮子里。',
        riskLevel: 'low',
      },
      {
        id: 'ch3_rand1_c',
        text: '直接找他当面对质',
        effects: {
          energy: -100,
          morale: -500,
          mentalHealth: -100,
          reputation: -500,
        },
        outcomeText: '你找到了小王，两人发生了激烈的争吵。虽然你发泄了情绪，但这件事在行业圈子里传开了，对你的声誉造成了一些负面影响。',
        riskLevel: 'high',
      },
    ],
  },

  {
    id: 'ch3_rand2',
    type: 'opportunity',
    title: '媒体关注',
    description: '一篇关于你公司的报道在社交媒体上火了！标题是"90后创业者如何从零到月入十万"。你的电话被打爆了，各种合作邀约纷至沓来。',
    chapter: 3,
    choices: [
      {
        id: 'ch3_rand2_a',
        text: '抓住机会，积极回应媒体',
        effects: {
          energy: -1500,
          reputation: 200,
          marketing: 100,
          clients: 300,
          morale: 1500,
        },
        outcomeText: '你迅速回应了媒体的关注，接受了几个采访，在社交媒体上积极互动。流量带来了实实在在的客户——一周内新增了30个付费客户！',
        riskLevel: 'low',
      },
      {
        id: 'ch3_rand2_b',
        text: '低调处理，专注业务',
        effects: {
          energy: 500,
          reputation: 100,
          productQuality: 500,
        },
        outcomeText: '你对媒体的关注保持低调，把精力集中在业务上。虽然错过了一些短期流量红利，但你确保了项目质量不受影响。有些客户正是因为你的低调和专业而选择了你。',
        riskLevel: 'low',
      },
    ],
  },

  {
    id: 'ch3_rand3',
    type: 'random',
    title: '团队扩张的机会',
    description: '你的大学学弟小李联系你，说他刚从大厂辞职，想加入你的创业团队。他在技术方面很有天赋，但期望薪资不低。',
    chapter: 3,
    choices: [
      {
        id: 'ch3_rand3_a',
        text: '欢迎加入，给合理的薪资和期权',
        effects: {
          cash: -15000,
          monthlyExpense: 80000,
          morale: 1500,
          technical: 100,
          teamSize: 10,
          productQuality: 500,
        },
        outcomeText: '你给小李开出了月薪80000元加50%期权的条件。他欣然接受。有了第一个正式员工，你的公司终于不再是一个人了。团队的力量开始显现。',
        riskLevel: 'medium',
      },
      {
        id: 'ch3_rand3_b',
        text: '以合伙人身份邀请，共担风险',
        effects: {
          morale: 100,
          leadership: 100,
          networking: 500,
          teamSize: 10,
        },
        requirements: { leadership: 3500 },
        outcomeText: '你向小李提出了合伙人的邀请：没有固定薪资，但给150%的股份。小李被你的诚意打动，决定加入。你们签了合伙协议，正式成为并肩作战的伙伴。',
        riskLevel: 'medium',
      },
      {
        id: 'ch3_rand3_c',
        text: '暂时不招人，保持精简',
        effects: {
          morale: -500,
          energy: -500,
        },
        outcomeText: '你婉拒了小李的请求。虽然你觉得公司还不需要全职员工，但看着小李失望离去的背影，你心里有些不安。也许你错过了一个人才。',
        riskLevel: 'low',
      },
    ],
  },

  {
    id: 'ch3_rand4',
    type: 'crisis',
    title: '税务问题',
    description: '你收到了税务局的通知，因为之前不懂税务规定，公司有一些申报不合规的地方，需要补缴税款和滞纳金，共计150000元。',
    chapter: 3,
    choices: [
      {
        id: 'ch3_rand4_a',
        text: '老老实实补缴，以后规范经营',
        effects: {
          cash: -15000,
          morale: -100,
          finance: 100,
          reputation: 500,
        },
        outcomeText: '你补缴了所有税款和滞纳金，并请了一位会计顾问帮你规范了税务流程。虽然损失了一笔钱，但你学到了宝贵的财务知识，以后不会再犯同样的错误。',
        riskLevel: 'low',
      },
      {
        id: 'ch3_rand4_b',
        text: '尝试申诉，看能否减免',
        effects: {
          cash: -50000,
          energy: -100,
          finance: 1500,
          morale: 500,
        },
        requirements: { finance: 2500 },
        outcomeText: '你准备了详细的申诉材料，亲自去了税务局说明情况。工作人员理解你是初次创业，最终同意减免了大部分滞纳金。你只补缴了50000元税款。',
        riskLevel: 'low',
      },
    ],
  },

  {
    id: 'ch3_rand5',
    type: 'random',
    title: '行业峰会邀请',
    description: '你收到了一个行业峰会的演讲邀请。作为嘉宾分享创业经验，虽然不付费，但这是极好的曝光机会。',
    chapter: 3,
    choices: [
      {
        id: 'ch3_rand5_a',
        text: '精心准备，做一场精彩的演讲',
        effects: {
          energy: -200,
          reputation: 200,
          marketing: 1500,
          networking: 200,
          morale: 1500,
          clients: 200,
        },
        requirements: { marketing: 300, leadership: 2500 },
        outcomeText: '你花了三天准备演讲稿，反复练习。演讲当天，你的分享引起了强烈共鸣，台下掌声不断。会后，好几位企业家来找你交换名片，其中两位后来成了你的客户。',
        riskLevel: 'low',
      },
      {
        id: 'ch3_rand5_b',
        text: '去参加但只做听众，积累人脉',
        effects: {
          energy: -100,
          networking: 1500,
          experience: 100,
        },
        outcomeText: '你以听众身份参加了峰会，认真听了很多分享，也认识了不少人。虽然没有上台演讲的曝光度，但你获得了大量行业信息和潜在人脉。',
        riskLevel: 'low',
      },
    ],
  },

  // ============================================================
  // 第4章：至暗时刻（第181-270天）
  // ============================================================

  // --- 主线事件 ---
  {
    id: 'ch4_main1',
    type: 'crisis',
    title: '核心客户流失',
    description: '你最大的客户——占你收入400%的那家公司，突然通知你他们决定将业务交给一家更大的供应商。这意味着你下个月的收入将骤降近一半。你感到天塌了。',
    chapter: 4,
    choices: [
      {
        id: 'ch4_main1_a',
        text: '找客户高层沟通，争取挽回',
        effects: {
          energy: -200,
          morale: -100,
          networking: 100,
          experience: 200,
        },
        requirements: { networking: 400 },
        outcomeText: '你通过关系找到了客户的高层，诚恳地了解了他们更换供应商的原因。虽然最终没能挽回这个客户，但你获得了宝贵的反馈，知道了需要改进的地方。更重要的是，这位高层表示未来有机会还可以合作。',
        riskLevel: 'medium',
      },
      {
        id: 'ch4_main1_b',
        text: '立即启动紧急客户拓展计划',
        effects: {
          energy: -2500,
          health: -100,
          morale: -1500,
          experience: 300,
          marketing: 1500,
          burnoutRisk: 1500,
        },
        outcomeText: '你像疯了一样开始拓展新客户。每天打500个电话、发100封邮件。一个月后，你拿下了30个新客户，虽然每个都不如之前的大客户，但总算弥补了一部分收入缺口。',
        riskLevel: 'high',
      },
      {
        id: 'ch4_main1_c',
        text: '缩减开支，度过寒冬',
        effects: {
          cash: 50000,
          morale: -200,
          mentalHealth: -100,
          monthlyExpense: -50000,
          teamSize: -10,
        },
        outcomeText: '你做出了痛苦的决定：辞退了一名员工，搬到了更便宜的办公室，削减了一切非必要开支。这些决定让你心如刀割，但你知道这是活下去的唯一方式。',
        riskLevel: 'medium',
      },
    ],
  },

  {
    id: 'ch4_main2',
    type: 'crisis',
    title: '法律纠纷',
    description: '你收到了一封律师函——之前的一个客户声称你的产品侵犯了他们的知识产权，要求赔偿30万元。你仔细看了律师函，发现这个指控有些牵强，但如果打官司，律师费也是一笔不小的开支。',
    chapter: 4,
    choices: [
      {
        id: 'ch4_main2_a',
        text: '请律师应诉，维护自己的权益',
        effects: {
          cash: -200000,
          energy: -200,
          morale: -1500,
          mentalHealth: -100,
          resilience: 1500,
        },
        outcomeText: '你花2万元请了一位经验丰富的知识产权律师。经过两个月的诉讼，法院最终驳回了对方的诉求。虽然花了钱和时间，但你证明了自己的清白，也积累了宝贵的法律经验。',
        riskLevel: 'high',
      },
      {
        id: 'ch4_main2_b',
        text: '尝试庭外和解',
        effects: {
          cash: -500000,
          energy: -100,
          morale: -200,
          mentalHealth: -500,
        },
        outcomeText: '你选择了庭外和解，赔偿了5万元。虽然比律师函要求的少了很多，但你觉得与其在官司上耗费精力，不如把时间花在业务上。这个决定让你心痛，但也许是最务实的选择。',
        riskLevel: 'medium',
      },
      {
        id: 'ch4_main2_c',
        text: '收集证据，证明自己的原创性',
        effects: {
          energy: -2500,
          experience: 300,
          technical: 100,
          morale: -500,
          reputation: 100,
        },
        requirements: { technical: 400 },
        outcomeText: '你花了大量时间收集了所有开发日志、设计文档和时间戳，证明你的产品是独立开发的。你把这些证据发给了对方的律师，对方看到铁证如山，主动撤回了诉讼。你不仅赢了，还一分钱没花！',
        riskLevel: 'medium',
      },
    ],
  },

  // --- 随机事件 ---
  {
    id: 'ch4_rand1',
    type: 'crisis',
    title: '合伙人离开',
    description: '你的合伙人突然提出要离开公司。他说："创业太累了，我想回到大厂稳定的工作。"更糟糕的是，他要求兑现他的股份。',
    chapter: 4,
    choices: [
      {
        id: 'ch4_rand1_a',
        text: '尊重他的选择，按协议回购股份',
        effects: {
          cash: -30000,
          morale: -2500,
          mentalHealth: -1500,
          resilience: 100,
          leadership: 100,
        },
        outcomeText: '你按照合伙协议回购了他的股份。看着他收拾东西离开，你感到无比孤独。但你知道，创业路上人来人往，只有坚持到最后的人才能看到曙光。',
        riskLevel: 'medium',
      },
      {
        id: 'ch4_rand1_b',
        text: '挽留他，提出更好的条件',
        effects: {
          cash: -100000,
          monthlyExpense: 30000,
          morale: -100,
          leadership: 500,
        },
        outcomeText: '你提出给他加薪并增加股份，苦苦挽留。他犹豫了很久，最终同意留下。但你们之间的关系已经出现了裂痕，你不确定他还能全心投入。',
        riskLevel: 'medium',
      },
      {
        id: 'ch4_rand1_c',
        text: '让他走，公司是我的',
        effects: {
          morale: -1500,
          resilience: 1500,
          mentalHealth: -100,
        },
        outcomeText: '你平静地接受了他的离开。虽然失去了一个伙伴，但你也摆脱了分歧和内耗。你深呼吸，看着空荡荡的办公室，对自己说："从今天起，我要独自面对一切。"',
        riskLevel: 'low',
      },
    ],
  },

  {
    id: 'ch4_rand2',
    type: 'crisis',
    title: '资金链断裂',
    description: '公司账上只剩下不到1万元了，而下周就要发工资和付房租。你面临着创业以来最严重的现金流危机。',
    chapter: 4,
    choices: [
      {
        id: 'ch4_rand2_a',
        text: '紧急向朋友和家人借款周转',
        effects: {
          cash: 30000,
          morale: -200,
          mentalHealth: -1500,
          reputation: -500,
        },
        outcomeText: '你厚着脸皮向身边的亲朋好友借钱。有人爽快地借了，有人委婉地拒绝了，还有人说了些让你难堪的话。你凑到了3万元，暂时度过了危机，但你的自尊心受到了严重打击。',
        riskLevel: 'medium',
      },
      {
        id: 'ch4_rand2_b',
        text: '抵押个人资产贷款',
        effects: {
          cash: 80000,
          morale: -1500,
          mentalHealth: -200,
          monthlyExpense: 50000,
          resilience: 100,
        },
        outcomeText: '你把自己的车抵押了，贷了8万元。虽然解决了燃眉之急，但每天看着没有车的停车场，你都在提醒自己：这是背水一战。',
        riskLevel: 'high',
      },
      {
        id: 'ch4_rand2_c',
        text: '延迟发工资，和员工坦诚沟通',
        effects: {
          morale: -100,
          reputation: -100,
          leadership: 100,
          mentalHealth: -500,
        },
        outcomeText: '你召开了一次艰难的会议，坦诚地告诉员工公司面临的困境，请求他们理解并同意延迟一个月发工资。有的员工理解，有的员工当场提出辞职。你感到无比愧疚。',
        riskLevel: 'high',
      },
    ],
  },

  {
    id: 'ch4_rand3',
    type: 'random',
    title: '健康预警',
    description: '你连续加班三周后，突然在办公室晕倒了。被送到医院后，医生严肃地告诉你："你的身体已经严重透支。如果继续这样下去，后果不堪设想。"你躺在病床上，第一次认真思考：创业真的值得用命去换吗？',
    chapter: 4,
    choices: [
      {
        id: 'ch4_rand3_a',
        text: '听医生的话，休养一周',
        effects: {
          cash: -30000,
          health: 200,
          energy: 200,
          mentalHealth: 1500,
          morale: -500,
          burnoutRisk: -200,
        },
        outcomeText: '你强迫自己休息了一周。虽然担心公司的运营，但你的身体和精神状态明显好转。你开始意识到，健康是一切的基础。没有健康的创业者，注定走不远。',
        riskLevel: 'low',
      },
      {
        id: 'ch4_rand3_b',
        text: '带病工作，公司离不开我',
        effects: {
          health: -200,
          energy: -1500,
          morale: -100,
          mentalHealth: -1500,
          burnoutRisk: 2500,
        },
        outcomeText: '你从医院出来后直接回了办公室。虽然你坚持工作，但效率极低，而且频繁出错。员工们看着你苍白的脸，都劝你休息，但你听不进去。你在用命赌明天。',
        riskLevel: 'high',
      },
      {
        id: 'ch4_rand3_c',
        text: '开始培养副手，学会放权',
        effects: {
          energy: 100,
          health: 100,
          leadership: 1500,
          experience: 200,
          morale: 500,
          burnoutRisk: -100,
        },
        requirements: { leadership: 3500 },
        outcomeText: '你决定借此机会开始培养副手。你把一些日常事务交给了信任的员工，自己只负责最重要的决策。虽然一开始有些不放心，但你发现团队比你想象的更能干。',
        riskLevel: 'low',
      },
    ],
  },

  {
    id: 'ch4_rand4',
    type: 'crisis',
    title: '市场变化',
    description: '行业突然发生了重大变化——一项新技术的出现让你的核心产品/服务面临被淘汰的风险。你必须迅速做出反应。',
    chapter: 4,
    choices: [
      {
        id: 'ch4_rand4_a',
        text: '投入资源研发新技术，转型升级',
        effects: {
          cash: -200000,
          energy: -200,
          experience: 300,
          technical: 1500,
          productQuality: 100,
          morale: -500,
        },
        outcomeText: '你决定all in新技术。虽然投入了大量资金和时间，但你的产品成功实现了升级。新版本不仅保留了原有优势，还增加了新功能。客户们纷纷升级，你成功跨越了技术鸿沟。',
        riskLevel: 'high',
      },
      {
        id: 'ch4_rand4_b',
        text: '转型做新技术的配套服务',
        effects: {
          cash: -50000,
          energy: -100,
          experience: 200,
          creativity: 100,
          morale: 500,
        },
        outcomeText: '你敏锐地发现，新技术虽然颠覆了你的核心业务，但也创造了新的需求。你迅速转型，开始提供新技术的配套服务。虽然一切要从头开始，但你站在了新的起跑线上。',
        riskLevel: 'medium',
      },
      {
        id: 'ch4_rand4_c',
        text: '坚持原有业务，深耕细分市场',
        effects: {
          energy: -500,
          morale: -100,
          marketShare: -100,
          resilience: 100,
        },
        outcomeText: '你决定坚持原有业务，专注于那些仍然需要传统服务的客户。虽然市场在萎缩，但你在这个细分领域建立了更强的壁垒。这条路越走越窄，但你的客户忠诚度极高。',
        riskLevel: 'high',
      },
    ],
  },

  {
    id: 'ch4_rand5',
    type: 'random',
    title: '深夜的自我怀疑',
    description: '又一个失眠的夜晚。你盯着天花板，脑海里全是负面念头："我是不是不适合创业？""也许当初不该辞职？""如果失败了怎么办？"创业的压力让你第一次感到了深深的孤独和恐惧。',
    chapter: 4,
    choices: [
      {
        id: 'ch4_rand5_a',
        text: '给信任的朋友打电话倾诉',
        effects: {
          energy: -500,
          mentalHealth: 1500,
          morale: 100,
          burnoutRisk: -100,
        },
        outcomeText: '你拨通了最好的朋友的电话，把所有的压力和恐惧都倾诉了出来。朋友静静地听完，说："你已经走了这么远，不要在黎明前放弃。"你挂了电话，感觉心里轻松了许多。',
        riskLevel: 'low',
      },
      {
        id: 'ch4_rand5_b',
        text: '写日记，整理思绪',
        effects: {
          mentalHealth: 100,
          morale: 500,
          burnoutRisk: -500,
          creativity: 500,
        },
        outcomeText: '你打开笔记本，把所有的想法都写了下来。写着写着，你发现自己的恐惧其实没有想象中那么可怕。你列出了公司的问题和解决方案，心情渐渐平静下来。',
        riskLevel: 'low',
      },
      {
        id: 'ch4_rand5_c',
        text: '强迫自己入睡，明天再说',
        effects: {
          health: -500,
          energy: -100,
          mentalHealth: -500,
          burnoutRisk: 100,
        },
        outcomeText: '你吃了一片褪黑素，强迫自己入睡。但第二天醒来，那些负面念头依然在那里。你开始意识到，逃避不能解决问题，你需要正面面对内心的恐惧。',
        riskLevel: 'low',
      },
    ],
  },

  // ============================================================
  // 第5章：浴火重生（第271-360天）
  // ============================================================

  // --- 主线事件 ---
  {
    id: 'ch5_main1',
    type: 'story',
    title: '转型成功',
    description: '经过几个月的艰难转型，你的新产品/服务终于上线了！市场反馈出乎意料地好——上线第一周就获得了500个用户/客户。你感到久违的兴奋和希望。',
    chapter: 5,
    choices: [
      {
        id: 'ch5_main1_a',
        text: '趁热打铁，加大推广力度',
        effects: {
          cash: -15000,
          morale: 200,
          reputation: 1500,
          clients: 500,
          marketShare: 100,
          monthlyRevenue: 100000,
        },
        outcomeText: '你投入1500元做推广，在社交媒体上投放广告、联系KOL合作。效果立竿见影——客户数翻了一番，月收入大幅增长。你终于看到了隧道尽头的光。',
        riskLevel: 'medium',
      },
      {
        id: 'ch5_main1_b',
        text: '稳扎稳打，先优化产品再扩张',
        effects: {
          energy: -1500,
          morale: 1500,
          productQuality: 1500,
          reputation: 100,
          experience: 200,
        },
        outcomeText: '你选择先不急于扩张，而是集中精力优化产品。你收集了第一批用户的反馈，快速迭代改进。虽然增长慢了一些，但客户满意度和留存率极高。',
        riskLevel: 'low',
      },
    ],
  },

  {
    id: 'ch5_main2',
    type: 'milestone',
    title: '突破关键里程碑',
    description: '恭喜！你的公司月收入首次突破了10万元！这是一个重要的里程碑。你站在办公室里，看着墙上贴满的便利贴和加班记录，眼眶湿润了。那些至暗时刻的坚持，终于有了回报。',
    chapter: 5,
    choices: [
      {
        id: 'ch5_main2_a',
        text: '庆祝一下，犒劳团队',
        effects: {
          cash: -50000,
          morale: 2500,
          energy: 1500,
          mentalHealth: 100,
          burnoutRisk: -1500,
        },
        outcomeText: '你请全团队去吃了一顿大餐，还给每个人发了奖金。看着大家开心的笑脸，你觉得一切辛苦都值得了。团队的凝聚力在这一刻达到了顶峰。',
        riskLevel: 'low',
      },
      {
        id: 'ch5_main2_b',
        text: '把利润投入下一个增长计划',
        effects: {
          cash: -200000,
          morale: 100,
          reputation: 100,
          marketShare: 500,
          productQuality: 500,
        },
        outcomeText: '你把大部分利润投入了产品研发和市场拓展。虽然团队没能庆祝，但你心里清楚：真正的庆祝要等到公司上市的那一天。',
        riskLevel: 'low',
      },
    ],
  },

  // --- 随机事件 ---
  {
    id: 'ch5_rand1',
    type: 'opportunity',
    title: '市场回暖',
    description: '行业整体开始回暖，市场信心恢复。多个潜在客户主动联系你，表示有兴趣合作。你感到春天的气息。',
    chapter: 5,
    choices: [
      {
        id: 'ch5_rand1_a',
        text: '精心筛选客户，只接最优质的',
        effects: {
          clients: 300,
          reputation: 100,
          productQuality: 500,
          morale: 100,
        },
        requirements: { marketing: 3500 },
        outcomeText: '你没有急于接下所有客户，而是精心筛选了最匹配的30个。虽然拒绝了其他机会，但这30个客户的质量都很高，为后续合作打下了良好基础。',
        riskLevel: 'low',
      },
      {
        id: 'ch5_rand1_b',
        text: '来者不拒，快速扩大规模',
        effects: {
          clients: 600,
          cash: -50000,
          energy: -1500,
          morale: 500,
          marketShare: 100,
          monthlyRevenue: 80000,
        },
        outcomeText: '你接下了所有能接的客户。虽然收入大幅增长，但你也开始感到力不从心——交付质量开始下降，团队疲于奔命。快速扩张的代价开始显现。',
        riskLevel: 'medium',
      },
    ],
  },

  {
    id: 'ch5_rand2',
    type: 'random',
    title: '旧敌回归',
    description: '之前背叛你的合作伙伴小王突然回来了。他说自己创业失败了，想回来继续和你合作。他的眼神里满是悔意和恳求。',
    chapter: 5,
    choices: [
      {
        id: 'ch5_rand2_a',
        text: '给他一个机会，人都会犯错',
        effects: {
          morale: -500,
          networking: 500,
          teamSize: 10,
          monthlyExpense: 6000,
          mentalHealth: -500,
        },
        outcomeText: '你决定再给小王一次机会。他回来后工作比以前更努力，似乎真的悔过了。但你是否能完全信任他，只有时间能证明。',
        riskLevel: 'medium',
      },
      {
        id: 'ch5_rand2_b',
        text: '拒绝，信任一旦破坏就很难修复',
        effects: {
          morale: 500,
          resilience: 100,
          mentalHealth: 500,
        },
        outcomeText: '你平静地拒绝了小王。虽然有些不忍，但你知道信任是合作的基础，而他已经失去了你的信任。小王默默离开，你继续前行。',
        riskLevel: 'low',
      },
      {
        id: 'ch5_rand2_c',
        text: '以顾问身份合作，不让他接触核心业务',
        effects: {
          cash: -30000,
          networking: 500,
          morale: 500,
        },
        outcomeText: '你提出了一个折中方案：小王可以作为外部顾问参与一些项目，但不涉及核心业务和客户资源。双方都接受了这个安排。',
        riskLevel: 'low',
      },
    ],
  },

  {
    id: 'ch5_rand3',
    type: 'opportunity',
    title: '政府扶持政策',
    description: '当地政府推出了针对创业企业的扶持政策，符合条件的公司可以获得最高20万元的补贴。你需要提交申请材料。',
    chapter: 5,
    choices: [
      {
        id: 'ch5_rand3_a',
        text: '认真准备申请材料',
        effects: {
          energy: -1500,
          cash: 1000000,
          morale: 1500,
          reputation: 100,
          finance: 100,
        },
        outcomeText: '你花了三天准备详细的申请材料，包括商业计划书、财务报表、团队介绍等。一个月后，你收到了好消息——申请通过！10万元补贴到账，大大缓解了公司的资金压力。',
        riskLevel: 'low',
      },
      {
        id: 'ch5_rand3_b',
        text: '找专业机构代办，省时省力',
        effects: {
            cash: 75000,
            morale: 500,
          },
        outcomeText: '你花了5000元找了一家专业的申报机构代办。虽然他们拿走了补贴的20%作为服务费，但你节省了大量时间和精力。最终拿到了8万元补贴。',
        riskLevel: 'low',
      },
    ],
  },

  {
    id: 'ch5_rand4',
    type: 'random',
    title: '新机会出现',
    description: '一个海外客户通过你的网站找到了你，希望你能为他们的中国业务提供支持。这是一个进入国际市场的机会！',
    chapter: 5,
    choices: [
      {
        id: 'ch5_rand4_a',
        text: '积极接洽，开拓海外市场',
        effects: {
          energy: -1500,
          cash: 200000,
          reputation: 1500,
          marketShare: 100,
          experience: 2500,
          networking: 100,
        },
        requirements: { marketing: 300, networking: 300 },
        outcomeText: '你和海外客户进行了多次视频会议，克服了时差和语言障碍。最终成功签约！这是你的第一个海外客户，不仅带来了2万元收入，更打开了国际化的大门。',
        riskLevel: 'medium',
      },
      {
        id: 'ch5_rand4_b',
        text: '婉拒，先做好国内市场',
        effects: {
          energy: 500,
          morale: -500,
          productQuality: 500,
        },
        outcomeText: '你婉拒了海外客户，决定先专注于国内市场。虽然错过了一个机会，但你确保了现有客户的服务质量。你告诉自己：国际化不急于一时。',
        riskLevel: 'low',
      },
    ],
  },

  {
    id: 'ch5_rand5',
    type: 'random',
    title: '团队文化建设',
    description: '随着团队规模扩大，你发现团队成员之间的沟通和协作出现了问题。有人抱怨工作量分配不均，有人说缺乏归属感。你意识到需要建立更好的团队文化。',
    chapter: 5,
    choices: [
      {
        id: 'ch5_rand5_a',
        text: '组织团建活动，增强凝聚力',
        effects: {
          cash: -30000,
          morale: 1500,
          energy: 100,
          leadership: 100,
          mentalHealth: 500,
        },
        outcomeText: '你组织了一次户外团建活动。在攀岩和烧烤的过程中，团队成员之间的距离拉近了很多。你看到了每个人不同的一面，团队氛围明显改善。',
        riskLevel: 'low',
      },
      {
        id: 'ch5_rand5_b',
        text: '建立明确的制度和沟通机制',
        effects: {
          energy: -100,
          morale: 100,
          leadership: 1500,
          experience: 1500,
        },
        requirements: { leadership: 3500 },
        outcomeText: '你花了一周时间建立了完善的内部制度：每周例会、项目管理系统、绩效考核标准。虽然过程枯燥，但团队的效率和专业度明显提升。',
        riskLevel: 'low',
      },
    ],
  },

  // ============================================================
  // 第6章：王者归来（第361-450天）
  // ============================================================

  // --- 主线事件 ---
  {
    id: 'ch6_main1',
    type: 'story',
    title: '快速增长',
    description: '你的公司进入了快速增长期。月收入从100万增长到300万，团队从50人扩大到150人。你搬进了新的办公室，有了专门的会议室和休息区。一切都在向好的方向发展，但你也感到了新的压力。',
    chapter: 6,
    choices: [
      {
        id: 'ch6_main1_a',
        text: '继续快速扩张，抢占市场份额',
        effects: {
          cash: -30000,
          monthlyExpense: 200000,
          teamSize: 100,
          marketShare: 1500,
          morale: 100,
          reputation: 100,
        },
        outcomeText: '你决定趁势快速扩张，大量招聘新员工，开拓新市场。公司规模迅速扩大，但管理难度也随之增加。你开始从"做事的人"转变为"管理者"。',
        riskLevel: 'medium',
      },
      {
        id: 'ch6_main1_b',
        text: '稳健增长，注重利润率',
        effects: {
          cash: 100000,
          morale: 100,
          productQuality: 100,
          reputation: 100,
          totalProfit: 200000,
        },
        outcomeText: '你选择稳健增长策略，注重提升利润率而非规模。虽然增长速度不如竞争对手快，但你的公司财务健康，利润率行业领先。投资人对此非常认可。',
        riskLevel: 'low',
      },
    ],
  },

  {
    id: 'ch6_main2',
    type: 'story',
    title: '道德困境',
    description: '你的一个重要客户提出了一个让你不安的要求：他们希望你在产品中添加一个功能，可以帮助他们收集用户的隐私数据。这个功能不违法，但明显违背了你的价值观。如果拒绝，可能失去这个大客户（占收入的200%）。',
    chapter: 6,
    choices: [
      {
        id: 'ch6_main2_a',
        text: '坚持原则，拒绝这个要求',
        effects: {
          cash: -200000,
          clients: -100,
          morale: -100,
          reputation: 200,
          resilience: 1500,
          mentalHealth: 500,
        },
        outcomeText: '你坚定地拒绝了客户的要求。虽然失去了一个大客户，但你的决定在行业内传开了，很多人对你的正直表示敬佩。更重要的是，你晚上终于能睡个安稳觉了。',
        riskLevel: 'medium',
      },
      {
        id: 'ch6_main2_b',
        text: '妥协，商业利益优先',
        effects: {
          cash: 30000,
          morale: -200,
          mentalHealth: -1500,
          reputation: -1500,
          burnoutRisk: 100,
        },
        outcomeText: '你最终妥协了，按照客户的要求添加了那个功能。虽然赚到了钱，但每次看到那个功能，你都感到不安。你开始质疑自己：创业到底是为了什么？',
        riskLevel: 'high',
      },
      {
        id: 'ch6_main2_c',
        text: '提出替代方案，保护隐私的同时满足需求',
        effects: {
          energy: -1500,
          experience: 2500,
          creativity: 1500,
          reputation: 1500,
          morale: 100,
          technical: 500,
        },
        requirements: { technical: 400, creativity: 3500 },
        outcomeText: '你花了几天时间设计了一个替代方案——既能满足客户的业务需求，又充分保护了用户隐私。客户被你的专业和创意打动，不仅接受了替代方案，还增加了合作预算。',
        riskLevel: 'low',
      },
    ],
  },

  // --- 随机事件 ---
  {
    id: 'ch6_rand1',
    type: 'crisis',
    title: '管理危机',
    description: '随着团队扩大，管理问题开始显现：部门之间沟通不畅、项目延期、员工流失率上升。你发现自己越来越像一个"救火队长"，每天都在处理各种突发问题。',
    chapter: 6,
    choices: [
      {
        id: 'ch6_rand1_a',
        text: '引入专业的管理层',
        effects: {
          cash: -25000,
          monthlyExpense: 15000,
          leadership: 1500,
          morale: 100,
          energy: 100,
        },
        outcomeText: '你高薪聘请了一位有经验的运营总监。他来了之后，重新梳理了组织架构和工作流程。虽然成本增加了，但公司的运营效率大幅提升，你终于可以从日常事务中抽身出来。',
        riskLevel: 'medium',
      },
      {
        id: 'ch6_rand1_b',
        text: '自己学习管理知识，亲力亲为',
        effects: {
          energy: -200,
          leadership: 200,
          experience: 2500,
          morale: -500,
        },
        outcomeText: '你报名了MBA课程，每天抽出两小时学习管理知识。你把学到的方法论应用到公司管理中，虽然过程缓慢，但你的管理能力在稳步提升。',
        riskLevel: 'low',
      },
    ],
  },

  {
    id: 'ch6_rand2',
    type: 'opportunity',
    title: 'VC投资意向',
    description: '一家知名风险投资机构对你的公司表示了浓厚的兴趣。他们愿意投资50万元，占股15%。这意味着你的公司估值达到了330万！',
    chapter: 6,
    choices: [
      {
        id: 'ch6_rand2_a',
        text: '接受投资，加速发展',
        effects: {
          cash: 5000000,
          morale: 200,
          reputation: 200,
          networking: 1500,
        },
        outcomeText: '你接受了VC的投资。500万到账后，你制定了雄心勃勃的扩张计划。有了资本的加持，你的公司开始驶入快车道。但同时，你也感受到了来自投资人的压力——他们期望在30年内看到回报。',
        riskLevel: 'medium',
      },
      {
        id: 'ch6_rand2_b',
        text: '谈判更好的条件',
        effects: {
          cash: 400000,
          morale: 1500,
          reputation: 1500,
          networking: 100,
          finance: 100,
        },
        requirements: { finance: 400, networking: 400 },
        outcomeText: '你和VC进行了多轮谈判，最终达成了一个更好的协议：投资400万，占股12%。虽然金额少了些，但你保留了更多的控制权和未来融资空间。',
        riskLevel: 'low',
      },
      {
        id: 'ch6_rand2_c',
        text: '拒绝投资，保持独立',
        effects: {
          morale: 100,
          resilience: 1500,
          reputation: 100,
          mentalHealth: 500,
        },
        outcomeText: '你礼貌地拒绝了VC的投资。你选择保持独立发展，虽然速度慢一些，但你可以按照自己的节奏和理念来经营公司。投资人表示理解，并说"大门永远为你敞开"。',
        riskLevel: 'low',
      },
    ],
  },

  {
    id: 'ch6_rand3',
    type: 'random',
    title: '新竞争者',
    description: '一家获得巨额融资的创业公司进入了你的市场。他们有强大的技术团队和充足的资金，产品定价只有你的一半。行业内的气氛变得紧张起来。',
    chapter: 6,
    choices: [
      {
        id: 'ch6_rand3_a',
        text: '专注差异化，提供他们无法复制的高价值服务',
        effects: {
          energy: -1500,
          productQuality: 100,
          reputation: 100,
          experience: 200,
          creativity: 100,
        },
        outcomeText: '你深入分析了竞争对手的弱点，发现他们在定制化服务和客户体验方面远不如你。你决定走高端路线，提供更深度的服务。虽然流失了一些价格敏感的客户，但核心客户群体更加稳固。',
        riskLevel: 'low',
      },
      {
        id: 'ch6_rand3_b',
        text: '联合其他小玩家，形成联盟',
        effects: {
          networking: 1500,
          marketShare: 500,
          reputation: 500,
          leadership: 100,
          energy: -100,
        },
        requirements: { networking: 400, leadership: 400 },
        outcomeText: '你联系了几家同样面临竞争压力的小公司，提议组成联盟，共享资源、联合推广。联盟成立后，你们的市场影响力明显增强，竞争对手也不得不重视你们。',
        riskLevel: 'medium',
      },
    ],
  },

  {
    id: 'ch6_rand4',
    type: 'random',
    title: '员工期权纠纷',
    description: '早期加入的员工提出要兑现期权，但你们之前没有签订正式的期权协议。员工威胁说如果不给股份，就要离职并带走客户资源。',
    chapter: 6,
    choices: [
      {
        id: 'ch6_rand4_a',
        text: '兑现承诺，给员工应得的回报',
        effects: {
          cash: -500000,
          morale: 1500,
          reputation: 1500,
          leadership: 100,
          mentalHealth: 500,
        },
        outcomeText: '你决定兑现当初的承诺，给早期员工发放了期权。虽然稀释了你的股份，但团队的士气和忠诚度大幅提升。其他员工看到你的诚信，更加坚定了跟随你的决心。',
        riskLevel: 'medium',
      },
      {
        id: 'ch6_rand4_b',
        text: '签署正式协议，但给予其他补偿',
        effects: {
          cash: -200000,
          morale: 500,
          finance: 100,
          leadership: 500,
        },
        requirements: { finance: 3500 },
        outcomeText: '你和员工进行了深入沟通，解释了期权兑现的复杂性。最终你们达成了一致：签署正式的期权协议（分四年兑现），同时给予一笔现金奖金作为补偿。双方都比较满意。',
        riskLevel: 'low',
      },
    ],
  },

  {
    id: 'ch6_rand5',
    type: 'opportunity',
    title: '行业奖项',
    description: '你的公司被提名参加年度"最佳创业企业"评选。如果获奖，将获得巨大的品牌曝光和行业认可。',
    chapter: 6,
    choices: [
      {
        id: 'ch6_rand5_a',
        text: '全力准备评选材料',
        effects: {
          energy: -1500,
          reputation: 2500,
          morale: 200,
          marketing: 1500,
          clients: 300,
        },
        outcomeText: '你精心准备了评选材料，展示了公司的发展历程、创新成果和社会价值。评选当天，你登台做了精彩的演讲。最终，你的公司获得了"年度最佳创业企业"奖！这个荣誉让你的公司声名鹊起。',
        riskLevel: 'low',
      },
      {
        id: 'ch6_rand5_b',
        text: '正常参与，不过度投入',
        effects: {
          energy: -500,
          reputation: 100,
          morale: 100,
        },
        outcomeText: '你正常提交了评选材料，没有过度投入。虽然没有获奖，但提名本身就是一种认可。你在颁奖典礼上认识了很多行业前辈，收获了不少有价值的人脉。',
        riskLevel: 'low',
      },
    ],
  },

  // ============================================================
  // 第7章：传奇终章（第451-540天）
  // ============================================================

  // --- 主线事件 ---
  {
    id: 'ch7_main1',
    type: 'story',
    title: '终极抉择',
    description: '经过一年多的奋斗，你的公司已经成长为行业内的知名企业。现在，你面临着创业以来最重要的抉择：\n\nA. 推动公司上市，让更多人分享你的成功\nB. 保持独立经营，按自己的节奏发展\nC. 接受大企业的收购邀约，实现财务自由\n\n这个决定将定义你和公司的未来。',
    chapter: 7,
    choices: [
      {
        id: 'ch7_main1_a',
        text: '启动IPO，走向资本市场',
        effects: {
          cash: 1000000,
          reputation: 300,
          morale: 200,
          experience: 500,
          leadership: 200,
        },
        requirements: { finance: 500, leadership: 500 },
        outcomeText: '你决定启动IPO！经过几个月的筹备，你的公司成功在科创板上市。敲钟的那一刻，你回想起创业路上的每一个日夜，泪水模糊了双眼。从一个在出租屋写代码的年轻人，到上市公司的CEO——你做到了。',
        riskLevel: 'high',
      },
      {
        id: 'ch7_main1_b',
        text: '保持独立，做一家"小而美"的公司',
        effects: {
          morale: 2500,
          reputation: 200,
          mentalHealth: 1500,
          resilience: 200,
          creativity: 100,
        },
        outcomeText: '你选择了保持独立。虽然这意味着放弃了快速扩张和巨额回报，但你拥有完全的控制权和自由。你的公司成为行业内有口皆碑的"小而美"企业，利润稳定，团队幸福。也许这就是你想要的成功。',
        riskLevel: 'low',
      },
      {
        id: 'ch7_main1_c',
        text: '接受收购，开启新的人生篇章',
        effects: {
          cash: 2000000,
          morale: 100,
          mentalHealth: 100,
          reputation: 1500,
        },
        outcomeText: '一家大型企业以2000万元收购了你的公司。签字的那一刻，你百感交集。这段创业旅程结束了，但你获得的不仅是金钱——还有经验、人脉、和一颗更强大的心。你开始思考下一个冒险……',
        riskLevel: 'medium',
      },
    ],
  },

  {
    id: 'ch7_main2',
    type: 'story',
    title: '命运审判',
    description: '创业旅程即将画上句号。你坐在办公室里，回顾这一年多的点点滴滴。那些深夜的加班、被拒绝的滋味、第一次收到付款的喜悦、至暗时刻的坚持……你给自己打了一个分。不管结果如何，这段经历已经改变了你的一生。',
    chapter: 7,
    choices: [
      {
        id: 'ch7_main2_a',
        text: '写下创业回忆录，分享经验',
        effects: {
          energy: -1500,
          reputation: 200,
          morale: 200,
          creativity: 1500,
          mentalHealth: 100,
        },
        outcomeText: '你开始写创业回忆录。每写一章，那些记忆就鲜活地浮现在眼前。你希望这些文字能帮助到其他正在创业路上挣扎的人。也许有一天，这本书会成为畅销书。',
        riskLevel: 'low',
      },
      {
        id: 'ch7_main2_b',
        text: '成立创业孵化器，帮助更多人',
        effects: {
          cash: -1000000,
          reputation: 2500,
          morale: 2500,
          leadership: 200,
          networking: 1500,
          mentalHealth: 1500,
        },
        outcomeText: '你拿出一部分资金成立了创业孵化器，为年轻的创业者提供办公空间、指导和资源。看着那些满怀梦想的年轻人，你仿佛看到了当年的自己。帮助别人成功，比自己成功更有意义。',
        riskLevel: 'low',
      },
      {
        id: 'ch7_main2_c',
        text: '休息一段时间，陪陪家人',
        effects: {
          health: 200,
          energy: 2500,
          mentalHealth: 2500,
          morale: 200,
          burnoutRisk: -300,
        },
        outcomeText: '你决定给自己放一个长假。你带着家人去了海边，看着夕阳，听着海浪。这一刻，你终于明白：创业是为了更好的生活，而不是用生活去换创业。你笑了，这是很久以来最真诚的笑容。',
        riskLevel: 'low',
      },
    ],
  },

  // --- 随机事件 ---
  {
    id: 'ch7_rand1',
    type: 'opportunity',
    title: '国际扩张机会',
    description: '一家东南亚的企业希望成为你的代理商，将你的产品/服务引入东南亚市场。这是一个走向国际化的绝佳机会。',
    chapter: 7,
    choices: [
      {
        id: 'ch7_rand1_a',
        text: '签署独家代理协议',
        effects: {
          cash: 500000,
          reputation: 1500,
          marketShare: 100,
          clients: 500,
          monthlyRevenue: 15000,
        },
        outcomeText: '你和东南亚企业签署了独家代理协议。几个月后，海外市场开始贡献可观的收入。你的公司正式成为了一家国际化企业。',
        riskLevel: 'medium',
      },
      {
        id: 'ch7_rand1_b',
        text: '先试水，签非独家代理',
        effects: {
          cash: 200000,
          reputation: 100,
          marketShare: 500,
          clients: 200,
          monthlyRevenue: 50000,
        },
        outcomeText: '你选择了保守策略，先签非独家代理试水。海外市场反馈不错，你计划在稳定后再扩大规模。',
        riskLevel: 'low',
      },
    ],
  },

  {
    id: 'ch7_rand2',
    type: 'random',
    title: '老客户的感谢',
    description: '你最早的一批客户之一给你发来一封长长的感谢信。他说："感谢你们这些年的陪伴，你们的产品/服务真的改变了我们的业务。你们是我见过的最用心的团队。"你读完信，热泪盈眶。',
    chapter: 7,
    choices: [
      {
        id: 'ch7_rand2_a',
        text: '回信感谢，并邀请见面叙旧',
        effects: {
          morale: 200,
          mentalHealth: 1500,
          networking: 100,
          energy: 500,
        },
        outcomeText: '你给客户回了一封真挚的信，并约了一起吃饭。见面时，你们聊起了当年的合作经历，感慨万千。这位客户不仅是你的客户，更成为了你的朋友。',
        riskLevel: 'low',
      },
      {
        id: 'ch7_rand2_b',
        text: '把这封信分享给团队',
        effects: {
          morale: 1500,
          leadership: 100,
          energy: 500,
          burnoutRisk: -100,
        },
        outcomeText: '你在团队会议上朗读了这封信。很多老员工也红了眼眶。这封信提醒了每个人——你们的工作是有意义的，你们真的在改变世界。',
        riskLevel: 'low',
      },
    ],
  },

  {
    id: 'ch7_rand3',
    type: 'random',
    title: '行业峰会演讲',
    description: '你受邀在年度行业峰会上做主题演讲，分享你的创业故事和经验。台下坐着上千位行业精英。',
    chapter: 7,
    choices: [
      {
        id: 'ch7_rand3_a',
        text: '分享真实的创业经历，包括失败和教训',
        effects: {
          energy: -1500,
          reputation: 2500,
          morale: 200,
          leadership: 1500,
          networking: 200,
        },
        outcomeText: '你没有选择粉饰太平，而是坦诚地分享了创业路上的每一次失败、每一次想放弃的瞬间，以及你是如何坚持下来的。演讲结束后，全场起立鼓掌。很多人排着队来和你交换名片。',
        riskLevel: 'low',
      },
      {
        id: 'ch7_rand3_b',
        text: '展示公司的成就和未来规划',
        effects: {
          energy: -100,
          reputation: 1500,
          marketing: 1500,
          morale: 100,
        },
        outcomeText: '你做了一个专业的演讲，展示了公司的发展历程、核心竞争力和未来规划。台下反响热烈，好几个投资人和合作伙伴在会后联系了你。',
        riskLevel: 'low',
      },
    ],
  },

  {
    id: 'ch7_rand4',
    type: 'random',
    title: '接班人计划',
    description: '你开始思考：如果有一天我不在了，公司会怎样？你需要培养一个接班人，确保公司的长期发展。',
    chapter: 7,
    choices: [
      {
        id: 'ch7_rand4_a',
        text: '选定一个核心成员重点培养',
        effects: {
          energy: -100,
          leadership: 200,
          morale: 100,
          resilience: 100,
        },
        outcomeText: '你选定了一位跟随你最久、最值得信赖的核心成员，开始有计划地培养他。你把越来越多的决策权交给他，自己退居幕后。你欣慰地看到，他已经可以独当一面了。',
        riskLevel: 'low',
      },
      {
        id: 'ch7_rand4_b',
        text: '建立制度化的管理团队',
        effects: {
          energy: -1500,
          leadership: 1500,
          finance: 100,
          reputation: 100,
        },
        requirements: { leadership: 4500 },
        outcomeText: '你建立了一个制度化的管理团队，每个部门都有明确的负责人和决策流程。这样即使你不在，公司也能正常运转。你从一个"人治"的企业走向了"法治"的企业。',
        riskLevel: 'low',
      },
    ],
  },

  {
    id: 'ch7_rand5',
    type: 'milestone',
    title: '创业周年纪念',
    description: '今天是你的公司成立一周年的日子。你站在窗前，看着城市的灯火，和一年前那个站在出租屋窗前的自己重叠了。你笑了——那个迷茫、焦虑的年轻人，已经成长为了一个真正的创业者。',
    chapter: 7,
    choices: [
      {
        id: 'ch7_rand5_a',
        text: '举办周年庆典，感谢所有人',
        effects: {
          cash: -100000,
          morale: 2500,
          energy: 1500,
          mentalHealth: 1500,
          reputation: 100,
          burnoutRisk: -200,
        },
        outcomeText: '你举办了一场温馨的周年庆典，邀请了所有员工、合作伙伴和客户。你站在台上，回顾了这一年的点点滴滴，感谢每一个帮助过你的人。台下掌声雷动。你知道，这不是终点，而是新的起点。',
        riskLevel: 'low',
      },
      {
        id: 'ch7_rand5_b',
        text: '安静地度过，给自己一些独处的时间',
        effects: {
          mentalHealth: 200,
          energy: 200,
          morale: 1500,
          burnoutRisk: -1500,
          creativity: 100,
        },
        outcomeText: '你选择了一个人的安静时光。你去了当初创业时经常去的那家咖啡馆，坐在同样的位置，点了一杯同样的咖啡。你拿出笔记本，开始规划下一个目标。创业者的心，永远在路上。',
        riskLevel: 'low',
      },
    ],
  },
];

/** 获取所有事件 */
export function getAllEvents(): GameEvent[] {
  return ALL_EVENTS;
}

/** 获取指定章节的事件 */
export function getChapterEvents(chapter: number): GameEvent[] {
  return ALL_EVENTS.filter(e => e.chapter === chapter);
}

/** 获取指定章节的主线事件 */
export function getMainEvents(chapter: number): GameEvent[] {
  return ALL_EVENTS.filter(e => e.chapter === chapter && e.type === 'story');
}

/** 获取指定章节的随机事件 */
export function getRandomEvents(chapter: number): GameEvent[] {
  return ALL_EVENTS.filter(e => e.chapter === chapter && e.type !== 'story');
}

/** 根据条件筛选可用事件 */
export function getAvailableEvents(chapter: number, eventHistory: string[]): GameEvent[] {
  const chapterEvents = getChapterEvents(chapter);
  return chapterEvents.filter(event => !eventHistory.includes(event.id));
}
