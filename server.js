const express = require("express");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const app = express();
const rootDir = __dirname;
const dataFile = path.join(rootDir, "data", "course-data.json");
const mindMapDir = path.join(rootDir, "assets", "mindmaps");
const port = Number(process.env.PORT || 3000);
const adminToken = process.env.ADMIN_TOKEN || "";

fs.mkdirSync(mindMapDir, { recursive: true });

function sendJson(res, status, payload) {
  res.status(status).set("cache-control", "no-store").json(payload);
}

function isAuthorized(req) {
  if (!adminToken) return true;
  return req.headers.authorization === `Bearer ${adminToken}`;
}

function ensureAuthorized(req, res, next) {
  if (!isAuthorized(req)) {
    sendJson(res, 401, { error: "未授权" });
    return;
  }
  next();
}

function sanitizeBaseName(input) {
  const cleaned = String(input || "")
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[. ]+$/g, "");

  return cleaned || `mindmap-${Date.now()}`;
}

function formatFileSize(size) {
  if (!Number.isFinite(size) || size <= 0) return "0 KB";
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`;
  }
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
}

function resolveMindMapPath(filePath) {
  const normalized = String(filePath || "").replace(/\\/g, "/");
  if (!normalized || !normalized.startsWith("assets/mindmaps/")) {
    return null;
  }

  const absolutePath = path.resolve(rootDir, normalized);
  if (!absolutePath.startsWith(mindMapDir)) {
    return null;
  }

  if (path.extname(absolutePath).toLowerCase() !== ".xmind") {
    return null;
  }

  return absolutePath;
}

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => {
    callback(null, mindMapDir);
  },
  filename: (req, file, callback) => {
    const preferredName = [req.body.chapter, req.body.title].filter(Boolean).join(" ");
    const sourceName = preferredName || path.parse(file.originalname).name;
    callback(null, `${sanitizeBaseName(sourceName)}.xmind`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 20 * 1024 * 1024
  },
  fileFilter: (_req, file, callback) => {
    const isXmind = path.extname(file.originalname).toLowerCase() === ".xmind";
    if (!isXmind) {
      callback(new Error("只支持上传 .xmind 文件"));
      return;
    }
    callback(null, true);
  }
});

app.use(express.json({ limit: "2mb" }));

app.get("/api/course-data", (_req, res) => {
  fs.readFile(dataFile, "utf8", (error, content) => {
    if (error) {
      sendJson(res, 500, { error: "无法读取课程数据" });
      return;
    }

    res.status(200).set("cache-control", "no-store").type("application/json; charset=utf-8").send(content);
  });
});

app.put("/api/course-data", ensureAuthorized, (req, res) => {
  try {
    const formatted = `${JSON.stringify(req.body, null, 2)}\n`;
    fs.writeFileSync(dataFile, formatted, "utf8");
    sendJson(res, 200, { ok: true });
  } catch (error) {
    sendJson(res, 400, { error: error.message });
  }
});

app.post("/api/mindmap-files", ensureAuthorized, (req, res) => {
  upload.single("mindmapFile")(req, res, (error) => {
    if (error) {
      sendJson(res, 400, { error: error.message });
      return;
    }

    if (!req.file) {
      sendJson(res, 400, { error: "请选择要上传的 .xmind 文件" });
      return;
    }

    sendJson(res, 200, {
      ok: true,
      file: `assets/mindmaps/${req.file.filename}`.replace(/\\/g, "/"),
      size: formatFileSize(req.file.size),
      originalName: req.file.originalname
    });
  });
});

app.get("/api/mindmap-files/download", (req, res) => {
  const absolutePath = resolveMindMapPath(req.query.file);
  if (!absolutePath || !fs.existsSync(absolutePath)) {
    sendJson(res, 404, { error: "思维导图文件不存在" });
    return;
  }

  res.set("cache-control", "no-store");
  res.download(absolutePath, path.basename(absolutePath));
});

app.delete("/api/mindmap-files", ensureAuthorized, (req, res) => {
  const absolutePath = resolveMindMapPath(req.query.file);
  if (!absolutePath) {
    sendJson(res, 400, { error: "无效的思维导图文件路径" });
    return;
  }

  if (!fs.existsSync(absolutePath)) {
    sendJson(res, 404, { error: "思维导图文件不存在" });
    return;
  }

  try {
    fs.unlinkSync(absolutePath);
    sendJson(res, 200, { ok: true });
  } catch (error) {
    sendJson(res, 500, { error: "删除思维导图文件失败" });
  }
});

app.use(express.static(rootDir));

app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError && "body" in error) {
    sendJson(res, 400, { error: "请求 JSON 格式无效" });
    return;
  }

  sendJson(res, 500, { error: "服务器内部错误" });
});

app.listen(port, () => {
  console.log(`课程资料管理服务已启动：http://localhost:${port}`);
  console.log(`管理后台：http://localhost:${port}/admin.html`);
});
