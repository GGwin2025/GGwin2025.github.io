// 页面加载完成后执行
$(document).ready(function () {
  // 查找带有data-current="true"属性的导航项
  var currentLi = $(".nav-container #nav li[data-current='true']");

  // 如果没有找到，默认选中第一个导航项
  if (currentLi.length === 0) {
    currentLi = $(".nav-container #nav li:first-child");
  }

  // 初始化slide1位置
  var navContainer = $(".nav-container");
  var slide1 = navContainer.find(".slide1");
  var slide2 = navContainer.find(".slide2");

  // 设置slide1的初始位置
  updateSlidePosition(slide1, currentLi);

  // 点击导航项时的滑动效果
  $("#nav a").on("click", function () {
    var li = $(this).parent();
    updateSlidePosition(slide1, li);
  });

  // 鼠标离开导航项时的挤压效果
  $("#nav a").on("mouseleave", function () {
    var li = $(this).parent();
    updateSlidePosition(slide2, li);
    slide2.addClass("squeeze");
    // 动画结束后隐藏slide2
    setTimeout(function () {
      slide2.css({ opacity: 0 });
    }, 300);
  });

  // 鼠标悬停导航项时的动画效果
  $("#nav a").on("mouseenter", function () {
    var li = $(this).parent();
    updateSlidePosition(slide2, li);
    slide2.css({ opacity: 1 }).removeClass("squeeze");
  });

  // 更新滑条位置的函数
  function updateSlidePosition(slide, li) {
    // 安全检查：确保所有必要的元素都存在
    if (!navContainer.length || !li.length) {
      return;
    }

    // 获取导航项的a元素
    var aElement = li.find("a");

    // 安全检查：确保a元素存在
    if (!aElement.length) {
      return;
    }

    // 获取a元素的宽度（包含padding和border）
    var aWidth = aElement.outerWidth();
    // 获取a元素的偏移量（相对于文档）
    var aOffset = aElement.offset();
    // 获取.nav-container的偏移量（相对于文档）
    var navContainerOffset = navContainer.offset();

    // 安全检查：确保偏移量存在
    if (!aOffset || !navContainerOffset) {
      return;
    }

    // 计算滑条相对于.nav-container的位置
    var slideLeft = aOffset.left - navContainerOffset.left;
    var slideTop = aOffset.top - navContainerOffset.top;

    // 设置滑条位置和大小
    slide.css({
      left: slideLeft,
      top: slideTop,
      width: aWidth,
      height: aElement.outerHeight()
    });
  }
});


// 页面加载完成后执行轮播图初始化
window.addEventListener('DOMContentLoaded', function () {
  const slides = document.querySelectorAll('.slide');
  const indicators = document.querySelectorAll('.indicator');
  const prevBtn = document.querySelector('.prev');
  const nextBtn = document.querySelector('.next');
  const container = document.querySelector('.carousel-container');

  // 检查DOM元素是否存在
  if (!slides.length || !indicators.length || !prevBtn || !nextBtn || !container) {
    console.log('轮播图DOM元素不存在，跳过轮播图初始化');
    return;
  }

  let currentIndex = 0;
  const totalSlides = slides.length;
  const AUTO_PLAY_DELAY = 2000;
  let autoPlayInterval;

  function showSlide(index) {
    // 处理边界情况：如果索引超过最后一张，回到第一张
    if (index >= totalSlides) {
      currentIndex = 0;  // 设置当前索引为0（第一张）
    }
    // 处理边界情况：如果索引小于0，跳到最后一张
    else if (index < 0) {
      currentIndex = totalSlides - 1;  // 设置当前索引为最后一张
    }
    else {
      currentIndex = index;  // 更新当前索引
    }
    slides.forEach((slide, i) => {
      // 首先移除所有轮播图的"active"类（隐藏所有图片）
      slide.classList.remove('active');

      // 如果当前遍历的索引等于要显示的索引
      if (i === currentIndex) {
        // 给这张图片添加"active"类（显示这张图片）
        slide.classList.add('active');
      }
    });
    indicators.forEach((indicator, i) => {
      // 首先移除所有指示器的"active"类（所有小圆点变暗）
      indicator.classList.remove('active');

      // 如果当前遍历的索引等于要显示的索引
      if (i === currentIndex) {
        // 给这个小圆点添加"active"类（当前小圆点变亮）
        indicator.classList.add('active');
      }
    });
  }

  function nextSlide() {
    // 显示下一张（当前索引+1）
    showSlide(currentIndex + 1);
  }

  function prevSlide() {
    // 显示上一张（当前索引-1）
    showSlide(currentIndex - 1);
  }

  function startAutoPlay() {
    // 清除之前的定时器（如果存在）
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
    }
    // 设置一个定时器，每隔AUTO_PLAY_DELAY毫秒执行一次nextSlide函数
    autoPlayInterval = setInterval(nextSlide, AUTO_PLAY_DELAY);
  }

  function stopAutoPlay() {
    // 清除自动播放定时器
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
    }
  }

  function resetAutoPlay() {
    stopAutoPlay();   // 先停止当前的自动播放
    startAutoPlay();  // 再重新开始自动播放
  }

  // 当点击"上一张"按钮时
  prevBtn.addEventListener('click', () => {
    prevSlide();        // 切换到上一张图片
    resetAutoPlay();    // 重置自动播放计时器
  });

  // 当点击"下一张"按钮时
  nextBtn.addEventListener('click', () => {
    nextSlide();        // 切换到下一张图片
    resetAutoPlay();    // 重置自动播放计时器
  });
  // 遍历所有指示器（小圆点）
  indicators.forEach((indicator, index) => {
    // 为每个小圆点添加点击事件监听器
    indicator.addEventListener('click', () => {
      // 跳转到对应索引的轮播图
      showSlide(index);
      // 重置自动播放计时器
      resetAutoPlay();
    });
  });
  // 当鼠标进入轮播图容器时
  container.addEventListener('mouseenter', () => {
    // 停止自动播放
    stopAutoPlay();
  });
  // 当鼠标离开轮播图容器时
  container.addEventListener('mouseleave', () => {
    // 重新开始自动播放
    startAutoPlay();
  });
  // 页面加载完成后，显示第一张轮播图（索引0）
  showSlide(0);

  // 开始自动播放
  startAutoPlay();
});

// 回到顶部功能
window.addEventListener('DOMContentLoaded', function () {
  // 创建回到顶部按钮
  const backToTopButton = document.createElement('div');
  backToTopButton.className = 'back-to-top';
  backToTopButton.innerHTML = '↑';
  document.body.appendChild(backToTopButton);

  // 监听滚动事件
  window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
      backToTopButton.classList.add('visible');
    } else {
      backToTopButton.classList.remove('visible');
    }
  });

  // 点击按钮回到顶部
  backToTopButton.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});

// API调用功能
// API基础URL配置
const API_BASE_URL = 'http://10.13.99.225:3000/api';
console.log('API_BASE_URL配置:', API_BASE_URL);

// 管理员审核功能
class AdminReviewManager {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // 获取待审核游记列表
  async getPendingNotes(status = 'pending', page = 1, limit = 20) {
    try {
      const response = await fetch(`${this.baseURL}/admin/notes?status=${status}&page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('获取待审核游记失败:', error);
      return { notes: [], pagination: { total: 0, pages: 0 } };
    }
  }

  // 审核单个游记
  async reviewNote(noteId, status, reviewReason = '') {
    try {
      const response = await fetch(`${this.baseURL}/admin/notes/${noteId}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: status,
          review_reason: reviewReason
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('审核游记失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 批量审核游记
  async batchReviewNotes(noteIds, status, reviewReason = '') {
    try {
      const response = await fetch(`${this.baseURL}/admin/notes/batch-review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          note_ids: noteIds,
          status: status,
          review_reason: reviewReason
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('批量审核失败:', error);
      return { success: false, error: error.message };
    }
  }

  // 获取待审核数量
  async getPendingCount() {
    try {
      const response = await fetch(`${this.baseURL}/admin/notes/pending-count`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('获取待审核数量失败:', error);
      return { count: 0 };
    }
  }
}

// 创建全局审核管理器实例
const adminReviewManager = new AdminReviewManager(); // 使用可用的后端服务器地址

// 检测后端是否可用，如果不可用则使用本地数据
let BACKEND_AVAILABLE = false;

// 将API_BASE_URL设置为全局变量，供其他页面使用
window.API_BASE_URL = API_BASE_URL;
window.BACKEND_AVAILABLE = BACKEND_AVAILABLE;

// 检测后端连接状态
async function checkBackendAvailability() {
  try {
    console.log('开始检测后端可用性，API地址:', API_BASE_URL);
    // 使用AbortController实现超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    // 检测实际可用的接口
    console.log('正在发送请求到:', `${API_BASE_URL}/places`);
    const response = await fetch(`${API_BASE_URL}/places`, {
      method: 'GET',
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    console.log('收到响应，状态码:', response.status);
    console.log('响应是否成功:', response.ok);

    if (response.ok) {
      console.log('后端服务器可用，状态码:', response.status);
      BACKEND_AVAILABLE = true;
    } else {
      console.log('后端服务器响应异常，状态码:', response.status);
      console.log('响应状态文本:', response.statusText);
      BACKEND_AVAILABLE = false;
    }
  } catch (error) {
    console.log('后端服务器不可用，错误类型:', error.name);
    console.log('后端服务器不可用，错误信息:', error.message);
    console.log('使用本地数据模式');
    BACKEND_AVAILABLE = false;
  }

  window.BACKEND_AVAILABLE = BACKEND_AVAILABLE;
  console.log('后端可用性检测结果:', BACKEND_AVAILABLE);
}

// 页面加载时检测后端状态
document.addEventListener('DOMContentLoaded', function () {
  checkBackendAvailability();
});

// 获取所有地方
async function getPlaces() {
  // 尝试直接调用后端API，不依赖检测状态
  console.log('尝试直接调用后端API...');

  try {
    console.log('开始获取地方数据，API地址:', API_BASE_URL);
    // 使用AbortController实现超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${API_BASE_URL}/places`, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    console.log('API响应状态:', response.status);

    if (!response.ok) {
      console.log('API响应异常，状态码:', response.status);
      return [];
    }

    const data = await response.json();
    console.log('获取到的地方数据:', data);
    console.log('数据长度:', data.length);

    return data;
  } catch (error) {
    console.error('获取地方列表失败:', error);
    // 发生错误时标记后端不可用
    BACKEND_AVAILABLE = false;
    window.BACKEND_AVAILABLE = BACKEND_AVAILABLE;
    return [];
  }
}

// 获取单个地方及其项目
async function getPlaceDetails(placeId) {
  try {
    const response = await fetch(`${API_BASE_URL}/${placeId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取地方详情失败:', error);
    return null;
  }
}

// 获取本地项目数据（后端不可用时使用）
function getLocalItems(type = '') {
  // 默认项目数据
  const defaultItems = [
    { id: 1, name: '浙江乌镇', category: '古城古镇', place_category: '古城古镇', image_url: './旅游图片/古城古镇/浙江乌镇/浙江乌镇.jpg', description: '江南水乡古镇' },
    { id: 2, name: '湖南凤凰古城', category: '古城古镇', place_category: '古城古镇', image_url: './旅游图片/古城古镇/湖南凤凰古城/古城湖南3.jpg', description: '湘西古城' },
    { id: 3, name: '南浔古镇', category: '古城古镇', place_category: '古城古镇', image_url: './旅游图片/古城古镇/南浔古镇/小莲庄.jpg', description: '江南古镇' },
    { id: 4, name: '九寨沟', category: '自然风光', place_category: '自然风光', image_url: './旅游图片/自然风光/四川九寨沟/自然四川1.jpg', description: '自然风景区' },
    { id: 5, name: '阳朔', category: '自然风光', place_category: '自然风光', image_url: './旅游图片/自然风光/广西阳朔/广西阳朔1.jpg', description: '桂林山水' },
    { id: 6, name: '武功山', category: '自然风光', place_category: '自然风光', image_url: './旅游图片/自然风光/江西武功山/江西武功山1.jpg', description: '高山草甸' },
    { id: 7, name: '重庆', category: '城市漫游', place_category: '城市漫游', image_url: './旅游图片/城市漫游/重庆/重庆.jpg', description: '山城重庆' },
    { id: 8, name: '上海', category: '城市漫游', place_category: '城市漫游', image_url: './旅游图片/城市漫游/上海/上海东方明珠1.jpg', description: '国际大都市' },
    { id: 9, name: '成都', category: '城市漫游', place_category: '城市漫游', image_url: './旅游图片/城市漫游/四川成都/成都.jpg', description: '天府之国' },
    { id: 10, name: '广西', category: '小众秘境', place_category: '小众秘境', image_url: './旅游图片/文艺小众/福建东山岛/东山岛🏝️_1_CCer_来自小红书网页版.jpg', description: '小众旅游地' },
    { id: 11, name: '湖北', category: '小众秘境', place_category: '小众秘境', image_url: './旅游图片/文艺小众/宁夏中卫/宁夏中卫沙坡头寺口大峡谷·南长滩古村落_1_影入尘烟_来自小红书网页版.jpg', description: '小众旅游地' },
    { id: 12, name: '云南', category: '小众秘境', place_category: '小众秘境', image_url: './旅游图片/文艺小众/云南芒市/芒市 _ 一座很适合躺平的中缅边境小城🤩_2_野生小虫子🐛_来自小红书网页版.jpg', description: '小众旅游地' }
  ];

  // 按类型筛选
  if (type) {
    return defaultItems.filter(item => item.category === type);
  }

  return defaultItems;
}

// 获取所有项目（景点/美食）
async function getItems(type = '', place_id = '') {
  // 尝试直接调用后端API，不依赖检测状态
  console.log('调用getItems函数，类型:', type, '地方ID:', place_id);
  try {
    // 使用AbortController实现超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    // 构建URL，使用/items接口
    let url = `${API_BASE_URL}/items`;
    const params = [];
    if (type) params.push(`type=${type}`);
    if (place_id) params.push(`place_id=${place_id}`);
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    console.log('API请求URL:', url);
    const response = await fetch(url, {
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    console.log('API响应状态:', response.status);
    const data = await response.json();

    // 处理图片URL，将localhost转换为实际的后端地址
    if (data && Array.isArray(data)) {
      data.forEach(item => {
        if (item.image_url) {
          // 处理localhost:3000的情况
          if (item.image_url.includes('localhost:3000')) {
            // 确保只替换localhost:3000部分，不重复添加http://
            if (item.image_url.startsWith('http://')) {
              item.image_url = item.image_url.replace('http://localhost:3000', API_BASE_URL.replace('/api', ''));
            } else {
              item.image_url = item.image_url.replace('localhost:3000', API_BASE_URL.replace('/api', ''));
            }
          }
          // 将相对路径转换为后端路径
          if (item.image_url.startsWith('./旅游图片/')) {
            item.image_url = `${API_BASE_URL.replace('/api', '')}${item.image_url.replace('./', '/')}`;
          }
        }
      });
    }

    console.log('处理后的API返回数据:', data);
    console.log('数据长度:', data.length);
    return data;
  } catch (error) {
    console.error('获取项目列表失败:', error);
    // 发生错误时使用本地数据
    return getLocalItems(type);
  }
}

// 获取单个项目详情
async function getItemDetails(itemId) {
  try {
    const response = await fetch(`${API_BASE_URL}/items/${itemId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取项目详情失败:', error);
    return null;
  }
}

// 用户登录
async function login(username, password) {
  // 如果后端不可用，使用本地登录
  if (!BACKEND_AVAILABLE) {
    console.log('后端不可用，使用本地登录');
    // 模拟登录成功
    return {
      success: true,
      user: {
        id: 1,
        username: username,
        nickname: username
      }
    };
  }

  try {
    // 使用AbortController实现超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error('登录失败');
    }
  } catch (error) {
    console.error('登录失败:', error);
    // 发生错误时标记后端不可用
    BACKEND_AVAILABLE = false;
    window.BACKEND_AVAILABLE = BACKEND_AVAILABLE;
    throw error;
  }
}

// 收藏项目
async function addFavorite(userId, itemId) {
  // 如果后端不可用，使用本地收藏
  if (!BACKEND_AVAILABLE) {
    console.log('后端不可用，使用本地收藏');
    return { success: true };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/favorites`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ user_id: userId, item_id: itemId })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('收藏项目失败:', error);
    return null;
  }
}

// 获取用户收藏
async function getUserFavorites(userId) {
  // 如果后端不可用，返回空数组
  if (!BACKEND_AVAILABLE) {
    console.log('后端不可用，返回空收藏列表');
    return [];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/favorites`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('获取用户收藏失败:', error);
    return [];
  }
}

// 渲染地方数据到首页
async function renderPlaces() {
  let places = await getPlaces();
  console.log('加载的地方数据:', places);

  // 找到首页的图片展示区域
  const picsContainer = document.querySelector('.deco>.pics');
  if (picsContainer) {
    // 清空现有内容
    picsContainer.innerHTML = '';

    // 默认地方数据，当后端数据不足时使用
    const defaultPlaces = [
      { name: '浙江乌镇', category: '古城古镇', imgSrc: './旅游图片/古城古镇/浙江乌镇/浙江乌镇.jpg', pageUrl: './古城古镇网页.html#浙江乌镇' },
      { name: '湖南凤凰古城', category: '古城古镇', imgSrc: './旅游图片/古城古镇/湖南凤凰古城/古城湖南3.jpg', pageUrl: './古城古镇网页.html#湖南凤凰古城' },
      { name: '南浔古镇', category: '古城古镇', imgSrc: './旅游图片/古城古镇/南浔古镇/小莲庄.jpg', pageUrl: './古城古镇网页.html#南浔古镇' },
      { name: '四川九寨沟', category: '自然风光', imgSrc: './旅游图片/自然风光/四川九寨沟/自然四川1.jpg', pageUrl: './自然风光网页.html#四川九寨沟' },
      { name: '广西阳朔', category: '自然风光', imgSrc: './旅游图片/自然风光/广西阳朔/广西阳朔1.jpg', pageUrl: './自然风光网页.html#广西阳朔' },
      { name: '江西武功山', category: '自然风光', imgSrc: './旅游图片/自然风光/江西武功山/江西武功山1.jpg', pageUrl: './自然风光网页.html#江西武功山' }
    ];

    // 确保有至少6个地方数据
    if (places.length < 6) {
      // 用默认数据填充
      const remainingCount = 6 - places.length;
      for (let i = 0; i < remainingCount; i++) {
        places.push(defaultPlaces[places.length]);
      }
    }

    // 只使用前6个地方
    places = places.slice(0, 6);

    // 遍历地方数据，创建图片卡片
    places.forEach((place, index) => {
      const li = document.createElement('li');
      // 设置特殊样式（与现有布局匹配）
      if (index === 0 || index === 5) {
        li.style.width = '630px';
      }
      if (index === 0 || index === 1 || index === 2) {
        li.style.marginBottom = '0px';
      }
      if (index === 3 || index === 4 || index === 5) {
        li.style.marginTop = '0px';
        li.style.marginBottom = '30px';
      }
      if (index === 0 || index === 3) {
        li.style.marginLeft = '30px';
      }

      // 创建链接和图片
      const a = document.createElement('a');
      // 根据地方名称生成跳转链接和正确的锚点
      let pageUrl = '#';
      let anchorId = '';

      // 根据地名判断跳转链接和锚点ID
      if (place.name.includes('乌镇')) {
        pageUrl = './古城古镇网页.html#浙江乌镇';
        anchorId = '浙江乌镇';
      } else if (place.name.includes('凤凰')) {
        pageUrl = './古城古镇网页.html#湖南凤凰古城';
        anchorId = '湖南凤凰古城';
      } else if (place.name.includes('南浔')) {
        pageUrl = './古城古镇网页.html#南浔古镇';
        anchorId = '南浔古镇';
      } else if (place.name.includes('九寨沟')) {
        pageUrl = './自然风光网页.html#四川九寨沟';
        anchorId = '四川九寨沟';
      } else if (place.name.includes('阳朔')) {
        pageUrl = './自然风光网页.html#广西阳朔';
        anchorId = '广西阳朔';
      } else if (place.name.includes('武功山')) {
        pageUrl = './自然风光网页.html#江西武功山';
        anchorId = '江西武功山';
      } else if (place.name.includes('上海') || place.name.includes('东方明珠')) {
        pageUrl = './城市漫游网页.html#上海';
        anchorId = '上海';
      } else if (place.name.includes('重庆')) {
        pageUrl = './城市漫游网页.html#重庆';
        anchorId = '重庆';
      } else if (place.name.includes('成都')) {
        pageUrl = './城市漫游网页.html#成都';
        anchorId = '成都';
      } else if (place.name.includes('黄石') || place.name.includes('大峡谷')) {
        pageUrl = './小众秘境.html#黄石大峡谷';
        anchorId = '黄石大峡谷';
      } else if (place.name.includes('凤山')) {
        pageUrl = './小众秘境.html#广西风山';
        anchorId = '广西风山';
      } else if (place.name.includes('西双版纳')) {
        pageUrl = './小众秘境.html#西双版纳';
        anchorId = '西双版纳';
      } else if (place.category) {
        // 根据分类设置默认跳转
        if (place.category.includes('古城古镇')) {
          pageUrl = './古城古镇网页.html';
        } else if (place.category.includes('自然风光')) {
          pageUrl = './自然风光网页.html';
        } else if (place.category.includes('城市漫游')) {
          pageUrl = './城市漫游网页.html';
        } else if (place.category.includes('小众秘境')) {
          pageUrl = './小众秘境.html';
        }
      }
      a.href = pageUrl;

      // 创建图片元素
      const img = document.createElement('img');
      // 使用地方的imgSrc，如果没有则使用默认图片
      let imgSrc = place.imgSrc;
      if (!imgSrc) {
        if (place.name.includes('乌镇')) {
          imgSrc = './旅游图片/古城古镇/浙江乌镇/浙江乌镇.jpg';
        } else if (place.name.includes('凤凰')) {
          imgSrc = './旅游图片/古城古镇/湖南凤凰古城/古城湖南1.jpg';
        } else if (place.name.includes('南浔')) {
          imgSrc = './旅游图片/古城古镇/南浔古镇/小莲庄.jpg';
        } else if (place.name.includes('九寨沟')) {
          imgSrc = './旅游图片/自然风光/四川九寨沟/自然四川1.jpg';
        } else if (place.name.includes('阳朔')) {
          imgSrc = './旅游图片/自然风光/广西阳朔/广西阳朔1.jpg';
        } else if (place.name.includes('武功山')) {
          imgSrc = './旅游图片/自然风光/江西武功山/江西武功山1.jpg';
        } else if (place.name.includes('重庆')) {
          imgSrc = './旅游图片/城市漫游/重庆/重庆.jpg';
        } else if (place.name.includes('青岛')) {
          imgSrc = './旅游图片/城市漫游/山东青岛/青岛1.jpg';
        } else if (place.name.includes('成都')) {
          imgSrc = './旅游图片/城市漫游/四川成都/成都.jpg';
        } else if (place.name.includes('东山岛')) {
          imgSrc = './旅游图片/文艺小众/福建东山岛/东山岛🏝️_1_CCer_来自小红书网页版.jpg';
        } else if (place.name.includes('中卫')) {
          imgSrc = './旅游图片/文艺小众/宁夏中卫/宁夏中卫沙坡头寺口大峡谷·南长滩古村落_1_影入尘烟_来自小红书网页版.jpg';
        } else if (place.name.includes('芒市')) {
          imgSrc = './旅游图片/文艺小众/云南芒市/芒市 _ 一座很适合躺平的中缅边境小城🤩_2_野生小虫子🐛_来自小红书网页版.jpg';
        } else {
          imgSrc = './旅游图片/首页轮播图/轮播图1青春旅游.jpg';
        }
      }
      img.src = imgSrc;
      img.alt = place.name;

      // 创建文字描述
      const span = document.createElement('span');
      span.textContent = place.name;

      // 组装元素
      a.appendChild(img);
      a.appendChild(span);
      li.appendChild(a);
      picsContainer.appendChild(li);
    });
  }
}

// 渲染景点数据到对应页面
async function renderAttractions() {
  // 检查当前页面是否为城市漫游网页.html、古城古镇网页.html、小众秘境.html或自然风光网页.html
  // 如果是，则跳过，因为这些页面有自己的渲染逻辑
  const pagePath = window.location.pathname;
  if (pagePath.includes('城市漫游网页.html') || pagePath.includes('古城古镇网页.html') || pagePath.includes('小众秘境.html') || pagePath.includes('自然风光网页.html')) {
    console.log('跳过该页面的渲染，使用页面内的渲染逻辑');
    return;
  }

  const attractions = await getItems('attraction');
  console.log('加载的景点数据:', attractions);

  // 根据当前页面确定分类
  let category = '';

  if (pagePath.includes('自然风光')) {
    category = '自然风光';
  } else if (pagePath.includes('小众秘境')) {
    category = '小众秘境';
  }

  if (category) {
    // 找到页面的景点容器
    const container = document.querySelector('.container');
    if (container) {
      // 清空现有内容
      container.innerHTML = '';

      // 过滤出对应分类的景点
      const filteredAttractions = attractions.filter(item => {
        return item.place_category && item.place_category.includes(category);
      });

      // 遍历景点数据，创建卡片
      filteredAttractions.forEach((attraction, index) => {
        const card = document.createElement('div');
        card.className = 'card';

        // 设置卡片样式
        card.style.setProperty('--clr', getRandomColor());

        // 创建图片容器
        const imgBx = document.createElement('div');
        imgBx.className = 'imgBx';

        // 创建图片
        const img = document.createElement('img');
        // 使用默认图片，实际项目中应该使用后端返回的图片URL
        let imgSrc = '';
        if (attraction.place_name.includes('乌镇')) {
          imgSrc = './旅游图片/古城古镇/浙江乌镇/浙江乌镇.jpg';
        } else if (attraction.place_name.includes('凤凰')) {
          imgSrc = './旅游图片/古城古镇/湖南凤凰古城/古城湖南1.jpg';
        } else if (attraction.place_name.includes('九寨沟')) {
          imgSrc = './旅游图片/自然风光/四川九寨沟/自然四川1.jpg';
        } else if (attraction.place_name.includes('阳朔')) {
          imgSrc = './旅游图片/自然风光/广西阳朔/广西阳朔1.jpg';
        } else if (attraction.place_name.includes('重庆')) {
          imgSrc = './旅游图片/城市漫游/重庆/重庆.jpg';
        } else if (attraction.place_name.includes('青岛')) {
          imgSrc = './旅游图片/城市漫游/山东青岛/青岛1.jpg';
        } else if (attraction.place_name.includes('成都')) {
          imgSrc = './旅游图片/城市漫游/四川成都/成都.jpg';
        } else if (attraction.place_name.includes('东山岛')) {
          imgSrc = './旅游图片/文艺小众/福建东山岛/东山岛🏝️_1_CCer_来自小红书网页版.jpg';
        } else if (attraction.place_name.includes('中卫')) {
          imgSrc = './旅游图片/文艺小众/宁夏中卫/宁夏中卫沙坡头寺口大峡谷·南长滩古村落_1_影入尘烟_来自小红书网页版.jpg';
        } else if (attraction.place_name.includes('芒市')) {
          imgSrc = './旅游图片/文艺小众/云南芒市/芒市 _ 一座很适合躺平的中缅边境小城🤩_2_野生小虫子🐛_来自小红书网页版.jpg';
        } else {
          imgSrc = './旅游图片/首页轮播图/轮播图1青春旅游.jpg';
        }
        img.src = imgSrc;
        img.alt = attraction.name;

        // 创建内容容器
        const content = document.createElement('div');
        content.className = 'content';

        // 创建标题
        const h2 = document.createElement('h2');
        h2.textContent = attraction.name;

        // 创建描述
        const p = document.createElement('p');
        p.textContent = attraction.description;

        // 创建标签
        const tagsContainer = document.createElement('div');
        tagsContainer.style.display = 'flex';
        tagsContainer.style.flexWrap = 'wrap';
        tagsContainer.style.gap = '8px';
        tagsContainer.style.marginTop = '10px';

        attraction.tags.forEach(tag => {
          const tagSpan = document.createElement('span');
          tagSpan.textContent = tag;
          tagSpan.style.backgroundColor = 'rgba(97, 196, 47, 0.1)';
          tagSpan.style.color = '#61c42f';
          tagSpan.style.padding = '4px 12px';
          tagSpan.style.borderRadius = '16px';
          tagSpan.style.fontSize = '12px';
          tagsContainer.appendChild(tagSpan);
        });

        // 创建链接
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = '了解更多';

        // 组装元素
        imgBx.appendChild(img);
        content.appendChild(h2);
        content.appendChild(p);
        content.appendChild(tagsContainer);
        content.appendChild(a);
        card.appendChild(imgBx);
        card.appendChild(content);
        container.appendChild(card);
      });
    }
  }
}

// 生成随机颜色
function getRandomColor() {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff', '#5f27cd'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// 页面加载时尝试加载数据
window.addEventListener('DOMContentLoaded', function () {
  // 渲染景点数据到对应页面
  renderAttractions();

  // 初始化收藏按钮
  initFavoriteButtons();

  // 如果是我的页面，渲染收藏的卡片
  if (window.location.pathname.includes('我的.html')) {
    renderFavorites();
  }
});

// 用户认证功能
// 检查用户登录状态
function checkLoginStatus() {
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    try {
      const userInfo = JSON.parse(currentUser);
      // 如果是对象，传递整个对象；否则传递字符串
      if (typeof userInfo === 'object') {
        showUserProfile(userInfo);
      } else {
        showUserProfile(currentUser);
      }
    } catch (error) {
      // 如果解析失败，使用本地存储版本
      showUserProfile(currentUser);
    }
  } else {
    showLoginForm();
  }
}

// 显示登录表单
function showLoginForm() {
  const loginSection = document.getElementById('login-section');
  const userProfile = document.getElementById('user-profile');
  const userAuthContainer = document.querySelector('.user-auth-container');

  if (loginSection) loginSection.style.display = 'block';
  if (userProfile) userProfile.style.display = 'none';
  if (userAuthContainer) userAuthContainer.classList.add('login-mode');
}

// 显示用户个人资料
function showUserProfile(userOrUsername) {
  const loginSection = document.getElementById('login-section');
  const userProfile = document.getElementById('user-profile');
  const currentUserElement = document.getElementById('current-user');
  const userAuthContainer = document.querySelector('.user-auth-container');
  const currentNicknameElement = document.getElementById('current-nickname');
  const profileAvatarElement = document.getElementById('profile-avatar');
  const profileAvatarInitialElement = document.getElementById('profile-avatar-initial');

  if (loginSection) loginSection.style.display = 'none';
  if (userProfile) userProfile.style.display = 'block';
  if (userAuthContainer) {
    userAuthContainer.classList.remove('login-mode');
    // 直接设置样式，确保宽度正确
    userAuthContainer.style.maxWidth = '1600px';
    userAuthContainer.style.width = '100%';
    userAuthContainer.style.margin = '50px auto';
  }
  if (userProfile) {
    userProfile.style.maxWidth = '1600px';
    userProfile.style.width = '100%';
    userProfile.style.margin = '0 auto';
  }

  // 判断是对象还是字符串
  let username, nickname, avatar;
  if (typeof userOrUsername === 'object') {
    username = userOrUsername.username || userOrUsername.name || '用户';
    nickname = userOrUsername.nickname;
    avatar = userOrUsername.avatar;
  } else {
    username = userOrUsername;
    nickname = null;
    avatar = null;
  }

  if (currentUserElement) currentUserElement.textContent = username;

  if (currentNicknameElement) {
    currentNicknameElement.textContent = nickname || '未设置昵称';
  }

  // 设置头像
  if (profileAvatarElement && profileAvatarInitialElement) {
    if (avatar && avatar.trim() !== '') {
      // 如果有有效的头像 URL，显示图片
      profileAvatarElement.innerHTML = `<img src="${avatar}" alt="头像" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">`;
      // 添加一个备用的首字母显示
      profileAvatarElement.innerHTML += `<span style="display: none; width: 100%; height: 100%; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; justify-content: center; align-items: center; font-size: 40px; font-weight: 600;">${(nickname || username).charAt(0).toUpperCase()}</span>`;
    } else {
      // 没有头像，显示首字母
      const initial = nickname ? nickname.charAt(0) : username.charAt(0).toUpperCase();
      profileAvatarInitialElement.textContent = initial;
    }
  }

  // 渲染用户的收藏
  renderFavorites();
}

// 登录
function login(username, password) {
  // 从本地存储获取用户数据
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  // 查找用户
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // 保存当前用户
    localStorage.setItem('currentUser', username);
    showUserProfile(username);
  } else {
    alert('用户名或密码错误');
  }
}

// 注册
function register(username, password) {
  if (!username || !password) {
    alert('请输入用户名和密码');
    return;
  }

  // 从本地存储获取用户数据
  const users = JSON.parse(localStorage.getItem('users') || '[]');

  // 检查用户名是否已存在
  if (users.some(u => u.username === username)) {
    alert('用户名已存在');
    return;
  }

  // 添加新用户
  users.push({ username, password });
  localStorage.setItem('users', JSON.stringify(users));

  // 自动登录
  localStorage.setItem('currentUser', username);
  showUserProfile(username);
}

// 退出登录
function logout() {
  localStorage.removeItem('currentUser');
  showLoginForm();
}

// 收藏功能
// 从本地存储获取收藏数据
function getFavorites() {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) return [];

  let userId;
  try {
    const userInfo = JSON.parse(currentUser);
    userId = userInfo.id || userInfo.userId || userInfo.username;
  } catch (error) {
    userId = currentUser;
  }

  const userFavorites = localStorage.getItem(`favorites_${userId}`);
  return userFavorites ? JSON.parse(userFavorites) : [];
}

// 保存收藏数据到本地存储
function saveFavorites(favorites) {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) return;

  let userId;
  try {
    const userInfo = JSON.parse(currentUser);
    userId = userInfo.id || userInfo.userId || userInfo.username;
  } catch (error) {
    userId = currentUser;
  }

  localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
}

// 从后端同步收藏数据
async function syncFavorites() {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) return;

  try {
    const userInfo = JSON.parse(currentUser);
    const userId = userInfo.id || userInfo.userId;

    // 从后端获取收藏数据
    const backendFavorites = await getUserFavorites(userId);

    if (backendFavorites && backendFavorites.length > 0) {
      // 将后端数据转换为本地存储格式
      const localFavorites = backendFavorites.map(item => ({
        id: item.id,
        name: item.name,
        image: item.image,
        description: item.description,
        category: item.category,
        pageUrl: ''
      }));

      // 保存到本地存储
      saveFavorites(localFavorites);
    }
  } catch (error) {
    console.error('同步收藏数据失败:', error);
  }
}

// 检查项目是否已收藏
function isFavorited(itemId) {
  const favorites = getFavorites();
  return favorites.some(item => item.id === itemId);
}

// 切换收藏状态
async function toggleFavorite(item) {
  let favorites = getFavorites();
  const index = favorites.findIndex(fav => fav.id === item.id);

  if (index > -1) {
    // 已收藏，取消收藏
    favorites.splice(index, 1);
    // 调用后端取消收藏API
    if (BACKEND_AVAILABLE) {
      const currentUser = localStorage.getItem('currentUser');
      let userId;
      try {
        const userInfo = JSON.parse(currentUser);
        userId = userInfo.id || userInfo.userId || userInfo.username;
      } catch (error) {
        userId = currentUser;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/favorites`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_id: userId, item_id: item.id })
        });
        await response.json();
      } catch (error) {
        console.error('取消收藏失败:', error);
      }
    }
  } else {
    // 未收藏，添加收藏
    favorites.push(item);
    // 调用后端添加收藏API
    if (BACKEND_AVAILABLE) {
      const currentUser = localStorage.getItem('currentUser');
      let userId;
      try {
        const userInfo = JSON.parse(currentUser);
        userId = userInfo.id || userInfo.userId || userInfo.username;
      } catch (error) {
        userId = currentUser;
      }
      try {
        await addFavorite(userId, item.id);
      } catch (error) {
        console.error('添加收藏失败:', error);
      }
    }
  }

  saveFavorites(favorites);
  return index === -1; // 返回是否为收藏操作
}

// 初始化收藏按钮
function initFavoriteButtons() {
  const buttons = document.querySelectorAll('.favorite-btn');

  buttons.forEach(button => {
    const itemId = button.getAttribute('data-id');
    if (itemId && isFavorited(itemId)) {
      button.classList.add('favorited');
      button.textContent = '★';
    }

    button.addEventListener('click', async function () {
      // 检查用户是否登录
      const currentUser = localStorage.getItem('currentUser');
      if (!currentUser) {
        alert('请先登录后再收藏');
        window.location.href = './我的.html';
        return;
      }

      const itemId = this.getAttribute('data-id');
      const itemName = this.getAttribute('data-name');
      const itemImage = this.getAttribute('data-image');
      const itemDescription = this.getAttribute('data-description');

      // 根据卡片ID推断页面路径
      let pageUrl = '';
      let category = '';

      if (itemId.includes('chongqing-') || itemId.includes('shanghai-') || itemId.includes('chengdu-')) {
        category = '城市漫游';
        pageUrl = './城市漫游网页.html';
      } else if (itemId.includes('fenghuang-') || itemId.includes('wuzhen-')) {
        category = '古城古镇';
        pageUrl = './古城古镇网页.html';
      } else if (itemId.includes('jiuzhaigou-') || itemId.includes('yangshuo-') || itemId.includes('wugongshan-')) {
        category = '自然风光';
        pageUrl = './自然风光网页.html';
      } else if (itemId.includes('ganzi-') || itemId.includes('guangxi-')) {
        category = '小众秘境';
        pageUrl = './小众秘境.html';
      }

      const item = {
        id: itemId,
        name: itemName,
        image: itemImage,
        description: itemDescription,
        category: category,
        pageUrl: pageUrl
      };

      const isNowFavorited = await toggleFavorite(item);

      if (isNowFavorited) {
        this.classList.add('favorited');
        this.textContent = '★';
      } else {
        this.classList.remove('favorited');
        this.textContent = '☆';
      }
    });
  });
}

// 渲染已收藏的卡片到我的页面
function renderFavorites() {
  const favorites = getFavorites();
  const container = document.querySelector('.favorites-container');

  if (!container) return;

  // 清空容器
  container.innerHTML = '';

  if (favorites.length === 0) {
    container.innerHTML = '<div class="empty-notes"><p>还没有收藏任何内容</p></div>';
    return;
  }

  // 创建收藏卡片网格
  const grid = document.createElement('div');
  grid.className = 'favorites-grid';
  grid.style.gap = '20px';
  grid.style.padding = '20px';

  // 创建style元素添加响应式样式
  const style = document.createElement('style');
  style.textContent = `
    .favorites-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      max-width: 1600px;
      margin: 0 auto;
      width: 100%;
    }
    @media (min-width: 1600px) {
      .favorites-grid {
        grid-template-columns: repeat(5, 1fr);
      }
    }
    @media (min-width: 1300px) and (max-width: 1599px) {
      .favorites-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }
    @media (min-width: 992px) and (max-width: 1299px) {
      .favorites-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
    @media (min-width: 600px) and (max-width: 991px) {
      .favorites-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
    @media (max-width: 599px) {
      .favorites-grid {
        grid-template-columns: repeat(1, 1fr);
      }
    }
  `;
  document.head.appendChild(style);

  favorites.forEach(item => {
    const card = document.createElement('div');
    card.className = 'favorite-card';

    // 根据分类设置页面链接
    let viewUrl = item.pageUrl;

    // 如果pageUrl为空，根据卡片ID推断页面路径
    if (!viewUrl && item.id) {
      if (item.id.includes('chongqing-') || item.id.includes('shanghai-') || item.id.includes('chengdu-')) {
        viewUrl = './城市漫游网页.html';
      } else if (item.id.includes('fenghuang-') || item.id.includes('wuzhen-')) {
        viewUrl = './古城古镇网页.html';
      } else if (item.id.includes('jiuzhaigou-') || item.id.includes('yangshuo-') || item.id.includes('wugongshan-')) {
        viewUrl = './自然风光网页.html';
      } else if (item.id.includes('ganzi-') || item.id.includes('guangxi-')) {
        viewUrl = './小众秘境.html';
      } else {
        viewUrl = './网页.html';
      }
    }

    // 处理图片URL
    let imageUrl = item.image || '';
    if (imageUrl) {
      // 替换旧的后端地址
      if (imageUrl.startsWith('http://10.14.33.225:3000')) {
        imageUrl = imageUrl.replace('http://10.14.33.225:3000', API_BASE_URL.replace('/api', ''));
      } else if (imageUrl.startsWith('http://localhost:3000')) {
        imageUrl = imageUrl.replace('http://localhost:3000', API_BASE_URL.replace('/api', ''));
      } else if (imageUrl.startsWith('http://10.13.99.225:3000')) {
        imageUrl = imageUrl.replace('http://10.13.99.225:3000', API_BASE_URL.replace('/api', ''));
      } else if (imageUrl.startsWith('/')) {
        imageUrl = API_BASE_URL.replace('/api', '') + imageUrl;
      }

      // 确保图片URL使用正确的后端地址
      if (imageUrl.includes('localhost:3000')) {
        imageUrl = imageUrl.replace('localhost:3000', '10.13.99.225:3000');
      }
    }

    // 构建锚点链接，跳转到对应卡片的精确位置
    let anchorLink = viewUrl;

    // 根据卡片ID构建精确的锚点
    if (item.id) {
      // 城市漫游卡片
      if (item.id.includes('chongqing-')) {
        anchorLink = `${viewUrl}#重庆`;
      } else if (item.id.includes('shanghai-')) {
        anchorLink = `${viewUrl}#上海`;
      } else if (item.id.includes('chengdu-')) {
        anchorLink = `${viewUrl}#成都`;
      }
      // 古城古镇卡片
      else if (item.id.includes('fenghuang-')) {
        anchorLink = `${viewUrl}#湖南凤凰古城`;
      } else if (item.id.includes('wuzhen-')) {
        anchorLink = `${viewUrl}#浙江乌镇`;
      } else if (item.id.includes('nanxun-')) {
        anchorLink = `${viewUrl}#南浔古镇`;
      }
      // 自然风光卡片
      else if (item.id.includes('jiuzhaigou-')) {
        anchorLink = `${viewUrl}#四川九寨沟`;
      } else if (item.id.includes('yangshuo-')) {
        anchorLink = `${viewUrl}#广西阳朔`;
      } else if (item.id.includes('wugongshan-')) {
        anchorLink = `${viewUrl}#江西武功山`;
      }
      // 小众秘境卡片
      else if (item.id.includes('ganzi-')) {
        anchorLink = `${viewUrl}#广西风山`;
      } else if (item.id.includes('guangxi-')) {
        anchorLink = `${viewUrl}#西双版纳`;
      } else if (item.id.includes('huangshi-')) {
        anchorLink = `${viewUrl}#黄石大峡谷`;
      }
    }

    card.innerHTML = `
      <img src="${imageUrl || './img/default.jpg'}" alt="${item.name}" style="width: 100%; height: 160px; object-fit: cover; border-radius: 8px 8px 0 0;">
      <div class="card-content" style="padding: 16px;">
        <h3 style="font-size: 16px; margin-bottom: 10px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</h3>
        <p style="font-size: 14px; margin-bottom: 16px; line-height: 1.4; height: 50px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${item.description}</p>
        <div class="card-buttons" style="display: flex; gap: 10px;">
          <button class="view-btn" data-url="${anchorLink}" style="flex: 1; padding: 8px 12px; font-size: 14px; background-color: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer;">查看</button>
          <button class="remove-btn" data-id="${item.id}" style="flex: 1; padding: 8px 12px; font-size: 14px; background-color: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer;">移除</button>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  container.appendChild(grid);

  // 添加查看按钮的事件监听
  document.querySelectorAll('.view-btn').forEach(button => {
    button.addEventListener('click', function () {
      const url = this.getAttribute('data-url');
      if (url) {
        window.location.href = url;
      }
    });
  });

  // 添加移除收藏的事件监听
  document.querySelectorAll('.remove-btn').forEach(button => {
    button.addEventListener('click', function () {
      const itemId = this.getAttribute('data-id');
      let favorites = getFavorites();
      favorites = favorites.filter(item => item.id !== itemId);
      saveFavorites(favorites);
      renderFavorites(); // 重新渲染收藏列表
    });
  });
}
