/**
 * 每日早教推送脚本
 * 读取 schedule.json，根据当前日期找到当天的活动内容，
 * 拼成方案C格式的消息，通过企业微信群机器人推送到家庭群。
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// ===== 配置 =====
const WECOM_WEBHOOK = process.env.WECOM_WEBHOOK; // 企业微信群机器人 webhook URL
const SCHEDULE_PATH = path.join(__dirname, '..', 'schedule.json');

// 维度配置
const DIMS = [
  { key: 'lang',   icon: '📖', label: '语' },
  { key: 'eng',    icon: '🔤', label: '英' },
  { key: 'sci',    icon: '🔬', label: '科' },
  { key: 'math',   icon: '🔢', label: '数' },
  { key: 'art',    icon: '🎨', label: '美音' },
  { key: 'social', icon: '🤝', label: '社' }
];

// ===== 获取当前日期对应的课程 =====
function getTodayLesson() {
  const schedule = JSON.parse(fs.readFileSync(SCHEDULE_PATH, 'utf-8'));
  const now = new Date();
  // 获取北京时间（UTC+8）
  const beijingOffset = 8 * 60 * 60 * 1000;
  const beijingTime = new Date(now.getTime() + beijingOffset);
  const year = beijingTime.getUTCFullYear();
  const month = beijingTime.getUTCMonth() + 1;
  const day = beijingTime.getUTCDate();

  console.log(`当前北京时间: ${year}年${month}月${day}日`);

  // 在 schedule 中找到匹配的月份
  const monthData = schedule.months.find(m => m.month === month && m.year === year);
  if (!monthData) {
    return null;
  }

  // 在该月中找到匹配的日期
  for (const week of monthData.weeks) {
    for (const dayObj of week.days) {
      // 解析 dateLabel 中的日期数字，如 "8月4日 周二"
      const match = dayObj.date.match(/(\d+)月(\d+)日/);
      if (match) {
        const dMonth = parseInt(match[1]);
        const dDay = parseInt(match[2]);
        if (dMonth === month && dDay === day) {
          return { monthData, week, dayObj, weekIndex: week.weekIndex };
        }
      }
    }
  }

  return null;
}

// ===== 判断是否为复习日 =====
function isReviewDay(dayObj) {
  let hasContent = false;
  let allReview = true;
  for (const dim of DIMS) {
    const v = dayObj[dim.key];
    if (v && v.trim()) {
      hasContent = true;
      if (!v.startsWith('复习') && !v.startsWith('本周复习') && !v.startsWith('月度复习')) {
        allReview = false;
      }
    }
  }
  return hasContent && allReview;
}

// ===== 判断是否为空内容日 =====
function isEmptyDay(dayObj) {
  return DIMS.every(dim => !dayObj[dim.key] || !dayObj[dim.key].trim());
}

// 无实质指导意义的内容，提取重点时跳过
const SKIP_PATTERNS = ['复习', '本周复习', '月度复习', '自由玩耍'];

// ===== 生成今日重点 =====
function getHighlight(dayObj) {
  // 优先找有实质内容的维度（非"复习"、"自由玩耍"等）
  for (const dim of DIMS) {
    const v = dayObj[dim.key];
    if (v && v.trim() && !SKIP_PATTERNS.some(p => v.startsWith(p))) {
      // 截取前40字作为重点
      return v.length > 40 ? v.slice(0, 40) + '...' : v;
    }
  }
  // 如果全是复习/自由玩耍，取第一个有内容的维度
  for (const dim of DIMS) {
    const v = dayObj[dim.key];
    if (v && v.trim()) {
      return v.length > 40 ? v.slice(0, 40) + '...' : v;
    }
  }
  return '复习巩固今天学过的内容';
}

// ===== 拼接推送消息（方案C格式）=====
function buildMessage(lesson) {
  const { monthData, week, dayObj, weekIndex } = lesson;

  // 复习日换轻松语气
  const isReview = isReviewDay(dayObj);
  const isEmpty = isEmptyDay(dayObj);

  if (isReview || isEmpty) {
    // 轻松日格式
    const lines = [];
    lines.push(`👶 ${dayObj.date} · ${monthData.theme}主题`);
    lines.push('');
    lines.push('🌈 今天轻松日~');
    lines.push('');
    lines.push(dayObj.tip || '翻出这周的绘本和玩具，让宝宝自己选一个玩就好');
    lines.push('');
    // 如果有英文复习内容，附上
    if (dayObj.eng && dayObj.eng.trim()) {
      lines.push(`🔤 英文随口复习：${dayObj.eng}`);
    }
    return lines.join('\n');
  }

  // 正常日格式（方案C）
  const lines = [];
  
  // 标题行
  lines.push(`👶 ${dayObj.date} · ${monthData.theme}主题 第${weekIndex + 1}周`);
  lines.push('');

  // 今日重点
  lines.push('🎯 今日重点');
  lines.push(getHighlight(dayObj));
  lines.push('');

  // 全部活动速览
  lines.push('📝 全部活动');
  const activities = [];
  for (const dim of DIMS) {
    const v = dayObj[dim.key];
    if (v && v.trim()) {
      activities.push(`${dim.icon} ${v}`);
    }
  }
  if (activities.length > 0) {
    lines.push(activities.join(' ｜ '));
  } else {
    lines.push('今天没有特别安排');
  }
  lines.push('');

  // 小贴士
  lines.push('💡 小贴士');
  lines.push(dayObj.tip || '和宝宝一起探索，重点是陪伴和互动');

  return lines.join('\n');
}

// ===== 通过企业微信群机器人推送 =====
function pushToWeChat(message) {
  return new Promise((resolve, reject) => {
    if (!WECOM_WEBHOOK) {
      console.error('错误：WECOM_WEBHOOK 未配置');
      reject(new Error('WECOM_WEBHOOK not configured'));
      return;
    }

    // 企业微信群机器人支持 markdown 消息
    const payload = JSON.stringify({
      msgtype: 'markdown',
      markdown: {
        content: message
      }
    });

    // 解析 webhook URL
    let url;
    try {
      url = new URL(WECOM_WEBHOOK);
    } catch(e) {
      reject(new Error(`webhook URL 无效: ${e.message}`));
      return;
    }

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log('企业微信响应:', res.statusCode, data);
        if (res.statusCode === 200) {
          try {
            const json = JSON.parse(data);
            if (json.errcode === 0) {
              resolve(json);
            } else {
              reject(new Error(`企业微信返回错误: ${json.errmsg || data}`));
            }
          } catch(e) {
            reject(new Error(`解析响应失败: ${data}`));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(new Error(`请求失败: ${e.message}`));
    });

    req.write(payload);
    req.end();
  });
}

// ===== 主流程 =====
async function main() {
  console.log('=== 每日早教推送 ===');
  console.log('时间:', new Date().toISOString());

  // 1. 获取今日课程
  const lesson = getTodayLesson();
  if (!lesson) {
    console.log('今天没有对应的课程数据');
    // 推送一条"今日休息"消息
    const restMsg = '👶 今天没有安排课程\n\n周末/休息日，好好陪宝宝玩就好~';
    try {
      await pushToWeChat(restMsg);
      console.log('休息日消息已推送');
    } catch(e) {
      console.error('推送失败:', e.message);
      process.exit(1);
    }
    return;
  }

  // 2. 生成消息
  const message = buildMessage(lesson);
  console.log('--- 消息内容 ---');
  console.log(message);
  console.log('--- 消息结束 ---');

  // 3. 推送
  try {
    await pushToWeChat(message);
    console.log('✅ 推送成功！');
  } catch(e) {
    console.error('❌ 推送失败:', e.message);
    process.exit(1);
  }
}

main();
