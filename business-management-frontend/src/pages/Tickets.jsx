import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Filter, Eye, MessageSquare, Clock, User, AlertCircle } from 'lucide-react';
import { ticketAPI, customerAPI } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

const Tickets = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);

  // 新建工单表单状态
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    customer_id: '',
    category_id: '',
    priority: 'medium',
    source: 'web'
  });

  // 状态映射
  const statusMap = {
    'open': { label: '待处理', color: 'bg-blue-100 text-blue-800' },
    'in_progress': { label: '处理中', color: 'bg-yellow-100 text-yellow-800' },
    'pending': { label: '等待中', color: 'bg-orange-100 text-orange-800' },
    'resolved': { label: '已解决', color: 'bg-green-100 text-green-800' },
    'closed': { label: '已关闭', color: 'bg-gray-100 text-gray-800' }
  };

  const priorityMap = {
    'low': { label: '低', color: 'bg-gray-100 text-gray-800' },
    'medium': { label: '中', color: 'bg-blue-100 text-blue-800' },
    'high': { label: '高', color: 'bg-orange-100 text-orange-800' },
    'urgent': { label: '紧急', color: 'bg-red-100 text-red-800' }
  };

  useEffect(() => {
    fetchTickets();
    fetchCustomers();
    fetchCategories();
  }, [statusFilter, priorityFilter]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (priorityFilter) params.priority = priorityFilter;
      
      const data = await ticketAPI.getTickets(params);
      setTickets(data.tickets || []);
    } catch (error) {
      console.error('获取工单列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const data = await customerAPI.getCustomers();
      setCustomers(data.customers || []);
    } catch (error) {
      console.error('获取客户列表失败:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await ticketAPI.getCategories();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('获取分类列表失败:', error);
    }
  };

  const handleCreateTicket = async () => {
    try {
      if (!newTicket.title || !newTicket.description || !newTicket.customer_id) {
        alert('请填写必要信息');
        return;
      }

      await ticketAPI.createTicket(newTicket);
      setShowCreateDialog(false);
      setNewTicket({
        title: '',
        description: '',
        customer_id: '',
        category_id: '',
        priority: 'medium',
        source: 'web'
      });
      fetchTickets();
    } catch (error) {
      console.error('创建工单失败:', error);
      alert('创建工单失败');
    }
  };

  const handleViewTicket = async (ticket) => {
    try {
      setSelectedTicket(ticket);
      const data = await ticketAPI.getTicketComments(ticket.id);
      setComments(data.comments || []);
      setShowDetailDialog(true);
    } catch (error) {
      console.error('获取工单详情失败:', error);
    }
  };

  const handleAddComment = async () => {
    try {
      if (!newComment.trim()) return;

      await ticketAPI.createTicketComment(selectedTicket.id, {
        content: newComment,
        is_internal: false
      });
      
      setNewComment('');
      const data = await ticketAPI.getTicketComments(selectedTicket.id);
      setComments(data.comments || []);
    } catch (error) {
      console.error('添加评论失败:', error);
    }
  };

  const handleUpdateTicketStatus = async (ticketId, newStatus) => {
    try {
      await ticketAPI.updateTicket(ticketId, { status: newStatus });
      fetchTickets();
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus });
      }
    } catch (error) {
      console.error('更新工单状态失败:', error);
    }
  };

  const filteredTickets = tickets.filter(ticket =>
    ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ticket.ticket_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (ticket.customer && ticket.customer.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('zh-CN');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">售后服务</h1>
          <p className="text-gray-600">管理和处理客户服务工单</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              新建工单
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>创建新工单</DialogTitle>
              <DialogDescription>填写工单基本信息</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">工单标题</Label>
                <Input
                  id="title"
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">问题描述</Label>
                <Textarea
                  id="description"
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="customer">客户</Label>
                <Select value={newTicket.customer_id} onValueChange={(value) => setNewTicket({ ...newTicket, customer_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="选择客户" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id.toString()}>
                        {customer.company_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">优先级</Label>
                <Select value={newTicket.priority} onValueChange={(value) => setNewTicket({ ...newTicket, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">低</SelectItem>
                    <SelectItem value="medium">中</SelectItem>
                    <SelectItem value="high">高</SelectItem>
                    <SelectItem value="urgent">紧急</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  取消
                </Button>
                <Button onClick={handleCreateTicket}>
                  创建工单
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 搜索和筛选 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="搜索工单号、标题或客户..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="所有状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">所有状态</SelectItem>
            <SelectItem value="open">待处理</SelectItem>
            <SelectItem value="in_progress">处理中</SelectItem>
            <SelectItem value="pending">等待中</SelectItem>
            <SelectItem value="resolved">已解决</SelectItem>
            <SelectItem value="closed">已关闭</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="所有优先级" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">所有优先级</SelectItem>
            <SelectItem value="low">低</SelectItem>
            <SelectItem value="medium">中</SelectItem>
            <SelectItem value="high">高</SelectItem>
            <SelectItem value="urgent">紧急</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 工单列表 */}
      <div className="grid gap-4">
        {filteredTickets.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无工单</h3>
              <p className="text-gray-500 mb-4">点击"新建工单"开始创建第一个工单</p>
            </CardContent>
          </Card>
        ) : (
          filteredTickets.map((ticket) => (
            <Card key={ticket.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold">{ticket.title}</h3>
                      <Badge className={statusMap[ticket.status]?.color}>
                        {statusMap[ticket.status]?.label}
                      </Badge>
                      <Badge className={priorityMap[ticket.priority]?.color}>
                        {priorityMap[ticket.priority]?.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{ticket.ticket_number}</p>
                    <p className="text-gray-700 mb-4 line-clamp-2">{ticket.description}</p>
                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{ticket.customer?.company_name || '未知客户'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(ticket.created_at)}</span>
                      </div>
                      {ticket.assignee && (
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>负责人: {ticket.assignee.full_name}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewTicket(ticket)}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      查看
                    </Button>
                    {ticket.status !== 'closed' && (
                      <Select
                        value={ticket.status}
                        onValueChange={(value) => handleUpdateTicketStatus(ticket.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">待处理</SelectItem>
                          <SelectItem value="in_progress">处理中</SelectItem>
                          <SelectItem value="pending">等待中</SelectItem>
                          <SelectItem value="resolved">已解决</SelectItem>
                          <SelectItem value="closed">已关闭</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 工单详情对话框 */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedTicket && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {selectedTicket.title}
                  <Badge className={statusMap[selectedTicket.status]?.color}>
                    {statusMap[selectedTicket.status]?.label}
                  </Badge>
                  <Badge className={priorityMap[selectedTicket.priority]?.color}>
                    {priorityMap[selectedTicket.priority]?.label}
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  工单号: {selectedTicket.ticket_number} | 创建时间: {formatDate(selectedTicket.created_at)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">问题描述</h4>
                  <p className="text-gray-700 bg-gray-50 p-3 rounded">{selectedTicket.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">客户信息</h4>
                    <p className="text-gray-700">{selectedTicket.customer?.company_name}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">负责人</h4>
                    <p className="text-gray-700">{selectedTicket.assignee?.full_name || '未分配'}</p>
                  </div>
                </div>

                {selectedTicket.resolution && (
                  <div>
                    <h4 className="font-medium mb-2">解决方案</h4>
                    <p className="text-gray-700 bg-green-50 p-3 rounded">{selectedTicket.resolution}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    评论记录 ({comments.length})
                  </h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {comments.map((comment) => (
                      <div key={comment.id} className="bg-gray-50 p-3 rounded">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{comment.user?.full_name}</span>
                          <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
                        </div>
                        <p className="text-gray-700">{comment.content}</p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 space-y-2">
                    <Textarea
                      placeholder="添加评论..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                      添加评论
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Tickets;

