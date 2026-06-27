# 早教规划在线编辑工具

> 18个月女宝早教课程规划的在线编辑工具，支持管理员在线编辑、问题清单追踪、云端同步。

## 功能特性

- **课程表查看**：8个月主题课程（食物/穿衣/居住/动物/植物/海洋/天空/太空）
- **管理员编辑**：密码保护，可编辑所有课程内容
- **问题清单**：记录和追踪待解决问题
- **数据管理**：导入/导出 JSON，重置数据
- **样式自定义**：主题色、字体大小、圆角调整
- **云端同步**：配置 API 后数据可在所有设备间同步
- **响应式设计**：桌面和移动端均可使用

## 本地运行

```bash
node server.js
# 访问 http://localhost:3000
```

## 部署到 Vercel

### 方法一：GitHub + Vercel（推荐）

1. Fork 或导入此仓库到你的 GitHub
2. 访问 [vercel.com](https://vercel.com) 并登录
3. 点击 "New Project" → 选择此 GitHub 仓库
4. 点击 "Deploy" — Vercel 会自动识别配置并部署
5. 部署完成后获得 `https://你的项目.vercel.app` 公开链接

### 方法二：Vercel CLI

```bash
npm i -g vercel
vercel login
cd early-ed-app
vercel --prod
```

## 管理员使用

1. 点击右上角 🔒 图标
2. 输入密码（默认：`admin123`）
3. 进入管理员模式后，点击任何表格单元格即可编辑
4. 编辑后自动保存到本地，配置云端 API 后自动同步

## 云端同步配置

1. 部署到 Vercel 后，API 端点自动可用：`https://你的项目.vercel.app/api/data`
2. 在应用设置 → 云端同步中填入 API 地址
3. 管理员修改的数据将同步到云端，所有访问者可看到最新内容

## 技术栈

- 前端：纯 HTML/CSS/JavaScript（零构建依赖）
- 后端：Vercel Serverless Functions
- 数据存储：localStorage + 可选云端 KV

## 文件结构

```
early-ed-app/
├── index.html      # 主页面
├── style.css       # 样式
├── app.js          # 应用逻辑
├── server.js       # 本地开发服务器
├── package.json    # 项目配置
├── vercel.json     # Vercel 部署配置
├── api/
│   └── data.js     # 云端同步 API
└── README.md       # 说明文档
```
