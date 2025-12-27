# MoveCar - 挪车通知系统

基于 Cloudflare Workers 的挪车通知系统，扫码即可通知车主。

## 功能

- 扫码一键通知车主
- 双向位置共享（请求者和车主）
- 支持高德地图、Apple Maps
- 通过 Bark 推送通知到手机

## 部署步骤

### 1. 创建 Cloudflare Worker

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 Workers & Pages → Create Worker
3. 复制 `movecar.js` 代码粘贴进去

### 2. 创建 KV 存储

1. Workers & Pages → KV → Create namespace
2. 名称填 `MOVE_CAR_STATUS`
3. 回到 Worker → Settings → Bindings → Add → KV Namespace
4. Variable name 填 `MOVE_CAR_STATUS`，选择刚创建的 namespace

### 3. 配置环境变量

Worker → Settings → Variables → Add：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| BARK_URL | `https://api.day.app/你的密钥` | Bark 推送地址 |
| PHONE_NUMBER | `+8613800138000` | 备用电话（可选） |

### 4. 绑定域名（可选）

Worker → Triggers → Add Custom Domain

## 使用流程

**请求者：**
1. 扫码进入页面
2. 允许获取位置（不允许则延迟30秒发送）
3. 点击通知车主
4. 等待车主确认

**车主：**
1. 收到 Bark 推送
2. 点击进入确认页面
3. 查看请求者位置
4. 点击确认，分享自己位置

## 文件说明

```
movecar.js    # 主程序
wrangler.toml # Cloudflare 配置（可选，用于 CLI 部署）
env.example   # 环境变量示例
```

## License

MIT
