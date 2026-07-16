let courseData = null;

const state = {
  filter: "all",
  query: ""
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function createTag(text) {
  return `<span class="tag">${text}</span>`;
}

function renderCourseInfo() {
  const meta = courseData.meta;
  $("#courseIntro").textContent = courseData.intro;
  $("#courseInfo").innerHTML = [
    ["课程代码", meta.courseCode],
    ["英文名称", meta.englishName],
    ["学分/学时", `${meta.credits} / ${meta.totalHours}`],
    ["学时构成", `${meta.theoryHours}，${meta.experimentHours}`],
    ["适用专业", meta.major],
    ["课程类型", meta.courseType],
    ["开课单位", meta.school],
    ["开课学期", meta.semester],
    ["先修课程", meta.prerequisites]
  ].map(([label, value]) => `
    <div class="info-item">
      <span>${label}</span>
      <strong>${value}</strong>
    </div>
  `).join("");
}

function renderObjectives() {
  $("#objectiveGrid").innerHTML = courseData.objectives.map((item) => `
    <article class="objective-card">
      <div class="card-meta">
        <span>${item.id}</span>
        <span>${item.requirement}</span>
      </div>
      <h3>${item.title}</h3>
      <p>${item.desc}</p>
    </article>
  `).join("");
}

function renderOutline() {
  $("#outlineList").innerHTML = courseData.outline.map((item) => `
    <article class="timeline-item searchable" data-type="outline" data-search="${item.title} ${item.desc} ${item.tags.join(" ")}">
      <div class="week">
        <span>${item.week}</span>
        <strong>${item.hours} 学时</strong>
      </div>
      <div>
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
        <div class="outline-meta">
          <span>${item.format}</span>
          <span>${item.goal}</span>
        </div>
        <div class="point-grid">
          <div>
            <strong>重点</strong>
            <p>${item.keyPoints.join("；")}</p>
          </div>
          <div>
            <strong>难点</strong>
            <p>${item.difficulties.join("；")}</p>
          </div>
        </div>
        <div class="tags">${item.tags.map(createTag).join("")}</div>
      </div>
    </article>
  `).join("");
}

function renderMindMap() {
  $("#mindMap").innerHTML = courseData.mindMap.map((item) => `
    <article class="mind-node ${item.variant}">
      <h3>${item.title}</h3>
      <p>${item.desc}</p>
    </article>
  `).join("");

  $("#mindMapFiles").innerHTML = courseData.mindMapFiles.map((item) => `
    <article class="mindmap-file-card searchable" data-type="knowledge" data-search="${item.chapter} ${item.title} ${item.root} ${item.branches.join(" ")}">
      <div class="card-meta">
        <span>${item.chapter}</span>
        <span>${item.size}</span>
      </div>
      <h3>${item.title}</h3>
      <p>${item.root}</p>
      <div class="branch-list">
        ${item.branches.map((branch) => `<span>${branch}</span>`).join("")}
      </div>
      ${item.file ? `
      <a class="download-link" href="/api/mindmap-files/download?file=${encodeURIComponent(item.file)}" download="${item.title || item.chapter}.xmind">
        <i data-lucide="download"></i>下载 ${item.chapter} XMind
      </a>
      ` : `
      <span class="download-link is-disabled">
        <i data-lucide="file-x"></i>暂未上传 XMind
      </span>
      `}
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

function renderExperiments() {
  $("#experimentList").innerHTML = courseData.experiments.map((item) => `
    <article class="compact-card">
      <div class="card-meta">
        <span>${item.hours} 学时</span>
        <span>${item.equipment}</span>
      </div>
      <h3>${item.title}</h3>
      <p>${item.desc}</p>
    </article>
  `).join("");

  $("#assessmentList").innerHTML = courseData.assessment.map((item) => `
    <article class="assessment-item">
      <div class="assessment-percent">${item.percent}%</div>
      <div>
        <h3>${item.title}</h3>
        <p>${item.content}。${item.standard}。</p>
        <span class="tag">${item.goal}</span>
      </div>
    </article>
  `).join("");
}

function renderTeaching() {
  $("#methodList").innerHTML = courseData.teachingMethods.map((item) => `<li>${item}</li>`).join("");
  $("#referenceList").innerHTML = courseData.references.map((item) => `
    <article class="reference-item">
      <span class="tag">${item.type}</span>
      <h3>${item.title}</h3>
      <p>${item.authors}，${item.publisher}</p>
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
    line: style.getPropertyValue("--line").trim(),
    surface: style.getPropertyValue("--surface").trim(),
    teal: style.getPropertyValue("--teal").trim(),
    amber: style.getPropertyValue("--amber").trim()
  };
}

function drawGraph(activeId = "环境感知系统") {
  if (!courseData) return;

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
    if (!a || !b) return;

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

async function loadCourseData() {
  const response = await fetch("data/course-data.json", { cache: "no-cache" });
  if (!response.ok) {
    throw new Error(`课程数据加载失败：${response.status}`);
  }
  return response.json();
}

async function init() {
  try {
    courseData = await loadCourseData();
    renderCourseInfo();
    renderObjectives();
    renderOutline();
    renderMindMap();
    renderKnowledge();
    renderResources();
    renderExperiments();
    renderTeaching();
    setupFilters();
    setupTheme();
    setupGraph();
    window.lucide?.createIcons();
  } catch (error) {
    document.body.insertAdjacentHTML("afterbegin", `
      <div style="padding:16px;background:#fff3cd;color:#503b00;border-bottom:1px solid #f2d27a">
        ${error.message}。如果你是直接双击打开本地 HTML，请改用本地服务或部署到 GitHub Pages 后访问。
      </div>
    `);
    console.error(error);
  }
}

init();
