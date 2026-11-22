/* =========================================================
   主页内容配置
   修改这里的文字、链接、项目和技能即可更新主页。
   图片请放入 assets/images/，并填写相对路径。
   ========================================================= */
window.SITE_CONFIG = {
  site: {
    name: "Sakura",
    title: "初夏的小花园",
    description: "在代码与樱花之间，记录每一次成长。"
  },
  profile: {
    name: "初夏",
    tagline: "保持好奇，慢慢生长。",
    avatar: "./assets/images/avatar.png",
    github: "https://github.com/ChuXia2004",
    githubUsername: "ChuXia2004"
  },
  hero: {
    eyebrow: "A LITTLE PLACE ON THE INTERNET",
    greeting: "你好，欢迎来到",
    suffix: "的小花园",
    description: "在代码与樱花之间，记录每一次成长。",
    primaryButton: "探索我的项目"
  },
  about: {
    title: "关于我",
    subtitle: "认识一下这个花园的主人",
    greeting: "你好呀！很高兴认识你。",
    content: "这里是我的个人小空间。我喜欢探索新技术，也喜欢把灵感变成真实的小作品。希望你能在这里发现一点有趣的东西。",
    hobbies: ["⌨️ 编程", "🎨 绘画", "🏔️ 旅行", "🌱 持续学习"]
  },
  projects: {
    title: "花园角落的小制作",
    subtitle: "每一个项目，都是一次新的尝试",
    items: [
      {
        name: "Sakura Homepage",
        description: "一个日式简约、带有樱花粒子背景的个人主页模板。",
        tags: ["HTML", "CSS", "JavaScript"],
        url: "https://github.com/ChuXia2004/ChuXia2004.github.io",
        icon: "🌸"
      },
      {
        name: "Steam 插件",
        description: "给数字生命接上 Steam：查游戏库存、好友列表、个人资料，还能看社区市场行情与历史成交。",
        tags: ["KiraAI", "Python", "Steam API"],
        url: "https://github.com/ChuXia2004/kira-ai-plugin-steam",
        icon: "🎮"
      },
      {
        name: "API 余额插件",
        description: "一句话查余额，支持 DeepSeek、硅基流动、Kimi，以及自定义中转站。",
        tags: ["KiraAI", "Python", "API"],
        url: "https://github.com/ChuXia2004/KiraAI-plugin-api-balance",
        icon: "💰"
      }
    ]
  },
  skills: {
    title: "我的工具架",
    subtitle: "顺手，也还在学习",
    rows: [["HTML5", "CSS3", "JavaScript", "Python", "Markdown"], ["Git", "Clip Studio Paint"]],
    items: ["HTML5", "CSS3", "JavaScript", "Python", "Markdown", "Git", "Clip Studio Paint"]
  },
  github: {
    title: "在 GitHub 找到我",
    subtitle: "代码是分享想法的另一种方式",
    username: "chuxia2004",
    showStats: true
  },
  settings: {
    sakuraEnabled: true,
    darkModeEnabled: true,
    sakuraCount: 0, // 0 = 按屏幕面积自动计算(42~78片)，填数字则固定数量
    sakuraSpeed: 1,
    glassBlur: 2,
    glassEdge: 0.25,
    glassSaturation: 1.3
  },
  footer: {
    message: "感谢你来到我的小花园。愿你也拥有温柔而闪亮的每一天。",
    copyrightName: "初夏"
  }
};
