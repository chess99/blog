---
permalink: /posts/powershell-git-setup/
title: PowerShell 终端美化与 Git 别名配置
pid: 116

alias:
  - /posts/116/
date: 2026-03-10 00:00:00
tags:
  - PowerShell
  - 终端
  - Git
  - Oh My Posh
categories: 工具
---

## 背景

作为 Windows 用户，之前命令行主要用 Git Bash 或 WSL。最近把 VS Code 的默认终端切换到 PowerShell 后，发现 PowerShell 其实也挺有可玩性的。本文记录 PowerShell 的美化配置和 Git 别名设置。

<!-- more -->

## 执行策略配置

PowerShell 默认禁止运行脚本，启动时会报错：

```
. : File C:\Users\zcs\Documents\WindowsPowerShell\profile.ps1 cannot be loaded because running scripts is disabled on this system.
```

### 解决方案

有两种方式：

**方案一：设置当前用户的执行策略**

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

**方案二：在 VS Code 终端配置中绕过**

在 VS Code 的 `settings.json` 中配置：

```json
{
  "terminal.integrated.profiles.windows": {
    "PowerShell": {
      "source": "PowerShell",
      "args": ["-ExecutionPolicy", "Bypass"]
    }
  },
  "terminal.integrated.defaultProfile.windows": "PowerShell"
}
```

方案二更适合 VS Code 场景，无需管理员权限。

## Oh My Posh 主题美化

Oh My Posh 类似于 zsh 的 oh-my-zsh，可以为 PowerShell 提供美观的主题和 Git 状态显示。

### 安装

```powershell
winget install JanDeDobbeleer.OhMyPosh
```

### 安装 Nerd Font 字体

主题中的图标需要 Nerd Font 字体支持，否则会显示乱码：

```powershell
oh-my-posh font install FiraCode
```

安装后在 VS Code 中配置终端字体：

```json
{
  "terminal.integrated.fontFamily": "FiraCode Nerd Font"
}
```

### 配置主题

在 PowerShell profile 中添加初始化命令：

```powershell
oh-my-posh init pwsh --config "$HOME/.config/oh-my-posh/themes/paradox.omp.json" | Invoke-Expression
```

**注意**：如果使用远程 URL 加载主题可能会因网络问题报错 `CONFIG URL FETCH FAILED`，建议将主题文件下载到本地使用。

主题文件可以从 [Oh My Posh Themes](https://github.com/JanDeDobbeleer/oh-my-posh/tree/main/themes) 下载，常用主题有：`paradox`、`agnoster`、`powerlevel10k_rainbow`、`tokyo` 等。

## Git 别名配置

作为开发者，Git 是最常用的命令之一。参考 oh-my-zsh 的 git 插件，可以在 PowerShell 中实现类似的别名体验。

### 解决内置别名冲突

PowerShell 有一些内置的短别名会与 Git 别名冲突，如 `gp`（Get-ItemProperty）、`gl`（Get-Location）、`gcm`（Get-Command）等。需要先移除这些内置别名：

```powershell
# 兼容 Windows PowerShell 5.1
Remove-Item Alias:gp -Force -ErrorAction SilentlyContinue
Remove-Item Alias:gl -Force -ErrorAction SilentlyContinue
Remove-Item Alias:gcm -Force -ErrorAction SilentlyContinue
Remove-Item Alias:gcb -Force -ErrorAction SilentlyContinue
```

**注意**：`Remove-Alias` 是 PowerShell 6+ 的命令，Windows PowerShell 5.1 需要用 `Remove-Item Alias:xxx` 方式。

### 为什么用函数而不是 Set-Alias

PowerShell 的 `Set-Alias` 不支持带参数的命令别名，所以需要用函数实现：

```powershell
# 这样不行
Set-Alias -Name gst -Value "git status"

# 正确方式：使用函数
function gst { git status $args }
```

`$args` 允许传递额外参数，比如 `gst -s` 等价于 `git status -s`。

### 常用别名列表

| Alias | Command | 说明 |
|-------|---------|------|
| `gst` | `git status` | 查看状态 |
| `ga` | `git add` | 添加文件 |
| `gaa` | `git add --all` | 添加所有文件 |
| `gco` | `git checkout` | 切换分支 |
| `gcb` | `git checkout -b` | 创建并切换分支 |
| `gcm` | `git checkout main` | 切换到 main 分支 |
| `gcmsg` | `git commit -m` | 提交 |
| `gcam` | `git commit -a -m` | 添加所有并提交 |
| `gp` | `git push` | 推送 |
| `gpf` | `git push --force-with-lease` | 安全强制推送 |
| `gpf!` | `git push --force` | 强制推送 |
| `gl` | `git pull` | 拉取 |
| `gpr` | `git pull --rebase` | 变基拉取 |
| `gb` | `git branch` | 分支操作 |
| `gba` | `git branch -a` | 查看所有分支 |
| `gbd` | `git branch -d` | 删除分支 |
| `gd` | `git diff` | 查看差异 |
| `gds` | `git diff --staged` | 查看暂存区差异 |
| `glog` | `git log --oneline --graph` | 图形化日志 |
| `glol` | `git log --graph --pretty=...` | 美化日志 |
| `gsta` | `git stash push` | 暂存 |
| `gstaa` | `git stash apply` | 应用暂存 |
| `gstp` | `git stash pop` | 弹出暂存 |
| `gstl` | `git stash list` | 暂存列表 |
| `grh` | `git reset` | 重置 |
| `grhh` | `git reset --hard` | 硬重置 |
| `grb` | `git rebase` | 变基 |
| `grbi` | `git rebase -i` | 交互式变基 |
| `gcp` | `git cherry-pick` | 摘取提交 |
| `gf` | `git fetch` | 获取远程更新 |
| `gfa` | `git fetch --all --prune` | 获取并清理 |

## 自定义别名

除了 Git 别名，也可以添加其他常用命令的别名：

```powershell
# Claude Code 快捷方式
function cc {
    claude --dangerously-skip-permissions $args
}
```

## 完整配置文件

PowerShell profile 路径：`$HOME\Documents\WindowsPowerShell\profile.ps1`

```powershell
#region conda initialize
# !! Contents within this block are managed by 'conda init' !!
If (Test-Path "D:\Programs\anaconda3\Scripts\conda.exe") {
    (& "D:\Programs\anaconda3\Scripts\conda.exe" "shell.powershell" "hook") | Out-String | ?{$_} | Invoke-Expression
}
#endregion

function cc {
    claude --dangerously-skip-permissions $args
}

# Oh My Posh 主题
oh-my-posh init pwsh --config "$HOME/.config/oh-my-posh/themes/paradox.omp.json" | Invoke-Expression

# Git aliases (参考 oh-my-zsh git plugin)
# 移除 PowerShell 内置别名冲突 (兼容 Windows PowerShell 5.1)
Remove-Item Alias:gp -Force -ErrorAction SilentlyContinue
Remove-Item Alias:gl -Force -ErrorAction SilentlyContinue
Remove-Item Alias:gcm -Force -ErrorAction SilentlyContinue
Remove-Item Alias:gcb -Force -ErrorAction SilentlyContinue

function g { git $args }
function ga { git add $args }
function gaa { git add --all $args }
function gau { git add --update $args }
function gb { git branch $args }
function gba { git branch --all $args }
function gbd { git branch --delete $args }
function gbD { git branch --delete --force $args }
function gbm { git branch --move $args }
function gco { git checkout $args }
function gcb { git checkout -b $args }
function gcm { git checkout $(git_main_branch) $args }
function gcd { git checkout $(git_develop_branch) $args }
function gc { git commit --verbose $args }
function gca { git commit --verbose --all $args }
function gcam { git commit --all --message $args }
function gcmsg { git commit --message $args }
function gcan { git commit --verbose --all --no-edit --amend $args }
function gcp { git cherry-pick $args }
function gcpa { git cherry-pick --abort $args }
function gcpc { git cherry-pick --continue $args }
function gd { git diff $args }
function gds { git diff --staged $args }
function gdw { git diff --word-diff $args }
function gf { git fetch $args }
function gfa { git fetch --all --tags --prune $args }
function gfo { git fetch origin $args }
function gl { git pull $args }
function gpr { git pull --rebase $args }
function glg { git log --stat $args }
function glo { git log --oneline --decorate $args }
function glog { git log --oneline --decorate --graph $args }
function glol { git log --graph --pretty='%Cred%h%Creset -%C(auto)%d%Creset %s %Cgreen(%ar) %C(bold blue)<%an>%Creset' $args }
function gm { git merge $args }
function gma { git merge --abort $args }
function gp { git push $args }
function gpd { git push --dry-run $args }
function gpf { git push --force-with-lease $args }
function gpf! { git push --force $args }
function gpsup { git push --set-upstream origin $(git_current_branch) $args }
function gr { git remote $args }
function grv { git remote --verbose $args }
function gra { git remote add $args }
function grb { git rebase $args }
function grba { git rebase --abort $args }
function grbc { git rebase --continue $args }
function grbi { git rebase --interactive $args }
function grh { git reset $args }
function grhh { git reset --hard $args }
function grhs { git reset --soft $args }
function grs { git restore $args }
function grst { git restore --staged $args }
function gst { git status $args }
function gss { git status --short $args }
function gsta { git stash push $args }
function gstaa { git stash apply $args }
function gstd { git stash drop $args }
function gstl { git stash list $args }
function gstp { git stash pop $args }
function gsts { git stash show --patch $args }
function gsw { git switch $args }
function gswc { git switch -c $args }

# Git 辅助函数
function git_current_branch {
    git rev-parse --abbrev-ref HEAD 2>$null
}

function git_main_branch {
    if (git rev-parse --verify main 2>$null) { "main" }
    elseif (git rev-parse --verify master 2>$null) { "master" }
    else { "main" }
}

function git_develop_branch {
    if (git rev-parse --verify develop 2>$null) { "develop" }
    elseif (git rev-parse --verify dev 2>$null) { "dev" }
    else { "develop" }
}
```

## VS Code 完整配置

`settings.json` 相关配置：

```json
{
  "terminal.integrated.fontFamily": "FiraCode Nerd Font",
  "terminal.integrated.defaultProfile.windows": "PowerShell",
  "terminal.integrated.profiles.windows": {
    "PowerShell": {
      "source": "PowerShell",
      "args": ["-ExecutionPolicy", "Bypass"]
    }
  }
}
```

## 常见问题

### Q: 启动时显示乱码

安装 Nerd Font 字体并在 VS Code 中配置 `terminal.integrated.fontFamily`。

### Q: CONFIG URL FETCH FAILED

主题配置文件从远程 URL 加载失败，改为使用本地文件：

```powershell
oh-my-posh init pwsh --config "$HOME/.config/oh-my-posh/themes/paradox.omp.json" | Invoke-Expression
```

### Q: 如何重新加载 profile

修改 profile 后执行：

```powershell
. $PROFILE
```

或重启终端。

## 总结

通过 Oh My Posh 和 Git 别名配置，PowerShell 的使用体验可以接近 oh-my-zsh。对于 Windows 开发者来说，PowerShell 是一个值得尝试的选择。

---

**参考链接**：

- [Oh My Posh 官方文档](https://ohmyposh.dev/)
- [oh-my-zsh git 插件](https://github.com/ohmyzsh/ohmyzsh/tree/master/plugins/git)
- [Nerd Fonts](https://www.nerdfonts.com/)