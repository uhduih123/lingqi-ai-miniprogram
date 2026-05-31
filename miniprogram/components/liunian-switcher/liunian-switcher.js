const { calcYearGanZhi } = require('../../utils/liunian');

const WUXING_COLORS = {
  '金': '#E5D3B3', '木': '#8FBC8F', '水': '#7BA4CC',
  '火': '#E08070', '土': '#C9A050'
};

Component({
  properties: {
    year: { type: Number, value: 2026 },
    riZhuWuxing: { type: String, value: '火' }
  },

  data: {
    ganZhi: '', gan: '', zhi: '', shengXiaoEmoji: '',
    ganWuxing: '', zhiWuxing: '', ganColor: '', zhiColor: '',
    flipping: false
  },

  lifetimes: {
    attached() { this.updateYear(); }
  },

  observers: {
    'year'() { this.updateYear(); }
  },

  methods: {
    updateYear() {
      var info = calcYearGanZhi(this.properties.year);
      this.setData({
        ganZhi: info.ganZhi, gan: info.gan, zhi: info.zhi,
        shengXiaoEmoji: info.shengXiaoEmoji,
        ganWuxing: info.ganWuxing, zhiWuxing: info.zhiWuxing,
        ganColor: WUXING_COLORS[info.ganWuxing] || '#aaa',
        zhiColor: WUXING_COLORS[info.zhiWuxing] || '#aaa'
      });
    },

    onPrev() {
      this.flip(function() {
        this.triggerEvent('change', { year: this.properties.year - 1 });
      }.bind(this));
    },

    onNext() {
      this.flip(function() {
        this.triggerEvent('change', { year: this.properties.year + 1 });
      }.bind(this));
    },

    flip(callback) {
      this.setData({ flipping: true });
      try { wx.vibrateShort({ type: 'light' }); } catch (e) {}
      setTimeout(function() {
        callback();
        setTimeout(function() {
          this.setData({ flipping: false });
        }.bind(this), 150);
      }.bind(this), 200);
    }
  }
});
