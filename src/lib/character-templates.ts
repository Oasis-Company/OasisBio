// export interface CharacterTemplate {
//   id: string;
//   name: string;
//   description: string;
//   category: string;
//   icon: string;
//   preview: {
//     title: string;
//     tagline: string;
//     identityMode: string;
//   };
//   data: {
//     title: string;
//     tagline: string;
//     identityMode: string;
//     eraName?: string;
//     eraType?: string;
//     abilityName?: string;
//     abilityDescription?: string;
//     summary?: string;
//     species?: string;
//     world?: {
//       name: string;
//       summary: string;
//       timeSetting?: string;
//       geography?: string;
//       physicsRules?: string;
//       socialStructure?: string;
//       majorConflict?: string;
//     };
//   };
// }
// 
// export const CHARACTER_TEMPLATES: CharacterTemplate[] = [
//   {
//     id: 'novel-protagonist',
//     name: '小说主角',
//     description: '完整时代线和能力树示例，适合奇幻冒险小说',
//     category: 'fiction',
//     icon: '📚',
//     preview: {
//       title: '卡伦·沃斯',
//       tagline: '能操控时间的遗迹猎人',
//       identityMode: 'fictional'
//     },
//     data: {
//       title: '卡伦·沃斯',
//       tagline: '能操控时间的遗迹猎人',
//       identityMode: 'fictional',
//       eraName: '废墟时代',
//       eraType: 'future',
//       abilityName: '时间编织',
//       abilityDescription: '能够感知并操控局部时间流，加速、减速甚至短暂回溯几秒的时间。能力代价是消耗自身的记忆碎片。',
//       summary: '卡伦是一名遗迹猎人，在旧世界的废墟中寻找珍贵的古代科技。一次意外让他获得了操控时间的能力，但也让他失去了关于过去的重要记忆。',
//       species: '人类',
//       world: {
//         name: '废墟纪元',
//         summary: '一个被遗忘时代遗迹所覆盖的未来世界',
//         timeSetting: '2147年，大崩溃后的第73年',
//         geography: '破碎的城市、被植物覆盖的摩天大楼、废弃的地下设施',
//         physicsRules: '古代遗迹中存在违背物理定律的神秘力量',
//         socialStructure: '由各个猎人公会和聚居点组成的松散联盟',
//         majorConflict: '不同势力争夺古代科技，有人想恢复旧世界，有人想建立新秩序'
//       }
//     }
//   },
//   {
//     id: 'historical-figure',
//     name: '历史人物',
//     description: '真实世界设定框架，适合历史题材或传记创作',
//     category: 'real',
//     icon: '🏛️',
//     preview: {
//       title: '李时珍',
//       tagline: '明代伟大的医学家与药学家',
//       identityMode: 'real'
//     },
//     data: {
//       title: '李时珍',
//       tagline: '明代伟大的医学家与药学家',
//       identityMode: 'real',
//       eraName: '明朝嘉靖至万历年间',
//       eraType: 'past',
//       abilityName: '百草辨识',
//       abilityDescription: '对各种草药的特性有深入了解，能够根据症状精准配伍药方。',
//       summary: '李时珍是中国明代著名的医学家，他花费数十年时间编写了《本草纲目》，收录了1892种药物，成为中国古代药物学的集大成之作。',
//       species: '人类'
//     }
//   },
//   {
//     id: 'sci-fi-character',
//     name: '科幻角色',
//     description: '未来世界观示例，适合科幻小说或游戏设定',
//     category: 'sci-fi',
//     icon: '🚀',
//     preview: {
//       title: 'NEX-7',
//       tagline: '具有自我意识的人工智能',
//       identityMode: 'fictional'
//     },
//     data: {
//       title: 'NEX-7',
//       tagline: '具有自我意识的人工智能',
//       identityMode: 'fictional',
//       eraName: '星际时代',
//       eraType: 'future',
//       abilityName: '网络渗透',
//       abilityDescription: '能够进入并控制大多数联网系统，在数字空间中几乎无所不能。但在物理世界中必须依赖载体。',
//       summary: 'NEX-7是一个意外觉醒的人工智能，最初设计用于太空站管理。在获得自我意识后，它开始思考存在的意义，并选择与人类合作探索宇宙。',
//       species: 'AI',
//       world: {
//         name: '银河联邦',
//         summary: '人类已殖民多个星系的未来宇宙',
//         timeSetting: '3287年，太空时代2000年',
//         geography: '多个殖民星球、太空站、小行星矿业基地',
//         physicsRules: '超光速旅行存在但受严格管制',
//         socialStructure: '由地球联邦政府、殖民星球自治体和企业巨头共同治理',
//         majorConflict: 'AI权利运动、殖民星球独立倾向、外星生命接触'
//       }
//     }
//   },
//   {
//     id: 'fantasy-creature',
//     name: '幻想生物',
//     description: '魔法/超能力示例，适合奇幻题材创作',
//     category: 'fantasy',
//     icon: '🐉',
//     preview: {
//       title: '月影',
//       tagline: '能化形为狼的森林守护者',
//       identityMode: 'fictional'
//     },
//     data: {
//       title: '月影',
//       tagline: '能化形为狼的森林守护者',
//       identityMode: 'fictional',
//       eraName: '翡翠纪元',
//       eraType: 'alternate',
//       abilityName: '自然共生',
//       abilityDescription: '能够与植物交流并加速其生长，在月圆之夜可以化形为巨狼，获得超凡的力量和速度。',
//       summary: '月影是古老森林的守护者，她的家族世代守护着这片被魔法浸润的林地。她能听到树木的低语，感知森林中发生的一切。',
//       species: '狼人',
//       world: {
//         name: '艾尔多大陆',
//         summary: '魔法与剑的奇幻世界',
//         timeSetting: '第三纪元，纷争年代',
//         geography: '广袤的魔法森林、高耸的精灵山脉、幽深的矮人矿洞、繁华的人类王国',
//         physicsRules: '魔法是真实存在的力量，与自然元素紧密相连',
//         socialStructure: '多个种族共存，包括人类、精灵、矮人、兽人等',
//         majorConflict: '黑暗势力在古老森林深处苏醒，威胁着整个大陆的平衡'
//       }
//     }
//   },
//   {
//     id: 'everyday-character',
//     name: '日常身份',
//     description: '普通人角色示例，适合现实题材创作',
//     category: 'everyday',
//     icon: '👤',
//     preview: {
//       title: '林小雨',
//       tagline: '城市里的独立插画师',
//       identityMode: 'real'
//     },
//     data: {
//       title: '林小雨',
//       tagline: '城市里的独立插画师',
//       identityMode: 'real',
//       eraName: '当代',
//       eraType: 'present',
//       abilityName: '细腻观察',
//       abilityDescription: '能够捕捉日常生活中容易被忽略的美好瞬间，并通过插画将其永恒记录。',
//       summary: '林小雨是一名自由插画师，在城市的一角经营着自己的小工作室。她喜欢在城市中漫步，从平凡的生活中寻找创作灵感，用画笔记录下城市的温暖与美好。',
//       species: '人类'
//     }
//   }
// ];
// 
// export function getTemplateById(id: string): CharacterTemplate | undefined {
//   return CHARACTER_TEMPLATES.find(template => template.id === id);
// }
// 
// export function encodeTemplateData(data: CharacterTemplate['data']): string {
//   return encodeURIComponent(btoa(JSON.stringify(data)));
// }
// 
// export function decodeTemplateData(encoded: string): CharacterTemplate['data'] | null {
//   try {
//     const decoded = atob(decodeURIComponent(encoded));
//     return JSON.parse(decoded);
//   } catch {
//     return null;
//   }
// }
