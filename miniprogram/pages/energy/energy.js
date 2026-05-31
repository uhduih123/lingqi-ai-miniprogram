Page({
  data: {
    energyLevel: 72,
    energyText: '平和充盈',
    energyColor: '#D4AF37',
    sphereAnim: false,
    
    showFortune: false,
    fortune: null,
    generating: false,
    
    savedFortunes: [],
    showSaved: false,
    
    dailyEnergy: null
  },

  onLoad() {
    this.generateDaily();
  },

  // 点击能量球
  onSphereTap() {
    this.setData({ sphereAnim: true });
    wx.vibrateShort({ type: 'medium' });
    
    var level = 40 + Math.floor(Math.random() * 55);
    var texts = ['平稳运行', '能量充盈', '略需调养', '状态极佳', '蓄势待发', '平和充盈', '精力充沛'];
    var colors = ['#D4AF37', '#8FBC8F', '#7BA4CC', '#F0D060', '#E08070', '#D4AF37', '#8FBC8F'];
    var idx = Math.floor(level / 15);
    
    this.setData({
      energyLevel: level,
      energyText: texts[idx] || '平和充盈',
      energyColor: colors[idx] || '#D4AF37'
    });
    
    setTimeout(function() {
      this.setData({ sphereAnim: false });
    }.bind(this), 800);
  },

  // 生成每日磁场
  generateDaily() {
    var today = new Date();
    var seed = today.getFullYear() * 10000 + (today.getMonth()+1) * 100 + today.getDate();
    var idx = seed % 8;
    
    var dailies = [
      { level: '大吉', color: '#D4AF37', emoji: '☀️', hint: '今日气场极佳，适合做重要决策和开启新项目', lucky: '北方', avoid: '冲动消费' },
      { level: '小吉', color: '#8FBC8F', emoji: '🌤️', hint: '运势平稳上扬，宜与朋友聚会交流，增进人际', lucky: '东方', avoid: '独断专行' },
      { level: '平顺', color: '#7BA4CC', emoji: '🌥️', hint: '中规中矩的一天，适合处理琐事，稳扎稳打', lucky: '南方', avoid: '冒险行为' },
      { level: '大吉', color: '#D4AF37', emoji: '✨', hint: '贵人运旺盛，可能遇到对你事业发展有帮助的人', lucky: '西方', avoid: '孤立自己' },
      { level: '平稳', color: '#C9A050', emoji: '🍃', hint: '适合反思和规划的安静一天，整理思绪', lucky: '中部', avoid: '过度消耗' },
      { level: '小吉', color: '#8FBC8F', emoji: '🌈', hint: '创意灵感爆发，适合创作和学习新知识', lucky: '东南', avoid: '思维僵化' },
      { level: '注意', color: '#E08070', emoji: '🌧️', hint: '须注意情绪波动，避免与人发生口角争执', lucky: '家中', avoid: '远行奔波' },
      { level: '大吉', color: '#D4AF37', emoji: '🔥', hint: '财运亨通，适合处理财务事宜或谈薪资', lucky: '西北', avoid: '犹豫不决' }
    ];
    
    this.setData({ dailyEnergy: dailies[idx] });
  },

  // 签文生成器
  onGenerateFortune() {
    if (this.data.generating) return;
    
    this.setData({ generating: true, showFortune: false });
    wx.vibrateShort({ type: 'heavy' });
    
    setTimeout(function() {
      var fortunes = [
        { qian: '上上签', emoji: '🌟', text: '凤凰于飞，翱翔九天。时运已至，百事可为。', advice: '今日宜：大胆行动，抓住机遇。忌：犹豫观望。', level: 'best' },
        { qian: '上吉签', emoji: '🌅', text: '旭日初升，霞光万丈。前途光明，步履坚定。', advice: '今日宜：制定计划，稳步推进。忌：急于求成。', level: 'good' },
        { qian: '中平签', emoji: '🌊', text: '流水不争先，争的是滔滔不绝。厚积薄发。', advice: '今日宜：学习积累，修身养性。忌：急功近利。', level: 'neutral' },
        { qian: '上上签', emoji: '🐉', text: '潜龙在渊，一朝腾云。蛰伏已久，是时候出山了。', advice: '今日宜：展示才华，主动出击。忌：妄自菲薄。', level: 'best' },
        { qian: '上吉签', emoji: '🌸', text: '春风得意马蹄疾，一日看尽长安花。喜事将近。', advice: '今日宜：享受当下，与亲友分享。忌：得意忘形。', level: 'good' },
        { qian: '中吉签', emoji: '🌙', text: '月有阴晴圆缺，此事古难全。顺应自然，莫要强求。', advice: '今日宜：顺其自然，调整心态。忌：固执己见。', level: 'neutral' },
        { qian: '下签提醒', emoji: '🌧️', text: '山重水复疑无路，柳暗花明又一村。逆境只是暂时的。', advice: '今日宜：保持耐心，求助他人。忌：独自硬撑。', level: 'bad' },
        { qian: '上上签', emoji: '🏔️', text: '会当凌绝顶，一览众山小。格局打开，前途无量。', advice: '今日宜：放眼长远，建立格局。忌：拘泥小节。', level: 'best' },
        { qian: '上吉签', emoji: '🎯', text: '百步穿杨，一击即中。目标明确，全力以赴。', advice: '今日宜：专注目标，排除干扰。忌：三心二意。', level: 'good' },
        { qian: '中平签', emoji: '🕯️', text: '星星之火，可以燎原。微小的开始也能成就大事。', advice: '今日宜：从小事做起，持之以恒。忌：好高骛远。', level: 'neutral' },
        { qian: '上吉签', emoji: '🦅', text: '大鹏一日同风起，扶摇直上九万里。上升期已至。', advice: '今日宜：乘势而上，接受挑战。忌：错过良机。', level: 'good' },
        { qian: '上上签', emoji: '💎', text: '宝剑锋从磨砺出，梅花香自苦寒来。所有付出都有回报。', advice: '今日宜：坚持信念，等待收获。忌：半途而废。', level: 'best' }
      ];
      
      var fortune = fortunes[Math.floor(Math.random() * fortunes.length)];
      
      this.setData({
        generating: false,
        showFortune: true,
        fortune: fortune
      });
    }.bind(this), 1200);
  },

  // 保存签文
  onSaveFortune() {
    var saved = this.data.savedFortunes;
    var f = this.data.fortune;
    var time = new Date().toLocaleString();
    
    // 避免重复
    if (saved.length > 0 && saved[0].text === f.text) {
      wx.showToast({ title: '已保存过该签文', icon: 'none' });
      return;
    }
    
    saved.unshift({ qian: f.qian, emoji: f.emoji, text: f.text, time: time });
    if (saved.length > 10) saved.pop();
    
    this.setData({ savedFortunes: saved });
    wx.setStorageSync('savedFortunes', saved);
    wx.showToast({ title: '签文已保存', icon: 'success' });
  },

  // 查看已保存签文
  toggleSaved() {
    var saved = wx.getStorageSync('savedFortunes') || [];
    this.setData({ savedFortunes: saved, showSaved: !this.data.showSaved });
  },

  closeSaved() {
    this.setData({ showSaved: false });
  }
});
