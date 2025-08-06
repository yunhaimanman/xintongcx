// API基础配置
const API_BASE_URL = 'https://5001-iq4r3ltfr3kyo4o2sjb84-da0a69c5.manusvm.computer/api';

// 获取token
const getToken = () => {
  return localStorage.getItem('token');
};

// 设置token
const setToken = (token) => {
  localStorage.setItem('token', token);
};

// 移除token
const removeToken = () => {
  localStorage.removeItem('token');
};

// 获取用户信息
const getUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// 设置用户信息
const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// 移除用户信息
const removeUser = () => {
  localStorage.removeItem('user');
};

// 通用请求函数
const request = async (url, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        // Token过期，清除本地存储并跳转到登录页
        removeToken();
        removeUser();
        window.location.href = '/login';
      }
      throw new Error(data.message || '请求失败');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// 认证相关API
export const authAPI = {
  // 登录
  login: async (credentials) => {
    const data = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (data.token) {
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  },

  // 注册
  register: async (userData) => {
    return await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // 获取个人信息
  getProfile: async () => {
    return await request('/auth/profile');
  },

  // 更新个人信息
  updateProfile: async (userData) => {
    return await request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // 登出
  logout: async () => {
    try {
      await request('/auth/logout', { method: 'POST' });
    } finally {
      removeToken();
      removeUser();
    }
  },
};

// 用户管理API
export const userAPI = {
  // 获取用户列表
  getUsers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await request(`/users?${queryString}`);
  },

  // 获取单个用户
  getUser: async (id) => {
    return await request(`/users/${id}`);
  },

  // 创建用户
  createUser: async (userData) => {
    return await request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // 更新用户
  updateUser: async (id, userData) => {
    return await request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // 删除用户
  deleteUser: async (id) => {
    return await request(`/users/${id}`, {
      method: 'DELETE',
    });
  },

  // 获取角色列表
  getRoles: async () => {
    return await request('/users/roles');
  },

  // 创建角色
  createRole: async (roleData) => {
    return await request('/users/roles', {
      method: 'POST',
      body: JSON.stringify(roleData),
    });
  },

  // 获取权限列表
  getPermissions: async () => {
    return await request('/users/permissions');
  },
};

// 客户管理API
export const customerAPI = {
  // 获取客户列表
  getCustomers: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await request(`/customers?${queryString}`);
  },

  // 获取单个客户
  getCustomer: async (id) => {
    return await request(`/customers/${id}`);
  },

  // 创建客户
  createCustomer: async (customerData) => {
    return await request('/customers', {
      method: 'POST',
      body: JSON.stringify(customerData),
    });
  },

  // 更新客户
  updateCustomer: async (id, customerData) => {
    return await request(`/customers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(customerData),
    });
  },

  // 获取线索列表
  getLeads: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await request(`/customers/leads?${queryString}`);
  },

  // 创建线索
  createLead: async (leadData) => {
    return await request('/customers/leads', {
      method: 'POST',
      body: JSON.stringify(leadData),
    });
  },

  // 获取销售机会列表
  getOpportunities: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await request(`/customers/opportunities?${queryString}`);
  },

  // 创建销售机会
  createOpportunity: async (opportunityData) => {
    return await request('/customers/opportunities', {
      method: 'POST',
      body: JSON.stringify(opportunityData),
    });
  },

  // 获取客户联系人
  getCustomerContacts: async (customerId) => {
    return await request(`/customers/${customerId}/contacts`);
  },

  // 创建联系人
  createContact: async (customerId, contactData) => {
    return await request(`/customers/${customerId}/contacts`, {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },

  // 获取客户活动
  getCustomerActivities: async (customerId) => {
    return await request(`/customers/${customerId}/activities`);
  },

  // 创建活动
  createActivity: async (customerId, activityData) => {
    return await request(`/customers/${customerId}/activities`, {
      method: 'POST',
      body: JSON.stringify(activityData),
    });
  },
};

// 项目管理API
export const projectAPI = {
  // 获取项目列表
  getProjects: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await request(`/projects?${queryString}`);
  },

  // 获取单个项目
  getProject: async (id) => {
    return await request(`/projects/${id}`);
  },

  // 创建项目
  createProject: async (projectData) => {
    return await request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },

  // 更新项目
  updateProject: async (id, projectData) => {
    return await request(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  },

  // 获取项目任务
  getProjectTasks: async (projectId, params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await request(`/projects/${projectId}/tasks?${queryString}`);
  },

  // 创建任务
  createTask: async (projectId, taskData) => {
    return await request(`/projects/${projectId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  // 获取任务详情
  getTask: async (taskId) => {
    return await request(`/projects/tasks/${taskId}`);
  },

  // 更新任务
  updateTask: async (taskId, taskData) => {
    return await request(`/projects/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  },

  // 获取我的任务
  getMyTasks: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await request(`/projects/my-tasks?${queryString}`);
  },

  // 获取任务评论
  getTaskComments: async (taskId) => {
    return await request(`/projects/tasks/${taskId}/comments`);
  },

  // 创建任务评论
  createTaskComment: async (taskId, commentData) => {
    return await request(`/projects/tasks/${taskId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  },
};

// 工单管理API
export const ticketAPI = {
  // 获取工单列表
  getTickets: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await request(`/tickets?${queryString}`);
  },

  // 获取单个工单
  getTicket: async (id) => {
    return await request(`/tickets/${id}`);
  },

  // 创建工单
  createTicket: async (ticketData) => {
    return await request('/tickets', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });
  },

  // 更新工单
  updateTicket: async (id, ticketData) => {
    return await request(`/tickets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(ticketData),
    });
  },

  // 获取我的工单
  getMyTickets: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await request(`/tickets/my-tickets?${queryString}`);
  },

  // 获取工单评论
  getTicketComments: async (ticketId) => {
    return await request(`/tickets/${ticketId}/comments`);
  },

  // 创建工单评论
  createTicketComment: async (ticketId, commentData) => {
    return await request(`/tickets/${ticketId}/comments`, {
      method: 'POST',
      body: JSON.stringify(commentData),
    });
  },

  // 获取服务分类
  getCategories: async () => {
    return await request('/tickets/categories');
  },

  // 创建服务分类
  createCategory: async (categoryData) => {
    return await request('/tickets/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  },

  // 获取知识库文章
  getKnowledgeArticles: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await request(`/tickets/knowledge?${queryString}`);
  },

  // 获取知识库文章详情
  getKnowledgeArticle: async (id) => {
    return await request(`/tickets/knowledge/${id}`);
  },

  // 创建知识库文章
  createKnowledgeArticle: async (articleData) => {
    return await request('/tickets/knowledge', {
      method: 'POST',
      body: JSON.stringify(articleData),
    });
  },
};

// 导出工具函数
export { getToken, setToken, removeToken, getUser, setUser, removeUser };

