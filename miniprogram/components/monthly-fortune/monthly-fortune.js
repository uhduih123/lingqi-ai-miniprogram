const { getMonthlyFortune } = require('../../utils/liunian');

Component({
  properties: {
    year: {
      type: Number,
      value: 2026
    }
  },

  data: {
    expanded: false,
    months: []
  },

  observers: {
    'year'(val) {
      if (val) {
        var months = getMonthlyFortune(val);
        months = months.map(function(m) {
          var cls = 'month-card';
          if (m.isCurrent) cls += ' month-current';
          if (m.level === '吉') cls += ' month-good';
          if (m.level === '凶') cls += ' month-bad';
          var tagCls = 'level-tag';
          if (m.level === '吉') tagCls += ' level-good';
          if (m.level === '凶') tagCls += ' level-bad';
          if (m.level === '平') tagCls += ' level-neutral';
          m.cardClass = cls;
          m.tagClass = tagCls;
          return m;
        });
        this.setData({ months: months });
      }
    }
  },

  lifetimes: {
    attached() {
      var months = getMonthlyFortune(this.properties.year);
      months = months.map(function(m) {
        var cls = 'month-card';
        if (m.isCurrent) cls += ' month-current';
        if (m.level === '吉') cls += ' month-good';
        if (m.level === '凶') cls += ' month-bad';
        var tagCls = 'level-tag';
        if (m.level === '吉') tagCls += ' level-good';
        if (m.level === '凶') tagCls += ' level-bad';
        if (m.level === '平') tagCls += ' level-neutral';
        m.cardClass = cls;
        m.tagClass = tagCls;
        return m;
      });
      this.setData({ months: months });
    }
  },

  methods: {
    toggle() {
      this.setData({ expanded: !this.data.expanded });
      if (!this.data.expanded) {
        wx.vibrateShort({ type: 'light' });
      }
    }
  }
});
