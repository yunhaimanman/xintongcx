import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit, Eye, Users, TrendingUp, Phone, Mail, Building, Trash2, Save, X } from 'lucide-react';

function CustomersDemo() {
  const [customers, setCustomers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [showCustomerDetailDialog, setShowCustomerDetailDialog] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  // 表单状态
  const [customerForm, setCustomerForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    address: '',
    industry: '',
    source: '',
    position: '',
    level: '',
    status: 'active'
  });

  useEffect(() => {
    // 模拟数据加载
    setTimeout(() => {
      const mockCustomers = [
        {
          id: 1,
          name: '张三',
          company: '阿里巴巴集团',
          email: 'zhangsan@alibaba.com',
          phone: '13800138001',
          address: '杭州市西湖区文三路969号',
          industry: '互联网',
          source: 'website',
          position: '技术总监',
          level: 'A',
          status: 'active',
          created_at: '2024-01-15T00:00:00Z'
        },
        {
          id: 2,
          name: '李四',
          company: '腾讯科技',
          email: 'lisi@tencent.com',
          phone: '13800138002',
          address: '深圳市南山区科技园',
          industry: '互联网',
          source: 'referral',
          position: '产品经理',
          level: 'B',
          status: 'active',
          created_at: '2024-01-20T00:00:00Z'
        },
        {
          id: 3,
          name: '王五',
          company: '百度公司',
          email: 'wangwu@baidu.com',
          phone: '13800138003',
          address: '北京市海淀区上地十街10号',
          industry: '互联网',
          source: 'advertisement',
          position: '市场总监',
          level: 'A',
          status: 'potential',
          created_at: '2024-02-01T00:00:00Z'
        },
        {
          id: 4,
          name: '赵六',
          company: '华为技术',
          email: 'zhaoliu@huawei.com',
          phone: '13800138004',
          address: '深圳市龙岗区坂田华为基地',
          industry: '通信设备',
          source: 'social_media',
          position: '采购经理',
          level: 'VIP',
          status: 'active',
          created_at: '2024-02-10T00:00:00Z'
        },
        {
          id: 5,
          name: '孙七',
          company: '小米科技',
          email: 'sunqi@xiaomi.com',
          phone: '13800138005',
          address: '北京市海淀区清河中街68号',
          industry: '消费电子',
          source: 'other',
          position: '运营总监',
          level: 'B',
          status: 'inactive',
          created_at: '2024-02-15T00:00:00Z'
        }
      ];

      const mockLeads = [
        {
          id: 1,
          title: '企业级CRM系统采购',
          description: '需要一套完整的客户关系管理系统',
          customer_id: 1,
          status: 'qualified',
          priority: 'high',
          estimated_value: 500000,
          source: 'website',
          created_at: '2024-02-20T00:00:00Z'
        },
        {
          id: 2,
          title: '移动应用开发项目',
          description: '开发一款企业内部使用的移动应用',
          customer_id: 2,
          status: 'contacted',
          priority: 'medium',
          estimated_value: 300000,
          source: 'referral',
          created_at: '2024-02-22T00:00:00Z'
        }
      ];

      const mockOpportunities = [
        {
          id: 1,
          title: '数字化转型咨询服务',
          description: '为企业提供全面的数字化转型咨询',
          customer_id: 1,
          stage: 'proposal',
          probability: 70,
          amount: 800000,
          expected_close_date: '2024-04-30',
          created_at: '2024-02-25T00:00:00Z'
        }
      ];

      setCustomers(mockCustomers);
      setLeads(mockLeads);
      setOpportunities(mockOpportunities);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    try {
      // 表单验证
      if (!customerForm.name || !customerForm.email) {
        alert('请填写必填字段');
        return;
      }

      if (editingCustomer) {
        // 更新客户
        const updatedCustomers = customers.map(customer => 
          customer.id === editingCustomer.id 
            ? { ...customer, ...customerForm }
            : customer
        );
        setCustomers(updatedCustomers);
        alert('客户更新成功');
      } else {
        // 创建新客户
        const newCustomer = {
          id: customers.length + 1,
          ...customerForm,
          created_at: new Date().toISOString()
        };
        setCustomers([...customers, newCustomer]);
        alert('客户创建成功');
      }

      setShowCustomerDialog(false);
      setEditingCustomer(null);
      resetCustomerForm();
    } catch (error) {
      console.error('客户操作失败:', error);
      alert('客户操作失败');
    }
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setCustomerForm({
      name: customer.name,
      company: customer.company || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      industry: customer.industry || '',
      source: customer.source || '',
      position: customer.position || '',
      level: customer.level || '',
      status: customer.status || 'active'
    });
    setShowCustomerDialog(true);
  };

  const handleDeleteCustomer = async (customerId) => {
    if (!confirm('确定要删除这个客户吗？')) return;
    
    try {
      setCustomers(customers.filter(customer => customer.id !== customerId));
      alert('客户删除成功');
    } catch (error) {
      console.error('删除客户失败:', error);
      alert('删除客户失败');
    }
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowCustomerDetailDialog(true);
  };

  const resetCustomerForm = () => {
    setCustomerForm({
      name: '',
      company: '',
      email: '',
      phone: '',
      address: '',
      industry: '',
      source: '',
      position: '',
      level: '',
      status: 'active'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-gray-100 text-gray-800',
      'potential': 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status) => {
    const texts = {
      'active': '活跃',
      'inactive': '非活跃',
      'potential': '潜在客户'
    };
    return texts[status] || status;
  };

  const getLevelColor = (level) => {
    const colors = {
      'A': 'bg-red-100 text-red-800',
      'B': 'bg-yellow-100 text-yellow-800',
      'C': 'bg-blue-100 text-blue-800',
      'VIP': 'bg-purple-100 text-purple-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const getSourceText = (source) => {
    const texts = {
      'website': '网站',
      'referral': '推荐',
      'advertisement': '广告',
      'social_media': '社交媒体',
      'other': '其他'
    };
    return texts[source] || source;
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <div>
          <h1 className="text-3xl font-bold">客户管理系统演示</h1>
          <p className="text-muted-foreground">完整的客户管理功能展示，包括客户列表、新增、编辑和删除</p>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总客户数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-muted-foreground">
              +{customers.filter(c => new Date(c.created_at) > new Date(Date.now() - 30*24*60*60*1000)).length} 本月新增
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃客户</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.filter(c => c.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((customers.filter(c => c.status === 'active').length / customers.length) * 100)}% 活跃率
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">VIP客户</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.filter(c => c.level === 'VIP').length}</div>
            <p className="text-xs text-muted-foreground">
              高价值客户群体
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">潜在客户</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.filter(c => c.status === 'potential').length}</div>
            <p className="text-xs text-muted-foreground">
              待转化客户
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 主要内容区域 */}
      <Tabs defaultValue="customers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="customers">客户管理</TabsTrigger>
          <TabsTrigger value="leads">线索管理</TabsTrigger>
          <TabsTrigger value="opportunities">销售机会</TabsTrigger>
        </TabsList>

        {/* 客户管理标签页 */}
        <TabsContent value="customers" className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索公司名称、联系人、电话、邮箱..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
            <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
              <DialogTrigger asChild>
                <Button onClick={() => {
                  setEditingCustomer(null);
                  resetCustomerForm();
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  新增客户
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{editingCustomer ? '编辑客户' : '新增客户'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateCustomer} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">客户姓名 *</Label>
                      <Input
                        id="name"
                        value={customerForm.name}
                        onChange={(e) => setCustomerForm({...customerForm, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">公司名称</Label>
                      <Input
                        id="company"
                        value={customerForm.company}
                        onChange={(e) => setCustomerForm({...customerForm, company: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">邮箱 *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={customerForm.email}
                        onChange={(e) => setCustomerForm({...customerForm, email: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">电话</Label>
                      <Input
                        id="phone"
                        value={customerForm.phone}
                        onChange={(e) => setCustomerForm({...customerForm, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">地址</Label>
                    <Input
                      id="address"
                      value={customerForm.address}
                      onChange={(e) => setCustomerForm({...customerForm, address: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="industry">行业</Label>
                      <Input
                        id="industry"
                        value={customerForm.industry}
                        onChange={(e) => setCustomerForm({...customerForm, industry: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="position">职位</Label>
                      <Input
                        id="position"
                        value={customerForm.position}
                        onChange={(e) => setCustomerForm({...customerForm, position: e.target.value})}
                        placeholder="如：总经理、采购主管等"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="source">客户来源</Label>
                      <Select value={customerForm.source} onValueChange={(value) => setCustomerForm({...customerForm, source: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择客户来源" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="website">网站</SelectItem>
                          <SelectItem value="referral">推荐</SelectItem>
                          <SelectItem value="advertisement">广告</SelectItem>
                          <SelectItem value="social_media">社交媒体</SelectItem>
                          <SelectItem value="other">其他</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="level">客户级别</Label>
                      <Select value={customerForm.level} onValueChange={(value) => setCustomerForm({...customerForm, level: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="选择客户级别" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A级客户（重要客户）</SelectItem>
                          <SelectItem value="B">B级客户（一般客户）</SelectItem>
                          <SelectItem value="C">C级客户（潜在客户）</SelectItem>
                          <SelectItem value="VIP">VIP客户</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="status">客户状态</Label>
                    <Select value={customerForm.status} onValueChange={(value) => setCustomerForm({...customerForm, status: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择客户状态" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">活跃</SelectItem>
                        <SelectItem value="inactive">非活跃</SelectItem>
                        <SelectItem value="potential">潜在客户</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => {
                      setShowCustomerDialog(false);
                      setEditingCustomer(null);
                      resetCustomerForm();
                    }}>
                      取消
                    </Button>
                    <Button type="submit">
                      <Save className="w-4 h-4 mr-2" />
                      {editingCustomer ? '更新' : '创建'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{customer.name}</CardTitle>
                      {customer.company && (
                        <p className="text-sm text-muted-foreground flex items-center mt-1">
                          <Building className="w-3 h-3 mr-1" />
                          {customer.company}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col space-y-1">
                      <Badge className={getStatusColor(customer.status)}>
                        {getStatusText(customer.status)}
                      </Badge>
                      {customer.level && (
                        <Badge className={getLevelColor(customer.level)}>
                          {customer.level}级
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {customer.email && (
                      <p className="text-sm flex items-center">
                        <Mail className="w-3 h-3 mr-2" />
                        {customer.email}
                      </p>
                    )}
                    {customer.phone && (
                      <p className="text-sm flex items-center">
                        <Phone className="w-3 h-3 mr-2" />
                        {customer.phone}
                      </p>
                    )}
                    {customer.position && (
                      <p className="text-sm text-muted-foreground">
                        职位: {customer.position}
                      </p>
                    )}
                    {customer.industry && (
                      <p className="text-sm text-muted-foreground">
                        行业: {customer.industry}
                      </p>
                    )}
                    {customer.source && (
                      <p className="text-sm text-muted-foreground">
                        来源: {getSourceText(customer.source)}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewCustomer(customer)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      查看
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleEditCustomer(customer)}
                    >
                      <Edit className="w-3 h-3 mr-1" />
                      编辑
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteCustomer(customer.id)}
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

        {/* 线索管理标签页 */}
        <TabsContent value="leads" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">线索管理</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leads.map((lead) => (
              <Card key={lead.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{lead.title}</CardTitle>
                    <Badge className={getStatusColor(lead.status)}>
                      {lead.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{lead.description}</p>
                    {lead.estimated_value && (
                      <p className="text-sm font-medium">
                        预估价值: ¥{lead.estimated_value.toLocaleString()}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      优先级: {lead.priority}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      来源: {getSourceText(lead.source)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* 销售机会标签页 */}
        <TabsContent value="opportunities" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">销售机会</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {opportunities.map((opportunity) => (
              <Card key={opportunity.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{opportunity.title}</CardTitle>
                    <Badge className={getStatusColor(opportunity.stage)}>
                      {opportunity.stage}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{opportunity.description}</p>
                    {opportunity.amount && (
                      <p className="text-lg font-bold text-green-600">
                        ¥{opportunity.amount.toLocaleString()}
                      </p>
                    )}
                    <p className="text-sm">
                      成交概率: {opportunity.probability}%
                    </p>
                    {opportunity.expected_close_date && (
                      <p className="text-sm text-muted-foreground">
                        预期成交: {new Date(opportunity.expected_close_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* 客户详情对话框 */}
      <Dialog open={showCustomerDetailDialog} onOpenChange={setShowCustomerDetailDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>客户详情</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>客户姓名</Label>
                  <p className="text-sm font-medium">{selectedCustomer.name}</p>
                </div>
                <div>
                  <Label>公司名称</Label>
                  <p className="text-sm font-medium">{selectedCustomer.company || '未设置'}</p>
                </div>
                <div>
                  <Label>邮箱</Label>
                  <p className="text-sm font-medium">{selectedCustomer.email || '未设置'}</p>
                </div>
                <div>
                  <Label>电话</Label>
                  <p className="text-sm font-medium">{selectedCustomer.phone || '未设置'}</p>
                </div>
                <div>
                  <Label>职位</Label>
                  <p className="text-sm font-medium">{selectedCustomer.position || '未设置'}</p>
                </div>
                <div>
                  <Label>行业</Label>
                  <p className="text-sm font-medium">{selectedCustomer.industry || '未设置'}</p>
                </div>
                <div>
                  <Label>客户级别</Label>
                  <Badge className={getLevelColor(selectedCustomer.level)}>
                    {selectedCustomer.level}级客户
                  </Badge>
                </div>
                <div>
                  <Label>客户状态</Label>
                  <Badge className={getStatusColor(selectedCustomer.status)}>
                    {getStatusText(selectedCustomer.status)}
                  </Badge>
                </div>
                <div>
                  <Label>客户来源</Label>
                  <p className="text-sm font-medium">{getSourceText(selectedCustomer.source)}</p>
                </div>
                <div>
                  <Label>创建时间</Label>
                  <p className="text-sm font-medium">{new Date(selectedCustomer.created_at).toLocaleString()}</p>
                </div>
              </div>
              {selectedCustomer.address && (
                <div>
                  <Label>地址</Label>
                  <p className="text-sm font-medium">{selectedCustomer.address}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CustomersDemo;

