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
import { Plus, Search, Edit, Trash2, Users as UsersIcon, UserCheck, Shield, Settings } from 'lucide-react';

const API_BASE_URL = '/api';

function Users() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showDepartmentDialog, setShowDepartmentDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // 表单状态
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    full_name: '',
    phone: '',
    department: '',
    position: '',
    password: ''
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

      const [usersRes, rolesRes, departmentsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/users`, { headers }),
        fetch(`${API_BASE_URL}/users/roles`, { headers }),
        fetch(`${API_BASE_URL}/users/departments`, { headers })
      ]);

      const usersData = await usersRes.json();
      const rolesData = await rolesRes.json();
      const departmentsData = await departmentsRes.json();

      setUsers(usersData.users || []);
      setRoles(rolesData.roles || []);
      setDepartments(departmentsData.departments || []);
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userForm)
      });

      if (response.ok) {
        setShowUserDialog(false);
        setUserForm({
          username: '',
          email: '',
          full_name: '',
          phone: '',
          department: '',
          position: '',
          password: ''
        });
        fetchData();
      }
    } catch (error) {
      console.error('创建用户失败:', error);
    }
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/roles`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(roleForm)
      });

      if (response.ok) {
        setShowRoleDialog(false);
        setRoleForm({
          name: '',
          description: '',
          permissions: []
        });
        fetchData();
      }
    } catch (error) {
      console.error('创建角色失败:', error);
    }
  };

  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/departments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(departmentForm)
      });

      if (response.ok) {
        setShowDepartmentDialog(false);
        setDepartmentForm({
          name: '',
          description: ''
        });
        fetchData();
      }
    } catch (error) {
      console.error('创建部门失败:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('确定要删除这个用户吗？')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('删除用户失败:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">加载中...</div>;
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
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃用户</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(user => user.is_active).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">角色数量</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roles.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">部门数量</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departments.length}</div>
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
                placeholder="搜索用户..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  新增用户
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新增用户</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="username">用户名 *</Label>
                      <Input
                        id="username"
                        value={userForm.username}
                        onChange={(e) => setUserForm({...userForm, username: e.target.value})}
                        required
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
                    <Label htmlFor="password">密码 *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={userForm.password}
                      onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                      required
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowUserDialog(false)}>
                      取消
                    </Button>
                    <Button type="submit">创建</Button>
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
                      <Badge className={user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                        {user.is_active ? '活跃' : '停用'}
                      </Badge>
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
                        <Button size="sm" variant="outline">
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
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>新增角色</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateRole} className="space-y-4">
                  {/* 预设角色模板 */}
                  <div>
                    <Label>快速创建预设角色</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setRoleForm({
                          name: '客户总监',
                          description: '负责客户关系管理和业务拓展',
                          permissions: ['customer_manage', 'project_manage', 'report_view']
                        })}
                      >
                        客户总监
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setRoleForm({
                          name: '销售经理',
                          description: '负责销售业务和客户维护',
                          permissions: ['customer_manage', 'project_manage', 'ticket_manage']
                        })}
                      >
                        销售经理
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setRoleForm({
                          name: '项目经理',
                          description: '负责项目管理和执行',
                          permissions: ['project_manage', 'ticket_manage', 'report_view']
                        })}
                      >
                        项目经理
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setRoleForm({
                          name: '客服专员',
                          description: '负责客户服务和工单处理',
                          permissions: ['ticket_manage', 'customer_manage']
                        })}
                      >
                        客服专员
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setRoleForm({
                          name: '系统管理员',
                          description: '负责系统管理和用户权限管理',
                          permissions: ['user_manage', 'role_manage', 'department_manage', 'system_settings']
                        })}
                      >
                        系统管理员
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setRoleForm({
                          name: '普通员工',
                          description: '基础权限用户',
                          permissions: ['report_view']
                        })}
                      >
                        普通员工
                      </Button>
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
                    <Input
                      id="role-description"
                      value={roleForm.description}
                      onChange={(e) => setRoleForm({...roleForm, description: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>权限设置</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {availablePermissions.map((permission) => (
                        <label key={permission.name} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={roleForm.permissions.includes(permission.name)}
                            onChange={(e) => {
                              if (e.target.checked) {
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
                    <Button type="submit">创建</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {roles.map((role) => (
              <Card key={role.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{role.name}</CardTitle>
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
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  新增部门
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新增部门</DialogTitle>
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
                    <Input
                      id="dept-description"
                      value={departmentForm.description}
                      onChange={(e) => setDepartmentForm({...departmentForm, description: e.target.value})}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowDepartmentDialog(false)}>
                      取消
                    </Button>
                    <Button type="submit">创建</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments.map((department) => (
              <Card key={department.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{department.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{department.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm">
                      员工数量: {users.filter(user => user.department === department.name).length}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      创建时间: {new Date(department.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button size="sm" variant="outline">
                      <Edit className="w-3 h-3 mr-1" />
                      编辑
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Users;

