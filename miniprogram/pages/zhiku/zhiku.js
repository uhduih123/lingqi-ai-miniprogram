Page({
  data: {
    activeTab: 0,

    masters: [
      {
        id: 1, avatar: '🧙', name: '太乙真人', skill: '八字命理',
        stars: 5, starsStr: '★★★★★',
        rate: '¥199/次', orders: 2380, rating: 4.9,
        intro: '三十载命理研究，深谙子平术与滴天髓。擅长八字格局分析、大运流年推演、事业财运规划。',
        tags: ['姻缘合婚', '事业规划', '流年分析']
      },
      {
        id: 2, avatar: '🧝', name: '紫微星君', skill: '紫微斗数',
        stars: 5, starsStr: '★★★★★',
        rate: '¥299/次', orders: 1892, rating: 4.8,
        intro: '紫微斗数传承人，精通十二宫飞星四化。擅长人生十二宫全盘分析。',
        tags: ['命盘全解', '流年运势', '财帛宫']
      },
      {
        id: 3, avatar: '🧘', name: '玄空子', skill: '风水堪舆',
        stars: 4, starsStr: '★★★★☆',
        rate: '¥399/次', orders: 1567, rating: 4.7,
        intro: '风水世家第六代传人，将传统风水与现代建筑学相结合。',
        tags: ['居家风水', '办公室布局', '选址勘察']
      },
      {
        id: 4, avatar: '🔮', name: '灵珠子', skill: '塔罗占卜',
        stars: 4, starsStr: '★★★★☆',
        rate: '¥99/次', orders: 3251, rating: 4.9,
        intro: '国际塔罗协会认证导师，8年占卜经验。擅长情感发展、事业抉择。',
        tags: ['情感占卜', '事业抉择', '年度运势']
      },
      {
        id: 5, avatar: '🌙', name: '月华仙子', skill: '奇门遁甲',
        stars: 5, starsStr: '★★★★★',
        rate: '¥499/次', orders: 892, rating: 4.9,
        intro: '奇门遁甲实战派传人，已在多家上市公司担任决策顾问。',
        tags: ['商业决策', '投资择时', '谈判预测']
      }
    ],

    skills: [
      { id: 1, emoji: '🪙', name: '六爻起卦', price: 99, desc: '铜钱六次起卦，AI精准解读64卦，附带变卦与爻辞详解', sold: 2847 },
      { id: 2, emoji: '🧭', name: '风水罗盘', price: 199, desc: '虚拟罗盘模拟，支持手机陀螺仪校准', sold: 1652 },
      { id: 3, emoji: '🎴', name: '塔罗全解', price: 149, desc: '78张塔罗牌在线抽牌，含逆位详解', sold: 3219 },
      { id: 4, emoji: '⭐', name: '星座运势', price: 79, desc: '日月上升星座三合一运势，含星盘解读', sold: 5123 },
      { id: 5, emoji: '🖐️', name: '手相分析', price: 129, desc: '拍照自动识别三线纹路，AI精准分析', sold: 1934 },
      { id: 6, emoji: '🏠', name: '居家风水', price: 299, desc: '上传户型图，AI标注吉凶方位并给出布局建议', sold: 1208 }
    ],

    selectedMaster: null,
    selectedSkill: null,
    showMaster: false,
    showSkill: false,
    purchasing: false,
    purchaseSuccess: false
  },

  switchTab: function(e) {
    var idx = parseInt(e.currentTarget.dataset.idx);
    this.setData({ activeTab: idx });
  },

  onMasterTap: function(e) {
    var id = e.currentTarget.dataset.id;
    var master = null;
    for (var i = 0; i < this.data.masters.length; i++) {
      if (this.data.masters[i].id === id) {
        master = this.data.masters[i];
        break;
      }
    }
    this.setData({ selectedMaster: master, showMaster: true });
  },

  closeMaster: function() {
    this.setData({ showMaster: false, selectedMaster: null });
  },

  onConsultMaster: function() {
    wx.showToast({ title: '咨询功能即将开放', icon: 'none' });
  },

  onSkillTap: function(e) {
    var id = e.currentTarget.dataset.id;
    var skill = null;
    for (var i = 0; i < this.data.skills.length; i++) {
      if (this.data.skills[i].id === id) {
        skill = this.data.skills[i];
        break;
      }
    }
    this.setData({ selectedSkill: skill, showSkill: true, purchaseSuccess: false });
  },

  closeSkill: function() {
    this.setData({ showSkill: false, selectedSkill: null, purchasing: false, purchaseSuccess: false });
  },

  onPurchaseSkill: function() {
    var that = this;
    this.setData({ purchasing: true });
    setTimeout(function() {
      that.setData({ purchasing: false, purchaseSuccess: true });
      wx.vibrateShort({ type: 'medium' });
    }, 1500);
  }
});
