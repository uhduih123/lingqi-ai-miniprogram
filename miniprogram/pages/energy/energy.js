Page({
  data: {},
  
  onEnergyField() {
    wx.vibrateShort({ type: 'medium' });
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },
  
  onGenerator() {
    wx.vibrateShort({ type: 'light' });
    wx.showToast({ title: '补运生成器即将上线', icon: 'none' });
  }
});
