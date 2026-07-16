# 海洋机器人环境感知技术教学资料库

这是一个静态展示网站加轻量管理后台的课程资料库。

## 公开展示

GitHub Pages 只需要托管这些文件：

- `index.html`
- `styles.css`
- `app.js`
- `assets/`
- `data/course-data.json`

公开页面会从 `data/course-data.json` 读取课程大纲、知识点、视频素材、思维导图和知识图谱数据。

## 本地管理后台

在本机运行：

```powershell
npm start
```

然后打开：

```text
http://localhost:3000/admin.html
```

在后台修改内容后点击“保存全部修改”，数据会写入：

```text
data/course-data.json
```

之后把修改推送到 GitHub：

```powershell
git add .
git commit -m "Update course resources"
git push
```

GitHub Pages 重新部署后，公开网站就会显示新内容。

## 可编辑内容

后台目前支持修改：

- 课程大纲
- 知识点
- 视频与多媒体素材
- 思维导图
- 知识图谱节点
- 知识图谱关系
- 完整 JSON 源码

## 重要说明

GitHub Pages 不能运行 `server.js`，所以管理后台不能直接部署在 GitHub Pages 上写入数据。推荐工作流是：

1. 本地运行后台。
2. 修改课程资料。
3. 保存到 `data/course-data.json`。
4. 提交并推送到 GitHub。
5. GitHub Pages 自动更新公开页面。

如果需要真正在线登录、在线上传、在线保存的后台，需要额外部署 Node 服务到 Render、Railway、Vercel Serverless 或学校服务器，并增加账号权限和文件上传存储。
