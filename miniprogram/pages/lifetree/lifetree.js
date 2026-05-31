Page({
  data: {},
  
  onLoad() {
    console.log('人生树页面加载');
  },
  
  onNodeTap(e) {
    const label = e.currentTarget.dataset.label;
    wx.vibrateShort({ type: 'light' });
    wx.showToast({ title: label + ' · ' + (label === '学业' ? '规划中' : '即将上线'), icon: 'none' });
  }
});
