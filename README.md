# lingqi-ai-miniprogram

> **AI 人生规划助手 · 微信小程序** — AI 辅助全栈交付

基于大模型的垂直领域对话工具，通过 AI Agent 辅助编程实现从需求到产品的快速交付。

---

## ✨ 功能

- 🚀 **Onboarding 引导页** — 新用户首次启动引导流程
- 🧭 **四大功能 Tab**
  - 命盘 — 八字排盘与解读
  - 人生树 — 生命周期可视化
  - 智库 — 知识库对话
  - 能量 — 五行能量分析
- 📜 **历史排盘** — 查看过往排盘记录
- 🌑 **暗黑鎏金风格 UI** — 视觉统一的深色主题
- ⚡ **DeepSeek-V4-Pro 驱动** — 流式 AI 对话响应

---

## 🛠 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | 微信小程序原生（WXML / WXSS / JS） |
| AI 引擎 | DeepSeek-V4-Pro API |
| 流式响应 | SSE (Server-Sent Events) |
| 辅助开发 | Hermes Agent (AI Coding) |
| 成本 | 单次对话 < ¥0.005 |

---

## 📁 项目结构

```
lingqi-ai-miniprogram/
├── miniprogram/
│   ├── app.js               # 应用入口
│   ├── app.json             # 应用配置
│   ├── app.wxss             # 全局样式
│   ├── assets/icons/        # 图标资源
│   ├── components/          # 7 个组件
│   │   ├── bazi-pillars/    # 八字四柱
│   │   ├── liunian-relation/# 流年关系
│   │   ├── liunian-switcher/# 流年切换器
│   │   ├── monthly-fortune/ # 月运
│   │   ├── remedy-tabs/     # 补救方案
│   │   ├── star-bg/         # 星空背景
│   │   └── wuxing-chart/    # 五行图表
│   ├── pages/               # 6 个页面
│   │   ├── bazi/            # 命盘
│   │   ├── energy/          # 能量
│   │   ├── history/         # 历史
│   │   ├── lifetree/        # 人生树
│   │   ├── onboarding/      # 引导页
│   │   └── zhiku/           # 智库
│   ├── styles/              # 公共样式
│   └── utils/               # 工具函数（八字算法、流年等）
├── project.config.json
└── README.md
```

---

## 🚀 快速开始

1. 安装[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 克隆仓库：
   ```bash
   git clone https://github.com/uhduih123/lingqi-ai-miniprogram.git
   ```
3. 用微信开发者工具打开项目目录
4. 配置 `miniprogram/app.js` 中的 API 地址
5. 编译预览

---

## 🤖 AI 辅助开发流程

本项目采用 **Hermes Agent** 作为 AI 编程伙伴，验证了 AI 辅助编程在 MVP 阶段的效率优势：

- **分层 Prompt 策略**：架构设计 → 模块拆分 → 代码生成 → 单元测试，确保生成代码的可维护性
- **效率对比**：传统 2-3 周的全栈开发周期 → **压缩至 2 天**
- **质量控制**：建立人工 Code Review 机制，对 AI 产出进行安全性、性能与业务逻辑校验
- **成本优化**：封装 SSE 流式响应与 Token 成本控制，单次服务成本 < ¥0.005

---

## 📝 版本历史

| 版本 | Tag | 说明 |
|------|-----|------|
| v1.0.0 | [`v1.0.0`](../../releases/tag/v1.0.0) | 初始 Demo，基础页面与 UI 框架 |
| v2.0.0 | [`v2.0.0`](../../releases/tag/v2.0.0) | Onboarding 引导页 + 四 Tab + 历史排盘 |
| v3.0.0 | [`v3.0.0`](../../releases/tag/v3.0.0) | UI 打磨，Bug 修复，最终 Demo 版 |

---

## 👤 作者

**uhduih123** · 天津理工大学 · 计算机科学与技术

- 🌐 [个人主页](https://uhduih123.github.io)
- 🐙 [GitHub](https://github.com/uhduih123)
