import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Plus, Search, Edit, Trash2, Users as UsersIcon, UserCheck, Shield, Settings, Eye, UserPlus, Save, X } from 'lucide-react';
import { toast } from 'sonner';

const API_BASE_URL = '/api';

function UsersEnhanced() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showDepartmentDialog, setShowDepartmentDialog] = useState(false);
  const [showUserDetailDialog, setShowUserDetailDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // 表单状态
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    full_name: '',
    phone: '',
    department: '',
    position: '',
    password: '',
    role_ids: [],
    is_active: true
  });

  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    permissions: []
  });

  const [departmentForm, setDepartmentForm] = useState({
    name: '',
    description: ''
  });

  const availablePermissions = [
    { name: 'user_manage', description: '用户管理' },
    { name: 'role_manage', description: '角色管理' },
    { name: 'department_manage', description: '部门管理' },
    { name: 'employee_manage', description: '员工管理' },
    { name: 'customer_manage', description: '客户管理' },
    { name: 'project_manage', description: '项目管理' },
    { name: 'ticket_manage', description: '工单管理' },
    { name: 'report_view', description: '报表查看' },
    { name: 'system_settings', description: '系统设置' }
  ];

  // 预设角色模板
  const roleTemplates = [
    {
      name: '客户总监',
      description: '负责客户关系管理和业务拓展',
      permissions: ['customer_manage', 'project_manage', 'report_view']
    },
    {
      name: '销售经理',
      description: '负责销售业务和客户维护',
      permissions: ['customer_manage', 'project_manage', 'ticket_manage']
    },
    {
      name: '项目经理',
      description: '负责项目管理和执行',
      permissions: ['project_manage', 'ticket_manage', 'report_view']
    },
    {
      name: '客服专员',
      description: '负责客户服务和工单处理',
      permissions: ['ticket_manage', 'customer_manage']
    },
    {
      name: '系统管理员',
      description: '负责系统管理和用户权限管理',
      permissions: ['user_manage', 'role_manage', 'department_manage', 'system_settings']
    },
    {
      name: '普通员工',
      description: '基础权限用户',
      permissions: ['report_view']
    }
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // 模拟数据，实际应该从API获取
      const mockUsers = [
        {
          id: 1,
          username: 'admin',
          email: 'admin@company.com',
          full_name: '系统管理员',
          phone: '13800138000',
          department: '技术部',
          position: '系统管理员',
          is_active: true,
          roles: [{ id: 1, name: '系统管理员' }],
          created_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 2,
          username: 'john_doe',
          email: 'john@company.com',
          full_name: '张三',
          phone: '13800138001',
          department: '销售部',
          position: '销售经理',
          is_active: true,
          roles: [{ id: 2, name: '销售经理' }],
          created_at: '2024-01-02T00:00:00Z'
        },
        {
          id: 3,
          username: 'jane_smith',
          email: 'jane@company.com',
          full_name: '李四',
          phone: '13800138002',
          department: '客服部',
          position: '客服专员',
          is_active: false,
          roles: [{ id: 3, name: '客服专员' }],
          created_at: '2024-01-03T00:00:00Z'
        }
      ];

      const mockRoles = [
        {
          id: 1,
          name: '系统管理员',
          description: '拥有系统所有权限',
          permissions: [
            { id: 1, name: 'user_manage' },
            { id: 2, name: 'role_manage' },
            { id: 3, name: 'department_manage' },
            { id: 4, name: 'system_settings' }
          ]
        },
        {
          id: 2,
          name: '销售经理',
          description: '负责销售业务管理',
          permissions: [
            { id: 5, name: 'customer_manage' },
            { id: 6, name: 'project_manage' },
            { id: 7, name: 'report_view' }
          ]
        },
        {
          id: 3,
          name: '客服专员',
          description: '负责客户服务',
          permissions: [
            { id: 8, name: 'ticket_manage' },
            { id: 9, name: 'customer_manage' }
          ]
        }
      ];

      const mockDepartments = [
        { id: 1, name: '技术部', description: '负责技术开发和维护', created_at: '2024-01-01T00:00:00Z' },
        { id: 2, name: '销售部', description: '负责销售业务', created_at: '2024-01-01T00:00:00Z' },
        { id: 3, name: '客服部', description: '负责客户服务', created_at: '2024-01-01T00:00:00Z' },
        { id: 4, name: '人事部', description: '负责人力资源管理', created_at: '2024-01-01T00:00:00Z' },
        { id: 5, name: '财务部', description: '负责财务管理', created_at: '2024-01-01T00:00:00Z' }
      ];

      setUsers(mockUsers);
      setRoles(mockRoles);
      setDepartments(mockDepartments);
    } catch (error) {
      console.error('获取数据失败:', error);
      toast.error('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      // 表单验证
      if (!userForm.username || !userForm.email || !userForm.full_name || !userForm.password) {
        toast.error('请填写必填字段');
        return;
      }

      // 模拟API调用
      const newUser = {
        id: users.length + 1,
        ...userForm,
        roles: userForm.role_ids.map(roleId => roles.find(r => r.id === roleId)).filter(Boolean),
        created_at: new Date().toISOString()
      };

      setUsers([...users, newUser]);
      setShowUserDialog(false);
      resetUserForm();
      toast.success('用户创建成功');
    } catch (error) {
      console.error('创建用户失败:', error);
      toast.error('创建用户失败');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const updatedUsers = users.map(user => 
        user.id === editingUser.id 
          ? { 
              ...user, 
              ...userForm,
              roles: userForm.role_ids.map(roleId => roles.find(r => r.id === roleId)).filter(Boolean)
            }
          : user
      );
      
      setUsers(updatedUsers);
      setShowUserDialog(false);
      setEditingUser(null);
      resetUserForm();
      toast.success('用户更新成功');
    } catch (error) {
      console.error('更新用户失败:', error);
      toast.error('更新用户失败');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('确定要删除这个用户吗？')) return;
    
    try {
      setUsers(users.filter(user => user.id !== userId));
      toast.success('用户删除成功');
    } catch (error) {
      console.error('删除用户失败:', error);
      toast.error('删除用户失败');
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      username: user.username,
      email: user.email,
      full_name: user.full_name,
      phone: user.phone || '',
      department: user.department || '',
      position: user.position || '',
      password: '',
      role_ids: user.roles?.map(role => role.id) || [],
      is_active: user.is_active
    });
    setShowUserDialog(true);
  };

  const handleToggleUserStatus = async (userId) => {
    try {
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, is_active: !user.is_active } : user
      );
      setUsers(updatedUsers);
      toast.success('用户状态更新成功');
    } catch (error) {
      console.error('更新用户状态失败:', error);
      toast.error('更新用户状态失败');
    }
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    try {
      if (!roleForm.name) {
        toast.error('请填写角色名称');
        return;
      }

      const newRole = {
        id: roles.length + 1,
        ...roleForm,
        permissions: roleForm.permissions.map(permName => ({ 
          id: Math.random(), 
          name: permName 
        }))
      };

      setRoles([...roles, newRole]);
      setShowRoleDialog(false);
      setRoleForm({ name: '', description: '', permissions: [] });
      toast.success('角色创建成功');
    } catch (error) {
      console.error('创建角色失败:', error);
      toast.error('创建角色失败');
    }
  };

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    try {
      if (!departmentForm.name) {
        toast.error('请填写部门名称');
        return;
      }

      if (editingDepartment) {
        // 更新部门
        const updatedDepartments = departments.map(dept => 
          dept.id === editingDepartment.id 
            ? { ...dept, ...departmentForm }
            : dept
        );
        setDepartments(updatedDepartments);
        toast.success('部门更新成功');
      } else {
        // 创建新部门
        const newDepartment = {
          id: departments.length + 1,
          ...departmentForm,
          created_at: new Date().toISOString()
        };
        setDepartments([...departments, newDepartment]);
        toast.success('部门创建成功');
      }

      setShowDepartmentDialog(false);
      setEditingDepartment(null);
      setDepartmentForm({ name: '', description: '' });
    } catch (error) {
      console.error('部门操作失败:', error);
      toast.error('部门操作失败');
    }
  };

  const handleEditDepartment = (department) => {
    setEditingDepartment(department);
    setDepartmentForm({
      name: department.name,
      description: department.description || ''
    });
    setShowDepartmentDialog(true);
  };

  const handleDeleteDepartment = async (departmentId) => {
    const department = departments.find(d => d.id === departmentId);
    const usersInDepartment = users.filter(user => user.department === department.name);
    
    if (usersInDepartment.length > 0) {
      toast.error(`无法删除部门：${department.name}，该部门下还有 ${usersInDepartment.length} 名员工`);
      return;
    }

    if (!confirm(`确定要删除部门"${department.name}"吗？`)) return;
    
    try {
      setDepartments(departments.filter(dept => dept.id !== departmentId));
      toast.success('部门删除成功');
    } catch (error) {
      console.error('删除部门失败:', error);
      toast.error('删除部门失败');
    }
  };

  const resetUserForm = () => {
    setUserForm({
      username: '',
      email: '',
      full_name: '',
      phone: '',
      department: '',
      position: '',
      password: '',
      role_ids: [],
      is_active: true
    });
  };

  const applyRoleTemplate = (template) => {
    setRoleForm({
      name: template.name,
      description: template.description,
      permissions: [...template.permissions]
    });
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2">加载中...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题 */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">用户管理</h1>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总用户数</CardTitle>
            <UsersIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">
              +{users.filter(u => new Date(u.created_at) > new Date(Date.now() - 30*24*60*60*1000)).length} 本月新增
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃用户</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(user => user.is_active).length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((users.filter(user => user.is_active).length / users.length) * 100)}% 活跃率
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">角色数量</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
            <p className="text-xs text-muted-foreground">
              权限管理体系
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">部门数量</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
            <p className="text-xs text-muted-foreground">
              组织架构完整
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 主要内容区域 */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList>
          <TabsTrigger value="users">用户管理</TabsTrigger>
          <TabsTrigger value="roles">角色管理</TabsTrigger>
          <TabsTrigger value="departments">部门管理</TabsTrigger>
        </TabsList>

        {/* 用户管理标签页 */}
        <TabsContent value="users" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索用户名、姓名或邮箱..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingUser(null);
                  resetUserForm();
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  新增用户
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingUser ? '编辑用户' : '新增用户'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="username">用户名 *</Label>
                      <Input
                        id="username"
                        value={userForm.username}
                        onChange={(e) => setUserForm({...userForm, username: e.target.value})}
                        required
                        disabled={editingUser} // 编辑时不允许修改用户名
                      />
                    </div>
                    <div>
                      <Label htmlFor="full_name">姓名 *</Label>
                      <Input
                        id="full_name"
                        value={userForm.full_name}
                        onChange={(e) => setUserForm({...userForm, full_name: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email">邮箱 *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">电话</Label>
                    <Input
                      id="phone"
                      value={userForm.phone}
                      onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="department">部门</Label>
                      <Select value={userForm.department} onValueChange={(value) => setUserForm({...userForm, department: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择部门" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.name}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="position">职位</Label>
                      <Input
                        id="position"
                        value={userForm.position}
                        onChange={(e) => setUserForm({...userForm, position: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="roles">角色</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {roles.map((role) => (
                        <label key={role.id} className="flex items-center space-x-2">
                          <Checkbox
                            checked={userForm.role_ids.includes(role.id)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setUserForm({
                                  ...userForm,
                                  role_ids: [...userForm.role_ids, role.id]
                                });
                              } else {
                                setUserForm({
                                  ...userForm,
                                  role_ids: userForm.role_ids.filter(id => id !== role.id)
                                });
                              }
                            }}
                          />
                          <span className="text-sm">{role.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  {!editingUser && (
                    <div>
                      <Label htmlFor="password">密码 *</Label>
                      <Input
                        id="password"
                        type="password"
                        value={userForm.password}
                        onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                        required={!editingUser}
                        placeholder={editingUser ? "留空则不修改密码" : ""}
                      />
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_active"
                      checked={userForm.is_active}
                      onCheckedChange={(checked) => setUserForm({...userForm, is_active: checked})}
                    />
                    <Label htmlFor="is_active">激活用户</Label>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowUserDialog(false)}>
                      取消
                    </Button>
                    <Button type="submit">
                      <Save className="w-4 h-4 mr-2" />
                      {editingUser ? '更新' : '创建'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>用户名</TableHead>
                  <TableHead>姓名</TableHead>
                  <TableHead>邮箱</TableHead>
                  <TableHead>部门</TableHead>
                  <TableHead>职位</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>角色</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>{user.full_name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.department}</TableCell>
                    <TableCell>{user.position}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Badge className={user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {user.is_active ? '活跃' : '停用'}
                        </Badge>
                        <Switch
                          checked={user.is_active}
                          onCheckedChange={() => handleToggleUserStatus(user.id)}
                          size="sm"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles?.map((role) => (
                          <Badge key={role.id} variant="outline" className="text-xs">
                            {role.name}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserDetailDialog(true);
                          }}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        {/* 角色管理标签页 */}
        <TabsContent value="roles" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">角色管理</h2>
            <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  新增角色
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>新增角色</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateRole} className="space-y-4">
                  {/* 预设角色模板 */}
                  <div>
                    <Label>快速创建预设角色</Label>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {roleTemplates.map((template, index) => (
                        <Button
                          key={index}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => applyRoleTemplate(template)}
                          className="text-left justify-start"
                        >
                          <UserPlus className="w-3 h-3 mr-1" />
                          {template.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="role-name">角色名称 *</Label>
                    <Input
                      id="role-name"
                      value={roleForm.name}
                      onChange={(e) => setRoleForm({...roleForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="role-description">描述</Label>
                    <Textarea
                      id="role-description"
                      value={roleForm.description}
                      onChange={(e) => setRoleForm({...roleForm, description: e.target.value})}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>权限设置</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2 p-4 border rounded-lg">
                      {availablePermissions.map((permission) => (
                        <label key={permission.name} className="flex items-center space-x-2">
                          <Checkbox
                            checked={roleForm.permissions.includes(permission.name)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setRoleForm({
                                  ...roleForm,
                                  permissions: [...roleForm.permissions, permission.name]
                                });
                              } else {
                                setRoleForm({
                                  ...roleForm,
                                  permissions: roleForm.permissions.filter(p => p !== permission.name)
                                });
                              }
                            }}
                          />
                          <span className="text-sm">{permission.description}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowRoleDialog(false)}>
                      取消
                    </Button>
                    <Button type="submit">
                      <Save className="w-4 h-4 mr-2" />
                      创建
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => (
              <Card key={role.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    {role.name}
                    <Badge variant="secondary">{role.permissions?.length || 0} 权限</Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">权限列表:</p>
                    <div className="flex flex-wrap gap-1">
                      {role.permissions?.map((permission) => (
                        <Badge key={permission.id} variant="outline" className="text-xs">
                          {availablePermissions.find(p => p.name === permission.name)?.description || permission.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button size="sm" variant="outline">
                      <Edit className="w-3 h-3 mr-1" />
                      编辑
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-3 h-3 mr-1" />
                      删除
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 部门管理标签页 */}
        <TabsContent value="departments" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">部门管理</h2>
            <Dialog open={showDepartmentDialog} onOpenChange={setShowDepartmentDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingDepartment(null);
                  setDepartmentForm({ name: '', description: '' });
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  新增部门
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingDepartment ? '编辑部门' : '新增部门'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateDepartment} className="space-y-4">
                  <div>
                    <Label htmlFor="dept-name">部门名称 *</Label>
                    <Input
                      id="dept-name"
                      value={departmentForm.name}
                      onChange={(e) => setDepartmentForm({...departmentForm, name: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="dept-description">描述</Label>
                    <Textarea
                      id="dept-description"
                      value={departmentForm.description}
                      onChange={(e) => setDepartmentForm({...departmentForm, description: e.target.value})}
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => {
                      setShowDepartmentDialog(false);
                      setEditingDepartment(null);
                      setDepartmentForm({ name: '', description: '' });
                    }}>
                      取消
                    </Button>
                    <Button type="submit">
                      <Save className="w-4 h-4 mr-2" />
                      {editingDepartment ? '更新' : '创建'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((department) => (
              <Card key={department.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    {department.name}
                    <Badge variant="secondary">
                      {users.filter(user => user.department === department.name).length} 人
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{department.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">
                      员工数量: {users.filter(user => user.department === department.name).length}
                    </p>
                    <p className="text-sm">
                      活跃员工: {users.filter(user => user.department === department.name && user.is_active).length}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      创建时间: {new Date(department.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEditDepartment(department)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      编辑
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteDepartment(department.id)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" />
                      删除
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* 用户详情对话框 */}
      <Dialog open={showUserDetailDialog} onOpenChange={setShowUserDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>用户详情</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>用户名</Label>
                  <p className="text-sm font-medium">{selectedUser.username}</p>
                </div>
                <div>
                  <Label>姓名</Label>
                  <p className="text-sm font-medium">{selectedUser.full_name}</p>
                </div>
                <div>
                  <Label>邮箱</Label>
                  <p className="text-sm font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <Label>电话</Label>
                  <p className="text-sm font-medium">{selectedUser.phone || '未设置'}</p>
                </div>
                <div>
                  <Label>部门</Label>
                  <p className="text-sm font-medium">{selectedUser.department || '未分配'}</p>
                </div>
                <div>
                  <Label>职位</Label>
                  <p className="text-sm font-medium">{selectedUser.position || '未设置'}</p>
                </div>
                <div>
                  <Label>状态</Label>
                  <Badge className={selectedUser.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                    {selectedUser.is_active ? '活跃' : '停用'}
                  </Badge>
                </div>
                <div>
                  <Label>创建时间</Label>
                  <p className="text-sm font-medium">{new Date(selectedUser.created_at).toLocaleString()}</p>
                </div>
              </div>
              <div>
                <Label>角色</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedUser.roles?.map((role) => (
                    <Badge key={role.id} variant="outline">
                      {role.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default UsersEnhanced;

