/**
 * Intelligent Router Service for Deo & Dia AI Assistant
 *
 * Analyzes user messages and routes them to the appropriate agent based on
 * keyword matching and scoring algorithms.
 */

import type { AgentType, RoutingResult } from './types';

const DEO_KEYWORDS = [
  '如何配置',
  '配置',
  '设置',
  '安装',
  '部署',
  'setup',
  'config',
  '代码',
  '编程',
  '开发',
  'API',
  '函数',
  '变量',
  '报错',
  '错误',
  'bug',
  'code',
  'programming',
  'script',
  'function',
  'variable',
  'syntax',
  '数据库',
  '表',
  '模型',
  'schema',
  'migration',
  'query',
  'sql',
  '技术',
  '原理',
  '机制',
  '架构',
  'protocol',
  'algorithm',
  'npm',
  'yarn',
  'pnpm',
  'docker',
  'git',
  '命令行',
  'terminal',
  '解决',
  '修复',
  '排查',
  'debug',
  'troubleshoot',
  'issue',
  '性能',
  '优化',
  '安全',
  '缓存',
  'performance',
  'optimize',
  'security',
  '编译',
  '构建',
  '打包',
  'build',
  'compile',
  'deploy',
  '服务器',
  'server',
  'client',
  '前端',
  '后端',
  'backend',
  'frontend',
  '数据库',
  'database',
  '接口',
  'parameter',
  '返回值',
  'async',
  'await',
  'promise',
  'type',
  'interface',
  'class',
  'module',
  'import',
  'export',
  'runtime',
  'compiler',
  'error',
  'exception',
  'logging',
  'monitoring',
  'testing',
  'ci',
  'cd',
  'pipeline',
  'workflow',
  'git',
  'version',
  'control',
];

const DIA_KEYWORDS = [
  '创意',
  '灵感',
  '想法',
  'brainstorm',
  '想象',
  'idea',
  'inspiration',
  'creative',
  '故事',
  '写作',
  '文案',
  '脚本',
  '剧情',
  '叙事',
  'story',
  'writing',
  'narrative',
  '角色',
  '人物',
  '设定',
  '世界观',
  '背景',
  'character',
  'worldbuilding',
  'backstory',
  '感觉',
  '心情',
  '情绪',
  '帮助',
  '支持',
  '鼓励',
  'feeling',
  'emotion',
  'support',
  '设计',
  '风格',
  '美学',
  '配色',
  '艺术',
  'design',
  'aesthetic',
  'style',
  '太棒了',
  '很好',
  '不错',
  '厉害',
  '感谢',
  '谢谢',
  'great',
  'awesome',
  'thanks',
  '建议',
  '推荐',
  '怎么写',
  '如何设计',
  'suggest',
  'recommend',
  '情节',
  'plot',
  '对话',
  'dialogue',
  '描写',
  'description',
  '氛围',
  'mood',
  'tone',
  '主题',
  'theme',
  'motif',
  '象征',
  'symbolism',
  '高潮',
  'climax',
  '转折',
  'twist',
  '结局',
  'ending',
  '开头',
  'opening',
  '冲突',
  'conflict',
  '动机',
  'motivation',
  '性格',
  'personality',
  '外貌',
  'appearance',
  '背景故事',
  'lore',
  '传说',
  'legend',
  '神话',
  'mythology',
  '魔法',
  'magic',
  '能力',
  'power',
  '天赋',
  'talent',
];

const MIXED_KEYWORDS = [
  '但是',
  '而且',
  '同时',
  '另外',
  'also',
  'and',
  'plus',
  'both',
  '既...又',
  '既...也',
  '一方面...另一方面',
  'however',
  'moreover',
  'furthermore',
];

function findKeywordMatches(text: string, keywords: string[]): { keyword: string; index: number; length: number }[] {
  const matches: { keyword: string; index: number; length: number }[] = [];
  const lowerText = text.toLowerCase();

  for (const keyword of keywords) {
    const lowerKeyword = keyword.toLowerCase();
    const index = lowerText.indexOf(lowerKeyword);
    if (index !== -1) {
      matches.push({ keyword, index, length: keyword.length });
    }
  }

  return matches;
}

function calculateScore(matches: { keyword: string; index: number; length: number }[], textLength: number): number {
  if (matches.length === 0) return 0;

  const matchedChars = new Set<number>();
  for (const match of matches) {
    for (let i = match.index; i < match.index + match.length; i++) {
      matchedChars.add(i);
    }
  }

  const baseScore = Math.min(matches.length * 10, 50);
  const coverageBonus = (matchedChars.size / textLength) * 30;

  let positionBonus = 0;
  for (const match of matches) {
    if (match.index < 20) {
      positionBonus += 10;
    }
  }

  return Math.min(baseScore + coverageBonus + positionBonus, 100);
}

export function routeMessage(message: string, forceAgent?: AgentType): RoutingResult {
  if (forceAgent) {
    return {
      primaryAgent: forceAgent,
      confidence: 1.0,
      reason: `User explicitly selected ${forceAgent}`,
    };
  }

  const text = message.trim();
  const deoMatches = findKeywordMatches(text, DEO_KEYWORDS);
  const diaMatches = findKeywordMatches(text, DIA_KEYWORDS);
  const hasMixedKeywords = findKeywordMatches(text, MIXED_KEYWORDS).length > 0;

  const deoScore = calculateScore(deoMatches, text.length);
  const diaScore = calculateScore(diaMatches, text.length);

  const scoreDiff = Math.abs(deoScore - diaScore);
  const totalScore = deoScore + diaScore;

  if (totalScore === 0) {
    return {
      primaryAgent: 'deo',
      confidence: 0.5,
      reason: 'No specific keywords detected, defaulting to Deo',
    };
  }

  if (hasMixedKeywords && scoreDiff < 20) {
    return {
      primaryAgent: deoScore > diaScore ? 'deo' : 'dia',
      secondaryAgent: deoScore > diaScore ? 'dia' : 'deo',
      confidence: 0.6,
      reason: 'Mixed content detected, both agents may contribute',
    };
  }

  if (deoScore > diaScore) {
    return {
      primaryAgent: 'deo',
      secondaryAgent: diaScore > 30 ? 'dia' : undefined,
      confidence: deoScore / 100,
      reason: `Technical keywords matched (score: ${deoScore})`,
    };
  } else {
    return {
      primaryAgent: 'dia',
      secondaryAgent: deoScore > 30 ? 'deo' : undefined,
      confidence: diaScore / 100,
      reason: `Creative/emotional keywords matched (score: ${diaScore})`,
    };
  }
}

export function getAgentDisplayName(agent: AgentType): string {
  return agent === 'deo' ? 'Deo' : 'Dia';
}

export function getAgentDescription(agent: AgentType): string {
  return agent === 'deo'
    ? '技术向导 - 帮你解决技术问题和配置指导'
    : '创意伙伴 - 给你灵感和情感支持';
}
