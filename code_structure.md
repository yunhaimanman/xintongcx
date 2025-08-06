## 售后服务页面 (Tickets.jsx) 完善后的代码结构与关键代码片段（伪代码）

根据之前制定的详细开发完善方案，我们将对 `Tickets.jsx` 进行模块化拆分和功能增强。以下是完善后的文件结构、主要组件的代码结构以及关键功能的伪代码实现。

### 1. 文件结构概览

为了提高代码的可读性、可维护性和组件复用性，我们将 `Tickets.jsx` 拆分为多个独立的组件，并引入常量和工具函数文件。新的文件结构将如下所示：

```
src/
├── components/
│   ├── ui/ (Shadcn UI 组件)
│   └── common/ (通用可复用组件)
│       ├── Pagination.jsx (新增：分页组件)
│       ├── Toast.jsx (新增：统一的Toast提示组件)
│       └── LoadingSpinner.jsx (新增：加载指示器)
├── pages/
│   └── Tickets.jsx (主页面，负责协调和数据流)
├── features/
│   └── tickets/ (与工单相关的特定功能模块)
│       ├── components/
│       │   ├── TicketCard.jsx (工单卡片)
│       │   ├── TicketFilters.jsx (搜索和筛选)
│       │   ├── CreateTicketDialog.jsx (创建工单对话框)
│       │   ├── TicketDetailDialog.jsx (工单详情对话框)
│       │   ├── TicketEditForm.jsx (新增：工单编辑表单)
│       │   ├── TicketCommentSection.jsx (新增：评论区，包含富文本和附件)
│       │   └── TicketHistoryLog.jsx (新增：操作历史)
│       ├── hooks/
│       │   └── useTickets.js (新增：自定义Hook，封装工单数据逻辑)
│       ├── stores/
│       │   └── ticketStore.js (新增：Zustand状态管理)
│       └── utils/
│           └── ticketUtils.js (新增：工单相关工具函数)
├── lib/
│   ├── api.js (现有：API调用)
│   ├── apiClient.js (新增：Axios实例封装)
│   └── constants.js (新增：常量定义，如状态、优先级映射)
└── contexts/
    └── AuthContext.js (现有：认证上下文)
```

### 2. `Tickets.jsx` (主页面) 伪代码

`Tickets.jsx` 将主要负责协调各个子组件，管理全局状态（通过 Zustand 或 Context API），并处理数据流。它将变得更加简洁，专注于组件的组合和高层逻辑。

```jsx
// src/pages/Tickets.jsx
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

import TicketFilters from '@/features/tickets/components/TicketFilters';
import TicketList from '@/features/tickets/components/TicketList';
import CreateTicketDialog from '@/features/tickets/components/CreateTicketDialog';
import { useTicketStore } from '@/features/tickets/stores/ticketStore';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import Toast from '@/components/common/Toast'; // 统一的Toast组件

const Tickets = () => {
  const { 
    tickets, 
    loading, 
    fetchTickets, 
    searchTerm, 
    statusFilter, 
    priorityFilter, 
    pagination, 
    setPagination,
    setSearchTerm,
    setStatusFilter,
    setPriorityFilter,
    // ...其他状态和方法
  } = useTicketStore();

  useEffect(() => {
    fetchTickets();
  }, [searchTerm, statusFilter, priorityFilter, pagination.currentPage, pagination.pageSize]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">售后服务</h1>
          <p className="text-gray-600">管理和处理客户服务工单</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              新建工单
            </Button>
          </DialogTrigger>
          <CreateTicketDialog />
        </Dialog>
      </div>

      <TicketFilters 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
      />

      <TicketList tickets={tickets} />

      <Pagination 
        currentPage={pagination.currentPage}
        pageSize={pagination.pageSize}
        totalItems={pagination.totalItems}
        onPageChange={(page) => setPagination({ ...pagination, currentPage: page })}
        onPageSizeChange={(size) => setPagination({ ...pagination, pageSize: size })}
      />

      {/* Toast组件通常在App.js或Layout组件中全局引入 */}
      <Toast />
    </div>
  );
};

export default Tickets;
```

### 3. `TicketList.jsx` (工单列表) 伪代码

`TicketList.jsx` 将负责渲染工单卡片列表，并处理批量操作的选中逻辑。

```jsx
// src/features/tickets/components/TicketList.jsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import TicketCard from './TicketCard';
import { useTicketStore } from '@/features/tickets/stores/ticketStore';
import { Checkbox } from '@/components/ui/checkbox'; // 用于批量选择
import { Button } from '@/components/ui/button'; // 用于批量操作按钮

const TicketList = ({ tickets }) => {
  const { selectedTicketIds, toggleTicketSelection, toggleAllTicketsSelection, clearSelectedTickets, performBulkAction } = useTicketStore();

  const handleBulkClose = () => {
    performBulkAction('close', selectedTicketIds);
    clearSelectedTickets();
  };

  if (tickets.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无工单</h3>
          <p className="text-gray-500 mb-4">点击"新建工单"开始创建第一个工单</p>
          {/* 如果有筛选条件，可以显示清除筛选按钮 */}
          {useTicketStore.getState().searchTerm || useTicketStore.getState().statusFilter || useTicketStore.getState().priorityFilter ? (
            <Button variant="outline" onClick={() => {
              useTicketStore.getState().setSearchTerm('');
              useTicketStore.getState().setStatusFilter('');
              useTicketStore.getState().setPriorityFilter('');
            }}>清除筛选</Button>
          ) : null}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* 批量操作区域 */}
      {tickets.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <Checkbox
            checked={selectedTicketIds.length === tickets.length && tickets.length > 0}
            onCheckedChange={toggleAllTicketsSelection}
            aria-label="Select all"
          />
          <Label htmlFor="select-all-tickets">全选</Label>
          {selectedTicketIds.length > 0 && (
            <>
              <Button size="sm" onClick={handleBulkClose}>批量关闭 ({selectedTicketIds.length})</Button>
              {/* 更多批量操作按钮 */}
            </>
          )}
        </div>
      )}

      <div className="grid gap-4">
        {tickets.map((ticket) => (
          <TicketCard 
            key={ticket.id} 
            ticket={ticket} 
            isSelected={selectedTicketIds.includes(ticket.id)}
            onSelect={() => toggleTicketSelection(ticket.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default TicketList;
```

### 4. `TicketCard.jsx` (工单卡片) 伪代码

`TicketCard.jsx` 将专注于单个工单的展示和交互，包括查看详情和直接更新状态。

```jsx
// src/features/tickets/components/TicketCard.jsx
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, MessageSquare, Clock, User } from 'lucide-react';
import { statusMap, priorityMap } from '@/lib/constants';
import { formatDate } from '@/lib/utils'; // 假设formatDate移到utils
import { useTicketStore } from '@/features/tickets/stores/ticketStore';
import { Checkbox } from '@/components/ui/checkbox';

const TicketCard = ({ ticket, isSelected, onSelect }) => {
  const { setSelectedTicket, setShowDetailDialog, handleUpdateTicketStatus } = useTicketStore();

  const handleViewTicket = () => {
    setSelectedTicket(ticket);
    setShowDetailDialog(true);
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center mr-4">
            <Checkbox checked={isSelected} onCheckedChange={onSelect} className="mr-3" />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold">{ticket.title}</h3>
                <Badge className={statusMap[ticket.status]?.color}>
                  {statusMap[ticket.status]?.label}
                </Badge>
                <Badge className={priorityMap[ticket.priority]?.color}>
                  {priorityMap[ticket.priority]?.label}
                </Badge>
                {/* 新增：SLA 状态 */}
                {ticket.sla_status && (
                  <Badge variant="outline" className={`
                    ${ticket.sla_status === 'on_track' ? 'bg-green-100 text-green-800'
                    : ticket.sla_status === 'warning' ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'}
                  `}>
                    SLA: {ticket.sla_status === 'on_track' ? '正常' : ticket.sla_status === 'warning' ? '即将超期' : '已超期'}
                  </Badge>
                )}
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
          </div>
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewTicket}
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
                  {Object.entries(statusMap).map(([key, val]) => (
                    <SelectItem key={key} value={key}>{val.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketCard;
```

### 5. `CreateTicketDialog.jsx` (创建工单对话框) 伪代码

此组件将封装创建新工单的表单逻辑，并增加负责人分配、分类选择等功能。

```jsx
// src/features/tickets/components/CreateTicketDialog.jsx
import React, { useState, useEffect } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useTicketStore } from '@/features/tickets/stores/ticketStore';
import { useToast } from '@/components/ui/use-toast'; // Shadcn Toast Hook
import { customerAPI, userAPI } from '@/lib/api'; // 假设有userAPI获取用户列表
import RichTextEditor from '@/components/common/RichTextEditor'; // 新增富文本编辑器组件
import FileUploader from '@/components/common/FileUploader'; // 新增文件上传组件

const CreateTicketDialog = () => {
  const { createTicket, fetchTickets } = useTicketStore();
  const { toast } = useToast();

  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    customer_id: '',
    category_id: '',
    priority: 'medium',
    source: 'web',
    assignee_id: '', // 新增负责人字段
    attachments: [], // 新增附件字段
  });
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]); // 用于负责人选择

  useEffect(() => {
    const loadFormData = async () => {
      try {
        const [customerData, categoryData, userData] = await Promise.all([
          customerAPI.getCustomers(),
          ticketAPI.getCategories(),
          userAPI.getUsers(), // 获取系统用户列表
        ]);
        setCustomers(customerData.customers || []);
        setCategories(categoryData.categories || []);
        setUsers(userData.users || []);
      } catch (error) {
        console.error('加载表单数据失败:', error);
        toast({
          title: '错误',
          description: '加载必要数据失败，请重试。',
          variant: 'destructive',
        });
      }
    };
    loadFormData();
  }, []);

  const handleCreate = async () => {
    if (!newTicket.title || !newTicket.description || !newTicket.customer_id) {
      toast({
        title: '提示',
        description: '请填写工单标题、描述和客户。',
        variant: 'warning',
      });
      return;
    }

    try {
      await createTicket(newTicket);
      toast({
        title: '成功',
        description: '工单创建成功。',
      });
      // 重置表单
      setNewTicket({
        title: '',
        description: '',
        customer_id: '',
        category_id: '',
        priority: 'medium',
        source: 'web',
        assignee_id: '',
        attachments: [],
      });
      fetchTickets(); // 刷新列表
      // 关闭对话框 (假设由父组件控制)
      // onOpenChange(false);
    } catch (error) {
      console.error('创建工单失败:', error);
      toast({
        title: '错误',
        description: '创建工单失败，请稍后再试。',
        variant: 'destructive',
      });
    }
  };

  return (
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
          {/* 使用富文本编辑器 */}
          <RichTextEditor
            value={newTicket.description}
            onChange={(content) => setNewTicket({ ...newTicket, description: content })}
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
          <Label htmlFor="category">分类</Label>
          <Select value={newTicket.category_id} onValueChange={(value) => setNewTicket({ ...newTicket, category_id: value })}>
            <SelectTrigger>
              <SelectValue placeholder="选择分类" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
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
              {Object.entries(priorityMap).map(([key, val]) => (
                <SelectItem key={key} value={key}>{val.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="assignee">负责人</Label>
          <Select value={newTicket.assignee_id} onValueChange={(value) => setNewTicket({ ...newTicket, assignee_id: value })}>
            <SelectTrigger>
              <SelectValue placeholder="选择负责人" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">未分配</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="attachments">附件</Label>
          <FileUploader 
            onFilesChange={(files) => setNewTicket({ ...newTicket, attachments: files })}
            // 假设FileUploader返回文件URL或ID
          />
        </div>
      </div>
      <DialogFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => { /* 关闭对话框 */ }}>
          取消
        </Button>
        <Button onClick={handleCreate}>
          创建工单
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default CreateTicketDialog;
```

### 6. `TicketDetailDialog.jsx` (工单详情对话框) 伪代码

此组件将展示工单的详细信息，并集成编辑功能、评论区和操作历史。

```jsx
// src/features/tickets/components/TicketDetailDialog.jsx
import React, { useState, useEffect } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Shadcn Tabs
import { statusMap, priorityMap } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import { useTicketStore } from '@/features/tickets/stores/ticketStore';
import TicketEditForm from './TicketEditForm'; // 新增工单编辑表单
import TicketCommentSection from './TicketCommentSection'; // 新增评论区
import TicketHistoryLog from './TicketHistoryLog'; // 新增操作历史
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { ticketAPI, userAPI } from '@/lib/api';

const TicketDetailDialog = () => {
  const { selectedTicket, setSelectedTicket, setShowDetailDialog, handleUpdateTicketStatus } = useTicketStore();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [users, setUsers] = useState([]); // 用于负责人选择

  useEffect(() => {
    if (selectedTicket) {
      // 每次打开详情时重新获取最新评论和历史记录
      const fetchDetails = async () => {
        try {
          const [commentsData, historyData, userData] = await Promise.all([
            ticketAPI.getTicketComments(selectedTicket.id),
            ticketAPI.getTicketHistory(selectedTicket.id), // 假设有获取历史记录的API
            userAPI.getUsers(),
          ]);
          useTicketStore.getState().setComments(commentsData.comments || []);
          useTicketStore.getState().setTicketHistory(historyData.history || []);
          setUsers(userData.users || []);
        } catch (error) {
          console.error('获取工单详情数据失败:', error);
          toast({
            title: '错误',
            description: '加载工单详情失败，请重试。',
            variant: 'destructive',
          });
        }
      };
      fetchDetails();
    }
  }, [selectedTicket?.id]);

  const handleSaveEdit = async (updatedFields) => {
    try {
      await ticketAPI.updateTicket(selectedTicket.id, updatedFields);
      setSelectedTicket({ ...selectedTicket, ...updatedFields }); // 更新本地状态
      useTicketStore.getState().fetchTickets(); // 刷新列表
      toast({
        title: '成功',
        description: '工单信息更新成功。',
      });
      setIsEditing(false);
    } catch (error) {
      console.error('更新工单失败:', error);
      toast({
        title: '错误',
        description: '更新工单失败，请稍后再试。',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteTicket = async () => {
    if (window.confirm('确定要删除此工单吗？此操作不可逆。')) {
      try {
        await ticketAPI.deleteTicket(selectedTicket.id);
        useTicketStore.getState().fetchTickets(); // 刷新列表
        setShowDetailDialog(false);
        toast({
          title: '成功',
          description: '工单已成功删除。',
        });
      } catch (error) {
        console.error('删除工单失败:', error);
        toast({
          title: '错误',
          description: '删除工单失败，请稍后再试。',
          variant: 'destructive',
        });
      }
    }
  };

  if (!selectedTicket) return null; // 或者显示加载状态

  return (
    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          {selectedTicket.title}
          <Badge className={statusMap[selectedTicket.status]?.color}>
            {statusMap[selectedTicket.status]?.label}
          </Badge>
          <Badge className={priorityMap[selectedTicket.priority]?.color}>
            {priorityMap[selectedTicket.priority]?.label}
          </Badge>
          {/* 新增：SLA 状态 */}
          {selectedTicket.sla_status && (
            <Badge variant="outline" className={`
              ${selectedTicket.sla_status === 'on_track' ? 'bg-green-100 text-green-800'
              : selectedTicket.sla_status === 'warning' ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'}
            `}>
              SLA: {selectedTicket.sla_status === 'on_track' ? '正常' : selectedTicket.sla_status === 'warning' ? '即将超期' : '已超期'}
            </Badge>
          )}
        </DialogTitle>
        <DialogDescription>
          工单号: {selectedTicket.ticket_number} | 创建时间: {formatDate(selectedTicket.created_at)}
        </DialogDescription>
      </DialogHeader>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Label>状态:</Label>
          <Select
            value={selectedTicket.status}
            onValueChange={(value) => handleUpdateTicketStatus(selectedTicket.id, value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(statusMap).map(([key, val]) => (
                <SelectItem key={key} value={key}>{val.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Label>负责人:</Label>
          <Select
            value={selectedTicket.assignee_id || ''}
            onValueChange={(value) => handleSaveEdit({ assignee_id: value || null })}
          >
            <SelectTrigger className="w-32">
              <SelectValue placeholder="未分配" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">未分配</SelectItem>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-x-2">
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? '取消编辑' : '编辑工单'}
          </Button>
          <Button variant="destructive" onClick={handleDeleteTicket}>
            删除工单
          </Button>
        </div>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">详情</TabsTrigger>
          <TabsTrigger value="comments">评论</TabsTrigger>
          <TabsTrigger value="history">操作历史</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="space-y-4 pt-4">
          {isEditing ? (
            <TicketEditForm ticket={selectedTicket} onSave={handleSaveEdit} onCancel={() => setIsEditing(false)} />
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">问题描述</h4>
                <div className="text-gray-700 bg-gray-50 p-3 rounded" dangerouslySetInnerHTML={{ __html: selectedTicket.description }}></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">客户</h4>
                  <p className="text-gray-700">{selectedTicket.customer?.company_name || '未知'}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">分类</h4>
                  <p className="text-gray-700">{selectedTicket.category?.name || '未知'}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">优先级</h4>
                  <p className="text-gray-700">{priorityMap[selectedTicket.priority]?.label}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">来源</h4>
                  <p className="text-gray-700">{selectedTicket.source}</p>
                </div>
                {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">附件</h4>
                    <ul className="list-disc pl-5">
                      {selectedTicket.attachments.map((attachment, index) => (
                        <li key={index}><a href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{attachment.filename}</a></li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* 动态渲染自定义字段 */}
                {selectedTicket.custom_fields && Object.keys(selectedTicket.custom_fields).map(key => (
                  <div key={key}>
                    <h4 className="font-medium mb-2">{key}</h4>
                    <p className="text-gray-700">{selectedTicket.custom_fields[key]}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="comments" className="pt-4">
          <TicketCommentSection ticketId={selectedTicket.id} />
        </TabsContent>
        <TabsContent value="history" className="pt-4">
          <TicketHistoryLog ticketId={selectedTicket.id} />
        </TabsContent>
      </Tabs>
    </DialogContent>
  );
};

export default TicketDetailDialog;
```

### 7. `TicketEditForm.jsx` (工单编辑表单) 伪代码

这是一个独立的表单组件，用于编辑工单的非状态字段。

```jsx
// src/features/tickets/components/TicketEditForm.jsx
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import RichTextEditor from '@/components/common/RichTextEditor';
import FileUploader from '@/components/common/FileUploader';
import { customerAPI, ticketAPI, userAPI } from '@/lib/api';
import { priorityMap } from '@/lib/constants';

const TicketEditForm = ({ ticket, onSave, onCancel }) => {
  const [editedTicket, setEditedTicket] = useState(ticket);
  const [customers, setCustomers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadFormData = async () => {
      const [customerData, categoryData, userData] = await Promise.all([
        customerAPI.getCustomers(),
        ticketAPI.getCategories(),
        userAPI.getUsers(),
      ]);
      setCustomers(customerData.customers || []);
      setCategories(categoryData.categories || []);
      setUsers(userData.users || []);
    };
    loadFormData();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setEditedTicket({ ...editedTicket, [id]: value });
  };

  const handleRichTextChange = (content) => {
    setEditedTicket({ ...editedTicket, description: content });
  };

  const handleFilesChange = (files) => {
    setEditedTicket({ ...editedTicket, attachments: files });
  };

  const handleSubmit = () => {
    onSave(editedTicket);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="title">工单标题</Label>
        <Input id="title" value={editedTicket.title} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="description">问题描述</Label>
        <RichTextEditor value={editedTicket.description} onChange={handleRichTextChange} />
      </div>
      <div>
        <Label htmlFor="customer_id">客户</Label>
        <Select value={editedTicket.customer_id.toString()} onValueChange={(value) => setEditedTicket({ ...editedTicket, customer_id: value })}>
          <SelectTrigger>
            <SelectValue />
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
        <Label htmlFor="category_id">分类</Label>
        <Select value={editedTicket.category_id.toString()} onValueChange={(value) => setEditedTicket({ ...editedTicket, category_id: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="priority">优先级</Label>
        <Select value={editedTicket.priority} onValueChange={(value) => setEditedTicket({ ...editedTicket, priority: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(priorityMap).map(([key, val]) => (
              <SelectItem key={key} value={key}>{val.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="assignee_id">负责人</Label>
        <Select value={editedTicket.assignee_id?.toString() || ''} onValueChange={(value) => setEditedTicket({ ...editedTicket, assignee_id: value || null })}>
          <SelectTrigger>
            <SelectValue placeholder="未分配" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">未分配</SelectItem>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id.toString()}>
                {user.full_name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="attachments">附件</Label>
        <FileUploader 
          initialFiles={editedTicket.attachments}
          onFilesChange={handleFilesChange}
        />
      </div>
      {/* 动态渲染自定义字段的编辑 */}
      {editedTicket.custom_fields && Object.keys(editedTicket.custom_fields).map(key => (
        <div key={key}>
          <Label htmlFor={`custom_field_${key}`}>{key}</Label>
          <Input 
            id={`custom_field_${key}`}
            value={editedTicket.custom_fields[key]}
            onChange={(e) => setEditedTicket({ 
              ...editedTicket, 
              custom_fields: { ...editedTicket.custom_fields, [key]: e.target.value }
            })}
          />
        </div>
      ))}
      <div className="flex justify-end space-x-2 mt-4">
        <Button variant="outline" onClick={onCancel}>取消</Button>
        <Button onClick={handleSubmit}>保存</Button>
      </div>
    </div>
  );
};

export default TicketEditForm;
```

### 8. `TicketCommentSection.jsx` (评论区) 伪代码

此组件将展示工单评论，并提供添加新评论的功能，区分内部/外部评论，并支持附件和富文本。

```jsx
// src/features/tickets/components/TicketCommentSection.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useTicketStore } from '@/features/tickets/stores/ticketStore';
import { useToast } from '@/components/ui/use-toast';
import { ticketAPI } from '@/lib/api';
import RichTextEditor from '@/components/common/RichTextEditor';
import FileUploader from '@/components/common/FileUploader';
import { formatDate } from '@/lib/utils';

const TicketCommentSection = ({ ticketId }) => {
  const { comments, setComments, addComment } = useTicketStore();
  const { toast } = useToast();
  const [newCommentContent, setNewCommentContent] = useState('');
  const [isInternalComment, setIsInternalComment] = useState(false);
  const [newCommentAttachments, setNewCommentAttachments] = useState([]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await ticketAPI.getTicketComments(ticketId);
        setComments(data.comments || []);
      } catch (error) {
        console.error('获取评论失败:', error);
        toast({
          title: '错误',
          description: '加载评论失败。',
          variant: 'destructive',
        });
      }
    };
    fetchComments();
  }, [ticketId]);

  const handleAddComment = async () => {
    if (!newCommentContent.trim()) {
      toast({
        title: '提示',
        description: '评论内容不能为空。',
        variant: 'warning',
      });
      return;
    }

    try {
      await addComment(ticketId, {
        content: newCommentContent,
        is_internal: isInternalComment,
        attachments: newCommentAttachments, // 传递附件
      });
      setNewCommentContent('');
      setIsInternalComment(false);
      setNewCommentAttachments([]);
      toast({
        title: '成功',
        description: '评论添加成功。',
      });
      // 重新获取评论以显示最新内容
      const data = await ticketAPI.getTicketComments(ticketId);
      setComments(data.comments || []);
    } catch (error) {
      console.error('添加评论失败:', error);
      toast({
        title: '错误',
        description: '添加评论失败，请稍后再试。',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium mb-2">评论</h4>
      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
        {comments.length === 0 ? (
          <p className="text-gray-500">暂无评论。</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className={`p-3 rounded-lg ${comment.is_internal ? 'bg-blue-50' : 'bg-gray-50'}`}>
              <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
                <span>
                  <strong>{comment.author?.full_name || '未知用户'}</strong>
                  {comment.is_internal && <span className="ml-2 text-blue-700 font-semibold">(内部评论)</span>}
                </span>
                <span>{formatDate(comment.created_at)}</span>
              </div>
              <div className="text-gray-800" dangerouslySetInnerHTML={{ __html: comment.content }}></div>
              {comment.attachments && comment.attachments.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium">附件:</p>
                  <ul className="list-disc pl-5 text-sm">
                    {comment.attachments.map((attachment, index) => (
                      <li key={index}><a href={attachment.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{attachment.filename}</a></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <div className="mt-4 p-4 border rounded-lg bg-white">
        <h5 className="font-medium mb-2">添加评论</h5>
        <RichTextEditor
          value={newCommentContent}
          onChange={setNewCommentContent}
          placeholder="输入评论内容..."
        />
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <Checkbox
              id="internal-comment"
              checked={isInternalComment}
              onCheckedChange={setIsInternalComment}
            />
            <Label htmlFor="internal-comment">内部评论</Label>
          </div>
          <FileUploader 
            onFilesChange={setNewCommentAttachments}
            // 假设FileUploader返回文件URL或ID
          />
          <Button onClick={handleAddComment}>提交评论</Button>
        </div>
      </div>
    </div>
  );
};

export default TicketCommentSection;
```

### 9. `TicketHistoryLog.jsx` (操作历史) 伪代码

此组件将展示工单的所有操作历史记录。

```jsx
// src/features/tickets/components/TicketHistoryLog.jsx
import React, { useEffect } from 'react';
import { useTicketStore } from '@/features/tickets/stores/ticketStore';
import { useToast } from '@/components/ui/use-toast';
import { ticketAPI } from '@/lib/api';
import { formatDate } from '@/lib/utils';

const TicketHistoryLog = ({ ticketId }) => {
  const { ticketHistory, setTicketHistory } = useTicketStore();
  const { toast } = useToast();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await ticketAPI.getTicketHistory(ticketId);
        setTicketHistory(data.history || []);
      } catch (error) {
        console.error('获取工单历史失败:', error);
        toast({
          title: '错误',
          description: '加载工单历史失败。',
          variant: 'destructive',
        });
      }
    };
    fetchHistory();
  }, [ticketId]);

  if (ticketHistory.length === 0) {
    return <p className="text-gray-500">暂无操作历史。</p>;
  }

  return (
    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
      {ticketHistory.map((log) => (
        <div key={log.id} className="p-3 rounded-lg bg-gray-50">
          <div className="flex justify-between items-center text-sm text-gray-600 mb-1">
            <span>
              <strong>{log.operator?.full_name || '系统'}</strong>
              <span className="ml-2">{log.action_type}</span>
            </span>
            <span>{formatDate(log.timestamp)}</span>
          </div>
          <p className="text-gray-800">{log.description}</p>
          {log.details && (
            <pre className="mt-1 text-xs text-gray-700 bg-gray-100 p-2 rounded overflow-x-auto">
              {JSON.stringify(log.details, null, 2)}
            </pre>
          )}
        </div>
      ))}
    </div>
  );
};

export default TicketHistoryLog;
```

### 10. `ticketStore.js` (Zustand 状态管理) 伪代码

使用 Zustand 管理工单相关的全局状态，包括工单列表、筛选条件、选中工单、详情工单、评论、历史记录等，并封装数据操作逻辑。

```jsx
// src/features/tickets/stores/ticketStore.js
import { create } from 'zustand';
import { ticketAPI } from '@/lib/api';

export const useTicketStore = create((set, get) => ({
  tickets: [],
  loading: false,
  searchTerm: '',
  statusFilter: '',
  priorityFilter: '',
  selectedTicketIds: [],
  selectedTicket: null,
  comments: [],
  ticketHistory: [],
  pagination: {
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  },

  setSearchTerm: (term) => set({ searchTerm: term, 'pagination.currentPage': 1 }),
  setStatusFilter: (status) => set({ statusFilter: status, 'pagination.currentPage': 1 }),
  setPriorityFilter: (priority) => set({ priorityFilter: priority, 'pagination.currentPage': 1 }),
  setSelectedTicket: (ticket) => set({ selectedTicket: ticket }),
  setShowDetailDialog: (isOpen) => set({ showDetailDialog: isOpen }), // 假设由store控制dialog状态
  setComments: (comments) => set({ comments: comments }),
  setTicketHistory: (history) => set({ ticketHistory: history }),
  setPagination: (newPagination) => set((state) => ({ pagination: { ...state.pagination, ...newPagination }})),

  fetchTickets: async () => {
    set({ loading: true });
    try {
      const { searchTerm, statusFilter, priorityFilter, pagination } = get();
      const params = {
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
        search: searchTerm,
        status: statusFilter,
        priority: priorityFilter,
        // ...其他排序参数
      };
      const data = await ticketAPI.getTickets(params);
      set({ 
        tickets: data.tickets || [],
        pagination: { 
          ...pagination, 
          totalItems: data.total_items, 
          totalPages: data.total_pages 
        }
      });
    } catch (error) {
      console.error('获取工单列表失败:', error);
      set({ tickets: [] });
      // 可以在这里触发全局Toast提示
    } finally {
      set({ loading: false });
    }
  },

  createTicket: async (ticketData) => {
    try {
      await ticketAPI.createTicket(ticketData);
      // 成功后不需要立即fetchTickets，因为CreateTicketDialog会调用fetchTickets
    } catch (error) {
      console.error('创建工单失败:', error);
      throw error; // 抛出错误以便组件处理
    }
  },

  handleUpdateTicketStatus: async (ticketId, newStatus) => {
    try {
      await ticketAPI.updateTicket(ticketId, { status: newStatus });
      set((state) => ({
        tickets: state.tickets.map((ticket) =>
          ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
        ),
        selectedTicket: state.selectedTicket?.id === ticketId ? { ...state.selectedTicket, status: newStatus } : state.selectedTicket,
      }));
      // 可以在这里触发全局Toast提示
    } catch (error) {
      console.error('更新工单状态失败:', error);
      throw error;
    }
  },

  toggleTicketSelection: (ticketId) => {
    set((state) => ({
      selectedTicketIds: state.selectedTicketIds.includes(ticketId)
        ? state.selectedTicketIds.filter((id) => id !== ticketId)
        : [...state.selectedTicketIds, ticketId],
    }));
  },

  toggleAllTicketsSelection: () => {
    set((state) => ({
      selectedTicketIds: state.selectedTicketIds.length === state.tickets.length && state.tickets.length > 0
        ? []
        : state.tickets.map((ticket) => ticket.id),
    }));
  },

  clearSelectedTickets: () => set({ selectedTicketIds: [] }),

  performBulkAction: async (actionType, ticketIds) => {
    try {
      // 根据actionType调用不同的API或执行不同的逻辑
      if (actionType === 'close') {
        await ticketAPI.bulkUpdateTickets(ticketIds, { status: 'closed' }); // 假设有批量更新API
      }
      // ... 其他批量操作
      get().fetchTickets(); // 刷新列表
      // 可以在这里触发全局Toast提示
    } catch (error) {
      console.error('批量操作失败:', error);
      throw error;
    }
  },

  addComment: async (ticketId, commentData) => {
    try {
      await ticketAPI.createTicketComment(ticketId, commentData);
      // 成功后，重新获取评论列表
      // get().fetchTicketComments(ticketId); // 或者直接更新本地comments状态
    } catch (error) {
      console.error('添加评论失败:', error);
      throw error;
    }
  },

  // ... 其他与工单相关的操作，如删除、编辑等
}));
```

### 11. `constants.js` (常量定义) 伪代码

将状态和优先级映射等常量集中管理。

```jsx
// src/lib/constants.js
export const statusMap = {
  'open': { label: '待处理', color: 'bg-blue-100 text-blue-800' },
  'in_progress': { label: '处理中', color: 'bg-yellow-100 text-yellow-800' },
  'pending': { label: '等待中', color: 'bg-orange-100 text-orange-800' },
  'resolved': { label: '已解决', color: 'bg-green-100 text-green-800' },
  'closed': { label: '已关闭', color: 'bg-gray-100 text-gray-800' }
};

export const priorityMap = {
  'low': { label: '低', color: 'bg-gray-100 text-gray-800' },
  'medium': { label: '中', color: 'bg-blue-100 text-blue-800' },
  'high': { label: '高', color: 'bg-orange-100 text-orange-800' },
  'urgent': { label: '紧急', color: 'bg-red-100 text-red-800' }
};

// 其他常量，如工单来源、SLA类型等
export const TICKET_SOURCES = ['web', 'email', 'phone', 'chat'];
export const SLA_STATUSES = ['on_track', 'warning', 'overdue'];
```

### 12. `utils.js` (工具函数) 伪代码

封装常用的工具函数。

```jsx
// src/lib/utils.js
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleString('zh-CN');
};

// 其他工具函数，如文件大小格式化、URL处理等
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
```

### 13. `apiClient.js` (API 客户端封装) 伪代码

统一 Axios 配置和请求拦截。

```jsx
// src/lib/apiClient.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '/api', // 从环境变量获取API基础URL
  timeout: 10000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：添加认证Token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // 假设Token存储在localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：统一错误处理
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // 服务器返回了错误状态码
      console.error('API Error:', error.response.data);
      // 可以根据不同的状态码进行处理，例如401跳转登录页
      if (error.response.status === 401) {
        // window.location.href = '/login';
      }
      // 可以在这里触发全局Toast提示
      // useToast().toast({ title: 'API错误', description: error.response.data.message, variant: 'destructive' });
    } else if (error.request) {
      // 请求已发出但没有收到响应
      console.error('No response received:', error.request);
      // useToast().toast({ title: '网络错误', description: '服务器无响应，请检查网络。', variant: 'destructive' });
    } else {
      // 其他错误
      console.error('Error:', error.message);
      // useToast().toast({ title: '未知错误', description: error.message, variant: 'destructive' });
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 14. `api.js` (API 调用) 伪代码

基于 `apiClient` 封装具体的 API 调用函数。

```jsx
// src/lib/api.js
import apiClient from './apiClient';

export const ticketAPI = {
  getTickets: async (params) => {
    const response = await apiClient.get('/tickets', { params });
    return response.data;
  },
  createTicket: async (ticketData) => {
    const response = await apiClient.post('/tickets', ticketData);
    return response.data;
  },
  updateTicket: async (ticketId, updateData) => {
    const response = await apiClient.put(`/tickets/${ticketId}`, updateData);
    return response.data;
  },
  deleteTicket: async (ticketId) => {
    const response = await apiClient.delete(`/tickets/${ticketId}`);
    return response.data;
  },
  getTicketComments: async (ticketId) => {
    const response = await apiClient.get(`/tickets/${ticketId}/comments`);
    return response.data;
  },
  createTicketComment: async (ticketId, commentData) => {
    const response = await apiClient.post(`/tickets/${ticketId}/comments`, commentData);
    return response.data;
  },
  getTicketHistory: async (ticketId) => {
    const response = await apiClient.get(`/tickets/${ticketId}/history`);
    return response.data;
  },
  bulkUpdateTickets: async (ticketIds, updateData) => {
    // 假设后端有一个批量更新的API
    const response = await apiClient.post('/tickets/bulk-update', { ids: ticketIds, ...updateData });
    return response.data;
  },
  getCategories: async () => {
    const response = await apiClient.get('/ticket-categories');
    return response.data;
  },
  uploadAttachment: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.post('/attachments/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};

export const customerAPI = {
  getCustomers: async () => {
    const response = await apiClient.get('/customers');
    return response.data;
  },
};

export const userAPI = {
  getUsers: async () => {
    const response = await apiClient.get('/users');
    return response.data;
  },
};
```

### 15. `RichTextEditor.jsx` (富文本编辑器) 伪代码

一个简单的富文本编辑器组件示例，可以使用第三方库实现。

```jsx
// src/components/common/RichTextEditor.jsx
import React, { useRef } from 'react';
// 假设使用 react-quill 或其他富文本库
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css'; // 或 'quill.bubble.css'

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const quillRef = useRef(null);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet',
    'link', 'image'
  ];

  return (
    <div className="rich-text-editor">
      {/* 实际项目中会集成一个富文本编辑器库，例如 ReactQuill */}
      {/* <ReactQuill
        ref={quillRef}
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        theme="snow"
      /> */}
      <textarea 
        className="w-full p-2 border rounded-md min-h-[100px]"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <p className="text-sm text-gray-500 mt-1">此处将集成富文本编辑器，目前为普通文本框。</p>
    </div>
  );
};

export default RichTextEditor;
```

### 16. `FileUploader.jsx` (文件上传器) 伪代码

一个简单的文件上传组件示例。

```jsx
// src/components/common/FileUploader.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ticketAPI } from '@/lib/api'; // 用于上传文件的API
import { formatFileSize } from '@/lib/utils';

const FileUploader = ({ onFilesChange, initialFiles = [] }) => {
  const [files, setFiles] = useState(initialFiles);
  const { toast } = useToast();

  const handleFileChange = async (event) => {
    const selectedFiles = Array.from(event.target.files);
    if (selectedFiles.length === 0) return;

    const uploadedFilesInfo = [];
    for (const file of selectedFiles) {
      try {
        // 模拟文件上传，实际应调用后端API
        // const response = await ticketAPI.uploadAttachment(file);
        // uploadedFilesInfo.push({ id: response.id, filename: file.name, url: response.url, size: file.size });
        
        // 模拟上传成功后的文件信息
        const mockFileUrl = URL.createObjectURL(file);
        uploadedFilesInfo.push({ 
          id: Date.now() + Math.random(), 
          filename: file.name, 
          url: mockFileUrl, 
          size: file.size 
        });

        toast({
          title: '上传成功',
          description: `文件 ${file.name} 上传成功。`,
        });
      } catch (error) {
        console.error('文件上传失败:', error);
        toast({
          title: '上传失败',
          description: `文件 ${file.name} 上传失败。`,
          variant: 'destructive',
        });
      }
    }
    const newFiles = [...files, ...uploadedFilesInfo];
    setFiles(newFiles);
    onFilesChange(newFiles);
  };

  const handleRemoveFile = (fileToRemove) => {
    const updatedFiles = files.filter(file => file.id !== fileToRemove.id);
    setFiles(updatedFiles);
    onFilesChange(updatedFiles);
    // 如果是实际上传的文件，可能需要调用API删除服务器上的文件
    if (fileToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(fileToRemove.url); // 释放模拟URL
    }
  };

  return (
    <div className="space-y-2">
      <Input 
        id="file-upload"
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden" // 隐藏默认文件输入框
      />
      <Label htmlFor="file-upload" className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
        <Upload className="w-4 h-4 mr-2" />
        选择文件
      </Label>
      <div className="mt-2">
        {files.map((file) => (
          <div key={file.id} className="flex items-center justify-between bg-gray-100 p-2 rounded-md mb-1">
            <span className="text-sm text-gray-800">{file.filename} ({formatFileSize(file.size)})</span>
            <Button variant="ghost" size="sm" onClick={() => handleRemoveFile(file)}>
              <X className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUploader;
```

### 17. `Pagination.jsx` (分页组件) 伪代码

一个通用的分页组件。

```jsx
// src/components/common/Pagination.jsx
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

const Pagination = ({ currentPage, pageSize, totalItems, onPageChange, onPageSizeChange }) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirstPage = () => {
    onPageChange(1);
  };

  const handleLastPage = () => {
    onPageChange(totalPages);
  };

  return (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex-1 text-sm text-gray-700">
        显示 {Math.min((currentPage - 1) * pageSize + 1, totalItems)} 到 {Math.min(currentPage * pageSize, totalItems)} 条，共 {totalItems} 条
      </div>
      <div className="flex items-center space-x-2">
        <Select value={pageSize.toString()} onValueChange={(value) => onPageSizeChange(Number(value))}>
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={pageSize} />
          </SelectTrigger>
          <SelectContent side="top">
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={handleFirstPage}
          disabled={currentPage === 1}
        >
          <span className="sr-only">Go to first page</span>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={handleNextPage}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={handleLastPage}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          <span className="sr-only">Go to last page</span>
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
```

### 18. `LoadingSpinner.jsx` (加载指示器) 伪代码

一个简单的加载指示器组件。

```jsx
// src/components/common/LoadingSpinner.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      <span className="ml-2 text-lg text-gray-700">加载中...</span>
    </div>
  );
};

export default LoadingSpinner;
```

### 19. `Toast.jsx` (统一的Toast提示组件) 伪代码

Shadcn UI 提供了 `useToast` Hook 和 `Toaster` 组件来管理 Toast 提示。通常 `Toaster` 会放在应用的根组件中。

```jsx
// src/components/common/Toast.jsx (这个文件通常不需要手动创建，而是使用Shadcn UI的Toaster)
// 假设你已经在 App.js 或 Layout.js 中引入了 Toaster 组件

// App.js (示例)
// import { Toaster } from '@/components/ui/toaster';
// function App() {
//   return (
//     <>
//       {/* 你的应用内容 */}
//       <Toaster />
//     </>
//   );
// }
// export default App;

// 在需要使用Toast的地方，直接使用 useToast Hook
// import { useToast } from '@/components/ui/use-toast';
// const { toast } = useToast();
// toast({ title: '成功', description: '操作成功。' });

const ToastPlaceholder = () => {
  return (
    <div className="fixed bottom-4 right-4 p-3 bg-gray-800 text-white rounded-md shadow-lg z-50">
      Toast 提示将在此处显示 (由 Shadcn UI 的 Toaster 组件管理)
    </div>
  );
};

export default ToastPlaceholder;
```

### 20. `useTickets.js` (自定义Hook) 伪代码

一个自定义 Hook，用于封装工单数据获取和管理逻辑，但考虑到 Zustand 已经提供了更强大的全局状态管理，此 Hook 的作用可能被 Zustand Store 部分替代。如果不需要全局状态，可以考虑使用此 Hook。

```jsx
// src/features/tickets/hooks/useTickets.js
import { useState, useEffect, useCallback } from 'react';
import { ticketAPI } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

const useTickets = (initialFilters = {}) => {
  const { toast } = useToast();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
        ...filters,
      };
      const data = await ticketAPI.getTickets(params);
      setTickets(data.tickets || []);
      setPagination(prev => ({ 
        ...prev, 
        totalItems: data.total_items, 
        totalPages: data.total_pages 
      }));
    } catch (err) {
      console.error('获取工单失败:', err);
      setError(err);
      toast({
        title: '错误',
        description: '获取工单列表失败。',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [filters, pagination.currentPage, pagination.pageSize]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPagination(prev => ({ ...prev, currentPage: 1 })); // 筛选条件改变时重置页码
  };

  const updatePagination = (newPagination) => {
    setPagination(prev => ({ ...prev, ...newPagination }));
  };

  // 其他工单操作，如创建、更新、删除等，也可以封装在这里
  const createTicket = async (ticketData) => {
    setLoading(true);
    try {
      await ticketAPI.createTicket(ticketData);
      toast({
        title: '成功',
        description: '工单创建成功。',
      });
      fetchTickets(); // 刷新列表
    } catch (err) {
      console.error('创建工单失败:', err);
      toast({
        title: '错误',
        description: '创建工单失败。',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    tickets,
    loading,
    error,
    filters,
    pagination,
    updateFilters,
    updatePagination,
    fetchTickets,
    createTicket,
    // ...其他操作
  };
};

export default useTickets;
```

### 21. `ticketUtils.js` (工单相关工具函数) 伪代码

将工单特有的辅助函数放在这里。

```jsx
// src/features/tickets/utils/ticketUtils.js

// 根据工单状态和优先级计算SLA状态的示例函数
export const calculateSlaStatus = (ticket) => {
  // 这是一个简化示例，实际SLA计算会更复杂
  const now = new Date();
  const createdAt = new Date(ticket.created_at);
  const hoursDiff = (now - createdAt) / (1000 * 60 * 60);

  if (ticket.status === 'resolved' || ticket.status === 'closed') {
    return 'on_track'; // 已解决或关闭的工单SLA正常
  }

  if (ticket.priority === 'urgent' && hoursDiff > 4) {
    return 'overdue';
  } else if (ticket.priority === 'high' && hoursDiff > 8) {
    return 'overdue';
  } else if (ticket.priority === 'medium' && hoursDiff > 24) {
    return 'overdue';
  } else if (ticket.priority === 'low' && hoursDiff > 48) {
    return 'overdue';
  }

  // 假设有即将超期的阈值
  if (ticket.priority === 'urgent' && hoursDiff > 3) {
    return 'warning';
  } else if (ticket.priority === 'high' && hoursDiff > 6) {
    return 'warning';
  }

  return 'on_track';
};

// 其他工单相关的辅助函数
// export const getTicketAssigneeName = (ticket) => { /* ... */ };
```

### 总结

以上伪代码展示了 `Tickets.jsx` 页面及其相关组件在功能增强、用户体验优化、性能提升和代码质量改进后的结构。通过模块化、状态管理、通用组件和工具函数的引入，整个工单管理模块将变得更加健壮、高效和易于维护。实际开发中，需要根据具体的技术栈和项目需求，填充伪代码中的具体实现细节，并进行充分的测试。


