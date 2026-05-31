/**
 * 灵琪AI · 流年分析模块
 * 流年干支计算 + 运势建议Mock生成
 */

const { TIAN_GAN, DI_ZHI, SHENG_XIAO, SHENG_XIAO_EMOJI, TG_WUXING, DZ_WUXING } = require('./bazi');

/**
 * 计算指定年份的干支
 */
function calcYearGanZhi(year) {
  const idx = (year - 4) % 60;
  const ganIdx = idx % 10;
  const zhiIdx = idx % 12;
  return {
    ganZhi: TIAN_GAN[ganIdx] + DI_ZHI[zhiIdx],
    gan: TIAN_GAN[ganIdx],
    zhi: DI_ZHI[zhiIdx],
    ganWuxing: TG_WUXING[ganIdx],
    zhiWuxing: DZ_WUXING[zhiIdx],
    shengXiao: SHENG_XIAO[zhiIdx],
    shengXiaoEmoji: SHENG_XIAO_EMOJI[zhiIdx],
    year
  };
}

/**
 * 流年十神 (日主 vs 流年天干)
 */
function calcLiunianShiShen(riGan, liunianGan) {
  const SHI_SHEN = {
    '甲甲': '比肩', '甲乙': '劫财', '甲丙': '食神', '甲丁': '伤官',
    '甲戊': '偏财', '甲己': '正财', '甲庚': '七杀', '甲辛': '正官',
    '甲壬': '偏印', '甲癸': '正印',
    '乙甲': '劫财', '乙乙': '比肩', '乙丙': '伤官', '乙丁': '食神',
    '乙戊': '正财', '乙己': '偏财', '乙庚': '正官', '乙辛': '七杀',
    '乙壬': '正印', '乙癸': '偏印',
    '丙甲': '偏印', '丙乙': '正印', '丙丙': '比肩', '丙丁': '劫财',
    '丙戊': '食神', '丙己': '伤官', '丙庚': '偏财', '丙辛': '正财',
    '丙壬': '七杀', '丙癸': '正官',
    '丁甲': '正印', '丁乙': '偏印', '丁丙': '劫财', '丁丁': '比肩',
    '丁戊': '伤官', '丁己': '食神', '丁庚': '正财', '丁辛': '偏财',
    '丁壬': '正官', '丁癸': '七杀',
    '戊甲': '七杀', '戊乙': '正官', '戊丙': '偏印', '戊丁': '正印',
    '戊戊': '比肩', '戊己': '劫财', '戊庚': '食神', '戊辛': '伤官',
    '戊壬': '偏财', '戊癸': '正财',
    '己甲': '正官', '己乙': '七杀', '己丙': '正印', '己丁': '偏印',
    '己戊': '劫财', '己己': '比肩', '己庚': '伤官', '己辛': '食神',
    '己壬': '正财', '己癸': '偏财',
    '庚甲': '偏财', '庚乙': '正财', '庚丙': '七杀', '庚丁': '正官',
    '庚戊': '偏印', '庚己': '正印', '庚庚': '比肩', '庚辛': '劫财',
    '庚壬': '食神', '庚癸': '伤官',
    '辛甲': '正财', '辛乙': '偏财', '辛丙': '正官', '辛丁': '七杀',
    '辛戊': '正印', '辛己': '偏印', '辛庚': '劫财', '辛辛': '比肩',
    '辛壬': '伤官', '辛癸': '食神',
    '壬甲': '食神', '壬乙': '伤官', '壬丙': '偏财', '壬丁': '正财',
    '壬戊': '七杀', '壬己': '正官', '壬庚': '偏印', '壬辛': '正印',
    '壬壬': '比肩', '壬癸': '劫财',
    '癸甲': '伤官', '癸乙': '食神', '癸丙': '正财', '癸丁': '偏财',
    '癸戊': '正官', '癸己': '七杀', '癸庚': '正印', '癸辛': '偏印',
    '癸壬': '劫财', '癸癸': '比肩'
  };
  return SHI_SHEN[riGan + liunianGan] || '';
}

/**
 * 根据日主五行生成流年补运建议
 */
function getAdvice(riZhuWuxing, liunianGanZhi) {
  const advices = {
    '木': {
      hint: '火旺木泄，亟需补水润局',
      colors: ['#000000', '#1A3A5C', '#0A2A4A'],
      colorNames: ['黑色', '深蓝', '藏青'],
      items: [
        { emoji: '💎', name: '黑曜石手串' },
        { emoji: '💎', name: '海蓝宝吊坠' },
        { emoji: '💎', name: '墨翠戒指' }
      ],
      direction: '北方',
      directionDesc: '往北方发展，多近水边',
      actions: [
        '多游泳、泡澡，亲近水源',
        '办公桌放置一杯清水',
        '晨起面北深呼吸9次'
      ],
      health: '注意肝胆保养，避免熬夜',
      summary: '身弱食伤旺，聪明但易思虑过度'
    },
    '火': {
      hint: '火炎土燥，亟需补水调候',
      colors: ['#000000', '#1A3A5C', '#4A6B8A'],
      colorNames: ['黑色', '深蓝', '黛蓝'],
      items: [
        { emoji: '💎', name: '黑曜石手串' },
        { emoji: '💎', name: '海蓝宝吊坠' },
        { emoji: '💎', name: '蓝纹玛瑙' }
      ],
      direction: '北方',
      directionDesc: '往北方发展，近水为吉',
      actions: [
        '多游泳、泡澡，亲近水源',
        '多饮清水，保持水润',
        '避免正午暴晒，注意降温'
      ],
      health: '防心血管急躁，多静坐养心',
      summary: '火旺须水济，性情急躁需调伏'
    },
    '土': {
      hint: '火旺土焦，亟需补水济土',
      colors: ['#E5D3B3', '#FFFFFF', '#C0C0C0'],
      colorNames: ['米白', '银白', '金色'],
      items: [
        { emoji: '💎', name: '白水晶' },
        { emoji: '💎', name: '月光石' },
        { emoji: '💎', name: '银饰' }
      ],
      direction: '西北方',
      directionDesc: '往西北方，近金融场所',
      actions: [
        '佩戴金属饰品增金气',
        '多接触金融、数据类工作',
        '家居摆放金属摆件'
      ],
      health: '注意脾胃，少食辛辣',
      summary: '火旺土焦，金水不足，宜稳固发展'
    },
    '金': {
      hint: '火旺克金，亟需补土通关',
      colors: ['#B8860B', '#C9A050', '#8B7355'],
      colorNames: ['棕黄', '赭色', '褐色'],
      items: [
        { emoji: '💎', name: '黄水晶' },
        { emoji: '💎', name: '蜜蜡手串' },
        { emoji: '💎', name: '陶瓷饰品' }
      ],
      direction: '中部',
      directionDesc: '稳守为上，不宜远行',
      actions: [
        '多接触泥土，养花种草',
        '穿戴黄色系衣物',
        '稳扎稳打，以守为攻'
      ],
      health: '注意呼吸道，避免烟尘',
      summary: '金被火克，须土通关，以守待时'
    },
    '水': {
      hint: '火旺水干，亟需补水自救',
      colors: ['#0A0A2E', '#1A1A3E', '#000000'],
      colorNames: ['深黑', '墨蓝', '纯黑'],
      items: [
        { emoji: '💎', name: '黑曜石手串' },
        { emoji: '💎', name: '墨翠戒指' },
        { emoji: '💎', name: '海蓝宝吊坠' }
      ],
      direction: '北方',
      directionDesc: '往北方发展，多饮水近水',
      actions: [
        '多饮水，保持水润',
        '家中摆放鱼缸或流水摆件',
        '选择水边居住或办公'
      ],
      health: '注意肾脏泌尿，保证充足睡眠',
      summary: '火旺水干，须大补水，以水制火'
    }
  };
  
  return advices[riZhuWuxing] || advices['水'];
}

/**
 * 生成流月运势 (Mock 12个月)
 */
function getMonthlyFortune(year) {
  const liunian = calcYearGanZhi(year);
  const zhiNames = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const monthNames = ['正月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '十一月', '十二月'];
  
  // Liunian year's zhi index determines the starting month's zhi
  const startZhiIdx = (DI_ZHI.indexOf(liunian.zhi) + 2) % 12; // 正月地支
  
  const fortunes = [
    { text: '财运上升，宜把握机会', level: '吉' },
    { text: '贵人相助，事业有进展', level: '吉' },
    { text: '注意口舌是非', level: '平' },
    { text: '感情运势波动', level: '平' },
    { text: '健康须留意，宜体检', level: '凶' },
    { text: '桃花运旺，社交活跃', level: '吉' },
    { text: '事业有阻，宜稳守', level: '凶' },
    { text: '学业进步，考试有利', level: '吉' },
    { text: '财运平平，不宜投资', level: '平' },
    { text: '出行顺利，宜远游', level: '吉' },
    { text: '家庭和睦，喜事临门', level: '吉' },
    { text: '岁末收官，宜做总结', level: '平' }
  ];
  
  const months = [];
  for (let i = 0; i < 12; i++) {
    const zhiIdx = (startZhiIdx + i) % 12;
    const ganIdx = ((liunian.ganIdx || 0) * 2 + i) % 10;
    months.push({
      month: i + 1,
      name: monthNames[i],
      ganZhi: TIAN_GAN[ganIdx] + zhiNames[zhiIdx],
      fortune: fortunes[i].text,
      level: fortunes[i].level,
      isCurrent: (i === new Date().getMonth())
    });
  }
  
  return months;
}

module.exports = {
  calcYearGanZhi,
  calcLiunianShiShen,
  getAdvice,
  getMonthlyFortune
};
