const { WUXING_COLORS, WUXING_BG, TG_WUXING, DZ_WUXING, TIAN_GAN, DI_ZHI } = require('../../utils/bazi');

Component({
  properties: {
    baziData: {
      type: Object,
      value: null
    }
  },

  data: {
    expandedPillar: null, // 当前展开的柱位 'year'|'month'|'day'|'hour'|null
    pillars: [],
    riZhu: null
  },

  observers: {
    'baziData'(val) {
      if (!val) return;
      this.processData(val);
    }
  },

  methods: {
    processData(data) {
      const { pillars, riZhu } = data;
      const pillarKeys = ['year', 'month', 'day', 'hour'];
      
      const processed = pillarKeys.map(key => {
        const p = pillars[key];
        const isDay = key === 'day';
        return {
          key,
          label: p.label,
          gan: p.gan,
          zhi: p.zhi,
          ganWuxing: TG_WUXING[TIAN_GAN.indexOf(p.gan)],
          zhiWuxing: DZ_WUXING[DI_ZHI.indexOf(p.zhi)],
          ganColor: WUXING_COLORS[TG_WUXING[TIAN_GAN.indexOf(p.gan)]],
          ganBg: WUXING_BG[TG_WUXING[TIAN_GAN.indexOf(p.gan)]],
          zhiColor: WUXING_COLORS[DZ_WUXING[DI_ZHI.indexOf(p.zhi)]],
          zhiBg: WUXING_BG[DZ_WUXING[DI_ZHI.indexOf(p.zhi)]],
          cangGan: p.cangGan,
          cangGanStr: (p.cangGan || []).join(' · '),
          shiShen: p.shiShen,
          naYin: p.naYin,
          isDay
        };
      });

      this.setData({
        pillars: processed,
        riZhu
      });
    },

    onPillarTap(e) {
      const { key } = e.currentTarget.dataset;
      const { expandedPillar } = this.data;
      
      // 手风琴模式：点击已展开的则折叠，否则展开新的
      if (expandedPillar === key) {
        this.setData({ expandedPillar: null });
      } else {
        this.setData({ expandedPillar: key });
        wx.vibrateShort({ type: 'light' });
      }
    },

    onRiZhuLongPress() {
      const { riZhu } = this.data;
      if (!riZhu) return;
      
      wx.vibrateShort({ type: 'medium' });
      wx.showModal({
        title: `日主·${riZhu.gan}${riZhu.wuxing}`,
        content: riZhu.desc || `${riZhu.gan}${riZhu.wuxing}日主`,
        showCancel: false,
        confirmText: '知晓',
        confirmColor: '#D4AF37'
      });
    }
  }
});
