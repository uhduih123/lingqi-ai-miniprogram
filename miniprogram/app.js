App({
  onLaunch: function() {
    var windowInfo = wx.getWindowInfo();
    var deviceInfo = wx.getDeviceInfo();

    this.globalData.windowInfo = windowInfo;
    this.globalData.deviceInfo = deviceInfo;
    this.globalData.statusBarHeight = windowInfo.statusBarHeight || 20;

    console.log('灵琪AI v2 启动', deviceInfo.platform);

    // Demo模式：每次启动清除档案，方便演示
    wx.removeStorageSync('userProfile');
    wx.removeStorageSync('baziHistory');
    wx.removeStorageSync('birthday');

    // 首次启动检测：若无档案，跳转引导页
    var profile = wx.getStorageSync('userProfile');
    if (!profile) {
      setTimeout(function() {
        wx.navigateTo({ url: '/pages/onboarding/onboarding' });
      }, 500);
    }
  },

  globalData: {
    windowInfo: null,
    deviceInfo: null,
    statusBarHeight: 20,
    currentTab: 1
  }
});
