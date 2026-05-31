const { analyzeRelation, detectSanHe } = require('../../utils/relation');
const { calcLiunianShiShen } = require('../../utils/liunian');

Component({
  properties: {
    baziData: {
      type: Object,
      value: null
    },
    liunian: {
      type: Object,
      value: null
    }
  },

  data: {
    shiShen: '',
    relations: [],
    sanHe: null
  },

  observers: {
    'baziData, liunian'(baziData, liunian) {
      if (!baziData || !liunian) return;
      this.analyze(baziData, liunian);
    }
  },

  methods: {
    analyze(baziData, liunian) {
      const dayPillar = {
        gan: baziData.pillars.day.gan,
        zhi: baziData.pillars.day.zhi
      };
      
      const shiShen = calcLiunianShiShen(baziData.riZhu.gan, liunian.gan);
      const relations = analyzeRelation(dayPillar, liunian);
      const sanHe = detectSanHe(baziData.pillars, liunian.zhi);

      this.setData({ shiShen, relations, sanHe });
    }
  }
});
