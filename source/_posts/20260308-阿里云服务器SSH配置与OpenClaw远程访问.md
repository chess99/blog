---
title: 阿里云服务器SSH配置与OpenClaw远程访问
date: 2026-03-08 00:00:00
tags:
  - SSH
  - 阿里云
  - OpenClaw
  - 远程访问
categories: 运维
---

## 背景

购买了阿里云服务器后，需要配置SSH密钥登录，并部署OpenClaw服务。由于OpenClaw默认只监听本地回环地址，需要通过SSH隧道实现远程访问。

<!-- more -->

## SSH配置

### 1. 准备密钥文件

阿里云会提供一个PEM格式的私钥文件（如 `ali-vps-2v2g.pem`，文件名自己定），这是SSH登录的凭证。

将密钥文件移动到 `~/.ssh/` 目录并设置权限：

```bash
cp ~/Downloads/ali-vps-2v2g.pem ~/.ssh/
chmod 600 ~/.ssh/ali-vps-2v2g.pem
```

**注意**：PEM文件权限必须是600，否则SSH会拒绝使用并报错 `WARNING: UNPROTECTED PRIVATE KEY FILE!`

### 2. 配置SSH别名

编辑 `~/.ssh/config` 文件（Windows路径为 `C:\Users\用户名\.ssh\config`）：

```
Host ali
    HostName 47.98.163.187
    User root
    IdentityFile ~/.ssh/ali-vps-2v2g.pem
```

配置完成后，可直接使用别名连接：

```bash
ssh ali
```

无需记忆IP地址和密钥路径。

## OpenClaw部署

### 1. 安装OpenClaw

在服务器上执行安装脚本：

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

### 2. 初始化配置

运行配置向导：

```bash
openclaw configure
```

或使用 `openclaw doctor --fix` 检查并修复配置问题。

### 3. 启动Gateway服务

```bash
nohup openclaw gateway > ~/openclaw.log 2>&1 &
```

验证服务状态：

```bash
netstat -tlnp | grep 18789
# 输出应显示: tcp  0  0 127.0.0.1:18789  0.0.0.0:*  LISTEN
```

## SSH隧道远程访问

### 问题

OpenClaw Gateway 默认绑定到 `127.0.0.1`（loopback），只允许本地访问。直接修改配置绑定 `0.0.0.0` 会被校验拒绝（`gateway.bind: Invalid input`），这是出于安全考虑。

### 解决方案：SSH端口转发

通过SSH隧道将远程端口映射到本地。

**临时隧道**：

```bash
ssh -L 18789:127.0.0.1:18789 ali -N
```

- `-L` 指定本地端口转发
- `-N` 不打开远程shell，只做端口转发
- 保持终端运行，隧道即保持有效

**持久化配置**（推荐）：

在 `~/.ssh/config` 中添加隧道专用Host：

```
Host ali-tunnel
    HostName 47.98.163.187
    User root
    IdentityFile ~/.ssh/ali-vps-2v2g.pem
    LocalForward 18789 127.0.0.1:18789
```

使用方式：

```bash
ssh -N ali-tunnel
```

### 访问OpenClaw

隧道建立后，浏览器访问：

```
http://localhost:18789
```

## 最终配置文件

`~/.ssh/config` 完整内容：

```
Host ali
    HostName 47.98.163.187
    User root
    IdentityFile ~/.ssh/ali-vps-2v2g.pem

Host ali-tunnel
    HostName 47.98.163.187
    User root
    IdentityFile ~/.ssh/ali-vps-2v2g.pem
    LocalForward 18789 127.0.0.1:18789
```

## 常见问题

### Q: PEM文件权限错误

```
Permissions for 'xxx.pem' are too open.
```

**解决**：执行 `chmod 600 xxx.pem`

### Q: 连接被拒绝

检查服务是否运行：`netstat -tlnp | grep 18789`

检查防火墙：`firewall-cmd --list-all`（CentOS）或 `ufw status`（Ubuntu）

### Q: 隧道断开后无法访问

SSH隧道依赖网络连接稳定性。可通过以下方式优化：

1. 在SSH config中添加心跳参数：

```
Host ali-tunnel
    # ... 其他配置
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

1. 使用 `autossh` 自动重连：

```bash
autossh -M 0 -N ali-tunnel
```

## 安全建议

1. 妥善保管PEM私钥，不要上传到公开仓库
2. 定期更换服务器密码和密钥
3. 禁用密码登录，只允许密钥认证：

```bash
# 编辑 /etc/ssh/sshd_config
PasswordAuthentication no
PubkeyAuthentication yes

# 重启SSH服务
systemctl restart sshd
```

1. 使用非默认SSH端口（修改 `/etc/ssh/sshd_config` 中的 `Port`）

---

**参考链接**：

- [OpenClaw 官方文档](https://docs.openclaw.ai)
- [SSH端口转发详解](https://www.ssh.com/academy/ssh/tunneling/example)
