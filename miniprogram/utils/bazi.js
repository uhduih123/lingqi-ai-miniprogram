/**
 * 灵琪AI · 八字计算核心模块
 * 公历日期 → 四柱八字 + 藏干 + 十神 + 纳音 + 五行统计
 * Demo 简化版，覆盖 1900-2100 年
 */

// ==================== 基础数据表 ====================

const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const SHENG_XIAO = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
const SHENG_XIAO_EMOJI = ['🐭', '🐮', '🐯', '🐰', '🐲', '🐍', '🐴', '🐑', '🐵', '🐔', '🐶', '🐷'];

// 天干五行
const TG_WUXING = ['木', '木', '火', '火', '土', '土', '金', '金', '水', '水'];
// 地支五行
const DZ_WUXING = ['水', '土', '木', '木', '土', '火', '火', '土', '金', '金', '土', '水'];

// 五行色
const WUXING_COLORS = {
  '金': '#E5D3B3', '木': '#8FBC8F', '水': '#7BA4CC',
  '火': '#E08070', '土': '#C9A050'
};

const WUXING_BG = {
  '金': 'rgba(229,211,179,0.2)', '木': 'rgba(107,142,90,0.2)',
  '水': 'rgba(74,107,138,0.2)', '火': 'rgba(192,74,58,0.2)',
  '土': 'rgba(184,134,11,0.2)'
};

// 地支藏干 (本气、中气、余气)
const CANG_GAN = {
  '子': ['癸'],
  '丑': ['己', '癸', '辛'],
  '寅': ['甲', '丙', '戊'],
  '卯': ['乙'],
  '辰': ['戊', '乙', '癸'],
  '巳': ['丙', '庚', '戊'],
  '午': ['丁', '己'],
  '未': ['己', '丁', '乙'],
  '申': ['庚', '壬', '戊'],
  '酉': ['辛'],
  '戌': ['戊', '辛', '丁'],
  '亥': ['壬', '甲']
};

// 纳音表 (60甲子)
const NA_YIN = [
  '海中金','炉中火','大林木','路旁土','剑锋金','山头火',
  '涧下水','城头土','白蜡金','杨柳木','泉中水','屋上土',
  '霹雳火','松柏木','流年水','砂中金','山下火','平地木',
  '壁上土','金箔金','覆灯火','天河水','大驿土','钗钏金',
  '桑柘木','大溪水','沙中土','天上火','石榴木','大海水'
];

// 十神名称映射 (日主 vs 其他天干)
const SHI_SHEN_TABLE = {
  // [日主][其他天干] => 十神
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

// 日主描述
const RI_ZHU_DESC = {
  '甲': '甲木日主：参天大树，正直刚毅，积极向上，喜庚金雕琢成器',
  '乙': '乙木日主：藤萝花草，柔韧灵活，善于适应，喜癸水滋润',
  '丙': '丙火日主：太阳之火，热情奔放，光明磊落，喜壬水辅映以成既济之功',
  '丁': '丁火日主：灯烛之火，温和持久，细腻敏锐，喜甲木生扶',
  '戊': '戊土日主：城墙之土，厚重诚信，稳重踏实，喜甲木疏土',
  '己': '己土日主：田园之土，温润包容，善于养育，喜丙火暖土',
  '庚': '庚金日主：斧钺之金，刚强果断，勇于变革，喜丁火锻炼',
  '辛': '辛金日主：珠玉之金，精致细腻，追求完美，喜壬水淘洗',
  '壬': '壬水日主：江河之水，奔流不息，智慧通达，喜戊土堤防',
  '癸': '癸水日主：雨露之水，滋润万物，细腻敏感，喜辛金发源'
};

// ==================== 核心计算函数 ====================

/**
 * 计算年柱
 * @param {number} year 公历年
 * @returns {{ ganZhi: string, gan: string, zhi: string, ganIdx: number, zhiIdx: number }}
 */
function calcNianZhu(year) {
  const idx = (year - 4) % 60;
  const ganIdx = idx % 10;
  const zhiIdx = idx % 12;
  return {
    ganZhi: TIAN_GAN[ganIdx] + DI_ZHI[zhiIdx],
    gan: TIAN_GAN[ganIdx],
    zhi: DI_ZHI[zhiIdx],
    ganIdx,
    zhiIdx,
    shengXiao: SHENG_XIAO[zhiIdx],
    shengXiaoEmoji: SHENG_XIAO_EMOJI[zhiIdx]
  };
}

/**
 * 计算月柱 (年上起月法/五虎遁)
 * 年干→正月天干映射
 */
function calcYueZhu(year, month) {
  const nianGanIdx = (year - 4) % 10;
  // 甲己之年丙作首，乙庚之岁戊为头...
  const yueGanBase = [2, 4, 6, 8, 0]; // 丙(2) 戊(4) 庚(6) 壬(8) 甲(0)
  const baseIndex = yueGanBase[Math.floor(nianGanIdx / 2) % 5];
  
  // 正月为寅月 (month 1-based)
  const ganIdx = (baseIndex + (month - 1)) % 10;
  const zhiIdx = (month + 1) % 12; // 寅=2 → 正月 index=2
  
  return {
    ganZhi: TIAN_GAN[ganIdx] + DI_ZHI[zhiIdx],
    gan: TIAN_GAN[ganIdx],
    zhi: DI_ZHI[zhiIdx],
    ganIdx,
    zhiIdx
  };
}

/**
 * 计算日柱 (基准日 1900-01-01 = 甲戌日，index=10)
 * @returns {{ ganZhi, gan, zhi, ganIdx, zhiIdx }}
 */
function calcRiZhu(year, month, day) {
  // 计算距离 1900-01-01 的天数
  const baseDate = new Date(1900, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));
  
  // 1900-01-01 甲戌日: 天干 index 0, 地支 index 10
  const ganIdx = ((0 + diffDays) % 10 + 10) % 10;
  const zhiIdx = ((10 + diffDays) % 12 + 12) % 12;
  
  return {
    ganZhi: TIAN_GAN[ganIdx] + DI_ZHI[zhiIdx],
    gan: TIAN_GAN[ganIdx],
    zhi: DI_ZHI[zhiIdx],
    ganIdx,
    zhiIdx
  };
}

/**
 * 计算时柱 (日上起时法/五鼠遁)
 * @param {number} hour 0-23
 */
function calcShiZhu(riGan, hour) {
  const riGanIdx = TIAN_GAN.indexOf(riGan);
  // 甲己还加甲，乙庚丙作初...
  const shiGanBase = [0, 2, 4, 6, 8]; // 甲子, 丙子, 戊子, 庚子, 壬子
  const baseIndex = shiGanBase[Math.floor(riGanIdx / 2) % 5];
  
  // 子时=23-1点 (hour 0 = 子时, index 0)
  const zhiIdx = Math.floor((hour + 1) / 2) % 12;
  const ganIdx = (baseIndex + zhiIdx) % 10;
  
  return {
    ganZhi: TIAN_GAN[ganIdx] + DI_ZHI[zhiIdx],
    gan: TIAN_GAN[ganIdx],
    zhi: DI_ZHI[zhiIdx],
    ganIdx,
    zhiIdx
  };
}

/**
 * 计算藏干
 */
function calcCangGan(zhi) {
  return CANG_GAN[zhi] || [];
}

/**
 * 计算十神
 * @param {string} riGan 日主天干
 * @param {string} otherGan 其他天干
 */
function calcShiShen(riGan, otherGan) {
  const key = riGan + otherGan;
  return SHI_SHEN_TABLE[key] || '';
}

/**
 * 计算纳音
 * @param {string} ganZhi 干支组合 (如'甲子')
 */
function calcNaYin(ganZhi) {
  const idx = TIAN_GAN.indexOf(ganZhi[0]) * 6 + Math.floor(DI_ZHI.indexOf(ganZhi[1]) / 2);
  return NA_YIN[idx < NA_YIN.length ? idx : 0];
}

/**
 * 计算五行统计
 */
function calcWuxingCount(pillars) {
  const count = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };
  ['year', 'month', 'day', 'hour'].forEach(key => {
    const p = pillars[key];
    count[TG_WUXING[TIAN_GAN.indexOf(p.gan)]]++;
    count[DZ_WUXING[DI_ZHI.indexOf(p.zhi)]]++;
  });
  return count;
}

/**
 * 生成平衡评语
 */
function getBalanceComment(wuxingCount) {
  const entries = Object.entries(wuxingCount).sort((a, b) => b[1] - a[1]);
  const max = entries[0];
  const min = entries[4];
  
  if (min[1] === 0) {
    return `${max[0]}旺${min[0]}缺，亟需补${min[0]}调衡`;
  }
  if (max[1] >= 4) {
    return `${max[0]}势过旺，${min[0]}弱不足，宜补${min[0]}抑${max[0]}`;
  }
  if (max[1] - min[1] >= 3) {
    return `${max[0]}强${min[0]}弱，需扶${min[0]}制${max[0]}`;
  }
  return '五行较为均衡，顺势而为即可';
}

/**
 * 公历→农历转换 (精确算法)
 * 基于 1900-2100 年农历数据表
 */
// 1900-2100 年每年正月初一对应的公历日期 [year, month, day]
var SPRING_FESTIVAL = [
  [1900,1,31],[1901,2,19],[1902,2,8],[1903,1,29],[1904,2,16],[1905,2,4],[1906,1,25],[1907,2,13],[1908,2,2],[1909,1,22],
  [1910,2,10],[1911,1,30],[1912,2,18],[1913,2,6],[1914,1,26],[1915,2,14],[1916,2,3],[1917,1,23],[1918,2,11],[1919,2,1],
  [1920,2,20],[1921,2,8],[1922,1,28],[1923,2,16],[1924,2,5],[1925,1,25],[1926,2,13],[1927,2,2],[1928,1,23],[1929,2,10],
  [1930,1,30],[1931,2,17],[1932,2,6],[1933,1,26],[1934,2,14],[1935,2,4],[1936,1,24],[1937,2,11],[1938,1,31],[1939,2,19],
  [1940,2,8],[1941,1,27],[1942,2,15],[1943,2,5],[1944,1,25],[1945,2,13],[1946,2,2],[1947,1,22],[1948,2,10],[1949,1,29],
  [1950,2,17],[1951,2,6],[1952,1,27],[1953,2,14],[1954,2,3],[1955,1,24],[1956,2,12],[1957,1,31],[1958,2,18],[1959,2,8],
  [1960,1,28],[1961,2,15],[1962,2,5],[1963,1,25],[1964,2,13],[1965,2,2],[1966,1,21],[1967,2,9],[1968,1,30],[1969,2,17],
  [1970,2,6],[1971,1,27],[1972,2,15],[1973,2,3],[1974,1,23],[1975,2,11],[1976,1,31],[1977,2,18],[1978,2,7],[1979,1,28],
  [1980,2,16],[1981,2,5],[1982,1,25],[1983,2,13],[1984,2,2],[1985,2,20],[1986,2,9],[1987,1,29],[1988,2,17],[1989,2,6],
  [1990,1,27],[1991,2,15],[1992,2,4],[1993,1,23],[1994,2,10],[1995,1,31],[1996,2,19],[1997,2,7],[1998,1,28],[1999,2,16],
  [2000,2,5],[2001,1,24],[2002,2,12],[2003,2,1],[2004,1,22],[2005,2,9],[2006,1,29],[2007,2,18],[2008,2,7],[2009,1,26],
  [2010,2,14],[2011,2,3],[2012,1,23],[2013,2,10],[2014,1,31],[2015,2,19],[2016,2,8],[2017,1,28],[2018,2,16],[2019,2,5],
  [2020,1,25],[2021,2,12],[2022,2,1],[2023,1,22],[2024,2,10],[2025,1,29],[2026,2,17],[2027,2,6],[2028,1,26],[2029,2,13],
  [2030,2,3],[2031,1,23],[2032,2,11],[2033,1,31],[2034,2,19],[2035,2,8],[2036,1,28],[2037,2,15],[2038,2,4],[2039,1,24],
  [2040,2,12],[2041,2,1],[2042,1,22],[2043,2,10],[2044,1,30],[2045,2,17],[2046,2,6],[2047,1,26],[2048,2,14],[2049,2,2],
  [2050,1,23],[2051,2,11],[2052,2,1],[2053,2,19],[2054,2,8],[2055,1,28],[2056,2,15],[2057,2,4],[2058,1,24],[2059,2,12],
  [2060,2,2],[2061,1,21],[2062,2,9],[2063,1,29],[2064,2,17],[2065,2,5],[2066,1,26],[2067,2,14],[2068,2,3],[2069,1,23],
  [2070,2,11],[2071,1,31],[2072,2,19],[2073,2,7],[2074,1,27],[2075,2,15],[2076,2,5],[2077,1,24],[2078,2,12],[2079,2,2],
  [2080,1,22],[2081,2,9],[2082,1,29],[2083,2,17],[2084,2,6],[2085,1,26],[2086,2,14],[2087,2,3],[2088,1,24],[2089,2,10],
  [2090,1,30],[2091,2,18],[2092,2,7],[2093,1,27],[2094,2,15],[2095,2,5],[2096,1,25],[2097,2,12],[2098,2,1],[2099,1,21],
  [2100,2,9]
];

// 农历月份大小月编码表 (标准格式, 1900-2100)
// 低4位: 闰月(0=无), 高12位: 每月天数(1=30天,0=29天)
// bit4=正月, bit5=二月, ..., bit15=腊月
var LUNAR_INFO = [
  0x04bd8,0x04ae0,0x0a570,0x054d5,0x0d260,0x0d950,0x16554,0x056a0,0x09ad0,0x055d2,
  0x04ae0,0x0a5b6,0x0a4d0,0x0d250,0x1d255,0x0b540,0x0d6a0,0x0ada2,0x095b0,0x14977,
  0x04970,0x0a4b0,0x0b4b5,0x06a50,0x06d40,0x1ab54,0x02b60,0x09570,0x052f2,0x04970,
  0x06566,0x0d4a0,0x0ea50,0x06e95,0x05ad0,0x02b60,0x186e3,0x092e0,0x1c8d7,0x0c950,
  0x0d4a0,0x1d8a6,0x0b550,0x056a0,0x1a5b4,0x025d0,0x092d0,0x0d2b2,0x0a950,0x0b557,
  0x06ca0,0x0b550,0x15355,0x04da0,0x0a5b0,0x14573,0x052b0,0x0a9a8,0x0e950,0x06aa0,
  0x0aea6,0x0ab50,0x04b60,0x0aae4,0x0a570,0x05260,0x0f263,0x0d950,0x05b57,0x056a0,
  0x096d0,0x04dd5,0x04ad0,0x0a4d0,0x0d4d4,0x0d250,0x0d558,0x0b540,0x0b6a0,0x195a6,
  0x095b0,0x049b0,0x0a974,0x0a4b0,0x0b27a,0x06a50,0x06d40,0x0af46,0x0ab60,0x09570,
  0x04af5,0x04970,0x064b0,0x074a3,0x0ea50,0x06b58,0x05ac0,0x0ab60,0x096d5,0x092e0,
  0x0c960,0x0d954,0x0d4a0,0x0da50,0x07552,0x056a0,0x0abb7,0x025d0,0x092d0,0x0cab5,
  0x0a950,0x0b4a0,0x0baa4,0x0ad50,0x055d9,0x04ba0,0x0a5b0,0x15176,0x052b0,0x0a930,
  0x07954,0x06aa0,0x0ad50,0x05b52,0x04b60,0x0a6e6,0x0a4e0,0x0d260,0x0ea65,0x0d530,
  0x05aa0,0x076a3,0x096d0,0x04afb,0x04ad0,0x0a4d0,0x1d0b6,0x0d250,0x0d520,0x0dd45,
  0x0b5a0,0x056d0,0x055b2,0x049b0,0x0a577,0x0a4b0,0x0aa50,0x1b255,0x06d20,0x0ada0,
  0x14b63,0x09370,0x049f8,0x04970,0x064b0,0x168a6,0x0ea50,0x06aa0,0x1a6c4,0x0aae0,
  0x092e0,0x0d2e3,0x0c960,0x0d557,0x0d4a0,0x0da50,0x05d55,0x056a0,0x0a6d0,0x055d4,
  0x052d0,0x0a9b8,0x0a950,0x0b4a0,0x0b6a6,0x0ad50,0x055a0,0x0aba4,0x0a5b0,0x052b0,
  0x0b273,0x06930,0x07337,0x06aa0,0x0ad50,0x14b55,0x04b60,0x0a570,0x054e4,0x0d160,
  0x0e968,0x0d520,0x0daa0,0x16aa6,0x056d0,0x04ae0,0x0a9d4,0x0a4d0,0x0d150,0x0f252,
  0x0d520
];

var LUNAR_MONTH_NAMES = ['正月','二月','三月','四月','五月','六月','七月','八月','九月','十月','冬月','腊月'];

function lunarDayName(n) {
  // n: 1-30
  if (n === 10) return '初十';
  if (n === 20) return '二十';
  if (n === 30) return '三十';
  if (n < 10) return '初' + ['一','二','三','四','五','六','七','八','九'][n - 1];
  if (n < 20) return '十' + ['一','二','三','四','五','六','七','八','九'][n - 11];
  return '廿' + ['一','二','三','四','五','六','七','八','九'][n - 21];
}

function solarToLunar(year, month, day) {
  // 第一步：用春节表精确定位农历年
  var idx = year - 1900;
  if (idx < 0 || idx >= SPRING_FESTIVAL.length) return '';
  
  var sf = SPRING_FESTIVAL[idx];
  var targetDate = new Date(year, month - 1, day);
  var sfDate = new Date(sf[0], sf[1] - 1, sf[2]);
  var delta = Math.floor((targetDate - sfDate) / (1000 * 60 * 60 * 24));
  
  if (delta < 0) {
    idx -= 1;
    if (idx < 0) return '';
    sf = SPRING_FESTIVAL[idx];
    sfDate = new Date(sf[0], sf[1] - 1, sf[2]);
    delta = Math.floor((targetDate - sfDate) / (1000 * 60 * 60 * 24));
  }
  
  // 第二步：用月份位表在年内推算月日
  var info = LUNAR_INFO[idx];
  var leap = info & 0xf;
  var offset = delta;
  
  for (var lm = 1; lm <= 12; lm++) {
    var md = (info & (0x10000 >> lm)) ? 30 : 29;
    if (offset < md) {
      return LUNAR_MONTH_NAMES[lm - 1] + lunarDayName(offset + 1);
    }
    offset -= md;
    
    if (leap === lm) {
      var ld = (info & (0x10000 >> leap)) ? 30 : 29;
      if (offset < ld) {
        return '闰' + LUNAR_MONTH_NAMES[lm - 1] + lunarDayName(offset + 1);
      }
      offset -= ld;
    }
  }
  
  return LUNAR_MONTH_NAMES[11] + lunarDayName(offset + 1);
}

// ==================== 主入口 ====================// ==================== 主入口 ====================// ==================== 主入口 ====================// ==================== 主入口 ====================

/**
 * 计算完整八字
 * @param {number} year 公历年
 * @param {number} month 公历月 (1-12)
 * @param {number} day 公历日
 * @param {number} hour 小时 (0-23, 默认0=子时)
 */
function calcBazi(year, month, day, hour = 0) {
  const nian = calcNianZhu(year);
  const yue = calcYueZhu(year, month);
  const ri = calcRiZhu(year, month, day);
  const shi = calcShiZhu(ri.gan, hour);
  
  const pillars = {
    year: {
      ...nian,
      label: '年柱',
      cangGan: calcCangGan(nian.zhi),
      shiShen: calcShiShen(ri.gan, nian.gan),
      naYin: calcNaYin(nian.ganZhi)
    },
    month: {
      ...yue,
      label: '月柱',
      cangGan: calcCangGan(yue.zhi),
      shiShen: calcShiShen(ri.gan, yue.gan),
      naYin: calcNaYin(yue.ganZhi)
    },
    day: {
      ...ri,
      label: '日柱',
      cangGan: calcCangGan(ri.zhi),
      shiShen: '日主',
      naYin: calcNaYin(ri.ganZhi)
    },
    hour: {
      ...shi,
      label: '时柱',
      cangGan: calcCangGan(shi.zhi),
      shiShen: calcShiShen(ri.gan, shi.gan),
      naYin: calcNaYin(shi.ganZhi)
    }
  };
  
  const riZhu = {
    gan: ri.gan,
    zhi: ri.zhi,
    ganZhi: ri.ganZhi,
    wuxing: TG_WUXING[ri.ganIdx],
    desc: RI_ZHU_DESC[ri.gan] || '',
    color: WUXING_COLORS[TG_WUXING[ri.ganIdx]],
    bgColor: WUXING_BG[TG_WUXING[ri.ganIdx]]
  };
  
  const wuxingCount = calcWuxingCount(pillars);
  const balanceComment = getBalanceComment(wuxingCount);
  const lunarDate = solarToLunar(year, month, day);
  
  return {
    pillars,
    riZhu,
    wuxingCount,
    balanceComment,
    lunarDate,
    solarDate: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    birthInfo: { year, month, day, hour }
  };
}

module.exports = {
  calcBazi,
  calcNianZhu,
  calcYueZhu,
  calcRiZhu,
  calcShiZhu,
  calcCangGan,
  calcShiShen,
  calcNaYin,
  calcWuxingCount,
  getBalanceComment,
  solarToLunar,
  // 常量导出
  TIAN_GAN,
  DI_ZHI,
  SHENG_XIAO,
  SHENG_XIAO_EMOJI,
  TG_WUXING,
  DZ_WUXING,
  WUXING_COLORS,
  WUXING_BG,
  CANG_GAN,
  NA_YIN,
  SHI_SHEN_TABLE,
  RI_ZHU_DESC
};
