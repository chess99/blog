# chess99.github.io → blog.git + 新主页（cearl.cc）迁移行动文档

目标：

- **现有仓库 `chess99/chess99.github.io`（含所有分支/标签）整体迁移**到新仓库：`git@github.com:chess99/blog.git`
- 迁移完成后，旧仓库清空/重建，用于开发新的个人主页（不再使用 Hexo）
- **主域名从 `blog.cearl.cc` 迁移为 `cearl.cc`**
- 博客最终对外访问路径：**`https://cearl.cc/blog`**

> 重要提醒：GitHub Pages 的“自定义域名”是按站点绑定的，**无法在同一个自定义域名 `cearl.cc` 下同时让另一个 GitHub Pages 站点直接托管 `/blog` 子路径**。
>
> 因此 `https://cearl.cc/blog` 通常需要 **反向代理 / 重写**（推荐 Cloudflare Workers / Nginx），或退回到 **`blog.cearl.cc` 子域名**。

---

## 总览：推荐落地方案

- **新个人主页**：由清空后的 `chess99.github.io` 仓库承载（GitHub Pages User Site），绑定自定义域名 **`cearl.cc`**
- **博客站点**：迁移到新仓库 `chess99/blog`，继续用 GitHub Pages（Project Site），对外基础地址为：
  - `https://chess99.github.io/blog/`
- **`https://cearl.cc/blog`**：在 `cearl.cc` 前面加一层 **反代/重写** 到 `https://chess99.github.io/blog/`
  - 有 Cloudflare：用 **Workers** 最顺滑
  - 有自建服务器：用 **Nginx** 最顺滑

---

## Checklist（执行前准备）

- **权限/SSH**
  - 本机能无密码访问 GitHub：`ssh -T git@github.com`
  - 你对新仓库 `chess99/blog` 有 push 权限
- **新仓库确认**
  - `chess99/blog` 已创建（空仓库也可以）
- **现有 Pages 绑定信息梳理（需要你做）**
  - 旧站点目前占用了自定义域名：`blog.cearl.cc`（来源：`source/CNAME` + Pages 设置）
  - 迁移时需要在 GitHub Pages 设置里**解除旧域名绑定**，否则新站点绑定 `cearl.cc` 时可能提示已被占用
- **DNS 控制权**
  - 你能改 `cearl.cc` 的 DNS（A/AAAA/ALIAS/CNAME/HTTPS record 等）

---

## 迁移 Part 1：Git 仓库“全量”迁移到 `chess99/blog`

### 方法（推荐，最干净）：bare clone + mirror push

这会把 **所有分支、标签**原样推到新仓库（不带多余的 remote-tracking refs）。

在本机任意目录执行：

```bash
# 1) 拉取一个 bare 仓库（包含全部分支/标签）
tmp="$(mktemp -d)"
cd "$tmp"
git clone --bare git@github.com:chess99/chess99.github.io.git chess99.github.io.git

# 2) 推送到新仓库（镜像推送）
cd chess99.github.io.git
git push --mirror git@github.com:chess99/blog.git
```

验证：

```bash
git ls-remote --heads --tags git@github.com:chess99/blog.git
```

> 回滚：如果推错了仓库，可以在 GitHub 直接删除错误分支/重建仓库；mirror push 会覆盖同名 refs，请谨慎确认目标 remote。

---

## 迁移 Part 2：博客站点在新仓库的发布策略（GitHub Pages）

你当前的博客发布方式：

- `master` 分支 push 触发 Actions（`.github/workflows/main.yml`）
- Actions 内执行 `hexo clean && hexo generate && hexo deploy`
- Hexo deploy 目标写在 `_config.yml`：
  - `repo: git@github.com:chess99/chess99.github.io.git`
  - `branch: gh-pages`
- `source/CNAME` 当前是 `blog.cearl.cc`

迁移到 `chess99/blog` 后，有两条路线：

### 路线 A（最省事，延续你现有 deploy key 方式）

需要做的改动：

- **更新 Hexo deploy 目标仓库**：把 `_config.yml` 的 `deploy.repo` 改为 `git@github.com:chess99/blog.git`
- **把旧仓库里的 Actions Secret 复制到新仓库**
  - 旧：`chess99/chess99.github.io` → Settings → Secrets and variables → Actions
  - 找到 `HEXO_DEPLOY_SECRET`
  - 新：`chess99/blog` → 同路径新建同名 secret，值保持一致

优点：改动小。

缺点：需要维护 deploy key；workflow 里还在用较旧的 `actions/checkout@v2`。

### 路线 B（推荐长期做法，改用官方 Pages 部署）

思路：Actions 构建 `public/` 后直接用 GitHub Pages 官方方式发布（不需要 deploy key）。

优点：安全、配置少。

缺点：需要改 workflow（我可以帮你改）。

---

## 迁移 Part 3：实现 `https://cearl.cc/blog`

### 先讲结论

- **GitHub Pages 自定义域名无法“挂载子路径”到另一个 Pages 站点**（即无法直接把 `cearl.cc/blog` 指向 `chess99/blog` 的 Pages）
- 要实现 `https://cearl.cc/blog`，你需要：
  - **(推荐)** `cearl.cc` 前置一个反向代理层，转发 `/blog/*` 到 `https://chess99.github.io/blog/*`
  - 或者放弃 `/blog`，继续用 `blog.cearl.cc`

下面给可操作方案。

### 方案 1（推荐）：Cloudflare Workers 反代 + 路径重写

前提：`cearl.cc` 使用 Cloudflare 托管 DNS。

- 在 Cloudflare 创建一个 Worker，核心逻辑：
  - 把 `https://cearl.cc/blog/...` 重写为 `https://chess99.github.io/blog/...`
  - 保持静态资源路径正常（`/blog/` 前缀）

Worker 示例（可直接用）：

```js
export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/blog")) {
      return fetch(request);
    }
    const target = new URL("https://chess99.github.io");
    target.pathname = url.pathname; // 保持 /blog/...
    target.search = url.search;
    return fetch(new Request(target, request));
  },
};
```

路由（Routes）配置：

- `cearl.cc/blog*`

> 如果你希望博客域名彻底变成 `cearl.cc/blog`，博客站点内部的 `url`/`root` 也要配成 `/blog/`，否则会出现资源 404。

### 方案 2：自建 Nginx 反代

在 `cearl.cc` 的站点里加一段 location：

```nginx
location ^~ /blog/ {
  proxy_pass https://chess99.github.io/blog/;
  proxy_set_header Host chess99.github.io;
}
```

### 方案 3（备选，最简单但不满足 /blog）：继续使用 `blog.cearl.cc`

- 博客仍绑定自定义域名 `blog.cearl.cc`
- 新个人主页绑定 `cearl.cc`
- 首页提供链接跳转到博客子域名

---

## 迁移 Part 4：旧仓库 `chess99.github.io` 清空并用于新主页

做法（保留新主页的干净历史）：

1. 先完成 Part 1，把旧内容迁移到 `blog`（确保不会丢）
2. 在旧仓库创建一个“孤儿提交”作为新主页起点：
   - 这会让新主页从一个全新的 commit 开始（旧历史已在 `blog` 仓库保存）

命令示例（在旧仓库工作区执行）：

```bash
# 创建一个没有历史的分支（孤儿分支）
git checkout --orphan main
git rm -rf .

# 新主页内容放这里（例如一个最小的 index.html）
printf '%s\n' '<!doctype html><meta charset="utf-8"><title>Cearl</title><h1>Cearl</h1>' > index.html

git add -A
git commit -m "chore: bootstrap new homepage"

# 强制推送覆盖远端（注意：这会重写旧仓库默认分支历史）
git push -u origin main --force
```

然后在 GitHub 仓库 Settings：

- **把默认分支改为 `main`**
- **删除旧的 `master` 分支**（如果你确定不再需要；旧历史已在 `blog`）

> 如果你不想 force push，也可以新建 `homepage` 分支并在 Pages 里选择该分支发布；但“清空旧仓库”的目标通常更适合 orphan + force。

---

## 需要你人工完成的事项（我会在执行到这些点时停下来）

- **GitHub：解除旧域名占用（旧 repo）**
  - `chess99/chess99.github.io` → Settings → Pages
  - Custom domain 里移除 `blog.cearl.cc`（以及可能的 `cearl.cc` 相关绑定）
- **GitHub：为新主页绑定 `cearl.cc`（旧 repo 清空后）**
  - `chess99/chess99.github.io` → Settings → Pages
  - 设置 Source（Actions 或 branch）
  - 设置 Custom domain = `cearl.cc`
- **DNS：把 `cearl.cc` 指向新主页**
  - 按你 DNS 提供商的 GitHub Pages 指引配置 A/AAAA 或 ALIAS/ANAME
- （如果走路线 A）**把 `HEXO_DEPLOY_SECRET` 复制到新仓库 `chess99/blog`**
- （如果走 `/blog` 方案 1）**Cloudflare Workers/Routes 配置**

---

## 执行顺序（建议）

1. **Part 1：仓库全量迁移到 `chess99/blog`（我来做）**
2. **Part 2：修正博客 deploy 目标 + Secrets（我改代码，你配 secrets）**
3. **先让博客在 `https://chess99.github.io/blog/` 正常跑起来**
4. **Part 4：旧仓库清空，发布新主页（我改代码，你点 Pages + DNS）**
5. **Part 3：用 Cloudflare/Nginx 把 `cearl.cc/blog` 接到博客**

