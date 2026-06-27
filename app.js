/* ============================================================
 * 早教规划在线编辑工具 - 应用主逻辑
 * Loop Engineering: 构建 → 验证 → 迭代 → 部署
 * ============================================================ */

/* ===== 应用状态 ===== */
const state = {
  view: 'schedule',
  currentMonth: 7,
  isAdmin: false,
  adminPassword: 'admin123',
  theme: { color: '#FF6B35', fontSize: 16, borderRadius: 12 },
  syncUrl: '',
  scheduleData: {},
  issues: [],
  visitCount: 0,
  editingCell: null,
  editingIssue: null,
  issueFilter: 'all'
};

/* ===== 月份配置 ===== */
const monthConfig = [
  { month: 7,  theme: '食物', goal: '认识10种以上食物名称，尝试自主进食', color: '#FF6B35', light: '#FFE0B2' },
  { month: 8,  theme: '穿衣', goal: '认识5种以上衣物，配合穿衣，建立穿衣常规', color: '#FF69B4', light: '#F8BBD0' },
  { month: 9,  theme: '居住', goal: '认识家中房间和家具，理解基本方位词', color: '#4ECDC4', light: '#B2DFDB' },
  { month: 10, theme: '动物', goal: '认识10种以上动物，模仿叫声和动作', color: '#FFD93D', light: '#FFF9C4' },
  { month: 11, theme: '植物', goal: '认识5种以上植物，参与水培种植', color: '#6BCB77', light: '#C8E6C9' },
  { month: 12, theme: '海洋', goal: '认识5种以上海洋生物，建立水的感知', color: '#4D96FF', light: '#BBDEFB' },
  { month: 1,  theme: '天空', goal: '观察天空变化，认识天气，理解白天黑夜', color: '#9B59B6', light: '#E1BEE7' },
  { month: 2,  theme: '太空', goal: '初步感知太空概念，认识地球月亮太阳', color: '#2C3E50', light: '#CFD8DC' }
];

const stageNames = ['感知引入', '词汇积累', '深度体验', '跨维整合', '巩固拓展', '总结庆祝'];
const dimLabels = ['语', '英', '科', '数', '美音', '社'];
const dimKeys = ['lang', 'eng', 'sci', 'math', 'art', 'social'];

/* ===== 初始数据生成 ===== */
function generateInitialData() {
  const data = {};
  const themes = {
    7: {
      weeks: [
        ['绘本《好饿的毛毛虫》指认水果', '实物指认apple,banana', '观察水果颜色形状', '数1个苹果', '听《大苹果》儿歌', '触摸不同水果质地'],
        ['认识胡萝卜西红柿', 'carrot,tomato实物', '观察蔬菜颜色', '数胡萝卜1-3', '蔬菜印章画', '帮妈妈择菜'],
        ['食物制作词汇洗切煮', 'juice,milk,bowl', '观察鸡蛋生熟变化', '排序先洗后切', '做水果沙拉手工', '一起做水果沙拉'],
        ['餐具名称碗盘勺筷', 'bowl,plate,spoon', '认识餐具材质', '碗的形状圆形', '画餐具蜡笔', '练习用勺子吃饭'],
        ['超市物品名称', 'bread,rice,egg', '逛超市认识区域', '数货架苹果', '画我的购物车', '去菜市场超市'],
        ['复习所有食物词汇', '本月食物英文复习', '复习食物特性', '食物形状总复习', '画我最喜欢的食物', '美食派对']
      ],
      summary: ['水果世界感知', '蔬菜天地积累', '食物制作体验', '饮食文化整合', '超市探险拓展', '美食派对庆祝']
    },
    8: {
      weeks: [
        ['认识衣服裤子', 'shirt,pants实物', '摸不同材质衣物', '数衣服1-3', '衣服涂鸦', '帮妈妈叠衣服'],
        ['认识扣子拉链', 'button,zip', '观察鞋底花纹', '配对找一样袜子', '画鞋子', '自己脱袜子'],
        ['穿衣步骤词汇', 'put on,take off', '观察衣服标签', '穿衣顺序先后', '给纸娃娃穿衣服', '每天配合穿衣'],
        ['夏天冬天衣服', 'hot,cold,summer', '为什么夏天穿薄的', '比较厚薄', '画四季衣服', '整理衣柜分类'],
        ['颜色衣服组合', '颜色+衣服英文', '混色实验颜料', '按颜色分类计数', '画彩色衣服', '自己搭配衣服'],
        ['本月衣物词汇复习', '衣物英文总复习', '衣物知识问答', '数学总复习', '画最喜欢的衣服', '家庭时尚秀']
      ],
      summary: ['认识衣服', '鞋袜世界', '穿衣实践', '季节衣物', '颜色搭配', '时尚秀']
    },
    9: {
      weeks: [
        ['认识门窗', 'door,window', '观察门的开关', '数房间几个门', '积木搭房子', '打开关上门'],
        ['认识桌椅床沙发', 'table,chair,bed', '桌子形状方形圆形', '数椅子几把', '画家具', '坐在椅子上'],
        ['方位词上下前后', 'up,down,in,on', '东西在上面下面', '方位+数量', '方位手指操', '执行方位指令'],
        ['认识爸爸妈妈', 'mama,dada,family', '家里谁的物品', '数家里几个人', '画全家福', '指认每个人房间'],
        ['户外场所名称', 'go,stop,park', '认识红绿灯', '数路上的车', '画我的家全景', '去公园操场'],
        ['本月词汇总复习', '英文总复习', '家里知识问答', '数学总复习', '画我的家大画', '展示自己的家']
      ],
      summary: ['我的家', '家具认知', '方位游戏', '家庭成员', '去哪里', '我的家总结']
    },
    10: {
      weeks: [
        ['认识猫狗兔子', 'cat,dog,rabbit', '观察猫的特征胡须', '数几只猫狗', '画猫和狗', '看小区猫狗'],
        ['认识鸡鸭牛猪', 'cow,pig,chicken', '鸡和鸭的区别', '数鸡几只', '画农场动物', '看农场视频'],
        ['动物吃什么住哪', 'eat,sleep,farm', '观察蚂蚁搬家', '数蚂蚁', '做动物手工', '去小区找小动物'],
        ['古诗咏鹅所见', '动物英文总复习', '动物和季节', '动物数量游戏', '动物画展', '动物园准备'],
        ['动物园动物认知', 'monkey,elephant', '动物特征综合', '动物园动物计数', '画动物园', '去动物园'],
        ['本月动物词汇复习', '动物英文总复习', '动物知识问答', '数学总复习', '画最喜欢的动物', '动物角色扮演']
      ],
      summary: ['家养动物', '农场动物', '动物习性', '动物古诗', '动物园', '动物派对']
    },
    11: {
      weeks: [
        ['认识花花草', 'flower,leaf', '摸叶子质地', '数花几朵', '叶子印章画', '去小区看花草'],
        ['认识大树小草', 'tree,grass,seed', '观察种子', '数种子几颗', '画大树', '种一颗种子'],
        ['种植过程词汇', 'water,grow,rain', '观察水培葱蒜生长', '量芽长高多少', '画种植日记', '照顾水培植物'],
        ['水果从哪里来', 'fruit,seed,apple', '苹果从树上长出来', '水果分类计数', '画果实累累的树', '去华南植物园'],
        ['植物园见闻', 'garden,plant', '植物园观察记录', '植物园植物计数', '画植物园', '植物园亲子活动'],
        ['本月植物词汇复习', '植物英文总复习', '植物知识问答', '数学总复习', '画我的小花园', '展示水培成果']
      ],
      summary: ['认识花草', '认识树木', '水培种植', '水果植物', '植物园', '小花园']
    },
    12: {
      weeks: [
        ['认识鱼虾螃蟹', 'fish,crab,whale', '观察鱼的外形鳞片', '数鱼几条', '画海洋世界', '盆中玩水体验'],
        ['认识海豚鲸鱼', 'dolphin,starfish', '海洋生物特征', '比较大小鲸鱼小鱼', '做小鱼手工', '触摸池体验'],
        ['水的特性词汇', 'water,swim,deep', '水的流动温度', '空间深浅概念', '海洋拼贴画', '玩水感知特性'],
        ['海洋动物习性', 'shark,turtle', '沉浮实验', '数海洋生物', '海洋面具制作', '参观海洋馆'],
        ['海洋主题拓展', 'ocean,sea', '冰块融化实验', '颜色分类多彩的鱼', '海洋主题涂鸦', '海洋主题派对'],
        ['本月海洋词汇复习', '海洋英文总复习', '海洋知识问答', '数学总复习', '画海底世界', '海洋派对庆祝']
      ],
      summary: ['认识海洋动物', '海洋生物', '水的特性', '海洋习性', '海洋拓展', '海底世界']
    },
    1: {
      weeks: [
        ['认识太阳月亮', 'sun,moon,star', '观察太阳温暖明亮', '数星星', '画太阳和月亮', '出门看天空'],
        ['认识云风雨', 'cloud,rain,wind', '观察云的形状', '时间白天黑夜', '做月亮星星手工', '感受风吹'],
        ['天气变化观察', 'sunny,rainy,day', '温度变化冷热', '天气记录统计', '画天空和云朵', '观察日落'],
        ['白天黑夜概念', 'day,night,hot', '影子变化大小', '排序早中晚', '星空拼贴', '夜晚看星星'],
        ['自然现象认知', 'sky,star,bright', '彩虹形成', '比较明暗', '夕阳涂色', '放风筝'],
        ['本月天空词汇复习', '天空英文总复习', '天空知识问答', '数学总复习', '画美丽天空', '天空画展']
      ],
      summary: ['认识天空', '天气变化', '白天黑夜', '自然现象', '天空拓展', '天空画展']
    },
    2: {
      weeks: [
        ['认识地球月亮', 'earth,moon,sun', '观察地球仪是圆的', '空间上下远近', '画太空和星空', '看地球仪转地球仪'],
        ['认识太阳系', 'star,planet,space', '太阳在中间八大行星', '数星球数量', '做火箭手工', '模拟太空行走'],
        ['太空探索词汇', 'rocket,fly,up', '失重概念荡秋千', '大小排序太阳最大', '做星球模型', '纸飞机比赛'],
        ['宇航员认知', 'astronaut,spaceship', '太空没有空气', '分类恒星行星', '外星人面具', '太空角色扮演'],
        ['星空观察', 'star,light,far', '星座认知', '远近概念', '太空拼贴画', '晚上看星空'],
        ['本月太空词汇复习', '太空英文总复习', '太空知识问答', '数学总复习', '画太空探险', '太空探险派对']
      ],
      summary: ['认识星空', '太阳系', '太空探索', '宇航员', '星空观察', '太空探险']
    }
  };

  for (const cfg of monthConfig) {
    const t = themes[cfg.month];
    const weeks = [];
    for (let w = 0; w < 6; w++) {
      const days = [];
      for (let d = 0; d < 5; d++) {
        days.push({
          day: w * 5 + d + 1,
          lang: t.weeks[w][0],
          eng: t.weeks[w][1],
          sci: t.weeks[w][2],
          math: t.weeks[w][3],
          art: t.weeks[w][4],
          social: t.weeks[w][5]
        });
      }
      weeks.push({
        stageName: stageNames[w],
        summary: t.summary[w] + '：' + t.weeks[w][0] + '等核心内容复习与巩固',
        days: days
      });
    }
    data[cfg.month] = {
      theme: cfg.theme,
      goal: cfg.goal,
      color: cfg.color,
      light: cfg.light,
      weeks: weeks,
      books: getBooks(cfg.month),
      songs: getSongs(cfg.month)
    };
  }
  return data;
}

function getBooks(m) {
  const books = {
    7: ['《好饿的毛毛虫》', '《开饭啦》', '《好喝的汤》', '《首先有一个苹果》'],
    8: ['《我要穿衣服》', '《动物应该穿衣服吗》', '《小熊宝宝穿衣》'],
    9: ['《小兔子学搬家》', '《晚安月亮》', '《小蓝和小黄》'],
    10: ['《猜猜我有多爱你》', '《棕色的熊》', '《Dear Zoo》'],
    11: ['《小种子》', '《彩虹色的花》', '《一粒种子的旅行》'],
    12: ['《彩虹鱼》', '《海马先生》', '《好饿的鱼》'],
    1: ['《月亮晚安》', '《白天和黑夜》', '《风到哪里去了》'],
    2: ['《爸爸我要月亮》', '《月亮的味道》', '《最好的星空》']
  };
  return books[m] || [];
}

function getSongs(m) {
  const songs = {
    7: ['《大苹果》', '《拔萝卜》', '《吃饭歌》', 'Apple Song'],
    8: ['《穿衣歌》', '《小兔子乖乖》', 'Put On Your Shoes'],
    9: ['《我家有几口人》', '《房子歌》', 'In On Under Song'],
    10: ['《两只老虎》', '《小燕子》', '《小白兔白又白》', 'Old MacDonald'],
    11: ['《小树苗》', '《春天在哪里》', 'Flower Song'],
    12: ['《小鱼游游游》', '《小螺号》', 'Baby Shark'],
    1: ['《小星星》', '《月亮船》', 'Twinkle Twinkle Little Star'],
    2: ['《小火箭》', '《飞向太空》', 'Star Light Star Bright']
  };
  return songs[m] || [];
}

/* ===== 初始问题列表 ===== */
function generateInitialIssues() {
  return [
    { id: 1, title: '7月食物主题需要补充更多触觉体验活动', detail: '当前触觉活动较少，可增加更多食材触摸环节', priority: 'medium', category: 'content', resolved: false, createdAt: new Date().toISOString() },
    { id: 2, title: '英文儿歌资源需要整理可播放链接', detail: '家长需要直接可用的音频资源链接', priority: 'high', category: 'function', resolved: false, createdAt: new Date().toISOString() },
    { id: 3, title: '10月动物主题需确认动物园出行计划', detail: '需提前查看天气和预约门票', priority: 'high', category: 'content', resolved: false, createdAt: new Date().toISOString() },
    { id: 4, title: '移动端表格显示需优化', detail: '小屏幕下表格列太多，需要更好的响应式方案', priority: 'medium', category: 'style', resolved: true, createdAt: new Date().toISOString() }
  ];
}

/* ===== 持久化 ===== */
const STORAGE_KEY = 'early-ed-app-data';

function saveState() {
  const persistData = {
    adminPassword: state.adminPassword,
    theme: state.theme,
    syncUrl: state.syncUrl,
    scheduleData: state.scheduleData,
    issues: state.issues,
    visitCount: state.visitCount
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persistData));
  } catch(e) {
    console.error('保存失败:', e);
    showToast('保存失败：' + e.message, 'error');
  }
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const data = JSON.parse(saved);
      state.adminPassword = data.adminPassword || 'admin123';
      state.theme = data.theme || state.theme;
      state.syncUrl = data.syncUrl || '';
      state.scheduleData = data.scheduleData || generateInitialData();
      state.issues = data.issues || generateInitialIssues();
      state.visitCount = (data.visitCount || 0) + 1;
    } catch(e) {
      console.error('加载失败:', e);
      state.scheduleData = generateInitialData();
      state.issues = generateInitialIssues();
      state.visitCount = 1;
    }
  } else {
    state.scheduleData = generateInitialData();
    state.issues = generateInitialIssues();
    state.visitCount = 1;
  }
  saveState();
}

/* ===== 渲染：月份导航 ===== */
function renderMonthNav() {
  const nav = document.getElementById('monthNav');
  nav.innerHTML = monthConfig.map(m => `
    <button class="month-btn ${state.currentMonth === m.month ? 'active' : ''}"
            style="${state.currentMonth === m.month ? `background:${m.color};border-color:${m.color}` : ''}"
            onclick="switchMonth(${m.month})">
      ${m.month}月 · ${m.theme}
    </button>
  `).join('');
}

/* ===== 渲染：月份内容 ===== */
function renderMonthContent() {
  const container = document.getElementById('monthContent');
  const cfg = monthConfig.find(m => m.month === state.currentMonth);
  const data = state.scheduleData[state.currentMonth];
  if (!data) { container.innerHTML = '<p class="empty-state">暂无数据</p>'; return; }

  const textColor = isLightColor(cfg.color) ? '#333' : '#fff';
  let html = `
    <div class="month-header" style="background:${cfg.light};">
      <h2 style="color:${cfg.color};">${state.currentMonth}月 — ${data.theme}主题</h2>
      <div class="month-goal">🎯 ${data.goal}</div>
    </div>
  `;

  // 月度总览表
  html += `
    <div class="table-wrap" style="margin-bottom:20px;">
      <table class="overview-table">
        <thead><tr>
          <th style="background:${cfg.color};color:${textColor};">阶段</th>
          ${dimLabels.map(d => `<th style="background:${cfg.color};color:${textColor};">${d}</th>`).join('')}
        </tr></thead>
        <tbody>
          ${data.weeks.map((week, wi) => `
            <tr>
              <td style="background:${cfg.light};font-weight:700;">${week.stageName}</td>
              ${dimKeys.map(k => `<td style="background:#fff;">${week.days[0][k] || '-'}</td>`).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;

  // 周视图
  data.weeks.forEach((week, wi) => {
    const stageColor = cfg.light;
    html += `
      <div class="week-card ${wi > 0 ? 'collapsed' : ''}" id="week-${wi}">
        <div class="week-card-header" style="background:${stageColor};" onclick="toggleWeek(${wi})">
          <h3 style="color:${cfg.color};">第${wi + 1}周（D${wi*5+1}-D${wi*5+5}）：${week.stageName}</h3>
          <span class="week-toggle" style="background:${cfg.color};color:${textColor};">▼</span>
        </div>
        <div class="week-card-body">
          <div class="table-wrap">
            <table class="schedule-table">
              <thead><tr>
                <th style="background:${cfg.color};color:${textColor};">天数</th>
                ${dimLabels.map(d => `<th style="background:${cfg.color};color:${textColor};">${d}</th>`).join('')}
              </tr></thead>
              <tbody>
                ${week.days.map(day => `
                  <tr>
                    <td class="day-cell" style="background:${stageColor};color:${cfg.color};">第${day.day}天</td>
                    ${dimKeys.map(k => `
                      <td class="editable ${state.isAdmin ? 'admin-mode' : ''}"
                          onclick="editCell(${wi}, ${day.day - 1 - wi*5}, '${k}')"
                          data-week="${wi}" data-day="${day.day - 1 - wi*5}" data-key="${k}">
                        ${day[k] || '<span style="color:#ccc">点击编辑</span>'}
                      </td>
                    `).join('')}
                  </tr>
                `).join('')}
                <tr class="summary-row">
                  <td colspan="7" style="background:${cfg.light};" onclick="editSummary(${wi})">
                    📝 ${week.summary}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  });

  // 附录
  html += `
    <div class="week-card" style="margin-top:20px;">
      <div class="week-card-header" style="background:${cfg.light};" onclick="this.parentElement.classList.toggle('collapsed')">
        <h3 style="color:${cfg.color};">📖 附录：推荐资源</h3>
        <span class="week-toggle" style="background:${cfg.color};color:${textColor};">▼</span>
      </div>
      <div class="week-card-body" style="padding:16px;">
        <p style="font-weight:700;margin-bottom:8px;">推荐绘本：</p>
        <p style="margin-bottom:16px;">${data.books.join(' · ')}</p>
        <p style="font-weight:700;margin-bottom:8px;">推荐儿歌：</p>
        <p>${data.songs.join(' · ')}</p>
      </div>
    </div>
  `;

  container.innerHTML = html;
}

/* ===== 渲染：问题清单 ===== */
function renderIssues() {
  const list = document.getElementById('issuesList');
  let issues = state.issues;

  if (state.issueFilter === 'open') issues = issues.filter(i => !i.resolved);
  else if (state.issueFilter === 'resolved') issues = issues.filter(i => i.resolved);

  // 更新计数
  document.getElementById('countAll').textContent = state.issues.length;
  document.getElementById('countOpen').textContent = state.issues.filter(i => !i.resolved).length;
  document.getElementById('countResolved').textContent = state.issues.filter(i => i.resolved).length;

  if (issues.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">📝</div>
        <p>暂无问题记录</p>
        <p style="font-size:13px;margin-top:4px;">点击"添加问题"开始记录</p>
      </div>
    `;
    return;
  }

  list.innerHTML = issues.map(issue => {
    const priorityLabels = { high: '🔴 高', medium: '🟡 中', low: '🟢 低' };
    const categoryLabels = { content: '内容', style: '样式', function: '功能', other: '其他' };
    return `
      <div class="issue-card ${issue.resolved ? 'resolved' : ''} priority-${issue.priority}">
        <div class="issue-header">
          <div style="flex:1;">
            <div class="issue-title">${escapeHtml(issue.title)}</div>
            ${issue.detail ? `<div class="issue-detail">${escapeHtml(issue.detail)}</div>` : ''}
            <div class="issue-meta">
              <span class="issue-badge badge-${issue.priority}">${priorityLabels[issue.priority]}</span>
              <span class="issue-badge badge-cat">${categoryLabels[issue.category]}</span>
              <span style="color:var(--muted);">${issue.resolved ? '✅ 已解决' : '⏳ 待解决'}</span>
            </div>
          </div>
          <div class="issue-actions">
            <button class="issue-btn" onclick="toggleResolve(${issue.id})" title="${issue.resolved ? '标记未解决' : '标记已解决'}">
              ${issue.resolved ? '↩️' : '✅'}
            </button>
            <button class="issue-btn" onclick="editIssue(${issue.id})" title="编辑">✏️</button>
            <button class="issue-btn" onclick="deleteIssue(${issue.id})" title="删除">🗑️</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/* ===== 渲染：设置 ===== */
function renderSettings() {
  document.getElementById('themeColor').value = state.theme.color;
  document.getElementById('fontSize').value = state.theme.fontSize;
  document.getElementById('borderRadius').value = state.theme.borderRadius;
  document.getElementById('radiusValue').textContent = state.theme.borderRadius + 'px';
  document.getElementById('syncUrl').value = state.syncUrl;
  document.getElementById('adminStatus').textContent = state.isAdmin ? '已登录' : '未登录';
  document.getElementById('adminStatus').className = 'sync-badge ' + (state.isAdmin ? 'admin' : '');
  document.getElementById('visitCount').textContent = state.visitCount + ' 次访问';
  document.getElementById('storageInfo').textContent = state.syncUrl ? '本地 + 云端' : '本地存储';

  const syncStatus = document.getElementById('syncStatus');
  if (state.syncUrl) {
    syncStatus.textContent = '已配置';
    syncStatus.className = 'sync-badge connected';
  } else {
    syncStatus.textContent = '未配置';
    syncStatus.className = 'sync-badge';
  }
}

/* ===== 视图切换 ===== */
function switchView(viewName) {
  state.view = viewName;
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.toggle('active', t.dataset.view === viewName));
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('active', v.id === 'view-' + viewName));
  if (viewName === 'schedule') { renderMonthNav(); renderMonthContent(); }
  else if (viewName === 'issues') renderIssues();
  else if (viewName === 'settings') renderSettings();
}

function switchMonth(m) {
  state.currentMonth = m;
  renderMonthNav();
  renderMonthContent();
}

function toggleWeek(wi) {
  document.getElementById('week-' + wi).classList.toggle('collapsed');
}

/* ===== 管理员功能 ===== */
function openAdminLogin() {
  if (state.isAdmin) {
    state.isAdmin = false;
    document.getElementById('adminToggle').textContent = '🔒';
    document.body.classList.remove('admin-mode');
    showToast('已退出管理员模式');
    if (state.view === 'schedule') renderMonthContent();
    return;
  }
  document.getElementById('adminLoginModal').style.display = 'flex';
  document.getElementById('adminPassword').value = '';
  document.getElementById('adminError').textContent = '';
  setTimeout(() => document.getElementById('adminPassword').focus(), 100);
}

function closeAdminLogin() {
  document.getElementById('adminLoginModal').style.display = 'none';
}

function tryAdminLogin() {
  const pwd = document.getElementById('adminPassword').value;
  if (pwd === state.adminPassword) {
    state.isAdmin = true;
    document.getElementById('adminToggle').textContent = '🔓';
    document.body.classList.add('admin-mode');
    closeAdminLogin();
    showToast('管理员模式已开启', 'success');
    if (state.view === 'schedule') renderMonthContent();
    renderSettings();
  } else {
    document.getElementById('adminError').textContent = '密码错误，请重试';
  }
}

function changeAdminPassword() {
  const newPwd = document.getElementById('newAdminPassword').value;
  if (!newPwd || newPwd.length < 4) {
    showToast('密码至少4位', 'error');
    return;
  }
  state.adminPassword = newPwd;
  saveState();
  document.getElementById('newAdminPassword').value = '';
  showToast('密码已修改', 'success');
}

/* ===== 单元格编辑 ===== */
function editCell(weekIdx, dayIdx, key) {
  if (!state.isAdmin) {
    showToast('请先进入管理员模式', 'error');
    return;
  }
  const data = state.scheduleData[state.currentMonth];
  const day = data.weeks[weekIdx].days[dayIdx];
  state.editingCell = { weekIdx, dayIdx, key };

  const labelMap = { lang: '语文', eng: '英语', sci: '科学', math: '数学', art: '美音', social: '社交' };
  document.getElementById('cellEditLabel').textContent = `第${day.day}天 · ${labelMap[key]}`;
  document.getElementById('cellEditValue').value = day[key] || '';
  document.getElementById('cellEditModal').style.display = 'flex';
  setTimeout(() => document.getElementById('cellEditValue').focus(), 100);
}

function closeCellEdit() {
  document.getElementById('cellEditModal').style.display = 'none';
  state.editingCell = null;
}

function saveCellEdit() {
  if (!state.editingCell) return;
  const { weekIdx, dayIdx, key } = state.editingCell;
  const value = document.getElementById('cellEditValue').value.trim();
  state.scheduleData[state.currentMonth].weeks[weekIdx].days[dayIdx][key] = value;
  saveState();
  closeCellEdit();
  renderMonthContent();
  showToast('已保存', 'success');
  syncIfConnected();
}

function editSummary(weekIdx) {
  if (!state.isAdmin) { showToast('请先进入管理员模式', 'error'); return; }
  const data = state.scheduleData[state.currentMonth];
  const summary = data.weeks[weekIdx].summary;
  state.editingCell = { weekIdx, dayIdx: -1, key: 'summary' };
  document.getElementById('cellEditLabel').textContent = `第${weekIdx + 1}周小结`;
  document.getElementById('cellEditValue').value = summary;
  document.getElementById('cellEditModal').style.display = 'flex';
  setTimeout(() => document.getElementById('cellEditValue').focus(), 100);
}

/* ===== 问题清单功能 ===== */
function openIssueModal(issue = null) {
  state.editingIssue = issue;
  const modal = document.getElementById('issueModal');
  if (issue) {
    document.getElementById('issueModalTitle').textContent = '编辑问题';
    document.getElementById('issueTitle').value = issue.title;
    document.getElementById('issueDetail').value = issue.detail || '';
    document.getElementById('issuePriority').value = issue.priority;
    document.getElementById('issueCategory').value = issue.category;
  } else {
    document.getElementById('issueModalTitle').textContent = '添加问题';
    document.getElementById('issueTitle').value = '';
    document.getElementById('issueDetail').value = '';
    document.getElementById('issuePriority').value = 'medium';
    document.getElementById('issueCategory').value = 'content';
  }
  modal.style.display = 'flex';
  setTimeout(() => document.getElementById('issueTitle').focus(), 100);
}

function closeIssueModal() {
  document.getElementById('issueModal').style.display = 'none';
  state.editingIssue = null;
}

function saveIssue() {
  const title = document.getElementById('issueTitle').value.trim();
  if (!title) { showToast('请输入标题', 'error'); return; }
  const detail = document.getElementById('issueDetail').value.trim();
  const priority = document.getElementById('issuePriority').value;
  const category = document.getElementById('issueCategory').value;

  if (state.editingIssue) {
    const issue = state.issues.find(i => i.id === state.editingIssue.id);
    if (issue) { issue.title = title; issue.detail = detail; issue.priority = priority; issue.category = category; }
  } else {
    const newId = Math.max(0, ...state.issues.map(i => i.id)) + 1;
    state.issues.unshift({ id: newId, title, detail, priority, category, resolved: false, createdAt: new Date().toISOString() });
  }
  saveState();
  closeIssueModal();
  renderIssues();
  showToast('已保存', 'success');
  syncIfConnected();
}

function toggleResolve(id) {
  const issue = state.issues.find(i => i.id === id);
  if (issue) { issue.resolved = !issue.resolved; saveState(); renderIssues(); syncIfConnected(); }
}

function editIssue(id) {
  const issue = state.issues.find(i => i.id === id);
  if (issue) openIssueModal(issue);
}

function deleteIssue(id) {
  if (!confirm('确定删除这个问题吗？')) return;
  state.issues = state.issues.filter(i => i.id !== id);
  saveState();
  renderIssues();
  showToast('已删除', 'success');
  syncIfConnected();
}

/* ===== 数据管理 ===== */
function exportData() {
  const data = {
    scheduleData: state.scheduleData,
    issues: state.issues,
    theme: state.theme,
    exportDate: new Date().toISOString()
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `早教数据_${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('数据已导出', 'success');
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data.scheduleData) state.scheduleData = data.scheduleData;
      if (data.issues) state.issues = data.issues;
      if (data.theme) state.theme = data.theme;
      saveState();
      applyTheme();
      if (state.view === 'schedule') renderMonthContent();
      if (state.view === 'issues') renderIssues();
      showToast('数据已导入', 'success');
      syncIfConnected();
    } catch(err) {
      showToast('导入失败：文件格式错误', 'error');
    }
  };
  reader.readAsText(file);
}

function resetData() {
  if (!confirm('确定恢复默认数据？当前所有修改将丢失！')) return;
  state.scheduleData = generateInitialData();
  state.issues = generateInitialIssues();
  saveState();
  if (state.view === 'schedule') renderMonthContent();
  if (state.view === 'issues') renderIssues();
  showToast('已恢复默认数据', 'success');
  syncIfConnected();
}

/* ===== 样式设置 ===== */
function updateTheme() {
  state.theme.color = document.getElementById('themeColor').value;
  document.documentElement.style.setProperty('--primary', state.theme.color);
  saveState();
}

function updateFontSize() {
  state.theme.fontSize = parseInt(document.getElementById('fontSize').value);
  document.documentElement.style.setProperty('--font-size', state.theme.fontSize + 'px');
  saveState();
}

function updateBorderRadius() {
  state.theme.borderRadius = parseInt(document.getElementById('borderRadius').value);
  document.documentElement.style.setProperty('--radius', state.theme.borderRadius + 'px');
  document.getElementById('radiusValue').textContent = state.theme.borderRadius + 'px';
  saveState();
}

function applyTheme() {
  document.documentElement.style.setProperty('--primary', state.theme.color);
  document.documentElement.style.setProperty('--font-size', state.theme.fontSize + 'px');
  document.documentElement.style.setProperty('--radius', state.theme.borderRadius + 'px');
}

/* ===== 云端同步 ===== */
function saveSyncUrl() {
  state.syncUrl = document.getElementById('syncUrl').value.trim();
  saveState();
  renderSettings();
  showToast(state.syncUrl ? 'API地址已保存' : '已清除API地址', 'success');
}

async function syncToCloud() {
  if (!state.syncUrl) { showToast('请先配置API地址', 'error'); return; }
  const btn = document.getElementById('syncBtn');
  btn.textContent = '同步中...'; btn.disabled = true;
  try {
    const payload = { scheduleData: state.scheduleData, issues: state.issues };
    const res = await fetch(state.syncUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      showToast('同步成功', 'success');
    } else {
      showToast('同步失败: ' + res.status, 'error');
    }
  } catch(e) {
    showToast('同步失败: ' + e.message, 'error');
  }
  btn.textContent = '立即同步'; btn.disabled = false;
}

async function syncFromCloud() {
  if (!state.syncUrl) return;
  try {
    const res = await fetch(state.syncUrl);
    if (res.ok) {
      const data = await res.json();
      if (data.scheduleData) state.scheduleData = data.scheduleData;
      if (data.issues) state.issues = data.issues;
      saveState();
      if (state.view === 'schedule') renderMonthContent();
      if (state.view === 'issues') renderIssues();
    }
  } catch(e) { console.log('云端拉取跳过:', e.message); }
}

function syncIfConnected() {
  if (state.syncUrl && state.isAdmin) {
    syncToCloud().catch(() => {});
  }
}

/* ===== 工具函数 ===== */
function isLightColor(hex) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  return (r * 0.299 + g * 0.587 + b * 0.114) > 160;
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function showToast(msg, type = '') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast show ' + type;
  setTimeout(() => toast.classList.remove('show'), 2500);
}

/* ===== 事件绑定 ===== */
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  applyTheme();

  // 导航标签
  document.querySelectorAll('.nav-tab').forEach(tab => {
    tab.addEventListener('click', () => switchView(tab.dataset.view));
  });

  // 管理员按钮
  document.getElementById('adminToggle').addEventListener('click', openAdminLogin);

  // 导出按钮
  document.getElementById('exportBtn').addEventListener('click', exportData);

  // 添加问题按钮
  document.getElementById('addIssueBtn').addEventListener('click', () => openIssueModal());

  // 问题筛选
  document.querySelectorAll('.filter-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      state.issueFilter = tab.dataset.filter;
      renderIssues();
    });
  });

  // 导入文件
  document.getElementById('importFile').addEventListener('change', (e) => {
    if (e.target.files[0]) importData(e.target.files[0]);
  });

  // 管理员密码回车
  document.getElementById('adminPassword').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') tryAdminLogin();
  });

  // 单元格编辑回车
  document.getElementById('cellEditValue').addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) saveCellEdit();
  });

  // 问题标题回车
  document.getElementById('issueTitle').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') saveIssue();
  });

  // 初始渲染
  renderMonthNav();
  renderMonthContent();

  // 尝试从云端拉取
  if (state.syncUrl) setTimeout(syncFromCloud, 1000);
});

// 暴露全局函数
window.switchView = switchView;
window.switchMonth = switchMonth;
window.toggleWeek = toggleWeek;
window.editCell = editCell;
window.closeCellEdit = closeCellEdit;
window.saveCellEdit = saveCellEdit;
window.editSummary = editSummary;
window.openAdminLogin = openAdminLogin;
window.closeAdminLogin = closeAdminLogin;
window.tryAdminLogin = tryAdminLogin;
window.changeAdminPassword = changeAdminPassword;
window.openIssueModal = openIssueModal;
window.closeIssueModal = closeIssueModal;
window.saveIssue = saveIssue;
window.toggleResolve = toggleResolve;
window.editIssue = editIssue;
window.deleteIssue = deleteIssue;
window.exportData = exportData;
window.resetData = resetData;
window.updateTheme = updateTheme;
window.updateFontSize = updateFontSize;
window.updateBorderRadius = updateBorderRadius;
window.saveSyncUrl = saveSyncUrl;
window.syncToCloud = syncToCloud;
