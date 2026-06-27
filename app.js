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
  { month: 7,  year: 2026, theme: '食物', goal: '认识10种以上食物名称，尝试自主进食，建立健康饮食认知', color: '#FF6B35', light: '#FFE0B2' },
  { month: 8,  year: 2026, theme: '穿衣', goal: '认识5种以上衣物，配合穿衣，建立穿衣常规', color: '#FF69B4', light: '#F8BBD0' },
  { month: 9,  year: 2026, theme: '居住', goal: '认识家中房间和家具，理解基本方位词', color: '#4ECDC4', light: '#B2DFDB' },
  { month: 10, year: 2026, theme: '动物', goal: '认识10种以上动物，模仿叫声和动作', color: '#FFD93D', light: '#FFF9C4' },
  { month: 11, year: 2026, theme: '植物', goal: '认识5种以上植物，参与水培种植', color: '#6BCB77', light: '#C8E6C9' },
  { month: 12, year: 2026, theme: '海洋', goal: '认识5种以上海洋生物，建立水的感知', color: '#4D96FF', light: '#BBDEFB' },
  { month: 1,  year: 2027, theme: '天空', goal: '观察天空变化，认识天气，理解白天黑夜', color: '#9B59B6', light: '#E1BEE7' },
  { month: 2,  year: 2027, theme: '太空', goal: '初步感知太空概念，认识地球月亮太阳', color: '#2C3E50', light: '#CFD8DC' }
];

const stageNames = ['感知引入', '词汇积累', '深度体验', '跨维整合'];

function getDateLabel(year, month, dayNum) {
  const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const date = new Date(year, month - 1, dayNum);
  const wd = weekdays[date.getDay()];
  const actualMonth = date.getMonth() + 1;
  const actualDay = date.getDate();
  return `${actualMonth}月${actualDay}日 ${wd}`;
}

const dimLabels = ['语', '英', '科', '数', '美音', '社'];
const dimKeys = ['lang', 'eng', 'sci', 'math', 'art', 'social'];

/* ===== 初始数据生成 ===== */
function getFirstMonday(year, month) {
  const d = new Date(year, month - 1, 1);
  const day = d.getDay();
  const offset = day === 1 ? 0 : day === 0 ? 1 : 8 - day;
  return 1 + offset;
}

function generateInitialData() {
  const data = {};
  const themes = {
    7: {
      weeks: [
        // 第1周 感知引入
        [
          ['小方绘本《水果》认识水果', '学习英文苹果apple, 香蕉banana', '自由玩耍', '', '', ''],
          ['复习小方绘本《水果》', '复习apple, banana,学习橘子 orange,', '自由玩耍', '', '', ''],
          ['复习', '复习 apple, banana, orange, grape，学习葡萄grape', '玩实物水果（苹果、橘子、葡萄），摸水果表皮（光滑vs粗糙）', '', '英文歌 Apple round, apple red。苹果圆，苹果红。Apple juice, apple sweet。苹果多汁，苹果甜。Apple, apple, I love you。苹果，苹果，我爱你。Apple sweet I love to eat。苹果甜甜我喜欢吃。', ''],
          ['复习', '复习', '', '数葡萄1-5个', '', ''],
          ['复习', '复习', '', '数葡萄1-5个', '白板上画圆，复习圆形的水果', ''],
          ['本周复习：指认所有出现过的水果', '复习，梨pear', '', '', '', '']
        ],
        // 第2周 词汇积累
        [
          ['通过水果玩具认识苹果、香蕉、橘子、葡萄、西瓜、梨、草莓、桃子、柠檬，杨桃猕猴桃', '西瓜watermelon, 桃子peach', '', '', '', ''],
          ['复习', '草莓strawberry, 柠檬lemon', '切水果游戏，观察水果切面（杨桃五角星）', '', '', ''],
          ['复习', '复习', '', '水果拼接游戏：把水果玩具分开两半并混匀，学习正确拼接水果并指认', '', ''],
          ['复习', '复习', '', '水果拼接游戏：把水果玩具分开两半并混匀，学习正确拼接水果并指认', '', ''],
          ['复习', '复习', '玩实物水果（苹果、香蕉、草莓），摸水果表皮、尝水果味道', '', '', '小方绘本《我不挑食》，尝试水果味道'],
          ['复习本周所学', '复习', '', '', '', '']
        ],
        // 第3周 深度体验
        [
          ['小方绘本《蔬菜》认识蔬菜', '胡萝卜carrot, 番茄tomato', '', '', '', '小方绘本《我能自己吃饭》'],
          ['复习小方绘本《蔬菜》', '复习', '观察蔬菜颜色（红番茄、绿菜心、黄玉米、白花菜），触摸蔬菜质地（软硬）、闻蔬菜气味', '', '', '鼓励自己吃饭'],
          ['复习', '学习鸡蛋egg, 牛奶milk,', '', '数黄豆1-5，比较多少（两堆黄豆一多一少）', '白板画圆（复习圆形蔬菜）', '鼓励自己吃饭'],
          ['复习', '复习', '', '比较长短（长萝卜/短萝卜）', '《拔萝卜》《小兔子吃萝卜》儿歌', '鼓励自己吃饭'],
          ['复习', '复习西瓜、苹果、葡萄英文', '实物比较大小：大西瓜＞苹果＞葡萄＞黄豆', '', '', '鼓励自己吃饭'],
          ['复习本周蔬菜', '', '', '', '', '鼓励自己吃饭']
        ],
        // 第4周 跨维整合
        [
          ['学字（洗、切、煮、吃、米）', '', '', '', '', '观察煮饭过程（生的米粒，洗米，煮饭，熟的米饭）'],
          ['学字（米、汤）', '米饭rice, 面条noodle', '感受汤变冷变热', '', '', '观察煮鸡蛋过程（生的，熟的），复习鸡蛋egg'],
          ['古诗《悯农》锄禾日当午，汗滴禾下土，谁知盘中餐，粒粒皆辛苦', '', '布书《水果蔬菜》，学习蔬菜从哪里来（土里生长）并学习古诗，要珍惜食物', '', '', '鼓励自己吃饭'],
          ['布书《水果蔬菜》', '', '讲述蔬菜和水果的差别：蔬菜通常指的是植物的根、茎、叶或花蕾等部分，比如胡萝卜、西兰花、菠菜等，而水果则是植物的果实，比如苹果、香蕉、草莓等。蔬菜通常被烹饪、炒菜等加工食用，水果常新鲜食用，也可制作果汁、果酱', '用《水果蔬菜》布书的粘贴水果分类：水果vs蔬菜', '', '鼓励自己吃饭'],
          ['本周复习', '碗bowl, 碟子plate, 勺子spoon', '本周复习', '本周复习', '画圆', '鼓励自己吃饭'],
          ['月度复习', '月度复习', '月度复习', '月度复习', '', '']
        ]
      ],
      summary: [
        '通过绘本和实物操作，引导宝宝初步感知常见水果的颜色、形状和气味，建立了对食物的基本认知。',
        '认识常见蔬菜名称，通过观察和体验感受蔬菜的颜色、质地，初步建立健康饮食意识。',
        '认识常见蔬菜名称，通过观察和体验感受蔬菜的颜色、质地，初步建立健康饮食意识。',
        '通过食物制作活动体验洗、切、煮、吃的完整过程，学习食物相关词汇和英文表达。'
      ]
    },
    8: {
      weeks: [
        // 第1周 感知引入
        [
          ['小方绘本《衣服》认识衣服', '衣服shirt,裤子pants', '自由玩耍', '', '', ''],
          ['复习小方绘本《衣服》', '复习shirt,pants,学习鞋子shoe', '自由玩耍', '', '', ''],
          ['复习', '复习shirt,pants,shoe,学习袜子sock', '玩实物衣物（衣服、裤子、袜子），摸不同材质（柔软vs硬挺）', '', '英文歌Put on your shirt...', ''],
          ['复习', '复习', '', '数袜子1-5只', '', ''],
          ['复习', '复习', '', '数袜子1-5只', '白板上画长方形，复习衣服的形状', ''],
          ['本周复习：指认所有出现过的衣物', '复习，帽子hat', '', '', '', '']
        ],
        // 第2周 词汇积累
        [
          ['通过衣物玩具认识上衣、裤子、袜子、鞋子、帽子、围巾、手套、外套', '外套coat,围巾scarf', '', '', '', ''],
          ['复习', '手套glove,连衣裙dress', '触摸不同衣物材质（棉的、毛的、光滑的）', '', '', ''],
          ['复习', '复习', '', '衣物配对游戏：把袜子配成对、鞋子配成对', '', ''],
          ['复习', '复习', '', '衣物配对游戏复习', '', ''],
          ['复习', '复习', '玩实物衣物（帽子、围巾、手套），尝试戴帽子、围围巾', '', '', '小方绘本《我会自己穿》，配合穿脱衣物'],
          ['复习本周所学', '复习', '', '', '', '']
        ],
        // 第3周 深度体验
        [
          ['小方绘本《鞋子和袜子》', '穿上put on,脱下take off', '', '', '', '小方绘本《自己穿衣真棒》'],
          ['复习小方绘本《鞋子和袜子》', '复习', '观察鞋子的不同（大鞋vs小鞋、有鞋带vs没有）', '', '', ''],
          ['复习', '学习纽扣button,拉链zipper', '', '数纽扣1-5颗，比较多少（有纽扣的衣服vs无纽扣的）', '白板画圆形（复习纽扣形状）', '鼓励自己脱袜子'],
          ['复习', '复习', '', '比较长短（长围巾/短围巾）', '《穿衣歌》儿歌', '鼓励自己脱袜子'],
          ['复习', '复习put on, take off', '实物比较大小：爸爸的衣服＞我的衣服＞宝宝的衣服', '', '', '鼓励自己穿衣'],
          ['复习本周衣物', '', '', '', '', '鼓励自己穿衣']
        ],
        // 第4周 跨维整合
        [
          ['学字（冷、热、穿、脱、帽）', '', '', '', '', '观察天气冷热穿不同衣服（出门穿外套/回家脱外套）'],
          ['学字（衣、裤）', '热hot,冷cold', '感受衣服的厚度（薄衣服vs厚外套）', '', '', '练习根据天气选择衣服'],
          ['儿歌《穿衣服》一二三，穿衣服...', '', '布书《四季的衣服》，学习不同季节穿不同的衣服', '', '', '鼓励自己穿衣'],
          ['布书《四季的衣服》', '', '讲述夏天的衣服和冬天的衣服的区别：薄vs厚、短袖vs长袖', '用布书粘贴分类：夏天衣服vs冬天衣服', '', '鼓励自己穿衣'],
          ['本周复习', '雨衣raincoat,靴子boot', '本周复习', '本周复习', '画衣服', '鼓励自己穿衣'],
          ['月度复习', '月度复习', '月度复习', '月度复习', '月度复习', '']
        ]
      ],
      summary: ['认识衣服', '鞋袜世界', '穿衣实践', '季节衣物']
    },
    9: {
      weeks: [
        // 第1周 感知引入
        [
          ['小方绘本《我的家》认识房间', '门door,窗window', '自由玩耍', '', '', ''],
          ['复习小方绘本《我的家》', '复习door,window,学习床bed', '自由玩耍', '', '', ''],
          ['复习', '复习door,window,bed,学习椅子chair', '在各个房间走一走，感受不同房间（卧室、客厅、厨房）', '', '英文歌Open the door, close the door...', ''],
          ['复习', '复习', '', '数房间门1-5扇', '', ''],
          ['复习', '复习', '', '数房间门1-5扇', '白板上画方形，复习窗户和门的形状', ''],
          ['本周复习：指认家里的房间', '复习，桌子table', '', '', '', '']
        ],
        // 第2周 词汇积累
        [
          ['通过家居玩具/图片认识门、窗、床、椅子、桌子、沙发、柜子、冰箱', '沙发sofa,冰箱fridge', '', '', '', ''],
          ['复习', '柜子cabinet,灯lamp', '触摸不同家具材质（木质椅子、软沙发、光滑桌子）', '', '', ''],
          ['复习', '复习', '', '家具配对游戏：把椅子配到桌子旁、枕头配到床上', '', ''],
          ['复习', '复习', '', '家具配对游戏复习', '', ''],
          ['复习', '复习', '玩家居过家家（坐椅子、躺床、开冰箱）', '', '', '小方绘本《这是谁的房间》，认识家人物品归位'],
          ['复习本周所学', '复习', '', '', '', '']
        ],
        // 第3周 深度体验
        [
          ['小方绘本《上面和下面》', '上面up,下面down', '', '', '', '小方绘本《玩具回家》'],
          ['复习小方绘本《上面和下面》', '复习', '观察物品在桌面上vs桌子下', '', '', ''],
          ['复习', '学习里面in,外面out', '', '数玩具在桌子上1-5个，比较多少（桌上的vs桌下的）', '白板画圆形（复习桌面上放圆形物品）', '鼓励把玩具放回原位'],
          ['复习', '复习', '', '比较远近（离门近的椅子vs离门远的椅子）', '《小兔子乖乖》儿歌', '鼓励把玩具放回原位'],
          ['复习', '复习up, down, in, out', '实物比较大小：大床＞小椅子＞积木＞小球', '', '', '鼓励物品归位'],
          ['复习本周家具和方位', '', '', '', '', '鼓励物品归位']
        ],
        // 第4周 跨维整合
        [
          ['学字（家、门、床、桌、灯）', '', '', '', '', '观察开关灯过程（关灯变暗/开灯变亮）'],
          ['学字（开、关）', '开open,关close', '感受热水和冷水（洗手时感受）', '', '', '练习开门关门'],
          ['儿歌《我家有几口人》...', '', '布书《我的家》，学习家里不同的房间有什么用（厨房做饭、卧室睡觉）', '', '', '鼓励帮忙整理'],
          ['布书《我的家》', '', '讲述客厅和卧室的区别：客厅大家坐、卧室睡觉', '用布书粘贴分类：客厅物品vs卧室物品', '', '鼓励帮忙整理'],
          ['本周复习', '电视TV,镜子mirror', '本周复习', '本周复习', '画我的家', '鼓励帮忙整理'],
          ['月度复习', '月度复习', '月度复习', '月度复习', '月度复习', '']
        ]
      ],
      summary: ['我的家', '家具认知', '方位游戏', '家庭生活']
    },
    10: {
      weeks: [
        // 第1周 感知引入
        [
          ['小方绘本《动物》认识动物', '猫cat,狗dog', '自由玩耍', '', '', ''],
          ['复习小方绘本《动物》', '复习cat,dog,学习兔rabbit', '自由玩耍', '', '', ''],
          ['复习', '复习cat,dog,rabbit,学习鸟bird', '玩动物玩具（猫、狗、兔子、鸟），摸动物毛绒玩具（柔软vs粗糙）', '', '英文歌Old MacDonald had a farm...', ''],
          ['复习', '复习', '', '数动物玩具1-5个', '', ''],
          ['复习', '复习', '', '数动物玩具1-5个', '白板上画圆形，复习小动物的脸', ''],
          ['本周复习：指认所有出现过的动物', '复习，鱼fish', '', '', '', '']
        ],
        // 第2周 词汇积累
        [
          ['通过动物玩具认识猫、狗、兔子、鸟、鱼、鸡、鸭、牛', '鸡chicken,鸭duck', '', '', '', ''],
          ['复习', '牛cow,猪pig', '听动物叫声录音（喵、汪、叽叽、嘎嘎、哞哞）', '', '', ''],
          ['复习', '复习', '', '动物和食物配对：猫吃鱼、兔子吃胡萝卜', '', ''],
          ['复习', '复习', '', '动物和食物配对复习', '', ''],
          ['复习', '复习', '模仿动物动作（学猫爬、学兔子跳）', '', '', '小方绘本《农场里的动物》，认识农场动物'],
          ['复习本周所学', '复习', '', '', '', '']
        ],
        // 第3周 深度体验
        [
          ['小方绘本《动物的尾巴》', '尾巴tail,脚foot', '', '', '', '小方绘本《小动物吃什么》'],
          ['复习小方绘本《动物的尾巴》', '复习', '观察动物图片（大耳朵vs小耳朵、长尾巴vs短尾巴）', '', '', ''],
          ['复习', '学习大big,小small', '', '数动物脚（猫4只脚、鸟2只脚），比较多少', '白板画动物尾巴（长尾巴vs短尾巴）', '鼓励模仿动物叫声'],
          ['复习', '复习', '', '比较大小（大象玩具vs老鼠玩具）', '《两只老虎》儿歌', '鼓励模仿动物叫声'],
          ['复习', '复习tail, foot, big, small', '实物比较大小：大象最大＞牛＞猫＞老鼠', '', '', '鼓励模仿动物动作'],
          ['复习本周动物', '', '', '', '', '鼓励模仿动物动作']
        ],
        // 第4周 跨维整合
        [
          ['学字（大、小、牛、羊、鱼）', '', '', '', '', '观察小区里的猫/狗（安全距离）'],
          ['学字（鸟、虫）', '蝴蝶butterfly,蜜蜂bee', '观察蚂蚁搬家（户外）', '', '', '去小区找小动物'],
          ['古诗《咏鹅》鹅鹅鹅，曲项向天歌，白毛浮绿水，红掌拨清波', '', '布书《动物的家》，学习动物住在哪里（鸟在树上、鱼在水里）', '', '', '鼓励爱护小动物'],
          ['布书《动物的家》', '', '讲述宠物和野生动物的区别：宠物住家里、野生动物住外面', '用布书粘贴分类：水里住的动物vs陆地上住的动物', '', '鼓励爱护小动物'],
          ['本周复习', '青蛙frog,蜗牛snail', '本周复习', '本周复习', '画最喜欢的动物', '鼓励爱护小动物'],
          ['月度复习', '月度复习', '月度复习', '月度复习', '月度复习', '']
        ]
      ],
      summary: ['家养动物', '农场动物', '动物特征', '动物与生活']
    },
    11: {
      weeks: [
        // 第1周 感知引入
        [
          ['小方绘本《花和草》认识植物', '花flower,草grass', '自由玩耍', '', '', ''],
          ['复习小方绘本《花和草》', '复习flower,grass,学习树tree', '自由玩耍', '', '', ''],
          ['复习', '复习flower,grass,tree,学习叶子leaf', '去小区摸花草（摸叶子柔软vs粗糙），闻花香', '', '英文歌flower, flower, pretty flower...', ''],
          ['复习', '复习', '', '数花1-5朵', '', ''],
          ['复习', '复习', '', '数花1-5朵', '白板上画花，复习花的形状', ''],
          ['本周复习：指认所有出现过的植物', '复习，种子seed', '', '', '', '']
        ],
        // 第2周 词汇积累
        [
          ['通过实物/图片认识花、草、树、叶子、种子、仙人掌、向日葵、蘑菇', '仙人掌cactus,向日葵sunflower', '', '', '', ''],
          ['复习', '蘑菇mushroom,果实fruit', '观察不同植物的颜色（红花、绿草、黄向日葵）', '', '', ''],
          ['复习', '复习', '', '植物配对游戏：种子配到对应植物', '', ''],
          ['复习', '复习', '', '植物配对游戏复习', '', ''],
          ['复习', '复习', '玩树叶游戏（捡落叶、摸叶子脉络）', '', '', '小方绘本《一粒种子》，认识种子'],
          ['复习本周所学', '复习', '', '', '', '']
        ],
        // 第3周 深度体验
        [
          ['小方绘本《小种子长大》', '水water,生长grow', '', '', '', '小方绘本《我来种花》'],
          ['复习小方绘本《小种子长大》', '复习', '观察水培蒜/葱的生长（看根须、看绿芽）', '', '', ''],
          ['复习', '学习下雨rain,太阳sun', '', '数种子1-5颗，比较多少（大盘子vs小盘子）', '白板画叶子（复习叶子形状）', '鼓励给植物浇水'],
          ['复习', '复习', '', '比较高低（高的植物vs矮的植物）', '《小树苗》儿歌', '鼓励给植物浇水'],
          ['复习', '复习water, grow, rain, sun', '实物比较大小：大树＞小花＞草＞种子', '', '', '鼓励照顾植物'],
          ['复习本周植物', '', '', '', '', '鼓励照顾植物']
        ],
        // 第4周 跨维整合
        [
          ['学字（花、草、树、叶、种）', '', '', '', '', '去小区看花草树木（户外）'],
          ['学字（红、绿、黄）', '红色red,绿色green', '观察花瓣颜色（红花、黄花）', '', '', '收集落叶'],
          ['古诗《春晓》春眠不觉晓，处处闻啼鸟...', '', '布书《植物从哪里来》，学习植物从种子长出来需要阳光和水', '', '', '鼓励爱护植物'],
          ['布书《植物从哪里来》', '', '讲述花和树的区别：花有漂亮的花瓣、树有粗壮的树干', '用布书粘贴分类：有花的植物vs没有花的植物', '', '鼓励爱护植物'],
          ['本周复习', '蓝色blue,黄色yellow', '本周复习', '本周复习', '画植物', '鼓励爱护植物'],
          ['月度复习', '月度复习', '月度复习', '月度复习', '月度复习', '']
        ]
      ],
      summary: ['认识花草', '认识树木', '水培种植', '植物与生活']
    },
    12: {
      weeks: [
        // 第1周 感知引入
        [
          ['小方绘本《海洋》认识海洋生物', '鱼fish,虾shrimp', '自由玩耍', '', '', ''],
          ['复习小方绘本《海洋》', '复习fish,shrimp,学习螃蟹crab', '自由玩耍', '', '', ''],
          ['复习', '复习fish,shrimp,crab,学习海星starfish', '盆中玩水，摸水的感觉（冷/温、流动）', '', '英文歌Baby shark, doo doo doo...', ''],
          ['复习', '复习', '', '数鱼玩具1-5条', '', ''],
          ['复习', '复习', '', '数鱼玩具1-5条', '白板上画波浪线，复习水的形状', ''],
          ['本周复习：指认所有出现过的海洋生物', '复习，乌龟turtle', '', '', '', '']
        ],
        // 第2周 词汇积累
        [
          ['通过实物/图片认识鱼、虾、螃蟹、海星、乌龟、海豚、鲸鱼、章鱼', '海豚dolphin,鲸鱼whale', '', '', '', ''],
          ['复习', '章鱼octopus,水母jellyfish', '观察海洋生物图片（大鲸鱼vs小鱼、八条腿的章鱼）', '', '', ''],
          ['复习', '复习', '', '海洋生物配对游戏：小鱼配小鱼、螃蟹配螃蟹', '', ''],
          ['复习', '复习', '', '海洋生物配对游戏复习', '', ''],
          ['复习', '复习', '玩水游戏（塑料海洋动物放入水中漂/沉）', '', '', '小方绘本《海洋里的朋友》，认识海洋生物的家'],
          ['复习本周所学', '复习', '', '', '', '']
        ],
        // 第3周 深度体验
        [
          ['小方绘本《水》', '水water,游泳swim', '', '', '', '小方绘本《去海边》'],
          ['复习小方绘本《水》', '复习', '感受水的温度（温水vs凉水），摸冰块', '', '', ''],
          ['复习', '学习深deep,浅shallow', '', '数水杯1-5个，比较多少（满杯vs半杯）', '白板画水滴形状', '鼓励玩水时注意安全'],
          ['复习', '复习', '', '比较深浅（深水盆vs浅水盆）', '《小鱼游游游》儿歌', '鼓励玩水时注意安全'],
          ['复习', '复习water, swim, deep, shallow', '沉浮实验：重的东西沉下去、轻的东西浮起来（石头沉、木块浮）', '', '', '鼓励玩水时注意安全'],
          ['复习本周海洋', '', '', '', '', '鼓励玩水时注意安全']
        ],
        // 第4周 跨维整合
        [
          ['学字（海、水、鱼、浪、沙）', '', '', '', '', '去水池/小河边玩水（户外）'],
          ['学字（蓝、白）', '蓝色blue,白色white', '观察沙子（干的vs湿的），脚踩沙子', '', '', '玩沙子感受质地'],
          ['儿歌《小螺号》...大海边...', '', '布书《海洋世界》，学习海洋里有什么（水、沙、鱼、珊瑚）', '', '', '鼓励爱护海洋环境'],
          ['布书《海洋世界》', '', '讲述淡水鱼和海鱼的区别：河里的鱼vs海里的鱼', '用布书粘贴分类：水里游的vs沙滩上爬的', '', '鼓励爱护海洋环境'],
          ['本周复习', '贝壳shell,沙滩beach', '本周复习', '本周复习', '画海洋世界', '鼓励爱护海洋环境'],
          ['月度复习', '月度复习', '月度复习', '月度复习', '月度复习', '']
        ]
      ],
      summary: ['认识海洋动物', '海洋生物', '水的特性', '海洋世界']
    },
    1: {
      weeks: [
        // 第1周 感知引入
        [
          ['小方绘本《天空》认识天空', '太阳sun,月亮moon', '自由玩耍', '', '', ''],
          ['复习小方绘本《天空》', '复习sun,moon,学习星星star', '自由玩耍', '', '', ''],
          ['复习', '复习sun,moon,star,学习云cloud', '出门看天空（白天看太阳、看云朵）', '', '英文歌Twinkle twinkle little star...', ''],
          ['复习', '复习', '', '数星星图片1-5颗', '', ''],
          ['复习', '复习', '', '数星星图片1-5颗', '白板上画圆和曲线，复习太阳和云的形状', ''],
          ['本周复习：指认所有出现过的天空事物', '复习，风wind', '', '', '', '']
        ],
        // 第2周 词汇积累
        [
          ['通过图片认识太阳、月亮、星星、云、风、雨、彩虹', '雨rain,彩虹rainbow', '', '', '', ''],
          ['复习', '晴天sunny,阴天cloudy', '观察天气（看窗外是晴天还是阴天）', '', '', ''],
          ['复习', '复习', '', '天气配对游戏：太阳配晴天、云配阴天', '', ''],
          ['复习', '复习', '', '天气配对游戏复习', '', ''],
          ['复习', '复习', '感受风（扇扇子感受风、出门感受自然风）', '', '', '小方绘本《天气变变变》，认识不同天气'],
          ['复习本周所学', '复习', '', '', '', '']
        ],
        // 第3周 深度体验
        [
          ['小方绘本《白天和黑夜》', '白天day,黑夜night', '', '', '', '小方绘本《月亮晚安》'],
          ['复习小方绘本《白天和黑夜》', '复习', '感受白天（亮）/拉窗帘感受黑夜（暗）', '', '', ''],
          ['复习', '学习亮bright,暗dark', '', '数白天活动图片1-5张，比较多少（白天活动多vs晚上活动少）', '白板画太阳和月亮', '鼓励说白天做什么'],
          ['复习', '复习', '', '比较长短（白天长/夜晚短的概念）', '《小星星》儿歌', '鼓励说晚上做什么'],
          ['复习', '复习day,night,bright,dark', '观察影子（在太阳下有影子/阴天影子淡）', '', '', '鼓励观察自然变化'],
          ['复习本周天空', '', '', '', '', '鼓励观察自然变化']
        ],
        // 第4周 跨维整合
        [
          ['学字（日、月、星、云、风）', '', '', '', '', '出门观察天空（户外）'],
          ['学字（早、晚）', '早晨morning,晚上evening', '感受早晨（凉快）vs中午（热）', '', '', '建立早晚概念'],
          ['儿歌《月亮船》...', '', '布书《天空的变化》，学习日出日落（太阳升起/太阳落下）', '', '', '鼓励观察日出日落'],
          ['布书《天空的变化》', '', '讲述晴天和雨天的区别：晴天有太阳、雨天有乌云', '用布书粘贴分类：白天的天空vs夜晚的天空', '', '鼓励观察天气变化'],
          ['本周复习', '热hot,冷cold', '本周复习', '本周复习', '画天空', '鼓励观察天气变化'],
          ['月度复习', '月度复习', '月度复习', '月度复习', '月度复习', '']
        ]
      ],
      summary: ['认识天空', '天气变化', '白天黑夜', '天空与生活']
    },
    2: {
      weeks: [
        // 第1周 感知引入
        [
          ['小方绘本《太空》认识地球', '地球earth,月球moon', '自由玩耍', '', '', ''],
          ['复习小方绘本《太空》', '复习earth,moon,学习太阳sun', '自由玩耍', '', '', ''],
          ['复习', '复习earth,moon,sun,学习星星star', '摸地球仪（光滑的球体），观察地球仪上的蓝色和绿色', '', '英文歌Star light, star bright...', ''],
          ['复习', '复习', '', '数星星贴纸1-5颗', '', ''],
          ['复习', '复习', '', '数星星贴纸1-5颗', '白板上画圆形，复习地球和太阳的形状', ''],
          ['本周复习：指认所有出现过的太空事物', '复习，火箭rocket', '', '', '', '']
        ],
        // 第2周 词汇积累
        [
          ['通过地球仪/图片认识地球、月球、太阳、星星、火箭、宇航员', '宇航员astronaut', '', '', '', ''],
          ['复习', '太空space,飞船spaceship', '观察地球仪转（白天面vs夜晚面）', '', '', ''],
          ['复习', '复习', '', '太空事物配对游戏：宇航员配飞船、星星配太空', '', ''],
          ['复习', '复习', '', '太空事物配对游戏复习', '', ''],
          ['复习', '复习', '转地球仪游戏（用手指拨转地球仪）', '', '', '小方绘本《爸爸我要月亮》，认识月亮形状变化'],
          ['复习本周所学', '复习', '', '', '', '']
        ],
        // 第3周 深度体验
        [
          ['小方绘本《飞向太空》', '飞fly,高high', '', '', '', '小方绘本《月亮的味道》'],
          ['复习小方绘本《飞向太空》', '复习', '感受重和轻（拿石头vs拿气球，体验重的东西掉下来快）', '', '', ''],
          ['复习', '学习上up,下down', '', '数星球玩具1-5个，比较多少（大星球vs小星球）', '白板画火箭（三角形+长方形）', '鼓励想象太空'],
          ['复习', '复习', '', '比较高矮（高的火箭vs矮的火箭）', '《小火箭》儿歌', '鼓励想象太空'],
          ['复习', '复习fly,high,up,down', '实物比较大小：太阳（图片）最大＞地球＞月亮＞星星', '', '', '鼓励想象太空'],
          ['复习本周太空', '', '', '', '', '鼓励想象太空']
        ],
        // 第4周 跨维整合
        [
          ['学字（星、月、天、飞、高）', '', '', '', '', '晚上看月亮星星（户外）'],
          ['学字（大、小、圆）', '圆形circle,大big', '感受圆的形状（摸球、摸地球仪）', '', '', '找圆形的物品'],
          ['儿歌《飞向太空》一二三，飞上天...', '', '布书《太阳和月亮》，学习太阳白天出来、月亮晚上出来', '', '', '鼓励观察天空变化'],
          ['布书《太阳和月亮》', '', '讲述地球和月亮的区别：地球大大的、月亮小小的', '用布书粘贴分类：天上有的vs地上有的', '', '鼓励观察天空变化'],
          ['本周复习', '光light,远far', '本周复习', '本周复习', '画太空', '鼓励观察天空变化'],
          ['月度复习', '月度复习', '月度复习', '月度复习', '月度复习', '']
        ]
      ],
      summary: ['认识星空', '太阳系启蒙', '太空探索', '太空与生活']
    }
  };

  for (const cfg of monthConfig) {
    const t = themes[cfg.month];
    const weeks = [];
    const firstMonday = getFirstMonday(cfg.year, cfg.month);
    for (let w = 0; w < 4; w++) {
      const days = [];
      for (let d = 0; d < 6; d++) {
        const dayData = t.weeks[w][d];
        days.push({
          day: firstMonday + w * 7 + d,
          lang: dayData[0],
          eng: dayData[1],
          sci: dayData[2],
          math: dayData[3],
          art: dayData[4],
          social: dayData[5]
        });
      }
      weeks.push({
        stageName: stageNames[w],
        summary: t.summary[w],
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
const DATA_VERSION = 3;

function saveState() {
  const persistData = {
    version: DATA_VERSION,
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
      if (!data.version || data.version < DATA_VERSION) {
        console.log('数据版本不匹配，重新生成...', data.version, '->', DATA_VERSION);
        state.scheduleData = generateInitialData();
        state.issues = generateInitialIssues();
        state.visitCount = 1;
        state.adminPassword = data.adminPassword || 'admin123';
        saveState();
        return;
      }
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
              ${dimKeys.map(k => `
                <td class="editable ${state.isAdmin ? 'admin-mode' : ''}"
                    style="background:#fff;"
                    onclick="editCell(${wi}, 0, '${k}')"
                    data-week="${wi}" data-day="0" data-key="${k}">
                  ${week.days[0][k] || '-'}
                </td>
              `).join('')}
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
          <h3 style="color:${cfg.color};">第${wi + 1}周 · ${week.stageName} <span style="font-size:12px;font-weight:400;opacity:.7;">${getDateLabel(cfg.year, cfg.month, week.days[0].day)} ~ ${getDateLabel(cfg.year, cfg.month, week.days[5].day)}</span></h3>
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
                ${week.days.map((day, di) => `
                  <tr>
                    <td class="day-cell" style="background:${stageColor};color:${cfg.color};">${getDateLabel(cfg.year, cfg.month, day.day)}</td>
                    ${dimKeys.map(k => `
                      <td class="editable ${state.isAdmin ? 'admin-mode' : ''}"
                        onclick="editCell(${wi}, ${di}, '${k}')"
                          data-week="${wi}" data-day="${di}" data-key="${k}">
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
  const cfg2 = monthConfig.find(m => m.month === state.currentMonth); document.getElementById('cellEditLabel').textContent = `${getDateLabel(cfg2.year, cfg2.month, day.day)} · ${labelMap[key]}`;
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
