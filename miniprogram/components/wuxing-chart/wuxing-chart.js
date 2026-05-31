Component({
  properties: {
    wuxingCount: {
      type: Object,
      value: { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 }
    },
    balanceComment: {
      type: String,
      value: ''
    }
  },

  data: {
    wuxingData: [],
    animated: false
  },

  icons: {
    '金': '🟡', '木': '🌿', '水': '💧', '火': '🔥', '土': '⛰️'
  },
  colors: {
    '金': '#E5D3B3', '木': '#8FBC8F', '水': '#7BA4CC',
    '火': '#E08070', '土': '#C9A050'
  },
  order: ['金', '木', '水', '火', '土'],

  observers: {
    'wuxingCount'(val) {
      if (!val) return;
      this.buildData(val);
      setTimeout(() => {
        this.setData({ animated: true });
      }, 300);
    }
  },

  methods: {
    buildData(count) {
      var self = this;
      var data = self.order.map(function(name) {
        var c = count[name] || 0;
        return {
          name: name,
          icon: self.icons[name],
          color: self.colors[name],
          count: c,
          percent: (c / 8 * 100).toFixed(1),
          isEmpty: c === 0,
          barColor: c === 0 ? 'transparent' : self.colors[name]
        };
      });
      this.setData({ wuxingData: data });
    },

    onMissingTap(e) {
      var wxName = e.currentTarget.dataset.wx;
      var descs = {
        '金': '金代表义气、决断力。宜补金：佩戴金属饰品，从事金融等行业。',
        '木': '木代表仁爱、成长力。宜补木：多接触自然，养绿植，穿绿色。',
        '水': '水代表智慧、变通力。宜补水：多饮水，近水边，穿黑色蓝色。',
        '火': '火代表礼义、行动力。宜补火：多运动，晒太阳，穿红色。',
        '土': '土代表诚信、稳定力。宜补土：多接触泥土，穿黄色棕色。'
      };
      wx.showModal({
        title: wxName + '行缺失',
        content: descs[wxName] || '',
        showCancel: false,
        confirmText: '了解',
        confirmColor: '#D4AF37'
      });
    }
  }
});
