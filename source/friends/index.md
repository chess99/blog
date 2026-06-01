---
title: 友情链接
comments: false
---

<style>
.friend-cards {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 8px;
}
.friend-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  border-radius: 12px;
  border: 1px solid rgba(0,0,0,0.08);
  background: var(--card-bg, #fff);
  text-decoration: none;
  color: inherit;
  width: 320px;
  transition: box-shadow 0.2s, transform 0.2s;
}
.friend-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  transform: translateY(-2px);
  text-decoration: none;
}
.friend-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}
.friend-info .friend-name {
  font-weight: 600;
  font-size: 1em;
  margin-bottom: 4px;
}
.friend-info .friend-desc {
  font-size: 0.82em;
  color: #888;
  line-height: 1.4;
}
</style>

<div class="friend-cards">
  <a class="friend-card" href="https://blog.xuewen.me/" target="_blank" rel="noopener">
    <img class="friend-avatar" src="https://blog.xuewen.me/img/avatar.jpg" alt="阿文">
    <div class="friend-info">
      <div class="friend-name">阿文</div>
      <div class="friend-desc">底层技术探索，HTTP、Linux、Nginx 等工程实践记录</div>
    </div>
  </a>
</div>
