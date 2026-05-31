Page({
  data: {
    records: [],
    isEmpty: true
  },

  onShow() {
    this.loadRecords();
  },

  loadRecords() {
    try {
      var records = wx.getStorageSync('baziHistory') || [];
      // 按时间倒序
      records.sort(function(a, b) {
        return new Date(b.time) - new Date(a.time);
      });
      this.setData({
        records: records,
        isEmpty: records.length === 0
      });
    } catch (e) {
      console.error('加载历史失败:', e);
      this.setData({ records: [], isEmpty: true });
    }
  },

  onRecordTap(e) {
    var index = e.currentTarget.dataset.index;
    var record = this.data.records[index];
    if (!record) return;
    
    // 跳转到命盘页并传递参数
    wx.switchTab({
      url: '/pages/bazi/bazi'
    });
    
    // 存储要恢复的排盘数据
    wx.setStorageSync('restoreBazi', record.result);
    wx.setStorageSync('restoreBirthday', record.birthday);
  },

  onDeleteRecord(e) {
    var index = e.currentTarget.dataset.index;
    var that = this;
    
    wx.showModal({
      title: '删除记录',
      content: '确定删除这条排盘记录吗？',
      confirmColor: '#D4AF37',
      success: function(res) {
        if (res.confirm) {
          var records = that.data.records;
          records.splice(index, 1);
          wx.setStorageSync('baziHistory', records);
          that.loadRecords();
          wx.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  },

  onClearAll() {
    var that = this;
    wx.showModal({
      title: '清空全部',
      content: '确定清空所有历史记录吗？此操作不可撤销。',
      confirmColor: '#C04A3A',
      success: function(res) {
        if (res.confirm) {
          wx.setStorageSync('baziHistory', []);
          that.loadRecords();
          wx.showToast({ title: '已清空', icon: 'success' });
        }
      }
    });
  }
});
