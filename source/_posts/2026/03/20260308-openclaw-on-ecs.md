---
permalink: /posts/openclaw-on-ecs/
title: 阿里云ECS养龙虾：OpenClaw部署与配置实录
pid: 115

date: 2026-03-08 00:00:00
tags:
  - SSH
  - 阿里云
  - OpenClaw
categories: AI 工程
---

买了台阿里云 ECS 专门跑 OpenClaw（绰号"龙虾"），记录折腾过程。

为什么不跑在本机：本地跑有安全隐患（gateway 只绑 loopback，但本机环境更复杂），而且不能 24 小时开机。ECS 2vCPU / 2GB 内存 / 40GB 磁盘，99 元/年，够用。

为什么接飞书：看到一篇文章讲得很好——飞书作为办公 IM，文档、表格、知识库全是云端结构化数据，全有 API，天然是 Agent 的上下文来源；加上完备的机器人体系，顺理成章成了 OpenClaw 的首选前端。

<!-- more -->

## SSH 配置

### 准备密钥文件

阿里云会提供一个 PEM 格式的私钥文件（如 `ali-vps-2v2g.pem`），将其放到 `~/.ssh/` 并设置权限：

```bash
cp ~/Downloads/ali-vps-2v2g.pem ~/.ssh/
chmod 600 ~/.ssh/ali-vps-2v2g.pem
```

权限必须是 600，否则 SSH 会报 `WARNING: UNPROTECTED PRIVATE KEY FILE!` 并拒绝使用。

### 配置 SSH 别名

编辑 `~/.ssh/config`：

```
Host ali
    HostName <your-server-ip>
    User root
    IdentityFile ~/.ssh/ali-vps-2v2g.pem
```

之后直接 `ssh ali` 即可，无需记 IP 和密钥路径。

## 部署 OpenClaw

### 安装

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

### 启动 Gateway

```bash
nohup openclaw gateway > ~/openclaw.log 2>&1 &
```

验证是否在监听：

```bash
netstat -tlnp | grep 18789
# tcp  0  0 127.0.0.1:18789  0.0.0.0:*  LISTEN
```

## SSH 隧道远程访问

OpenClaw Gateway 默认只绑定 `127.0.0.1`，不对外暴露（直接改绑 `0.0.0.0` 会被配置校验拒绝），需要通过 SSH 端口转发访问。

在本机 `~/.ssh/config` 增加：

```
Host ali-tunnel
    HostName <your-server-ip>
    User root
    IdentityFile ~/.ssh/ali-vps-2v2g.pem
    LocalForward 18789 127.0.0.1:18789
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

建立隧道：

```bash
ssh -N ali-tunnel
```

之后浏览器访问 `http://localhost:18789` 即可。隧道断开会导致无法访问，可以用 `autossh` 自动重连：

```bash
autossh -M 0 -N ali-tunnel
```

## 接入阿里云 Coding Plan

阿里云 Coding Plan 提供了一批免费额度的模型，通过标准 OpenAI 兼容接口接入。

编辑 `~/.openclaw/openclaw.json`，在 `models.providers` 下追加 `bailian`，并设置默认模型：

```json
{
  "models": {
    "mode": "merge",
    "providers": {
      "bailian": {
        "baseUrl": "https://coding.dashscope.aliyuncs.com/v1",
        "apiKey": "YOUR_API_KEY",
        "api": "openai-completions",
        "models": [
          {
            "id": "glm-5",
            "name": "glm-5",
            "input": ["text"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 202752,
            "maxTokens": 16384
          },
          {
            "id": "qwen3-coder-plus",
            "name": "qwen3-coder-plus",
            "input": ["text"],
            "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 },
            "contextWindow": 1000000,
            "maxTokens": 65536
          }
        ]
      }
    }
  },
  "agents": {
    "defaults": {
      "model": {
        "primary": "bailian/glm-5"
      }
    }
  }
}
```

修改完重启 gateway 生效：

```bash
openclaw gateway restart
```

验证 API 是否通：

```bash
curl -s -X POST https://coding.dashscope.aliyuncs.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{"model":"glm-5","messages":[{"role":"user","content":"hi"}],"max_tokens":20}'
```

返回正常响应即配置成功。glm-5 的响应中会包含 `reasoning_content` 字段，它是推理模型。

在 TUI 中可用 `/model` 查看所有可用模型，`/model <名称>` 临时切换。

## 接入飞书

详细步骤参考 [OpenClaw 官方文档](https://docs.openclaw.ai/channels/feishu)，这里只记几个关键点。

飞书 channel 是内置插件，无需额外安装。接入走的是**长连接（WebSocket）模式**，不需要公网 IP 或配置 webhook，ECS 只需能出网即可。

配置写入 `~/.openclaw/openclaw.json`：

```json
{
  "channels": {
    "feishu": {
      "enabled": true,
      "dmPolicy": "pairing",
      "accounts": {
        "main": {
          "appId": "cli_xxx",
          "appSecret": "xxx",
          "botName": "OpenClaw"
        }
      }
    }
  }
}
```

重启 gateway 后，飞书开放平台侧需要：开启机器人能力、配置必要权限、事件订阅选长连接并添加 `im.message.receive_v1`、发布应用。

首次在飞书给机器人发消息会收到配对码，在服务器执行：

```bash
openclaw pairing approve feishu <CODE>
```

approve 后即可正常对话。
