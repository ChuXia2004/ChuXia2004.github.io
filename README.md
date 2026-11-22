# Sakura Homepage

一个日系樱花主题的个人主页，采用原生 HTML、CSS 和 JavaScript，无需构建工具。

## 快速开始

1. 解压项目。
2. 使用浏览器打开 `index.html`，或将整个目录部署到任意静态网站托管服务。
3. 修改 `config/config.js` 中的个人资料、项目、技能和页面文案。

## 目录结构

```text
Sakura-Homepage/
├── assets/
│   ├── icons/          # 网站图标、六瓣樱花设置图标
│   └── images/         # 头像等图片资源
├── config/
│   └── config.js       # 页面内容与默认参数
├── css/
│   ├── style.css       # 页面基础样式
│   ├── responsive.css  # 手机和平板适配
│   ├── animation.css   # 页面动效
│   ├── liquid-glass.css# 玻璃卡片材质
│   └── settings.css    # 设置入口与调参面板
├── js/
│   ├── main.js         # 页面内容渲染
│   ├── sakura.js       # 樱花飘落
│   ├── scroll.js       # 滚动交互
│   ├── github.js       # GitHub 公开资料
│   ├── theme.js        # 日间/夜间主题
│   └── settings.js     # 玻璃参数调节与本地保存
├── index.html
├── LICENSE
└── .gitignore
```

## 玻璃调参

点击顶部六瓣樱花按钮打开调参面板。默认参数：

- 背景模糊：`2px`
- 边缘反射：`0.25`
- 背景饱和度：`1.3`

调节结果保存在浏览器 `localStorage`。点击“恢复默认”即可还原。

## 技能标签

技能区分成两行显示。默认第一行是 HTML5、CSS3、JavaScript、Python、Markdown；第二行是 Git、Clip Studio Paint。可在 `config/config.js` 的 `skills.rows` 中修改。

## 说明

- 页面使用原生技术，不需要 npm 安装或打包。
- GitHub 统计需要在 `config/config.js` 填写真实用户名，并由浏览器请求 GitHub 公共 API。
- 头像可替换 `assets/images/` 中的图片，并同步修改配置里的相对路径。
