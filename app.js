const courseData = {
  outline: [
    {
      week: "第 1 周",
      title: "海洋机器人与环境感知概论",
      desc: "理解 AUV/ROV/USV 的任务形态，建立感知、定位、决策与控制之间的系统视角。",
      tags: ["课程导论", "系统架构", "典型任务"]
    },
    {
      week: "第 2-3 周",
      title: "水下声学感知基础",
      desc: "学习声速剖面、声呐方程、多波束与侧扫声呐数据的获取和解释。",
      tags: ["声呐", "回波", "海底地形"]
    },
    {
      week: "第 4-5 周",
      title: "视觉与光学成像",
      desc: "分析水下图像退化机理，掌握增强、去雾、目标检测和视觉测量基础。",
      tags: ["水下视觉", "图像增强", "目标检测"]
    },
    {
      week: "第 6-7 周",
      title: "惯性导航与多源定位",
      desc: "连接 IMU、DVL、深度计、USBL/LBL 与滤波估计，形成可解释的导航链路。",
      tags: ["导航", "DVL", "卡尔曼滤波"]
    },
    {
      week: "第 8-9 周",
      title: "多传感器融合与环境建图",
      desc: "构建从传感器标定、时间同步到 SLAM/栅格地图/语义地图的完整流程。",
      tags: ["融合", "SLAM", "地图表达"]
    },
    {
      week: "第 10-12 周",
      title: "实验任务与课程项目",
      desc: "围绕航线感知、目标识别、海底地形重建或数据集分析完成小组项目。",
      tags: ["实验", "项目", "报告"]
    }
  ],
  knowledge: [
    {
      title: "声呐方程",
      desc: "用于估计发射声源级、传播损失、目标强度、噪声和检测阈值之间的关系。",
      module: "声学感知",
      level: 72
    },
    {
      title: "水下图像增强",
      desc: "针对散射、吸收和色偏进行可视化改善，为检测、分割与测量提供输入。",
      module: "视觉感知",
      level: 58
    },
    {
      title: "DVL 辅助导航",
      desc: "使用多普勒速度计提供相对海底或水体速度，补偿惯导误差漂移。",
      module: "定位导航",
      level: 66
    },
    {
      title: "传感器时间同步",
      desc: "统一不同采样频率与时钟源的数据时间戳，减少融合估计中的系统误差。",
      module: "系统集成",
      level: 52
    },
    {
      title: "占据栅格地图",
      desc: "将环境离散为概率栅格，表达障碍物、未知区域和可通行区域。",
      module: "环境建图",
      level: 61
    },
    {
      title: "语义目标识别",
      desc: "识别管线、礁石、缆线、结构件等任务相关对象，并关联空间位置。",
      module: "智能感知",
      level: 74
    }
  ],
  resources: [
    {
      title: "AUV 任务流程示范",
      desc: "从任务规划、下潜、航迹执行到回收的数据闭环示范。",
      type: "video",
      duration: "18 min",
      link: "#"
    },
    {
      title: "多波束声呐数据解读",
      desc: "讲解水深条带、点云清洗和海底地形产品生成。",
      type: "video",
      duration: "24 min",
      link: "#"
    },
    {
      title: "水下图像增强实验",
      desc: "包含样例图像、处理脚本说明和实验报告模板。",
      type: "video",
      duration: "36 min",
      link: "#"
    },
    {
      title: "融合定位课堂演示",
      desc: "以 IMU、DVL、深度计组合为例展示滤波更新过程。",
      type: "video",
      duration: "21 min",
      link: "#"
    },
    {
      title: "知识图谱概念表",
      desc: "课程概念、先修关系、应用场景和关联资料的结构化表格。",
      type: "knowledge",
      duration: "XLSX",
      link: "#"
    },
    {
      title: "课程项目数据包",
      desc: "面向小组项目的声呐、视觉、导航样例数据和评分要求。",
      type: "outline",
      duration: "ZIP",
      link: "#"
    }
  ],
  graph: [
    { id: "环境感知系统", x: .5, y: .48, group: "core", desc: "连接传感器、算法、地图与任务执行的课程主线。" },
    { id: "声学感知", x: .22, y: .24, group: "sensor", desc: "多波束、侧扫、成像声呐和声学通信相关内容。" },
    { id: "视觉感知", x: .78, y: .25, group: "sensor", desc: "水下成像、图像增强、检测分割与视觉测量。" },
    { id: "定位导航", x: .24, y: .72, group: "nav", desc: "IMU、DVL、深度计和声学定位的组合导航。" },
    { id: "数据融合", x: .52, y: .76, group: "fusion", desc: "标定、同步、滤波估计和多源信息融合。" },
    { id: "环境建图", x: .78, y: .70, group: "map", desc: "点云、栅格地图、语义地图和任务地图表达。" },
    { id: "任务应用", x: .5, y: .18, group: "app", desc: "巡检、探测、采样、搜救与海洋工程作业。" }
  ],
  edges: [
    ["环境感知系统", "声学感知"],
    ["环境感知系统", "视觉感知"],
    ["环境感知系统", "定位导航"],
    ["环境感知系统", "数据融合"],
    ["数据融合", "环境建图"],
    ["环境建图", "任务应用"],
    ["声学感知", "环境建图"],
    ["视觉感知", "环境建图"],
    ["定位导航", "数据融合"],
    ["任务应用", "声学感知"],
    ["任务应用", "视觉感知"]
  ]
};

const state = {
  filter: "all",
  query: ""
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function createTag(text) {
  return `<span class="tag">${text}</span>`;
}

function renderOutline() {
  $("#outlineList").innerHTML = courseData.outline.map((item) => `
    <article class="timeline-item searchable" data-type="outline" data-search="${item.title} ${item.desc} ${item.tags.join(" ")}">
      <div class="week">${item.week}</div>
      <div>
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
        <div class="tags">${item.tags.map(createTag).join("")}</div>
      </div>
    </article>
  `).join("");
}

function renderMindMap() {
  const nodes = [
    ["core", "环境感知技术", "传感器、算法、地图和任务的统一理解"],
    ["", "声学链路", "传播建模、声呐成像、回波解释"],
    ["", "视觉链路", "成像退化、图像增强、目标检测"],
    ["", "导航链路", "惯性、速度、深度与声学定位融合"],
    ["", "建图链路", "点云、栅格、语义和任务地图"],
    ["", "工程链路", "标定、同步、数据管理和实验评估"]
  ];
  $("#mindMap").innerHTML = nodes.map(([variant, title, desc]) => `
    <article class="mind-node ${variant}">
      <h3>${title}</h3>
      <p>${desc}</p>
    </article>
  `).join("");
}

function renderKnowledge() {
  $("#knowledgeCards").innerHTML = courseData.knowledge.map((item) => `
    <article class="knowledge-card searchable" data-type="knowledge" data-search="${item.title} ${item.desc} ${item.module}">
      <div class="card-meta">
        <span>${item.module}</span>
        <span>${item.level}%</span>
      </div>
      <h3>${item.title}</h3>
      <p>${item.desc}</p>
      <div class="difficulty" aria-label="学习难度 ${item.level}%"><span style="width:${item.level}%"></span></div>
    </article>
  `).join("");
}

function renderResources() {
  $("#resourceGrid").innerHTML = courseData.resources.map((item) => `
    <article class="resource-card searchable" data-type="${item.type}" data-search="${item.title} ${item.desc} ${item.duration}">
      <div class="resource-thumb" aria-hidden="true"></div>
      <div class="card-meta">
        <span>${item.type === "video" ? "视频" : "资料"}</span>
        <span>${item.duration}</span>
      </div>
      <h3>${item.title}</h3>
      <p>${item.desc}</p>
      <a href="${item.link}" aria-label="打开${item.title}"><i data-lucide="external-link"></i>打开素材</a>
    </article>
  `).join("");
}

function applyFilters() {
  const query = state.query.trim().toLowerCase();
  $$(".searchable").forEach((item) => {
    const typeMatch = state.filter === "all" || item.dataset.type === state.filter;
    const queryMatch = !query || item.dataset.search.toLowerCase().includes(query);
    item.classList.toggle("is-hidden", !(typeMatch && queryMatch));
  });
}

function setupFilters() {
  $$(".filter").forEach((button) => {
    button.addEventListener("click", () => {
      $$(".filter").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      state.filter = button.dataset.filter;
      applyFilters();
    });
  });

  $("#searchInput").addEventListener("input", (event) => {
    state.query = event.target.value;
    applyFilters();
  });
}

function setupTheme() {
  const button = $("#themeToggle");
  button.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    button.innerHTML = document.body.classList.contains("dark")
      ? '<i data-lucide="moon"></i>'
      : '<i data-lucide="sun"></i>';
    window.lucide?.createIcons();
    drawGraph();
  });
}

function graphColors() {
  const style = getComputedStyle(document.body);
  return {
    text: style.getPropertyValue("--text").trim(),
    muted: style.getPropertyValue("--muted").trim(),
    line: style.getPropertyValue("--line").trim(),
    surface: style.getPropertyValue("--surface").trim(),
    teal: style.getPropertyValue("--teal").trim(),
    amber: style.getPropertyValue("--amber").trim(),
    coral: style.getPropertyValue("--coral").trim(),
    blue: style.getPropertyValue("--blue").trim()
  };
}

function drawGraph(activeId = "环境感知系统") {
  const canvas = $("#knowledgeCanvas");
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(720, Math.floor(rect.width * dpr));
  canvas.height = Math.floor(520 * dpr);
  ctx.scale(dpr, dpr);
  const width = canvas.width / dpr;
  const height = canvas.height / dpr;
  const colors = graphColors();
  const nodes = courseData.graph.map((node) => ({
    ...node,
    px: node.x * width,
    py: node.y * height
  }));

  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 2;
  courseData.edges.forEach(([source, target]) => {
    const a = nodes.find((node) => node.id === source);
    const b = nodes.find((node) => node.id === target);
    ctx.strokeStyle = colors.line;
    ctx.beginPath();
    ctx.moveTo(a.px, a.py);
    ctx.lineTo(b.px, b.py);
    ctx.stroke();
  });

  nodes.forEach((node) => {
    const active = node.id === activeId;
    const radius = node.group === "core" ? 54 : 42;
    ctx.beginPath();
    ctx.arc(node.px, node.py, radius + (active ? 8 : 0), 0, Math.PI * 2);
    ctx.fillStyle = active ? "rgba(242, 143, 59, .25)" : "rgba(59, 183, 173, .13)";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(node.px, node.py, radius, 0, Math.PI * 2);
    ctx.fillStyle = node.group === "core" ? colors.teal : colors.surface;
    ctx.strokeStyle = active ? colors.amber : colors.teal;
    ctx.lineWidth = active ? 4 : 2;
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = node.group === "core" ? "#fff" : colors.text;
    ctx.font = "700 14px Microsoft YaHei, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.id, node.px, node.py);
  });
}

function setupGraph() {
  const canvas = $("#knowledgeCanvas");
  const detail = $("#graphDetail");

  function selectNode(node) {
    detail.innerHTML = `
      <span class="tag">${node.group === "core" ? "核心节点" : "关联节点"}</span>
      <h3>${node.id}</h3>
      <p>${node.desc}</p>
    `;
    drawGraph(node.id);
  }

  canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const node = courseData.graph.find((item) => {
      const px = item.x * rect.width;
      const py = item.y * 520;
      return Math.hypot(x - px, y - py) < 56;
    });
    if (node) selectNode(node);
  });

  window.addEventListener("resize", () => drawGraph());
  drawGraph();
}

function init() {
  renderOutline();
  renderMindMap();
  renderKnowledge();
  renderResources();
  setupFilters();
  setupTheme();
  setupGraph();
  window.lucide?.createIcons();
}

init();
