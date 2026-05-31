App({
  onLaunch() {
    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync();
    this.globalData.systemInfo = systemInfo;
    this.globalData.statusBarHeight = systemInfo.statusBarHeight;
    
    // 初始化缓存
    this.globalData.birthday = wx.getStorageSync('birthday') || '';
    this.globalData.baziResult = wx.getStorageSync('baziResult') || null;
    
    console.log('灵琪AI 启动', systemInfo.platform, systemInfo.version);
  },
  
  globalData: {
    systemInfo: null,
    statusBarHeight: 20,
    birthday: '',
    baziResult: null,
    // 当前选中的 tab 索引
    currentTab: 1
  }
});
