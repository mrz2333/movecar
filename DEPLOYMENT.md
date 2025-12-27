# 📦 部署指南

本指南将帮助你快速部署 MoveCar 挪车通知系统到 Cloudflare Workers。

## 🎯 部署方式

### 方式一：零代码部署（推荐新手）
适合不熟悉代码的用户，通过 Cloudflare Dashboard 部署

### 方式二：命令行部署（推荐开发者）
通过 Wrangler CLI 命令部署，适合需要自定义配置的用户

## 🚀 方式一：零代码部署

### 步骤 1：注册 Cloudflare 账号

1. 访问 [Cloudflare 官网](https://www.cloudflare.com/)
2. 点击注册按钮，填写邮箱和密码
3. 验证邮箱完成注册

### 步骤 2：创建 Worker

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 在左侧菜单点击 "Workers"
3. 点击 "Create a Worker" 按钮
4. 给 Worker 命名（推荐：`movecar`）
5. 点击 "Deploy"

### 步骤 3：编辑 Worker 代码

1. 在 Worker 页面点击 "Quick Edit"
2. 删除默认代码，复制以下代码：
   - 打开 `movecar.js` 文件
   - 全选复制所有代码
   - 粘贴到编辑器中
3. 点击 "Save and Deploy"

### 步骤 4：创建 KV 命名空间

1. 在 Workers 页面点击左侧 "KV"
2. 点击 "Create a namespace"
3. 命名空间名称：`MOVE_CAR_STATUS`
4. 点击 "Add"
5. 记下命名空间 ID（后续配置需要）

### 步骤 5：绑定 KV 命名空间

1. 返回到你的 Worker 页面
2. 点击 "Settings" → "Variables"
3. 在 "KV Namespace Bindings" 部分：
   - Variable name: `MOVE_CAR_STATUS`
   - KV namespace: 选择刚创建的命名空间
4. 点击 "Save"

### 步骤 6：配置环境变量

1. 在同一个 "Variables" 页面：
2. 点击 "Environment variables" 下面的 "Edit variables"
3. 添加以下环境变量：

```
BARK_URL = https://api.day.app/YOUR_DEVICE_KEY
PHONE_NUMBER = +8613800138000  (可选)
```

**注意**：将 `YOUR_DEVICE_KEY` 替换为你的 Bark 设备密钥。

### 步骤 7：测试部署

1. 复制 Worker 的域名（格式：`your-name.your-workers-subdomain.workers.dev`）
2. 在浏览器中访问该域名
3. 测试完整功能流程

## 💻 方式二：命令行部署

### 前置要求

- [Node.js](https://nodejs.org/) (版本 16+)
- [Git](https://git-scm.com/)
- Cloudflare 账号

### 步骤 1：安装 Wrangler CLI

```bash
# 使用 npm
npm install -g wrangler

# 或使用 yarn
yarn global add wrangler

# 或使用 pnpm
pnpm add -g wrangler
```

### 步骤 2：登录 Cloudflare

```bash
wrangler login
```

这将打开浏览器让你登录 Cloudflare 账号。

### 步骤 3：获取项目代码

```bash
# 克隆仓库
git clone https://github.com/yourusername/movecar.git
cd movecar

# 或创建新文件夹
mkdir movecar
cd movecar
# 下载 movecar.js 和其他必要文件
```

### 步骤 4：配置环境

1. **复制环境变量模板**
   ```bash
   cp env.example .env
   ```

2. **编辑 `.env` 文件**
   ```bash
   # 使用你喜欢的编辑器
   nano .env
   # 或
   code .env
   ```

3. **修改配置**
   ```
   # 必填项
   BARK_URL=https://api.day.app/你的设备密钥
   
   # 可选项  
   PHONE_NUMBER=+8613800138000
   ```

### 步骤 5：创建 KV 命名空间

```bash
# 创建生产环境 KV
wrangler kv:namespace create "MOVE_CAR_STATUS"

# 创建预览环境 KV  
wrangler kv:namespace create "MOVE_CAR_STATUS" --preview
```

记下输出的 namespace ID，更新 `wrangler.toml`：

```toml
[[kv_namespaces]]
binding = "MOVE_CAR_STATUS"
id = "你的生产环境ID"
preview_id = "你的预览环境ID"
```

### 步骤 6：本地测试

```bash
# 启动开发服务器
wrangler dev

# 在浏览器中访问 http://localhost:8787
```

### 步骤 7：部署到生产环境

```bash
# 部署
wrangler deploy

# 部署成功会显示访问链接
```

## 🔧 配置自定义域名（可选）

### 自动配置

1. 在 Cloudflare Workers 页面点击 "Triggers"
2. 点击 "Add Custom Domain"
3. 输入你的域名（如：`move.yourdomain.com`）
4. 点击 "Add"

### 手动配置

如果你有自己的域名在 Cloudflare：

1. 在域名管理页面添加 CNAME 记录：
   ```
   类型: CNAME
   名称: move (或你想要的子域名)
   目标: your-worker-name.workers.dev
   代理状态: 已代理
   ```

## 📱 推送服务配置

### Bark 配置（推荐）

1. **安装 Bark**
   - iOS: App Store 搜索 "Bark"
   - Android: 访问 [Bark 官网](https://bark.day.app/) 下载

2. **获取设备密钥**
   - 打开 Bark app
   - 查看页面显示的设备号
   - 或访问 `https://api.day.app/你的设备号/` 测试

3. **配置 BARK\_URL**
   ```
   # 格式
   BARK_URL=https://api.day.app/你的设备号
   
   # 示例
   BARK_URL=https://api.day.app/v3HD9k2rP8tqWQwX
   ```

### Server酱 配置

1. 访问 [Server酱官网](https://sc.ftqq.com/)
2. 微信扫码关注获取 SCKEY
3. 需要修改代码中的推送逻辑

### PushPlus 配置

1. 访问 [PushPlus官网](https://www.pushplus.plus/)
2. 注册获取 token
3. 需要修改代码中的推送逻辑

## 🧪 部署验证

### 功能测试清单

- [ ] 页面能正常访问
- [ ] 获取位置功能正常
- [ ] 发送通知功能正常  
- [ ] 推送消息能收到
- [ ] 车主确认页面正常
- [ ] 状态同步功能正常
- [ ] 地图链接能打开

### 测试流程

1. **完整流程测试**
   ```
   访问主页 → 输入留言 → 获取位置 → 发送通知 
   → 收到推送 → 点击确认 → 查看状态同步
   ```

2. **异常情况测试**
   - 拒绝位置权限测试
   - 网络断开测试  
   - 推送失败测试

## 🚨 常见问题

### Q: 推送收不到？
**A:** 检查以下项目：
- BARK_URL 配置是否正确
- 设备号是否准确
- 网络是否正常
- Bark app 是否正常运行

### Q: 位置获取失败？
**A:** 
- 确保浏览器有定位权限
- 检查设备 GPS 是否开启
- 位置获取失败不影响通知发送

### Q: 页面无法访问？
**A:**
- 确认 Worker 部署成功
- 检查域名配置是否正确
- 查看 Cloudflare 控制台的错误日志

### Q: KV 存储报错？
**A:**
- 确认 KV 命名空间绑定正确
- 检查 Worker 计划是否包含 KV 功能
- 查看代码中的 KV 变量名是否正确

## 📋 维护清单

### 定期检查

- [ ] 每月检查推送服务状态
- [ ] 每季度检查代码是否需要更新
- [ ] 每年检查证书和域名状态

### 监控指标

- Worker 请求成功率
- 推送送达率
- 平均响应时间
- 错误日志数量

## 🛠️ 高级配置

### 自定义域名解析

```bash
# 检查 DNS 解析
nslookup move.yourdomain.com

# 测试证书
curl -I https://move.yourdomain.com
```

### 性能优化

```toml
# wrangler.toml
[limits]
cpu_ms = 1000  # CPU 时间限制

[[rules]]
type = ["ESModule"]
```

### 监控和日志

```bash
# 查看 Worker 实时日志
wrangler tail

# 查看 KV 数据
wrangler kv:namespace list MOVE_CAR_STATUS
```

---

## 📞 获取帮助

如果遇到部署问题，可以通过以下方式获取帮助：

- 📧 提交 [GitHub Issues](https://github.com/yourusername/movecar/issues)
- 💬 访问 [GitHub Discussions](https://github.com/yourusername/movecar/discussions)
- 📖 查看 [Cloudflare Workers 文档](https://workers.cloudflare.com/docs)

---

**祝你部署顺利！🎉**
