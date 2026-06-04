# Git 合作指南（零基础版）

## 一、安装 Git

**Windows**: 去 https://git-scm.com/downloads 下载安装，一路下一步。

**Mac**: 打开终端，输入 `git --version`，如果没有会提示安装。

安装完成后，打开终端（Windows 叫 Git Bash），设置你的名字：

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

---

## 二、GitHub 上注册 + Fork

1. 打开 https://github.com 注册账号
2. 打开项目仓库地址 https://github.com/yitian-chen/PPT_Reader ，点右上角 **Fork** 按钮
3. 这样你的账号下就有了一份项目副本

---

## 三、把代码拉到本地

```bash
# 克隆你 Fork 的仓库（把 YOUR_NAME 换成你的 GitHub 用户名）
git clone https://github.com/YOUR_NAME/PPT-Reader.git

# 进入项目目录
cd PPT-Reader

# 添加主仓库为 upstream（用于同步大家的更新）
git remote add upstream https://github.com/LEADER_NAME/PPT-Reader.git
```

---

## 四、开始干活

**每次写新功能前，都要开新分支：**

```bash
# 拉取组长最新代码
git fetch upstream
git checkout main
git merge upstream/main

# 创建你的功能分支（命名见什么就懂：feat/前端上传、feat/PPT解析...）
git checkout -b feat/你的功能名
```

---

## 五、写代码 + 提交

```bash
# 查看你改了什么
git status

# 添加所有改动
git add .

# 提交（信息用中文写清楚做了什么）
git commit -m "feat: 实现 PPT 上传页面"

# 推到你自己的 GitHub
git push origin feat/你的功能名
```

**提交信息格式**（统一）：
- `feat: xxx` — 新功能
- `fix: xxx` — 修 bug
- `docs: xxx` — 文档

---

## 六、提交 Pull Request（在主仓库中合并你的代码）

1. Push 完后，打开你的 GitHub 仓库页面
2. 页面上会出现一个绿色按钮 **Compare & pull request**，点它
3. 标题写清楚做了什么，点 **Create pull request**
4. 告诉陈一天来 Review，没问题就会合并

---

## 七、同步主仓库的最新代码

```bash
git fetch upstream
git checkout main
git merge upstream/main

# 如果你的分支需要追上最新代码
git checkout feat/你的功能名
git rebase main
```

---

## 八、常见情况

| 情况 | 怎么办 |
|---|---|
| 提交写错了想重写 | `git commit --amend -m "新的信息"` |
| 改乱了想回到上次提交 | `git checkout -- 文件名` |
| 想扔掉所有本地改动 | `git stash` |
| push 时说 rejected | 有人先推了，先 `git pull --rebase` 再 push |
| 合并冲突 | 打开冲突文件，找到 `<<<<<<<`，手动选保留哪部分，删掉标记，再 `git add` + `git commit` |

> 遇到问题不要慌，截图发群里问组长。

---

## 九、一条龙速查

```bash
# 1. 同步主仓库
git fetch upstream && git checkout main && git merge upstream/main

# 2. 开新分支
git checkout -b feat/功能名

# 3. 写代码...

# 4. 提交 + 推送
git add .
git commit -m "feat: 做了什么"
git push origin feat/功能名

# 5. 去 GitHub 页面点 "Compare & pull request"
```
