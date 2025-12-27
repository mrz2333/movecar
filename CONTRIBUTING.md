# 🤝 贡献指南

感谢你对 MoveCar 项目的关注！我们欢迎各种形式的贡献，包括但不限于：

- 🐛 报告 Bug
- ✨ 提出新功能建议  
- 📝 改进文档
- 🎨 UI/UX 优化
- 🔧 代码贡献

## 🚀 快速开始

### 环境准备

1. **Fork 仓库**
   ```bash
   # GitHub 上点击 Fork 按钮
   git clone https://github.com/YOUR_USERNAME/movecar.git
   cd movecar
   ```

2. **安装 Wrangler CLI**
   ```bash
   npm install -g wrangler
   # 或使用 yarn
   yarn global add wrangler
   ```

3. **登录 Cloudflare**
   ```bash
   wrangler login
   ```

### 本地开发

1. **复制环境变量**
   ```bash
   cp env.example .env
   # 编辑 .env 文件，填入你的配置
   ```

2. **创建 KV 命名空间**
   ```bash
   wrangler kv:namespace create "MOVE_CAR_STATUS"
   # 记下输出的 namespace ID
   ```

3. **启动本地服务**
   ```bash
   wrangler dev
   ```
   
4. **访问测试**
   在浏览器中打开 `http://localhost:8787`

## 📝 贡献流程

### 报告问题

1. 检查是否已有相关 Issue
2. 使用 Bug Report 模板创建新 Issue
3. 提供详细的重现步骤和环境信息

### 提交 PR

1. **创建分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b fix/your-fix-name
   ```

2. **开发测试**
   - 遵循现有的代码风格
   - 添加必要的注释
   - 在不同设备上测试功能

3. **提交代码**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   git push origin feature/your-feature-name
   ```

4. **创建 Pull Request**
   - 使用 PR 模板描述变更
   - 关联相关 Issue
   - 等待代码审核

## 📋 开发规范

### 代码风格

- **AI 友好注释**：在可定制部分添加详细注释
  ```javascript
  // 🎨 AI可修改区域：推送服务接口
  // 可以在这里添加新的推送服务或修改现有逻辑
  ```

- **语义化命名**：使用清晰、描述性的变量和函数名
- **ES6+ 语法**：优先使用现代 JavaScript 特性
- **错误处理**：添加适当的 try-catch 和错误提示

### UI/UX 规范

- **移动优先**：确保在手机上的体验
- **响应式设计**：适配各种屏幕尺寸
- **无障碍访问**：考虑可访问性需求
- **性能优化**：避免大图片和复杂动画

### 测试要求

- **功能测试**：确保核心功能正常
- **兼容性测试**：在不同浏览器和设备上验证
- **推送测试**：验证各种推送服务集成
- **边界测试**：测试异常情况处理

## 🎨 AI 修改指南

这个项目特别设计了 AI 友好的结构：

### 可修改区域识别

寻找代码中的以下标记：
```javascript
// 🎨 AI可修改区域：[功能描述]
```

### 主要可定制部分

1. **主题色彩**
   ```css
   /* 🎨 AI可修改：主题色彩配置 */
   --primary-gradient: linear-gradient(160deg, #0093E9 0%, #80D0C7 100%);
   ```

2. **推送服务**
   ```javascript
   // 🎨 AI可修改区域：推送服务接口
   // 当前使用 Bark，也可以替换为其他推送服务
   ```

3. **UI 布局**
   ```css
   /* 🎨 AI可修改：响应式设计断点 */
   @media (min-width: 768px) { ... }
   ```

### AI 修改建议

- **保持向后兼容**：修改时不要破坏现有功能
- **添加配置选项**：通过环境变量提供灵活配置
- **完善注释**：帮助其他 AI 理解修改意图
- **测试验证**：修改后进行全面测试

## 📦 项目结构

```
movecar/
├── movecar.js              # 主要业务逻辑
├── README.md               # 项目文档
├── LICENSE                 # 开源协议
├── wrangler.toml           # Cloudflare 配置
├── env.example             # 环境变量模板
├── .gitignore              # Git 忽略文件
└── .github/
    ├── ISSUE_TEMPLATE/
    │   ├── bug_report.md
    │   └── feature_request.md
    └── PULL_REQUEST_TEMPLATE.md
```

## 🧪 测试指南

### 本地测试

1. **功能测试项**：
   - [ ] 页面加载正常
   - [ ] 位置获取功能
   - [ ] 推送通知发送
   - [ ] 车主确认流程
   - [ ] 状态同步功能

2. **兼容性测试**：
   - [ ] iOS Safari 12+
   - [ ] Android Chrome 70+
   - [ ] 桌面 Chrome/Firefox/Safari
   - [ ] 微信内置浏览器

3. **异常情况测试**：
   - [ ] 网络断开重试
   - [ ] 位置获取失败
   - [ ] 推送服务异常
   - [ ] 服务器错误处理

### 部署测试

1. **Wrangler 部署**
   ```bash
   wrangler deploy
   ```

2. **生产环境验证**
   - 访问部署的 URL
   - 测试完整用户流程
   - 检查错误日志

## 🤝 社区准则

### 行为准则

- **友好尊重**：对所有参与者保持友好和尊重
- **建设性反馈**：提供有建设性的意见和反馈
- **耐心解答**：耐心回答新手的问题
- **责任担当**：为自己的代码和言论负责

### 沟通渠道

- **GitHub Issues**：报告问题和建议
- **GitHub Discussions**：技术讨论和问答
- **Pull Request**：代码审核和合并

## 📞 联系维护者

如有紧急问题或需要私下沟通，可以通过以下方式联系：

- 📧 Email: maintainers@example.com
- 💬 GitHub Discussions

## 🏆 贡献者荣誉

所有贡献者都会在项目中得到认可：

- **代码贡献**：在 README 和贡献者列表中展示
- **优秀贡献**：特别的贡献会在项目文档中突出显示
- **社区影响**：对社区有重要影响的贡献可能获得额外认可

---

## 📚 相关资源

- [Cloudflare Workers 文档](https://workers.cloudflare.com/docs)
- [Wrangler CLI 指南](https://developers.cloudflare.com/workers/wrangler/)  
- [Bark 推送服务](https://bark.day.app/)
- [MDN Web 开发文档](https://developer.mozilla.org/)

感谢你的贡献！🎉
