# 🌸 Sakura Homepage

一个使用原生 **HTML + CSS + JavaScript** 制作的日式简约个人主页。奶油白与樱花粉配色，搭配轻柔的 Canvas 樱花粒子背景。

## 功能

- Canvas 樱花粒子背景，可通过导航栏按钮开启或关闭
- 日间 / 夜间主题切换，并使用 `localStorage` 记住选择
- 页面滚动显现与导航平滑滚动
- 手机、平板和桌面端响应式布局
- 返回顶部按钮
- 通过 GitHub REST API 获取公开仓库数、Followers 和 Following
- 展示文字、头像、项目、技能集中在 `config/config.js` 修改
- 无需构建工具，无需安装依赖

## 快速开始

下载或克隆仓库后，直接用浏览器打开 `index.html` 即可预览。也可以使用 VS Code 的 Live Server 等本地静态服务器预览。

## 个性化配置

打开 `config/config.js`，修改以下内容：

1. `site`：网站名称和描述
2. `profile`：昵称、头像、GitHub 地址和个人标签
3. `hero`：首页欢迎语
4. `about`：个人介绍和兴趣爱好
5. `projects.items`：项目名称、介绍、标签、链接和图标
6. `skills.items`：技术栈
7. `github.username`：GitHub 用户名
8. `settings`：樱花初始状态、粒子数量和速度

将自己的头像放入 `assets/images/`，然后把 `profile.avatar` 改为对应路径即可。建议头像使用正方形图片。

> GitHub 统计使用 GitHub 公开 API。未填写有效用户名时会显示配置提示；未授权 API 有访问频率限制，无法获取时页面仍可正常使用。

## 部署到 GitHub Pages

1. 将项目文件上传到 GitHub 仓库根目录。
2. 打开仓库 **Settings → Pages**。
3. 在 **Build and deployment** 中选择 **Deploy from a branch**。
4. Branch 选择 `main`，目录选择 `/ (root)`，点击 Save。
5. 等待部署完成后，使用页面显示的网址访问。

## 目录结构

```text
Sakura-Homepage/
├── index.html
├── config/config.js
├── css/
│   ├── style.css
│   ├── animation.css
│   └── responsive.css
├── js/
│   ├── main.js
│   ├── sakura.js
│   ├── theme.js
│   ├── scroll.js
│   └── github.js
└── assets/
    ├── images/
    └── icons/
```

## 注意事项

- 页面字体通过 Google Fonts 加载；无法访问时会自动使用系统字体。
- 网站本身不需要后端服务。
- 请将示例中的 `username`、项目链接和个人介绍替换为自己的内容。

## License

MIT


## 本次界面更新
- 保留原项目原有目录、样式、脚本、配置与资源文件。
- 顶部新增六瓣樱花玻璃调参入口；面板默认折叠，可调背景模糊、边缘反射与背景饱和度。
- 技能标签顺序为 HTML5、CSS3、JavaScript、Python、Markdown / Git、Clip Studio Paint，并按两行居中布局。
- 新增 `js/settings.js`，其余原有功能脚本继续保留。
