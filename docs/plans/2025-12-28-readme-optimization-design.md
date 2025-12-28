# README 优化与文件精简设计

## 目标

1. 优化 README，使其适合开源项目推广
2. 精简文件结构，只保留必要文件

---

## 最终文件结构

```
movecar/
├── movecar.js      # 主程序（Worker 代码）
├── README.md       # 项目文档（含部署教程、流程图）
├── LICENSE         # MIT 开源协议
└── .gitignore      # Git 忽略配置
```

**删除的文件：**
- `wrangler.toml` - 不需要 CLI 部署
- `env.example` - 合并到 README
- `DEPLOYMENT.md` - 合并到 README
- `CONTRIBUTING.md` - 个人项目不需要
- `GITHUB_UPLOAD.md` - 临时指南
- `PROJECT_SUMMARY.md` - 临时指南
- `QUICK_UPLOAD.md` - 临时指南
- `.github/` 目录 - Issue/PR 模板不需要
- `docs/plans/` 目录 - 设计文档内容合并到 README

---

## README 结构

### 1. 开头（痛点 + 卖点）

```markdown
# MoveCar - 挪车通知系统

基于 Cloudflare Workers 的智能挪车通知系统，扫码即可通知车主，保护双方隐私。

## 为什么需要它？

- 🚗 **被堵车却找不到车主** - 干着急没办法
- 📱 **传统挪车码暴露电话** - 隐私泄露、骚扰电话不断
- 😈 **恶意扫码骚扰** - 有人故意反复扫码打扰
- 🤔 **路人好奇扫码** - 并不需要挪车却触发通知

## 这个系统如何解决？

- ✅ **不暴露电话号码** - 通过推送通知联系，保护隐私
- ✅ **双向位置共享** - 车主可确认请求者确实在车旁
- ✅ **无位置延迟 30 秒** - 降低恶意骚扰的动力
- ✅ **免费部署** - Cloudflare Workers 免费额度完全够用
- ✅ **无需服务器** - Serverless 架构，零运维成本

## 为什么使用 Bark 推送？

- 🔔 支持「紧急 / 重要 / 警告」通知级别
- 🎵 可自定义通知音效
- 🌙 **即使开启勿扰模式也能收到提醒**
- 📱 安卓用户：原理相通，将 Bark 替换为安卓推送服务即可（如 Pushplus、Server酱）
```

### 2. 使用流程

```markdown
## 使用流程

### 请求者（需要挪车的人）
1. 扫描车上的二维码，进入通知页面
2. 填写留言（可选），如「挡住出口了」
3. 允许获取位置（不允许则延迟 30 秒发送）
4. 点击「通知车主」
5. 等待车主确认，可查看车主位置

### 车主
1. 收到 Bark 推送通知
2. 点击通知进入确认页面
3. 查看请求者位置（判断是否真的在车旁）
4. 点击确认，分享自己位置给对方

### 流程图

请求者                              车主
  │                                  │
  ├─ 扫码进入页面                     │
  ├─ 填写留言、获取位置                │
  ├─ 点击发送                         │
  │   ├─ 有位置 → 立即推送 ──────────→ 收到通知
  │   └─ 无位置 → 30秒后推送 ────────→ 收到通知
  │                                  │
  ├─ 等待中...                        ├─ 查看请求者位置
  │                                  ├─ 点击确认，分享位置
  │                                  │
  ├─ 收到确认，查看车主位置 ←──────────┤
  │                                  │
  ▼                                  ▼
```

### 3. 部署教程

```markdown
## 部署教程

### 第一步：注册 Cloudflare 账号
1. 打开 https://dash.cloudflare.com/sign-up
2. 输入邮箱和密码，完成注册

### 第二步：创建 Worker
1. 登录后点击左侧菜单「Workers & Pages」
2. 点击「Create」→「Create Worker」
3. 名称填 `movecar`（或你喜欢的名字）
4. 点击「Deploy」
5. 点击「Edit code」，删除默认代码
6. 复制 `movecar.js` 全部内容粘贴进去
7. 点击右上角「Deploy」保存

### 第三步：创建 KV 存储
1. 左侧菜单点击「KV」
2. 点击「Create a namespace」
3. 名称填 `MOVE_CAR_STATUS`，点击「Add」
4. 回到你的 Worker → 「Settings」→「Bindings」
5. 点击「Add」→「KV Namespace」
6. Variable name 填 `MOVE_CAR_STATUS`
7. 选择刚创建的 namespace，点击「Deploy」

### 第四步：配置环境变量
1. Worker →「Settings」→「Variables and Secrets」
2. 添加以下变量：
   - `BARK_URL`：你的 Bark 推送地址（如 `https://api.day.app/xxxxx`）
   - `PHONE_NUMBER`：备用联系电话（可选）

### 第五步：绑定域名（可选）
1. Worker →「Settings」→「Domains & Routes」
2. 点击「Add」→「Custom Domain」
3. 输入你的域名，按提示完成 DNS 配置
```

### 4. 制作挪车码

```markdown
## 制作挪车码

### 生成二维码
1. 复制你的 Worker 地址（如 `https://movecar.你的账号.workers.dev`）
2. 使用任意二维码生成工具（如 草料二维码、QR Code Generator）
3. 将链接转换为二维码并下载

### 美化挪车牌
使用 AI 工具生成精美的装饰设计：
- **Napkin Pro** - 生成装饰图案和背景
- **ChatGPT** - 生成创意设计图

制作步骤：
1. 用 AI 工具生成你喜欢的装饰图案
2. 将二维码与生成的图案组合排版
3. 添加「扫码通知车主」提示文字
4. 打印、过塑，贴在车上

> 💡 用 AI 生成独一无二的挪车牌，让你的爱车更有个性！
```

### 5. License

```markdown
## License

MIT
```

---

## 实施步骤

1. 删除多余文件
2. 重写 README.md
3. 删除 docs/plans/ 目录（本设计文档执行后删除）
4. 提交到 git
