Component({
  properties: {
    opacity: {
      type: Number,
      value: 0.4
    },
    particleCount: {
      type: Number,
      value: 25
    }
  },

  data: {
    particles: [],
    constellationStars: []
  },

  lifetimes: {
    attached() {
      this.generateParticles();
      this.generateStars();
    }
  },

  methods: {
    generateParticles() {
      const particles = [];
      const count = this.properties.particleCount;
      
      for (let i = 0; i < count; i++) {
        particles.push({
          id: i,
          left: Math.floor(Math.random() * 100) + '%',
          top: Math.floor(Math.random() * 100) + '%',
          size: (1 + Math.random() * 2).toFixed(1) + 'rpx',
          delay: (Math.random() * 8).toFixed(1) + 's',
          duration: (6 + Math.random() * 10).toFixed(1) + 's',
          opacity: (0.15 + Math.random() * 0.5).toFixed(2)
        });
      }
      
      this.setData({ particles });
    },

    generateStars() {
      const stars = [];
      const starCount = 20;
      
      for (let i = 0; i < starCount; i++) {
        stars.push({
          id: i,
          left: (5 + (i % 10) * 9 + Math.random() * 5).toFixed(1) + '%',
          top: (8 + Math.floor(i / 10) * 30 + Math.random() * 20).toFixed(1) + '%',
          size: (2 + Math.random() * 2).toFixed(1) + 'rpx',
          delay: (Math.random() * 4).toFixed(1) + 's'
        });
      }
      
      this.setData({ constellationStars: stars });
    }
  }
});
