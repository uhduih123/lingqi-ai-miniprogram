Page({
  data: {
    name: '',
    birthday: '',
    gender: '',
    genderIndex: -1,
    genders: ['男', '女'],
    stage: '',
    stageIndex: -1,
    stages: ['在校学生', '职场新人', '自由职业', '其他'],
    grade: '',
    major: '',
    canSubmit: false
  },

  // 姓名
  onNameInput: function(e) {
    this.setData({ name: e.detail.value });
    this.checkCanSubmit();
  },

  // 生日
  onBirthdayChange: function(e) {
    this.setData({ birthday: e.detail.value });
    this.checkCanSubmit();
  },

  // 性别
  onGenderChange: function(e) {
    this.setData({ genderIndex: parseInt(e.detail.value) });
    this.checkCanSubmit();
  },

  // 阶段
  onStageChange: function(e) {
    this.setData({ stageIndex: parseInt(e.detail.value) });
    this.checkCanSubmit();
  },

  // 专业
  onMajorInput: function(e) {
    this.setData({ major: e.detail.value });
    this.checkCanSubmit();
  },

  // 年级/职位
  onGradeInput: function(e) {
    this.setData({ grade: e.detail.value });
    this.checkCanSubmit();
  },

  checkCanSubmit: function() {
    var d = this.data;
    var ok = d.name.trim() && d.birthday && d.genderIndex >= 0 && d.stageIndex >= 0 && d.grade.trim() && d.major.trim();
    this.setData({ canSubmit: ok });
  },

  // 提交
  onSubmit: function() {
    var d = this.data;
    if (!d.canSubmit) return;

    wx.vibrateShort({ type: 'medium' });

    var profile = {
      name: d.name.trim(),
      birthday: d.birthday,
      gender: d.genders[d.genderIndex],
      stage: d.stages[d.stageIndex],
      grade: d.grade.trim(),
      major: d.major.trim(),
      createdAt: new Date().toISOString()
    };

    wx.setStorageSync('userProfile', profile);
    console.log('档案已保存:', profile);

    wx.showToast({ title: '灵琪已认识你啦', icon: 'success', duration: 1500 });

    // 延迟跳回主页
    var that = this;
    setTimeout(function() {
      wx.switchTab({ url: '/pages/bazi/bazi' });
    }, 1200);
  }
});
