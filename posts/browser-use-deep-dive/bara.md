---
permalink: /posts/claude-code-buddy-capybara/
title: 我让 Claude 逆向了自己，0.04 秒找到传说闪光卡皮巴拉
pid: 120
date: 2026-04-16 00:00:00
tags:
  - Claude Code
  - 逆向工程
  - JavaScript
categories: 工具
---

Claude Code 有个 `/buddy` 命令，会根据你的账户 ID 孵化一只陪你写代码的小动物。稀有度五档，legendary shiny 的概率是万分之一。

我的默认宠物是一只 common axolotl——最低档，无闪光。我想要传说闪光卡皮巴拉。

于是我把这个系统的漏洞原理告诉了 Claude，让它去 190MB 的 Claude Code 二进制里找算法。它自己定位到了打包进去的 JS bundle，读懂了压缩混淆的代码，写了枚举脚本，还在第一版算法出错后自己设计实验修正。最终 14400 次枚举，0.04 秒，传说闪光卡皮巴拉出来了。

<!-- more -->

## 漏洞在哪里

`/buddy` 宠物由种子哈希决定——同一个种子永远孵化同一只动物。种子的来源有优先级：

1. 优先用 `accountUuid`——Anthropic 服务器下发的账户唯一标识，绑定账户，无法伪造
2. 没有 `accountUuid` 的话，fallback 到 `~/.claude.json` 里的 `userID` 字段
3. 连 `userID` 都没有，用 `"anon"`

关键在第二条：**`userID` 是本地文件里的字段，你可以随便改。**

什么情况下没有 `accountUuid`？用第三方 API（自定义 API key 或 proxy）的用户，配置文件里天然没有这个字段。订阅用户（Claude Max）正常登录会写入，但用 `CLAUDE_CODE_OAUTH_TOKEN` 环境变量方式启动时不会写——这是另一个大 V 发现的绕过路径。

**这只涉及本地配置文件里的一个字段，不涉及任何服务器端数据。**

## 操作步骤

如果你正在用 Claude Code，最省事的做法是直接把这篇文章发给它，告诉它你想要什么宠物，让它来判断你的情况、跑脚本、改配置文件。这篇文章里的卡皮巴拉，就是这么来的。

下面是手动步骤。

### 第一步：确认你的情况

```bash
python3 -c "
import json, os
d = json.load(open(os.path.expanduser('~/.claude.json')))
uuid = d.get('oauthAccount', {}).get('accountUuid')
print('订阅用户，需要先绕过 accountUuid（见文末）' if uuid else '第三方 API 用户，直接操作')
"
```

### 第二步：找到目标 userID

需要安装 [Bun](https://bun.sh)（Claude Code 本身依赖 Bun，一般已经装了）。

把下面的脚本保存为 `buddy-reroll.js`，把 `TARGET` 改成你想要的宠物，运行 `bun buddy-reroll.js`：

<details>
<summary>buddy-reroll.js（核心脚本，点击展开）</summary>

```javascript
const SALT = "friend-2026-401";
const SPECIES = ["duck","goose","blob","cat","dragon","octopus","owl","penguin",
                 "turtle","snail","ghost","axolotl","capybara","cactus","robot",
                 "rabbit","mushroom","chonk"];
const RARITIES = ["common","uncommon","rare","epic","legendary"];
const RARITY_WEIGHTS = { common: 60, uncommon: 25, rare: 10, epic: 4, legendary: 1 };
const STATS = ["DEBUGGING","PATIENCE","CHAOS","WISDOM","SNARK"];
const STAT_BASE = { common:5, uncommon:15, rare:25, epic:35, legendary:50 };

function hash(str) {
  return Number(BigInt(Bun.hash(str)) & 0xffffffffn);
}
function makeRng(seed) {
  let s = seed >>> 0;
  return function() {
    s |= 0; s = s + 1831565813 | 0;
    let q = Math.imul(s ^ s >>> 15, 1 | s);
    q = q + Math.imul(q ^ q >>> 7, 61 | q) ^ q;
    return ((q ^ q >>> 14) >>> 0) / 4294967296;
  };
}
function R0H(rng, arr) { return arr[Math.floor(rng() * arr.length)]; }
function pickRarity(rng) {
  let r = rng() * 100;
  for (const rarity of RARITIES) { r -= RARITY_WEIGHTS[rarity]; if (r < 0) return rarity; }
  return "common";
}
function rollStats(rng, rarity) {
  const base = STAT_BASE[rarity];
  let K = R0H(rng, STATS), O = R0H(rng, STATS);
  while (O === K) O = R0H(rng, STATS);
  const result = {};
  for (const T of STATS) {
    if (T === K) result[T] = Math.min(100, base + 50 + Math.floor(rng() * 30));
    else if (T === O) result[T] = Math.max(1, base - 10 + Math.floor(rng() * 15));
    else result[T] = base + Math.floor(rng() * 40);
  }
  return result;
}
function roll(userID) {
  const rng = makeRng(hash(userID + SALT));
  const rarity = pickRarity(rng);
  const species = R0H(rng, SPECIES);
  rng(); // eye
  if (rarity !== "common") rng(); // hat
  const shiny = rng() < 0.01;
  rollStats(rng, rarity);
  return { rarity, species, shiny };
}
function randomHex64() {
  let s = "";
  for (let i = 0; i < 64; i++) s += Math.floor(Math.random() * 16).toString(16);
  return s;
}

// ↓ 改这里
const TARGET = { species: "capybara", rarity: "legendary", shiny: true };

let attempts = 0;
const start = Date.now();
while (true) {
  const userID = randomHex64();
  const result = roll(userID);
  attempts++;
  if (attempts % 500000 === 0)
    process.stdout.write(`\r${(attempts/1e6).toFixed(1)}M attempts...`);
  if (result.species === TARGET.species &&
      result.rarity === TARGET.rarity &&
      result.shiny === TARGET.shiny) {
    console.log(`\nFound after ${attempts} attempts (${((Date.now()-start)/1000).toFixed(2)}s)`);
    console.log(`userID: ${userID}`);
    process.exit(0);
  }
}
```

</details>

物种可选：`duck` `goose` `blob` `cat` `dragon` `octopus` `owl` `penguin` `turtle` `snail` `ghost` `axolotl` `capybara` `cactus` `robot` `rabbit` `mushroom` `chonk`

稀有度可选：`common` `uncommon` `rare` `epic` `legendary`

0.04 秒内输出：

```
Found after 14400 attempts (0.04s)
userID: b625d73f2b07bbb7b108571274a4ac64bf65031967e99c773288f1b8452d0948
```

### 第三步：写入配置文件

```bash
cp ~/.claude.json ~/.claude.json.bak  # 先备份
```

```python
import json, os

path = os.path.expanduser('~/.claude.json')
with open(path, 'r') as f:
    d = json.load(f)

d['userID'] = '这里填脚本输出的 userID'
d.pop('companion', None)  # 必须删掉，否则读旧缓存

with open(path, 'w') as f:
    json.dump(d, f, indent=2)
```

`companion` 字段是已孵化宠物的缓存，不删的话 Claude Code 直接读旧数据，不会重新算。

### 第四步：重开会话，输入 `/buddy`

---

### 订阅用户的额外步骤

正常登录后 `accountUuid` 会写入配置文件，宠物种子被锁定，`userID` 字段会被忽略。绕过方式是用 `CLAUDE_CODE_OAUTH_TOKEN` 环境变量启动——这种方式不会写入 `accountUuid`：

```bash
# 1. 获取 OAuth token（会打开浏览器完成登录）
claude setup-token

# 2. 清掉 accountUuid
cp ~/.claude.json ~/.claude.json.bak
python3 -c "
import json, os
path = os.path.expanduser('~/.claude.json')
d = json.load(open(path))
d.pop('oauthAccount', None)
d.pop('companion', None)
json.dump(d, open(path, 'w'), indent=2)
"

# 3. 用环境变量方式启动
CLAUDE_CODE_OAUTH_TOKEN=<你的token> claude
```

然后再执行上面的第二、三、四步。

---

## Claude 逆向自己的过程

这件事的起因是我看到有人发现了这个漏洞——原理我懂了，但具体的哈希算法不知道，没法直接枚举。于是我把原理告诉了 Claude，问它能不能帮我搞定。

接下来的事情是我在旁边看着发生的。

**在 190MB 二进制里找代码**

Claude Code 的可执行文件是 190MB 的 Mach-O 二进制，没有公开源码。Claude 先用 `grep -oba` 在二进制里搜索 `buddy` 关键词的字节偏移，定位到几个集中出现的区域，再用 `dd` 把那段内容提取出来，用 `strings` 过滤可读文本。

在压缩混淆的 JS bundle 里，它找到了物种列表（每个物种名用 `String.fromCharCode` 编码成数字数组）、稀有度权重、salt 常量、哈希函数、PRNG，以及完整的宠物生成逻辑。

**第一版脚本出错，自己修正**

Claude 没有猜测算法，而是设计了一个校准实验：把 `userID` 改成 64 个 `a`，让我去 Claude Code 里跑 `/buddy` 看实际结果，再用脚本算同一个值比对——如果两边完全一致，说明算法还原正确。

第一版用了 FNV-1a 哈希——源码里确实有这个实现，是 Node.js 环境的 fallback。结果：脚本算出来是 uncommon capybara，实际显示是 uncommon robot，不匹配。rarity 对了，species 错了，说明哈希值本身就不对，后续所有随机数都跑偏了。

原因：Claude Code 实际运行在 Bun 上，走的是 `Bun.hash`（Wyhash 算法），不是 FNV-1a。换掉之后，rarity、species、全部五项 stats 数值完全一致。

**14400 次，0.04 秒**

算法校准后，枚举就是纯体力活了。legendary 概率 1/100，shiny 概率 1/100，同时出现是万分之一。14400 次命中，和理论期望吻合。

---

## 算法细节

**种子选取逻辑**

```javascript
// 优先 accountUuid，没有用 userID，都没有用 "anon"
function oS6() {
  let H = z_();
  return H.oauthAccount?.accountUuid ?? H.userID ?? "anon";
}

// seed = userID + salt，salt 硬编码：hI4 = "friend-2026-401"
function rS6(userID) {
  return yI4(GI4(ZI4(userID + hI4)));  // hash → rng → 生成
}
```

**哈希：Bun.hash（Wyhash）**

```javascript
function ZI4(H) {
  if (typeof Bun !== "undefined")
    return Number(BigInt(Bun.hash(H)) & 0xffffffffn);
  // Node.js fallback，Claude Code 实际走不到这里
  let _ = 2166136261;
  for (let q = 0; q < H.length; q++)
    _ ^= H.charCodeAt(q), _ = Math.imul(_, 16777619);
  return _ >>> 0;
}
```

**PRNG：Mulberry32 变体**

```javascript
function GI4(H) {
  let _ = H >>> 0;
  return function() {
    _ |= 0; _ = _ + 1831565813 | 0;
    let q = Math.imul(_ ^ _ >>> 15, 1 | _);
    q = q + Math.imul(q ^ q >>> 7, 61 | q) ^ q;
    return ((q ^ q >>> 14) >>> 0) / 4294967296;
  };
}
```

**生成顺序**

```javascript
function yI4(rng) {
  const rarity = pickRarity(rng);                            // 消耗 1 次
  const species = R0H(rng, Dsq);                             // 消耗 1 次
  const eye    = R0H(rng, Msq);                              // 消耗 1 次
  const hat    = rarity === "common" ? "none" : R0H(rng, Psq); // common 不消耗
  const shiny  = rng() < 0.01;                               // 消耗 1 次，1% 概率
  const stats  = vI4(rng, rarity);                           // 消耗多次
  return { rarity, species, eye, hat, shiny, stats };
}
```

枚举脚本必须完整模拟这个序列（包括 stats），否则 shiny 的 rng 调用位置对不上。

**物种列表**

物种名在二进制里用字符码编码：

```javascript
lk_ = String.fromCharCode(99,97,112,121,98,97,114,97)  // "capybara"
```

18 种：duck, goose, blob, cat, dragon, octopus, owl, penguin, turtle, snail, ghost, axolotl, capybara, cactus, robot, rabbit, mushroom, chonk
