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
import { Plus, Search, Edit, Eye, Users, TrendingUp, Phone, Mail, Building } from 'lucide-react';

const API_BASE_URL = '/api';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [leads, setLeads] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerDialog, setShowCustomerDialog] = useState(false);
  const [showLeadDialog, setShowLeadDialog] = useState(false);
  const [showOpportunityDialog, setShowOpportunityDialog] = useState(false);

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
    level: ''
  });

  const [leadForm, setLeadForm] = useState({
    title: '',
    description: '',
    customer_id: '',
    status: 'new',
    priority: 'medium',
    estimated_value: '',
    source: ''
  });

  const [opportunityForm, setOpportunityForm] = useState({
    title: '',
    description: '',
    customer_id: '',
    stage: 'prospecting',
    probability: 0,
    amount: '',
    expected_close_date: ''
  });

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

      const [customersRes, leadsRes, opportunitiesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/customers`, { headers }),
        fetch(`${API_BASE_URL}/customers/leads`, { headers }),
        fetch(`${API_BASE_URL}/customers/opportunities`, { headers })
      ]);

      const customersData = await customersRes.json();
      const leadsData = await leadsRes.json();
      const opportunitiesData = await opportunitiesRes.json();

      setCustomers(customersData.customers || []);
      setLeads(leadsData.leads || []);
      setOpportunities(opportunitiesData.opportunities || []);
    } catch (error) {
      console.error('获取数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/customers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(customerForm)
      });

      if (response.ok) {
        setShowCustomerDialog(false);
        setCustomerForm({
          name: '',
          company: '',
          email: '',
          phone: '',
          address: '',
          industry: '',
          source: '',
          position: '',
          level: ''
        });
        fetchData();
      }
    } catch (error) {
      console.error('创建客户失败:', error);
    }
  };

  const handleCreateLead = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/customers/leads`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(leadForm)
      });

      if (response.ok) {
        setShowLeadDialog(false);
        setLeadForm({
          title: '',
          description: '',
          customer_id: '',
          status: 'new',
          priority: 'medium',
          estimated_value: '',
          source: ''
        });
        fetchData();
      }
    } catch (error) {
      console.error('创建线索失败:', error);
    }
  };

  const handleCreateOpportunity = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/customers/opportunities`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(opportunityForm)
      });

      if (response.ok) {
        setShowOpportunityDialog(false);
        setOpportunityForm({
          title: '',
          description: '',
          customer_id: '',
          stage: 'prospecting',
          probability: 0,
          amount: '',
          expected_close_date: ''
        });
        fetchData();
      }
    } catch (error) {
      console.error('创建销售机会失败:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-gray-100 text-gray-800',
      'potential': 'bg-blue-100 text-blue-800',
      'new': 'bg-yellow-100 text-yellow-800',
      'contacted': 'bg-blue-100 text-blue-800',
      'qualified': 'bg-green-100 text-green-800',
      'lost': 'bg-red-100 text-red-800',
      'converted': 'bg-purple-100 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'low': 'bg-gray-100 text-gray-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64">加载中...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">客户关系管理</h1>
        <div className="flex space-x-2">
          <Dialog open={showCustomerDialog} onOpenChange={setShowCustomerDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                新增客户
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>新增客户</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreateCustomer} className="space-y-4">
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
                <div>
                  <Label htmlFor="email">邮箱</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerForm.email}
                    onChange={(e) => setCustomerForm({...customerForm, email: e.target.value})}
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
                <div>
                  <Label htmlFor="industry">行业</Label>
                  <Input
                    id="industry"
                    value={customerForm.industry}
                    onChange={(e) => setCustomerForm({...customerForm, industry: e.target.value})}
                  />
                </div>
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
                  <Label htmlFor="position">职位</Label>
                  <Input
                    id="position"
                    value={customerForm.position}
                    onChange={(e) => setCustomerForm({...customerForm, position: e.target.value})}
                    placeholder="如：总经理、采购主管等"
                  />
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
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setShowCustomerDialog(false)}>
                    取消
                  </Button>
                  <Button type="submit">创建</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
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
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃线索</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.filter(lead => lead.status !== 'lost' && lead.status !== 'converted').length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">销售机会</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{opportunities.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">预期收入</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ¥{opportunities.reduce((sum, opp) => sum + (opp.amount || 0), 0).toLocaleString()}
            </div>
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
                placeholder="搜索客户..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-80"
              />
            </div>
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
                    <Badge className={getStatusColor(customer.status)}>
                      {customer.status}
                    </Badge>
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
                    {customer.level && (
                      <div className="flex items-center">
                        <span className="text-sm text-muted-foreground mr-2">级别:</span>
                        <Badge variant="outline" className="text-xs">
                          {customer.level}级客户
                        </Badge>
                      </div>
                    )}
                    {customer.industry && (
                      <p className="text-sm text-muted-foreground">
                        行业: {customer.industry}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button size="sm" variant="outline">
                      <Eye className="w-3 h-3 mr-1" />
                      查看
                    </Button>
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

        {/* 线索管理标签页 */}
        <TabsContent value="leads" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">线索管理</h2>
            <Dialog open={showLeadDialog} onOpenChange={setShowLeadDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  新增线索
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新增线索</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateLead} className="space-y-4">
                  <div>
                    <Label htmlFor="lead-title">线索标题 *</Label>
                    <Input
                      id="lead-title"
                      value={leadForm.title}
                      onChange={(e) => setLeadForm({...leadForm, title: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lead-customer">关联客户 *</Label>
                    <Select value={leadForm.customer_id} onValueChange={(value) => setLeadForm({...leadForm, customer_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择客户" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id.toString()}>
                            {customer.name} - {customer.company}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="lead-description">描述</Label>
                    <Textarea
                      id="lead-description"
                      value={leadForm.description}
                      onChange={(e) => setLeadForm({...leadForm, description: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="lead-priority">优先级</Label>
                      <Select value={leadForm.priority} onValueChange={(value) => setLeadForm({...leadForm, priority: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">低</SelectItem>
                          <SelectItem value="medium">中</SelectItem>
                          <SelectItem value="high">高</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="lead-value">预估价值</Label>
                      <Input
                        id="lead-value"
                        type="number"
                        value={leadForm.estimated_value}
                        onChange={(e) => setLeadForm({...leadForm, estimated_value: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowLeadDialog(false)}>
                      取消
                    </Button>
                    <Button type="submit">创建</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {leads.map((lead) => (
              <Card key={lead.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{lead.title}</CardTitle>
                    <div className="flex flex-col space-y-1">
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status}
                      </Badge>
                      <Badge className={getPriorityColor(lead.priority)}>
                        {lead.priority}
                      </Badge>
                    </div>
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
                    {lead.expected_close_date && (
                      <p className="text-sm text-muted-foreground">
                        预期成交: {new Date(lead.expected_close_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button size="sm" variant="outline">
                      <Eye className="w-3 h-3 mr-1" />
                      查看
                    </Button>
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

        {/* 销售机会标签页 */}
        <TabsContent value="opportunities" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">销售机会</h2>
            <Dialog open={showOpportunityDialog} onOpenChange={setShowOpportunityDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  新增机会
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>新增销售机会</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateOpportunity} className="space-y-4">
                  <div>
                    <Label htmlFor="opp-title">机会标题 *</Label>
                    <Input
                      id="opp-title"
                      value={opportunityForm.title}
                      onChange={(e) => setOpportunityForm({...opportunityForm, title: e.target.value})}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="opp-customer">关联客户 *</Label>
                    <Select value={opportunityForm.customer_id} onValueChange={(value) => setOpportunityForm({...opportunityForm, customer_id: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="选择客户" />
                      </SelectTrigger>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id.toString()}>
                            {customer.name} - {customer.company}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="opp-description">描述</Label>
                    <Textarea
                      id="opp-description"
                      value={opportunityForm.description}
                      onChange={(e) => setOpportunityForm({...opportunityForm, description: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="opp-stage">销售阶段</Label>
                      <Select value={opportunityForm.stage} onValueChange={(value) => setOpportunityForm({...opportunityForm, stage: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="prospecting">潜在客户</SelectItem>
                          <SelectItem value="qualification">资格确认</SelectItem>
                          <SelectItem value="proposal">提案</SelectItem>
                          <SelectItem value="negotiation">谈判</SelectItem>
                          <SelectItem value="closed_won">成交</SelectItem>
                          <SelectItem value="closed_lost">失败</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="opp-probability">成交概率 (%)</Label>
                      <Input
                        id="opp-probability"
                        type="number"
                        min="0"
                        max="100"
                        value={opportunityForm.probability}
                        onChange={(e) => setOpportunityForm({...opportunityForm, probability: parseInt(e.target.value) || 0})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="opp-amount">金额</Label>
                      <Input
                        id="opp-amount"
                        type="number"
                        value={opportunityForm.amount}
                        onChange={(e) => setOpportunityForm({...opportunityForm, amount: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="opp-close-date">预期成交日期</Label>
                      <Input
                        id="opp-close-date"
                        type="date"
                        value={opportunityForm.expected_close_date}
                        onChange={(e) => setOpportunityForm({...opportunityForm, expected_close_date: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setShowOpportunityDialog(false)}>
                      取消
                    </Button>
                    <Button type="submit">创建</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
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
                  <div className="flex justify-end space-x-2 mt-4">
                    <Button size="sm" variant="outline">
                      <Eye className="w-3 h-3 mr-1" />
                      查看
                    </Button>
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

export default Customers;

