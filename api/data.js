/**
 * 早教规划 - 云端数据同步 API
 * 部署在 Vercel Serverless Functions 上
 *
 * 功能：
 *   GET  /api/data  - 获取云端存储的课程数据
 *   POST /api/data  - 保存课程数据到云端
 *
 * 数据持久化方案：
 *   生产环境推荐使用 Vercel KV（@vercel/kv）实现真正的数据持久化
 *   当前版本使用内存存储 + 可选 KV 升级
 *
 * 升级到 Vercel KV 步骤：
 *   1. npm install @vercel/kv
 *   2. 在 Vercel Dashboard 创建 KV Storage
 *   3. 设置环境变量 KV_REST_API_URL 和 KV_REST_API_TOKEN
 *   4. 取消下方 KV 代码注释
 */

// ===== 内存存储（开发/测试用，Vercel 冷启动后重置） =====
let memoryStore = null;

// ===== Vercel KV（生产环境推荐，取消注释后使用） =====
// let kv = null;
// try {
//   kv = require('@vercel/kv');
// } catch(e) {
//   console.log('@vercel/kv not installed, using memory store');
// }

const DATA_KEY = 'early-ed-schedule-data';

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      return handleGet(req, res);
    } else if (req.method === 'POST') {
      return handlePost(req, res);
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch(error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}

async function handleGet(req, res) {
  let data = null;

  // 优先使用 KV
  // if (kv && process.env.KV_REST_API_URL) {
  //   data = await kv.get(DATA_KEY);
  // }

  // 回退到内存存储
  if (!data) {
    data = memoryStore;
  }

  if (data) {
    return res.status(200).json({ success: true, data, source: 'memory' });
  } else {
    return res.status(200).json({ success: true, data: null, message: 'No data yet' });
  }
}

async function handlePost(req, res) {
  const body = req.body;

  if (!body || (!body.scheduleData && !body.issues)) {
    return res.status(400).json({ error: 'Invalid data format' });
  }

  const timestamp = new Date().toISOString();
  const storeData = {
    ...body,
    updatedAt: timestamp
  };

  // 保存到 KV
  // if (kv && process.env.KV_REST_API_URL) {
  //   await kv.set(DATA_KEY, JSON.stringify(storeData));
  // }

  // 保存到内存
  memoryStore = storeData;

  return res.status(200).json({
    success: true,
    message: 'Data saved',
    updatedAt: timestamp
  });
}
