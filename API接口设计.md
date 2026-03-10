# 旅游管理系统API接口设计

## 1. 接口概述

本API接口用于旅游管理系统的景点管理，包括获取景点列表、获取单个景点详情、新增景点、更新景点和删除景点等功能。

## 2. 基础信息

- API基础路径: `/api`
- 请求方法: GET, POST, PUT, DELETE
- 响应格式: JSON
- 状态码: 200(成功), 400(请求错误), 401(未授权), 404(资源不存在), 500(服务器错误)

## 3. 接口详情

### 3.1 获取景点列表

- **接口路径**: `/api/scenic-spots`
- **请求方法**: GET
- **请求参数**:
  - `page`: 页码，默认1
  - `pageSize`: 每页数量，默认10
  - `category`: 分类（如古城古镇、自然风光、城市漫游、小众秘境）
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "list": [
        {
          "id": 1,
          "name": "雪桥",
          "description": "凤凰的桥，是路，是景，更是浪漫",
          "imageUrl": "./旅游图片/古城古镇/湖南凤凰古城/古城湖南1.jpg",
          "category": "古城古镇",
          "location": "湖南凤凰古城",
          "createdAt": "2024-03-04T12:00:00Z"
        },
        // 更多景点...
      ],
      "total": 100,
      "page": 1,
      "pageSize": 10
    }
  }
  ```

### 3.2 获取单个景点详情

- **接口路径**: `/api/scenic-spots/:id`
- **请求方法**: GET
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "id": 1,
      "name": "雪桥",
      "description": "凤凰的桥，是路，是景，更是浪漫",
      "imageUrl": "./旅游图片/古城古镇/湖南凤凰古城/古城湖南1.jpg",
      "category": "古城古镇",
      "location": "湖南凤凰古城",
      "createdAt": "2024-03-04T12:00:00Z"
    }
  }
  ```

### 3.3 新增景点

- **接口路径**: `/api/scenic-spots`
- **请求方法**: POST
- **请求体**:
  ```json
  {
    "name": "雪桥",
    "description": "凤凰的桥，是路，是景，更是浪漫",
    "imageUrl": "./旅游图片/古城古镇/湖南凤凰古城/古城湖南1.jpg",
    "category": "古城古镇",
    "location": "湖南凤凰古城"
  }
  ```
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "id": 1,
      "name": "雪桥",
      "description": "凤凰的桥，是路，是景，更是浪漫",
      "imageUrl": "./旅游图片/古城古镇/湖南凤凰古城/古城湖南1.jpg",
      "category": "古城古镇",
      "location": "湖南凤凰古城",
      "createdAt": "2024-03-04T12:00:00Z"
    }
  }
  ```

### 3.4 更新景点

- **接口路径**: `/api/scenic-spots/:id`
- **请求方法**: PUT
- **请求体**:
  ```json
  {
    "name": "雪桥（更新）",
    "description": "凤凰的桥，是路，是景，更是浪漫（更新）",
    "imageUrl": "./旅游图片/古城古镇/湖南凤凰古城/古城湖南1.jpg",
    "category": "古城古镇",
    "location": "湖南凤凰古城"
  }
  ```
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "id": 1,
      "name": "雪桥（更新）",
      "description": "凤凰的桥，是路，是景，更是浪漫（更新）",
      "imageUrl": "./旅游图片/古城古镇/湖南凤凰古城/古城湖南1.jpg",
      "category": "古城古镇",
      "location": "湖南凤凰古城",
      "createdAt": "2024-03-04T12:00:00Z",
      "updatedAt": "2024-03-04T13:00:00Z"
    }
  }
  ```

### 3.5 删除景点

- **接口路径**: `/api/scenic-spots/:id`
- **请求方法**: DELETE
- **响应示例**:
  ```json
  {
    "code": 200,
    "message": "success",
    "data": null
  }
  ```

## 4. 前端对接方案

### 4.1 前端数据获取

使用Fetch API或Axios从后端API获取数据，示例代码：

```javascript
// 获取景点列表
async function getScenicSpots(category) {
  try {
    const response = await fetch(`/api/scenic-spots?category=${category}`);
    const data = await response.json();
    return data.data.list;
  } catch (error) {
    console.error('获取景点列表失败:', error);
    return [];
  }
}

// 新增景点
async function addScenicSpot(spot) {
  try {
    const response = await fetch('/api/scenic-spots', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(spot)
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('新增景点失败:', error);
    return null;
  }
}

// 删除景点
async function deleteScenicSpot(id) {
  try {
    const response = await fetch(`/api/scenic-spots/${id}`, {
      method: 'DELETE'
    });
    const data = await response.json();
    return data.code === 200;
  } catch (error) {
    console.error('删除景点失败:', error);
    return false;
  }
}
```

### 4.2 前端渲染

使用JavaScript动态渲染景点列表，示例代码：

```javascript
// 渲染景点卡片
function renderScenicSpots(spots) {
  const container = document.querySelector('.col:last-child');
  container.innerHTML = '';
  
  spots.forEach((spot, index) => {
    const card = document.createElement('div');
    card.className = `card${index + 1} card`;
    card.innerHTML = `
      <img src="${spot.imageUrl}" alt="${spot.name}">
      <h5>${spot.name}</h5>
      <p>${spot.description}</p>
    `;
    container.appendChild(card);
  });
}

// 初始化页面
async function initPage() {
  const category = '古城古镇'; // 根据当前页面设置
  const spots = await getScenicSpots(category);
  renderScenicSpots(spots);
}

// 页面加载时初始化
window.addEventListener('DOMContentLoaded', initPage);
```

### 4.3 管理界面

创建一个管理界面，用于增删改查景点，示例代码：

```html
<div class="admin-panel">
  <h2>景点管理</h2>
  
  <!-- 新增景点表单 -->
  <form id="add-spot-form">
    <input type="text" id="name" placeholder="景点名称">
    <input type="text" id="description" placeholder="景点描述">
    <input type="text" id="imageUrl" placeholder="图片URL">
    <select id="category">
      <option value="古城古镇">古城古镇</option>
      <option value="自然风光">自然风光</option>
      <option value="城市漫游">城市漫游</option>
      <option value="小众秘境">小众秘境</option>
    </select>
    <input type="text" id="location" placeholder="景点位置">
    <button type="submit">新增景点</button>
  </form>
  
  <!-- 景点列表 -->
  <div id="spots-list">
    <!-- 动态渲染景点列表 -->
  </div>
</div>

<script>
// 新增景点表单提交
document.getElementById('add-spot-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const spot = {
    name: document.getElementById('name').value,
    description: document.getElementById('description').value,
    imageUrl: document.getElementById('imageUrl').value,
    category: document.getElementById('category').value,
    location: document.getElementById('location').value
  };
  
  const result = await addScenicSpot(spot);
  if (result) {
    alert('新增成功');
    // 重新加载景点列表
    loadSpotsList();
  } else {
    alert('新增失败');
  }
});

// 加载景点列表
async function loadSpotsList() {
  const spots = await getScenicSpots();
  const list = document.getElementById('spots-list');
  list.innerHTML = '';
  
  spots.forEach(spot => {
    const item = document.createElement('div');
    item.className = 'spot-item';
    item.innerHTML = `
      <h3>${spot.name}</h3>
      <p>${spot.description}</p>
      <img src="${spot.imageUrl}" alt="${spot.name}" width="100">
      <button onclick="deleteSpot(${spot.id})">删除</button>
    `;
    list.appendChild(item);
  });
}

// 删除景点
async function deleteSpot(id) {
  if (confirm('确定删除该景点吗？')) {
    const result = await deleteScenicSpot(id);
    if (result) {
      alert('删除成功');
      // 重新加载景点列表
      loadSpotsList();
    } else {
      alert('删除失败');
    }
  }
}

// 页面加载时初始化
window.addEventListener('DOMContentLoaded', loadSpotsList);
</script>
```

## 5. 注意事项

1. **跨域处理**: 后端需要配置CORS（跨域资源共享），允许前端域名访问API。
2. **认证授权**: 管理接口需要添加认证机制，确保只有授权用户才能进行增删改操作。
3. **错误处理**: 前端需要处理各种错误情况，如网络错误、API错误等。
4. **加载状态**: 前端需要在数据加载过程中显示加载状态，提升用户体验。
5. **图片上传**: 对于图片上传功能，后端需要提供文件上传接口，前端需要使用FormData进行提交。

## 6. 技术栈推荐

### 后端
- **语言**: Node.js, Python, Java等
- **框架**: Express, Django, Spring Boot等
- **数据库**: MySQL, PostgreSQL, MongoDB等

### 前端
- **库/框架**: Vue.js, React, Angular等
- **HTTP客户端**: Axios, Fetch API
- **状态管理**: Redux, Vuex, Pinia等
- **UI库**: Element UI, Ant Design, Bootstrap等
