const { getAdvice } = require('../../utils/liunian');

Component({
  properties: {
    riZhuWuxing: {
      type: String,
      value: '火'
    },
    liunianGanZhi: {
      type: String,
      value: ''
    }
  },

  data: {
    activeTab: 0,
    tabs: ['颜色', '饰品', '方位', '行为'],
    advice: null
  },

  observers: {
    'riZhuWuxing, liunianGanZhi'(wx, ln) {
      if (wx) {
        this.setData({ advice: getAdvice(wx, ln) });
      }
    }
  },

  methods: {
    switchTab(e) {
      const idx = e.currentTarget.dataset.idx;
      this.setData({ activeTab: idx });
      wx.vibrateShort({ type: 'light' });
    },

    copyColor(e) {
      const color = e.currentTarget.dataset.color;
      wx.setClipboardData({
        data: color,
        success() {
          wx.showToast({ title: '色值已复制', icon: 'success' });
        }
      });
    }
  }
});
