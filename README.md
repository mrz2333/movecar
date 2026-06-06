# MoveCar - 挪车通知系统

基于 Cloudflare Workers 的智能挪车通知系统，扫码即可通知车主，保护双方隐私。

## ✨ 功能特性

- 🔔 **双通道通知** — Bark 推送 + 邮件通知，确保不错过任何挪车请求
- 📍 **双向位置共享** — 车主可确认请求者确实在车旁
- 📧 **精美 HTML 邮件** — 带地图链接的美观邮件通知
- 🛡️ **防骚扰机制** — 60 秒冷却时间，防止恶意频繁扫码
- 🔒 **隐私保护** — 双方不暴露手机号，通过云端推送中转
- 💸 **完全免费** — Cloudflare Workers + MailChannels 免费额度够用
- ⚡ **Serverless** — 零服务器、零运维成本

## 界面预览

| 请求者页面 | 车主页面 |
|:---:|:---:|
| [🔗 在线预览](https://htmlpreview.github.io/?https://github.com/lesnolie/movecar/blob/main/preview-requester.html) | [🔗 在线预览](https://htmlpreview.github.io/?https://github.com/lesnolie/movecar/blob/main/preview-owner.html) |

## 为什么需要它？

- 🚗 **被堵车却找不到车主** - 干着急没办法
- 📱 **传统挪车码暴露电话** - 隐私泄露、骚扰电话不断
- 😈 **恶意扫码骚扰** - 有人故意反复扫码打扰
- 🤔 **路人好奇扫码** - 并不需要挪车却触发通知

## 通知方式

### 📱 Bark 推送（主要）

- 🔔 支持「紧急 / 重要 / 警告」通知级别
- 🎵 可自定义通知音效
- 🌙 **即使开启勿扰模式也能收到提醒**
- 📱 iOS 用户首选方案

### 📧 邮件通知（新增）

- 🎨 **精美 HTML 邮件** — 渐变色头部、留言卡片、地图按钮
- 📍 **位置信息** — 有位置时附带高德地图链接
- 🆓 **免费发送** — 使用 MailChannels（Cloudflare 专属免费邮件服务）
- ⚡ **无需 API 密钥** — 只需配置收件邮箱即可

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

```
请求者                              车主
  │                                  │
  ├─ 扫码进入页面                     │
  ├─ 填写留言、获取位置                │
  ├─ 点击发送                         │
  │   ├─ 有位置 → 立即推送 ──────────→ 收到 Bark + 邮件
  │   └─ 无位置 → 30秒后推送 ────────→ 收到 Bark + 邮件
  │                                  │
  ├─ 等待中...                        ├─ 查看请求者位置
  │                                  ├─ 点击确认，分享位置
  │                                  │
  ├─ 收到确认，查看车主位置 ←──────────┤
  │                                  │
  ▼                                  ▼
```

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
4. 回到你的 Worker →「Settings」→「Bindings」
5. 点击「Add」→「KV Namespace」
6. Variable name 填 `MOVE_CAR_STATUS`
7. 选择刚创建的 namespace，点击「Deploy」

### 第四步：配置环境变量

1. Worker →「Settings」→「Variables and Secrets」
2. 添加以下变量：
   - `BARK_URL`：你的 Bark 推送地址（如 `https://api.day.app/xxxxx`）
   - `EMAIL_TO`：接收邮件通知的邮箱地址（可选，不填则不发邮件）
   - `PHONE_NUMBER`：备用联系电话（可选）

> 💡 **邮件通知**：只需配置 `EMAIL_TO` 即可，使用 MailChannels 免费发送，无需 API 密钥！

### 第五步：绑定域名（可选）

1. Worker →「Settings」→「Domains & Routes」
2. 点击「Add」→「Custom Domain」
3. 输入你的域名，按提示完成 DNS 配置

## 制作挪车码

### 生成二维码

1. 复制你的 Worker 地址（如 `https://movecar.你的账号.workers.dev`）
2. 使用任意二维码生成工具（如 草料二维码、QR Code Generator）
3. 将链接转换为二维码并下载

### 美化挪车牌

使用 AI 工具生成精美的装饰设计：

- **Nanobanana Pro** - 生成装饰图案和背景
- **ChatGPT** - 生成创意设计图

制作步骤：

1. 用 AI 工具生成你喜欢的装饰图案
2. 将二维码与生成的图案组合排版
3. 添加「扫码通知车主」提示文字
4. 打印、过塑，贴在车上

> 💡 用 AI 生成独一无二的挪车牌，让你的爱车更有个性！

### 效果展示

![挪车码效果](demo.jpg)

## 安全设置（推荐）

为防止境外恶意攻击，建议只允许中国地区访问：

### 方法一：使用 WAF 规则（推荐）

1. 进入 Cloudflare Dashboard → 你的域名
2. 左侧菜单点击「Security」→「WAF」
3. 点击「Create rule」
4. 规则设置：
   - Rule name：`Block non-CN traffic`
   - If incoming requests match：`Country does not equal China`
   - Then：`Block`
5. 点击「Deploy」

### 方法二：在 Worker 代码中过滤

在 `movecar.js` 的 `handleRequest` 函数开头添加：

```javascript
async function handleRequest(request) {
  const country = request.cf?.country;
  if (country && country !== 'CN') {
    return new Response('Access Denied', { status: 403 });
  }

  // 下面保持原有逻辑
}
```

> ⚠️ 曾经被境外流量攻击过，强烈建议开启地区限制！

## License

MIT

---

## 🙏 致谢

- 原项目：[lesnolie/movecar](https://github.com/lesnolie/movecar)
- 邮件服务：[MailChannels](https://mailchannels.com)（Cloudflare 专属免费邮件服务）

## 📝 更新日志

### v1.1.0 (本 Fork)

- ✨ 新增邮件通知功能（MailChannels，免费无需 API 密钥）
- 📧 精美 HTML 邮件模板（渐变色头部、留言卡片、地图按钮）
- 🛡️ 防骚扰频率限制（60 秒冷却时间）
- 📍 邮件中附带高德地图位置链接
- 🔒 XSS 安全防护
- ⚡ Bark + 邮件并行发送，互不阻塞
- 📊 响应中返回通知发送状态

### v1.0.0 (原版)

- 🚗 基础挪车通知功能
- 📱 Bark 推送
- 📍 双向位置共享
- ⏱️ 无位置延迟 30 秒


