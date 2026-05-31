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
      const sys = wx.getSystemInfoSync();
      const statusBarH = sys.statusBarHeight || 20;
      
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
      }
      
      // 设置默认日期为今天
      if (!this.data.birthday) {
        const today = new Date();
        const y = today.getFullYear();
        const m = String(today.getMonth() + 1).padStart(2, '0');
        const d = String(today.getDate()).padStart(2, '0');
        this.setData({ birthday: `${y}-${m}-${d}`, currentYear: y });
      }
      
      console.log('命盘页面初始化完成', this.data.birthday);
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

  // ==================== 输入区 ====================
  
  onBirthdayChange(e) {
    this.setData({ birthday: e.detail.value });
    console.log('日期已选择:', e.detail.value);
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
