/**
 * 灵琪AI · 干支生克合冲关系计算模块
 */

const { TIAN_GAN, DI_ZHI } = require('./bazi');

// ==================== 天干五合 ====================
const TG_HE = {
  '甲己': '土', '己甲': '土',
  '乙庚': '金', '庚乙': '金',
  '丙辛': '水', '辛丙': '水',
  '丁壬': '木', '壬丁': '木',
  '戊癸': '火', '癸戊': '火'
};

// ==================== 地支六合 ====================
const DZ_LIU_HE = {
  '子丑': '土', '丑子': '土',
  '寅亥': '木', '亥寅': '木',
  '卯戌': '火', '戌卯': '火',
  '辰酉': '金', '酉辰': '金',
  '巳申': '水', '申巳': '水',
  '午未': '土', '未午': '土'
};

// ==================== 地支三合 ====================
const DZ_SAN_HE = {
  '申子辰': '水局', '子辰申': '水局', '辰申子': '水局',
  '亥卯未': '木局', '卯未亥': '木局', '未亥卯': '木局',
  '寅午戌': '火局', '午戌寅': '火局', '戌寅午': '火局',
  '巳酉丑': '金局', '酉丑巳': '金局', '丑巳酉': '金局'
};

// ==================== 地支六冲 ====================
const DZ_CHONG = {
  '子午': true, '午子': true,
  '丑未': true, '未丑': true,
  '寅申': true, '申寅': true,
  '卯酉': true, '酉卯': true,
  '辰戌': true, '戌辰': true,
  '巳亥': true, '亥巳': true
};

// ==================== 天干五生 ====================
const TG_WUXING_VAL = { '木': 0, '火': 1, '土': 2, '金': 3, '水': 4 };
const TG_SHENG_MAP = {};

// 天干五行映射
const TG_WX = { '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
  '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水' };

TIAN_GAN.forEach(a => {
  TIAN_GAN.forEach(b => {
    const wa = TG_WUXING_VAL[TG_WX[a]];
    const wb = TG_WUXING_VAL[TG_WX[b]];
    if ((wa + 1) % 5 === wb) TG_SHENG_MAP[a + b] = '生';
    else if ((wa + 4) % 5 === wb) TG_SHENG_MAP[a + b] = '被生';
  });
});

/**
 * 分析日柱与流年的关系
 * @param {Object} dayPillar - { gan, zhi }
 * @param {Object} liunian - { gan, zhi }
 * @returns {Object} 关系列表
 */
function analyzeRelation(dayPillar, liunian) {
  const relations = [];
  
  // 天干关系
  const tgPair = dayPillar.gan + liunian.gan;
  if (TG_HE[tgPair]) {
    relations.push({
      type: '天合',
      detail: `天干${TG_HE[tgPair]}合`,
      level: 'good',
      color: '#D4AF37'
    });
  } else if (TG_SHENG_MAP[tgPair]) {
    relations.push({
      type: TG_SHENG_MAP[tgPair] === '生' ? '天生' : '被生',
      detail: TG_SHENG_MAP[tgPair] === '生' ? '日主生流年(泄)' : '流年生日主(生)',
      level: TG_SHENG_MAP[tgPair] === '生' ? 'neutral' : 'good',
      color: TG_SHENG_MAP[tgPair] === '生' ? '#888' : '#D4AF37'
    });
  }
  
  // 地支关系
  const dzPair = dayPillar.zhi + liunian.zhi;
  if (DZ_CHONG[dzPair]) {
    relations.push({
      type: '地冲',
      detail: '地支相冲，变动剧烈',
      level: 'bad',
      color: '#E08070'
    });
  } else if (DZ_LIU_HE[dzPair]) {
    relations.push({
      type: '地合',
      detail: `地支${DZ_LIU_HE[dzPair]}合`,
      level: 'good',
      color: '#8FBC8F'
    });
  }
  
  // 天克地冲检测
  const hasTianKe = relations.some(r => r.type === '天生' && r.level === 'neutral');
  const hasDiChong = relations.some(r => r.type === '地冲');
  if (hasDiChong) {
    // 检查是否构成天克地冲 (流年克日主 + 地支相冲)
    const liunianKeRi = TG_SHENG_MAP[liunian.gan + dayPillar.gan] === '生';
    if (liunianKeRi) {
      relations.push({
        type: '天克地冲',
        detail: '流年天克地冲日柱，变动极大',
        level: 'bad',
        color: '#C04A3A'
      });
    }
  }
  
  return relations;
}

/**
 * 检测三合局 (需要整个八字)
 */
function detectSanHe(pillars, liunianZhi) {
  const allZhi = [];
  ['year', 'month', 'day', 'hour'].forEach(k => {
    if (pillars[k]) allZhi.push(pillars[k].zhi);
  });
  allZhi.push(liunianZhi);
  
  const zhiStr = allZhi.join('');
  
  for (const [combo, name] of Object.entries(DZ_SAN_HE)) {
    if (combo.split('').every(z => allZhi.includes(z))) {
      return { combo, name, color: '#C9A050' };
    }
  }
  
  return null;
}

module.exports = {
  analyzeRelation,
  detectSanHe,
  TG_HE,
  DZ_LIU_HE,
  DZ_CHONG,
  DZ_SAN_HE
};
