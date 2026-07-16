const sectionLabels = {
  outline: "课程大纲",
  objectives: "课程目标",
  knowledge: "知识点",
  resources: "视频与素材",
  experiments: "实验项目",
  assessment: "考核方式",
  mindMap: "思维导图",
  mindMapFiles: "XMind 文件",
  graph: "知识图谱节点",
  edges: "图谱关系",
  teachingMethods: "教学方法",
  references: "参考资料",
  raw: "JSON 源码"
};

const fieldSchemas = {
  outline: [
    ["week", "章节/单元"],
    ["title", "标题"],
    ["hours", "学时", "number"],
    ["format", "授课形式"],
    ["goal", "对应课程目标"],
    ["desc", "教学内容说明", "textarea"],
    ["tags", "标签，用英文逗号分隔"],
    ["keyPoints", "重点，用英文逗号分隔"],
    ["difficulties", "难点，用英文逗号分隔"]
  ],
  objectives: [
    ["id", "目标编号"],
    ["title", "目标标题"],
    ["desc", "目标说明", "textarea"],
    ["requirement", "支撑毕业要求"]
  ],
  knowledge: [
    ["title", "知识点"],
    ["module", "所属模块"],
    ["level", "难度百分比", "number"],
    ["desc", "说明", "textarea"]
  ],
  resources: [
    ["title", "素材标题"],
    ["type", "类型", "select", ["video", "knowledge", "outline"]],
    ["duration", "时长/格式"],
    ["link", "链接"],
    ["desc", "说明", "textarea"]
  ],
  experiments: [
    ["title", "实验名称"],
    ["hours", "实验学时", "number"],
    ["equipment", "主要仪器设备"],
    ["desc", "内容和要求", "textarea"]
  ],
  assessment: [
    ["title", "考核方式"],
    ["content", "考核内容"],
    ["percent", "百分比", "number"],
    ["standard", "考核标准", "textarea"],
    ["goal", "对应课程目标"]
  ],
  mindMap: [
    ["variant", "样式", "select", ["", "core"]],
    ["title", "节点标题"],
    ["desc", "说明", "textarea"]
  ],
  mindMapFiles: [
    ["chapter", "章节"],
    ["title", "导图标题"],
    ["root", "中心主题"],
    ["branches", "一级分支，用英文逗号分隔"],
    ["file", "文件路径"],
    ["size", "文件大小"]
  ],
  graph: [
    ["id", "节点名称"],
    ["group", "分组", "select", ["core", "sensor", "nav", "fusion", "map", "app"]],
    ["x", "横向位置 0-1", "number"],
    ["y", "纵向位置 0-1", "number"],
    ["desc", "说明", "textarea"]
  ],
  edges: [
    ["0", "起点节点"],
    ["1", "终点节点"]
  ],
  teachingMethods: [
    ["value", "教学方法", "textarea"]
  ],
  references: [
    ["type", "资料类型"],
    ["title", "书名/资料名"],
    ["authors", "作者"],
    ["publisher", "出版社/年份"]
  ]
};

let courseData = null;
let activeSection = "outline";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function setStatus(message) {
  $("#statusLine").textContent = message;
}

function normalizeValue(key, value) {
  if (["tags", "keyPoints", "difficulties", "branches"].includes(key)) {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
  if (["level", "x", "y", "hours", "percent"].includes(key)) {
    return Number(value);
  }
  return value;
}

function valueForInput(section, item, key) {
  if (section === "edges") return item[Number(key)] || "";
  if (section === "teachingMethods") return item;
  const value = item[key];
  return Array.isArray(value) ? value.join(", ") : value ?? "";
}

function updateValue(section, index, key, value) {
  if (section === "edges") {
    courseData.edges[index][Number(key)] = value;
    return;
  }
  if (section === "teachingMethods") {
    courseData.teachingMethods[index] = value;
    return;
  }
  courseData[section][index][key] = normalizeValue(key, value);
}

async function uploadMindMapFile(index, file) {
  const item = courseData.mindMapFiles[index];
  const formData = new FormData();
  formData.append("mindmapFile", file);
  formData.append("chapter", item.chapter || "");
  formData.append("title", item.title || "");

  const response = await fetch("/api/mindmap-files", {
    method: "POST",
    body: formData
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "XMind 文件上传失败");
  return result;
}

async function deleteMindMapFile(filePath) {
  const response = await fetch(`/api/mindmap-files?file=${encodeURIComponent(filePath)}`, {
    method: "DELETE"
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "XMind 文件删除失败");
  return result;
}

function createField(section, item, index, schema) {
  const [key, label, type = "text", options = []] = schema;
  const value = valueForInput(section, item, key);
  const field = document.createElement("label");
  field.className = "field";
  field.innerHTML = `<span>${label}</span>`;

  let input;
  if (type === "textarea") {
    input = document.createElement("textarea");
    input.value = value;
  } else if (type === "select") {
    input = document.createElement("select");
    options.forEach((option) => {
      const optionNode = document.createElement("option");
      optionNode.value = option;
      optionNode.textContent = option || "普通";
      optionNode.selected = option === value;
      input.appendChild(optionNode);
    });
  } else {
    input = document.createElement("input");
    input.type = type;
    input.value = value;
    if (type === "number") {
      input.step = ["level", "hours", "percent"].includes(key) ? "1" : "0.01";
    }
  }

  input.addEventListener("input", () => updateValue(section, index, key, input.value));
  field.appendChild(input);
  return field;
}

function createMindMapUploadActions(index) {
  const wrapper = document.createElement("div");
  wrapper.className = "inline-actions";
  const item = courseData.mindMapFiles[index];

  const uploadButton = document.createElement("button");
  uploadButton.className = "admin-button";
  uploadButton.type = "button";
  uploadButton.textContent = "上传本地 XMind";

  const uploadHint = document.createElement("span");
  uploadHint.className = "upload-hint";
  uploadHint.textContent = "支持 .xmind，上传后会自动回填文件路径和大小。";

  const input = document.createElement("input");
  input.className = "upload-input";
  input.type = "file";
  input.accept = ".xmind";

  const deleteButton = document.createElement("button");
  deleteButton.className = "admin-button";
  deleteButton.type = "button";
  deleteButton.textContent = "删除已上传文件";
  deleteButton.disabled = !item.file;

  uploadButton.addEventListener("click", () => input.click());
  input.addEventListener("change", async () => {
    const [file] = input.files || [];
    if (!file) return;

    try {
      uploadButton.disabled = true;
      deleteButton.disabled = true;
      setStatus(`正在上传 ${file.name}...`);
      const result = await uploadMindMapFile(index, file);
      courseData.mindMapFiles[index].file = result.file;
      courseData.mindMapFiles[index].size = result.size;
      const successMessage = `上传成功：${result.originalName}，并已自动保存。`;
      await saveData(successMessage);
      renderSection("mindMapFiles");
      setStatus(successMessage);
    } catch (error) {
      setStatus(error.message);
    } finally {
      uploadButton.disabled = false;
      deleteButton.disabled = !courseData.mindMapFiles[index]?.file;
      input.value = "";
    }
  });

  deleteButton.addEventListener("click", async () => {
    const latestItem = courseData.mindMapFiles[index];
    if (!latestItem?.file) {
      setStatus("当前没有可删除的 XMind 文件。");
      return;
    }

    const confirmed = window.confirm(`确认删除文件？\n${latestItem.file}`);
    if (!confirmed) return;

    try {
      uploadButton.disabled = true;
      deleteButton.disabled = true;
      setStatus("正在删除 XMind 文件...");
      await deleteMindMapFile(latestItem.file);
      courseData.mindMapFiles[index].file = "";
      courseData.mindMapFiles[index].size = "0 KB";
      const successMessage = "XMind 文件已删除，并已自动保存。";
      await saveData(successMessage);
      renderSection("mindMapFiles");
      setStatus(successMessage);
    } catch (error) {
      setStatus(error.message);
    } finally {
      uploadButton.disabled = false;
      deleteButton.disabled = !courseData.mindMapFiles[index]?.file;
    }
  });

  wrapper.append(uploadButton, deleteButton, uploadHint, input);
  return wrapper;
}

function emptyItem(section) {
  const defaults = {
    outline: {
      week: "第 X 章",
      title: "新课程模块",
      desc: "填写模块说明。",
      hours: 2,
      format: "讲课/讨论",
      goal: "课程目标1",
      tags: ["新内容"],
      keyPoints: ["填写重点"],
      difficulties: ["填写难点"]
    },
    objectives: {
      id: "课程目标X",
      title: "新课程目标",
      desc: "填写课程目标说明。",
      requirement: "支撑毕业要求"
    },
    knowledge: {
      title: "新知识点",
      desc: "填写知识点说明。",
      module: "课程模块",
      level: 50
    },
    resources: {
      title: "新素材",
      desc: "填写素材说明。",
      type: "video",
      duration: "10 min",
      link: "#"
    },
    experiments: {
      title: "新实验项目",
      hours: 2,
      equipment: "计算机",
      desc: "填写实验内容和要求。"
    },
    assessment: {
      title: "新考核方式",
      content: "考核内容",
      percent: 10,
      standard: "填写考核标准。",
      goal: "课程目标1-3"
    },
    mindMap: {
      variant: "",
      title: "新节点",
      desc: "填写节点说明。"
    },
    mindMapFiles: {
      chapter: "第X章",
      title: "新思维导图",
      root: "中心主题",
      branches: ["一级分支"],
      file: "assets/mindmaps/example.xmind",
      size: "0 KB"
    },
    graph: {
      id: "新图谱节点",
      x: 0.5,
      y: 0.5,
      group: "sensor",
      desc: "填写节点说明。"
    },
    edges: ["环境感知系统", "新图谱节点"],
    teachingMethods: "填写教学方法说明。",
    references: {
      type: "参考资料",
      title: "《资料名称》",
      authors: "作者",
      publisher: "出版社，年份"
    }
  };
  return structuredClone(defaults[section]);
}

function renderRawEditor() {
  $("#addButton").style.display = "none";
  const textarea = document.createElement("textarea");
  textarea.className = "field raw-editor";
  textarea.value = JSON.stringify(courseData, null, 2);
  textarea.addEventListener("input", () => {
    try {
      courseData = JSON.parse(textarea.value);
      setStatus("JSON 格式正确，保存后生效。");
    } catch (error) {
      setStatus(`JSON 格式错误：${error.message}`);
    }
  });
  $("#editorList").replaceChildren(textarea);
}

function renderSection(section) {
  activeSection = section;
  $("#sectionTitle").textContent = sectionLabels[section];
  $("#addButton").style.display = section === "raw" ? "none" : "";
  $$(".admin-tab").forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.section === section);
  });

  if (section === "raw") {
    renderRawEditor();
    return;
  }

  const list = $("#editorList");
  list.innerHTML = "";
  const items = courseData[section] || [];

  items.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "editor-item";

    const fields = document.createElement("div");
    fields.className = "field-grid";
    fieldSchemas[section].forEach((schema) => {
      fields.appendChild(createField(section, item, index, schema));
    });

    const removeButton = document.createElement("button");
    removeButton.className = "admin-button";
    removeButton.type = "button";
    removeButton.textContent = "删除这一项";
    removeButton.addEventListener("click", () => {
      courseData[section].splice(index, 1);
      renderSection(section);
    });

    if (section === "mindMapFiles") {
      card.append(fields, createMindMapUploadActions(index), removeButton);
    } else {
      card.append(fields, removeButton);
    }
    list.appendChild(card);
  });

  setStatus(`当前共 ${items.length} 项。`);
}

async function loadData() {
  const response = await fetch("/api/course-data");
  if (!response.ok) throw new Error("无法读取课程数据，请确认后端服务正在运行。");
  courseData = await response.json();
  renderSection(activeSection);
}

async function saveData(successMessage = "已保存到 data/course-data.json。") {
  const response = await fetch("/api/course-data", {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(courseData)
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "保存失败");
  setStatus(successMessage);
}

function setupEvents() {
  $$(".admin-tab").forEach((tab) => {
    tab.addEventListener("click", () => renderSection(tab.dataset.section));
  });

  $("#addButton").addEventListener("click", () => {
    courseData[activeSection].push(emptyItem(activeSection));
    renderSection(activeSection);
  });

  $("#saveButton").addEventListener("click", async () => {
    try {
      await saveData();
    } catch (error) {
      setStatus(error.message);
    }
  });
}

setupEvents();
loadData().catch((error) => setStatus(error.message));
