const { calcBazi, solarToLunar } = require('../../utils/bazi');
const { calcYearGanZhi, getAdvice } = require('../../utils/liunian');

Page({
  data: {
    // 输入
    birthday: '',
    loading: false,
    
    // 排盘结果
    showResult: false,
    baziResult: null,
    lunarDate: '',
    lunarPreview: '',
    
    // 流年
    currentYear: 2026,
    currentLiunian: null,
    liunianAdvice: null,
    
    // UI
    showMonthly: false,
    scrollTop: 0,
    headerShadow: false,
    
    // 吸顶高度
    statusBarHeight: 44,
    navBarHeight: 44,
    headerTotalHeight: 88
  },

  onLoad() {
    try {
      var windowInfo = wx.getWindowInfo();
      var statusBarH = windowInfo.statusBarHeight || 20;
      
      // getMenuButtonBoundingClientRect 在某些版本可能不可用
      let navBarH = 44;
      try {
        const menuBtn = wx.getMenuButtonBoundingClientRect();
        navBarH = (menuBtn.top - statusBarH) * 2 + menuBtn.height;
      } catch (e) {
        console.warn('getMenuButtonBoundingClientRect failed, using default:', e);
      }

      this.setData({
        statusBarHeight: statusBarH,
        navBarHeight: navBarH,
        headerTotalHeight: statusBarH + navBarH
      });

      // 恢复缓存
      const cached = wx.getStorageSync('birthday');
      if (cached) {
        this.setData({ birthday: cached });
      } else {
        // 从档案读取生日
        var profile = wx.getStorageSync('userProfile');
        if (profile && profile.birthday) {
          this.setData({ birthday: profile.birthday });
        }
      }
      
      // 优先从档案读取生日
      var profile = wx.getStorageSync('userProfile');
      if (profile && profile.birthday) {
        this.setData({ birthday: profile.birthday, profileSet: true });
        console.log('从档案读取生日:', profile.birthday);
      }
      
      // 否则设置默认日期为今天
      if (!this.data.birthday) {
        var today = new Date();
        var y = today.getFullYear();
        var m = String(today.getMonth() + 1).padStart(2, '0');
        var d = String(today.getDate()).padStart(2, '0');
        this.setData({ birthday: y + '-' + m + '-' + d, currentYear: y });
      }
      
      console.log('命盘页面初始化完成', this.data.birthday);

      // 检查是否有需要恢复的排盘
      var restoreBazi = wx.getStorageSync('restoreBazi');
      var restoreBirthday = wx.getStorageSync('restoreBirthday');
      if (restoreBazi && restoreBirthday) {
        wx.removeStorageSync('restoreBazi');
        wx.removeStorageSync('restoreBirthday');
        this.setData({ birthday: restoreBirthday }, function() {
          this.doCalculate();
        }.bind(this));
      }
    } catch (err) {
      console.error('onLoad 失败:', err);
      // 设置默认值保证页面可用
      const today = new Date();
      const y = today.getFullYear();
      const m = String(today.getMonth() + 1).padStart(2, '0');
      const d = String(today.getDate()).padStart(2, '0');
      this.setData({ birthday: `${y}-${m}-${d}`, currentYear: y });
    }
  },

  onShow: function() {
    // 每次切换到命盘Tab时同步档案生日
    if (!this.data.showResult) {
      var profile = wx.getStorageSync('userProfile');
      if (profile && profile.birthday) {
        if (this.data.birthday !== profile.birthday) {
          this.setData({ birthday: profile.birthday });
          console.log('onShow 同步生日:', profile.birthday);
        }
      }
    }
  },

  // ==================== 输入区 ====================
  
  onBirthdayChange: function(e) {
    this.setData({ birthday: e.detail.value });
    console.log('日期已选择:', e.detail.value);
    // 实时预览农历
    var parts = e.detail.value.split('-');
    if (parts.length === 3) {
      var y = parseInt(parts[0]), m = parseInt(parts[1]), d = parseInt(parts[2]);
      try {
        var lunarPreview = solarToLunar(y, m, d);
        this.setData({ lunarPreview: lunarPreview });
      } catch (err) {
        this.setData({ lunarPreview: '' });
      }
    }
  },

  onPaipan() {
    console.log('onPaipan 触发, birthday:', this.data.birthday);
    const { birthday } = this.data;
    if (!birthday) {
      wx.showToast({ title: '请先选择出生日期', icon: 'none' });
      return;
    }

    this.setData({ loading: true });
    try {
      wx.vibrateShort({ type: 'light' });
    } catch (e) {}

    // 模拟推演延迟
    setTimeout(() => {
      this.doCalculate();
    }, 600);
  },

  doCalculate() {
    console.log('doCalculate 开始');
    try {
      const parts = this.data.birthday.split('-');
      console.log('生日解析:', parts);
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10);
      const d = parseInt(parts[2], 10);
      console.log('年月日:', y, m, d);
      
      const baziResult = calcBazi(y, m, d, 0);
      console.log('排盘结果:', JSON.stringify(baziResult.riZhu));
      
      const lunarDate = baziResult.lunarDate;
      
      // 缓存
      wx.setStorageSync('birthday', this.data.birthday);
      wx.setStorageSync('baziResult', baziResult);
      
      // 计算当前流年
      const currentLiunian = calcYearGanZhi(this.data.currentYear);
      const liunianAdvice = getAdvice(baziResult.riZhu.wuxing, currentLiunian.ganZhi);

      this.setData({
        loading: false,
        showResult: true,
        baziResult: baziResult,
        lunarDate: lunarDate,
        currentLiunian: currentLiunian,
        liunianAdvice: liunianAdvice
      });

      console.log('排盘完成, showResult:', this.data.showResult);
      
      try {
        wx.vibrateShort({ type: 'light' });
      } catch (e) {}
    } catch (err) {
      console.error('排盘失败:', err);
      console.error('错误详情:', err.message, err.stack);
      this.setData({ loading: false });
      wx.showToast({ title: '排盘失败: ' + (err.message || '未知错误'), icon: 'none', duration: 3000 });
    }
  },

  // ==================== 快捷日期栏 ====================
  
  onQuickDateChange(e) {
    const dir = e.currentTarget.dataset.dir;
    const parts = this.data.birthday.split('-');
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + (dir === 'prev' ? -1 : 1));
    
    const ny = date.getFullYear();
    const nm = String(date.getMonth() + 1).padStart(2, '0');
    const nd = String(date.getDate()).padStart(2, '0');
    
    this.setData({ birthday: `${ny}-${nm}-${nd}` }, () => {
      this.doCalculate();
    });
  },

  onToday() {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    
    this.setData({ birthday: `${y}-${m}-${d}`, currentYear: y }, () => {
      this.doCalculate();
    });
  },

  // ==================== 流年切换 ====================
  
  onYearChange(e) {
    const { year } = e.detail;
    const currentLiunian = calcYearGanZhi(year);
    const liunianAdvice = this.data.baziResult 
      ? getAdvice(this.data.baziResult.riZhu.wuxing, currentLiunian.ganZhi) 
      : null;

    this.setData({
      currentYear: year,
      currentLiunian: currentLiunian,
      liunianAdvice: liunianAdvice
    });
  },

  // ==================== 页面滚动 ====================
  
  onScroll(e) {
    const scrollTop = e.detail.scrollTop;
    this.setData({
      scrollTop: scrollTop,
      headerShadow: scrollTop > 20
    });
  },

  // ==================== 历史排盘 ====================

  saveToHistory(result) {
    try {
      var records = wx.getStorageSync('baziHistory') || [];
      var now = new Date();
      var timeStr = now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + ' ' +
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0');

      // 避免重复记录（同一天同一生日）
      var exists = records.some(function(r) {
        return r.birthday === this.data.birthday && r.timeStr === timeStr;
      }.bind(this));
      
      if (!exists) {
        records.unshift({
          birthday: this.data.birthday,
          lunarDate: result.lunarDate,
          rizhu: result.riZhu.gan + result.riZhu.wuxing,
          comment: result.balanceComment,
          timeStr: timeStr,
          time: now.toISOString(),
          result: result
        });

        // 最多保留20条
        if (records.length > 20) {
          records = records.slice(0, 20);
        }

        wx.setStorageSync('baziHistory', records);
      }
    } catch (e) {
      console.error('保存历史失败:', e);
    }
  },

  goHistory() {
    wx.navigateTo({
      url: '/pages/history/history'
    });
  },

  // ==================== 日主长按 ====================
  
  onRiZhuLongPress() {
    if (!this.data.baziResult) return;
    const riZhu = this.data.baziResult.riZhu;
    try {
      wx.vibrateShort({ type: 'medium' });
    } catch (e) {}
    wx.showModal({
      title: '日主·' + riZhu.gan + riZhu.wuxing,
      content: riZhu.desc,
      showCancel: false,
      confirmText: '知晓',
      confirmColor: '#D4AF37'
    });
  }
});
