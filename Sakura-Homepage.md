# Sakura Homepage 项目说明

## 项目定位
日系樱花风格个人主页，包含个人介绍、项目展示、技能标签、GitHub 信息、樱花粒子背景、主题切换和局部玻璃拟态卡片。

## 主要模块
- `config/config.js`：集中管理主页文字、个人资料、项目列表、技能分组和初始参数。
- `js/sakura.js`：负责樱花粒子的绘制与开关。
- `js/theme.js`：负责日间/夜间主题切换。
- `js/github.js`：读取 GitHub 公开用户资料。
- `js/settings.js`：控制玻璃调参面板，并将参数保存在本地浏览器。
- `css/liquid-glass.css`：定义玻璃卡片的模糊、饱和度和边缘反射视觉。

## 技能分组
第一行：HTML5、CSS3、JavaScript、Python、Markdown。
第二行：Git、Clip Studio Paint。

## 本地预览
直接打开根目录 `index.html` 即可。建议通过本地静态服务器预览，以获得更稳定的浏览器资源加载体验。
