Page({
  onLoad: function() {
    this.loadProfile();
  },

  onShow: function() {
    this.loadProfile();
  },

  loadProfile: function() {
    var profile = wx.getStorageSync('userProfile');
    var nodes = {
      study: this.buildStudy(profile),
      career: this.buildCareer(profile),
      love: this.buildLove(profile),
      health: this.buildHealth(profile)
    };
    this.setData({ nodes: nodes });
  },

  buildStudy: function(p) {
    var now = new Date();
    var year = now.getFullYear();
    var hasData = !!(p && p.grade && p.major);
    
    var details = [
      { label: '姓名', value: (p && p.name) ? p.name : '未填写' },
      { label: '当前阶段', value: (p && p.grade) ? p.grade + (p.major ? ' · ' + p.major : '') : '请完善档案' },
      { label: '学业进度', value: hasData ? this.getStudyPhase(p.grade) : '--' },
      { label: '学业建议', value: hasData ? this.getStudyAdvice(p) : '请先填写年级和专业信息' }
    ];
    
    var timeline = hasData ? this.getStudyTimeline(p) : [
      { time: '--', event: '请在引导页填写学业信息' }
    ];
    
    return {
      icon: '🎓', label: '学业',
      tag: hasData ? '已记录' : '待完善',
      progress: hasData ? 80 : 10,
      details: details,
      timeline: timeline
    };
  },

  getStudyPhase: function(grade) {
    if (grade.indexOf('大一') >= 0) return '基础课程阶段，打好数学和编程基础';
    if (grade.indexOf('大二') >= 0) return '专业核心课阶段，重点掌握专业工具';
    if (grade.indexOf('大三') >= 0) return '方向选择期，确定考研或就业方向';
    if (grade.indexOf('大四') >= 0) return '毕业冲刺期，实习+毕设同步推进';
    return '学习中';
  },

  getStudyAdvice: function(p) {
    var advice = p.name ? p.name + '同学，' : '';
    if (p.grade && p.grade.indexOf('大二') >= 0) {
      return advice + '大二是专业能力成型的关键期。建议利用暑假参加与' + (p.major || '专业') + '相关的实习，积累实践经验。同时注意英语和编程能力储备。';
    }
    if (p.grade && p.grade.indexOf('大三') >= 0) {
      return advice + '大三是分水岭。如果要考研，现在就应该开始准备；如果就业，暑假实习至关重要。';
    }
    return advice + '建议明确学期目标，保持GPA，多参与实践项目。';
  },

  getStudyTimeline: function(p) {
    var now = new Date();
    var y = now.getFullYear();
    var m = now.getMonth() + 1;
    var semester = m >= 9 ? '上学期' : (m >= 3 ? '下学期' : '寒假');
    
    return [
      { time: y + '.' + (m < 10 ? '0' : '') + m, event: '当前 · ' + semester },
      { time: (y + 1) + '.07', event: '暑期社会实践/实习' },
      { time: (y + 1) + '.09', event: '新学年 · 更高阶课程' },
      { time: (y + 2) + '.07', event: '毕业 · 迎接新阶段' }
    ];
  },

  buildCareer: function(p) {
    var hasData = !!(p && p.stage);
    var name = (p && p.name) ? p.name : '你';
    
    var details = [
      { label: '当前阶段', value: (p && p.stage) ? p.stage : '未填写' },
      { label: '年级/职位', value: (p && p.grade) ? p.grade : '--' },
      { label: '发展阶段', value: hasData ? this.getCareerPhase(p) : '--' },
      { label: '发展建议', value: hasData ? this.getCareerAdvice(p) : '请在引导页填写阶段信息' }
    ];
    
    var timeline = hasData ? this.getCareerTimeline(p) : [
      { time: '--', event: '填写阶段信息后解锁' }
    ];
    
    return {
      icon: '💼', label: '事业',
      tag: hasData ? '已记录' : '待完善',
      progress: hasData ? 35 : 10,
      details: details,
      timeline: timeline
    };
  },

  getCareerPhase: function(p) {
    if (!p || !p.stage) return '未知';
    if (p.stage === '在校学生') return '积累期 · 以学业和实习为主';
    if (p.stage === '职场新人') return '成长期 · 积累行业经验和人脉';
    if (p.stage === '自由职业') return '探索期 · 建立个人品牌和客户群';
    return '发展期 · 寻找适合自己的方向';
  },

  getCareerAdvice: function(p) {
    if (!p || !p.stage) return '';
    var name = p.name || '你';
    if (p.stage === '在校学生') return name + '目前应以学业为重，利用寒暑假实习探索职业兴趣。多参加行业讲座和校友分享。';
    if (p.stage === '职场新人') return '入职前三年是快速成长期，建议专注提升核心竞争力。不要频繁跳槽，深耕一个领域。';
    return '保持学习，持续提升。找到工作与生活的平衡点。';
  },

  getCareerTimeline: function(p) {
    var y = new Date().getFullYear();
    if (p && p.stage === '在校学生') {
      return [
        { time: y + '', event: '积累实习经验' },
        { time: (y + 1) + '', event: '确定职业方向' },
        { time: (y + 2) + '', event: '毕业入职' },
        { time: (y + 5) + '', event: '职位晋升 · 独当一面' }
      ];
    }
    return [
      { time: y + '', event: '积累核心能力' },
      { time: (y + 2) + '', event: '职业上升期' },
      { time: (y + 4) + '', event: '管理层/专家岗' },
      { time: (y + 7) + '', event: '事业高峰期' }
    ];
  },

  buildLove: function(p) {
    var name = (p && p.name) ? p.name : '你';
    var hasData = !!(p && p.birthday);
    
    var details = [
      { label: '当前状态', value: '信息有限，仅做参考' },
      { label: '感情建议', value: name + '，顺其自然是最好的态度。在对的时间遇到对的人。' },
      { label: '最佳时机', value: '通常在25-28岁期间桃花运较旺' },
      { label: '温馨提示', value: '比起着急，不如先成为更好的自己。缘分会在不经意间到来。' }
    ];
    
    var timeline = [
      { time: '25岁前后', event: '桃花运上升期' },
      { time: '27-28岁', event: '婚运高峰期' },
      { time: '30岁', event: '感情稳定 · 家庭美满' },
      { time: '未来', event: '平凡日子里的幸福' }
    ];
    
    return {
      icon: '💕', label: '姻缘',
      tag: hasData ? '推算中' : '待完善',
      progress: hasData ? 25 : 5,
      details: details,
      timeline: timeline
    };
  },

  buildHealth: function(p) {
    var name = (p && p.name) ? p.name : '你';
    var hasBirth = !!(p && p.birthday);
    
    var tips = this.getHealthTips(p);
    
    var details = [
      { label: '体质概况', value: tips.general },
      { label: '饮食建议', value: tips.diet },
      { label: '运动建议', value: tips.exercise },
      { label: '心理关怀', value: '保持积极心态，学会压力管理。每天10分钟冥想有助于身心健康。' }
    ];
    
    var timeline = [
      { time: '春季', event: '注意过敏 · 养肝护目' },
      { time: '夏季', event: '防暑降温 · 多饮水' },
      { time: '秋季', event: '润燥养肺 · 防感冒' },
      { time: '冬季', event: '保暖进补 · 适度运动' }
    ];
    
    return {
      icon: '🏥', label: '健康',
      tag: hasBirth ? '已推算' : '参考',
      progress: hasBirth ? 50 : 30,
      details: details,
      timeline: timeline
    };
  },

  getHealthTips: function(p) {
    if (p && p.gender === '女') {
      return {
        general: '注意内分泌平衡，规律作息最重要',
        diet: '多吃红枣、桂圆、菠菜等补铁食物。少食生冷。',
        exercise: '瑜伽和游泳是最佳选择，每周3次，每次40分钟。'
      };
    }
    return {
      general: '保持规律作息，避免熬夜是健康的基础',
      diet: '多摄入蛋白质和蔬菜，减少油腻和辛辣食物',
      exercise: '跑步、游泳或球类运动，每周3-4次，每次30-45分钟。'
    };
  },

  onNodeTap: function(e) {
    var node = e.currentTarget.dataset.node;
    var current = this.data.activeNode;
    
    if (current === node && this.data.detailVisible) {
      this.setData({ detailVisible: false, activeNode: null });
    } else {
      this.setData({ activeNode: node, detailVisible: true });
    }
    try { wx.vibrateShort({ type: 'light' }); } catch (e2) {}
  },

  onCloseDetail: function() {
    this.setData({ detailVisible: false, activeNode: null });
  }
});
