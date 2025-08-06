import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Calendar, CalendarIcon, Plus, Search, Filter, MoreHorizontal, Users, Clock, DollarSign,
  Edit, Trash2, Eye, UserPlus, CheckCircle, AlertCircle, XCircle, Pause, Play,
  TrendingUp, Target, Calendar as CalendarIcon2, FileText, BarChart3
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const ProjectsDemo = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isMemberDialogOpen, setIsMemberDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [editingProject, setEditingProject] = useState(null);

  // 项目状态映射
  const statusMap = {
    planning: { 
      label: '规划中', 
      color: 'bg-blue-100 text-blue-800',
      icon: FileText
    },
    active: { 
      label: '进行中', 
      color: 'bg-green-100 text-green-800',
      icon: Play
    },
    on_hold: { 
      label: '暂停', 
      color: 'bg-yellow-100 text-yellow-800',
      icon: Pause
    },
    completed: { 
      label: '已完成', 
      color: 'bg-gray-100 text-gray-800',
      icon: CheckCircle
    },
    cancelled: { 
      label: '已取消', 
      color: 'bg-red-100 text-red-800',
      icon: XCircle
    }
  };

  // 优先级映射
  const priorityMap = {
    low: { label: '低', color: 'bg-gray-100 text-gray-800' },
    medium: { label: '中', color: 'bg-blue-100 text-blue-800' },
    high: { label: '高', color: 'bg-red-100 text-red-800' },
    urgent: { label: '紧急', color: 'bg-purple-100 text-purple-800' }
  };

  // 模拟数据
  useEffect(() => {
    setTimeout(() => {
      const mockProjects = [
        {
          id: 1,
          name: '企业级CRM系统开发',
          description: '开发一套完整的客户关系管理系统，包括客户管理、销售管理、营销自动化等功能模块。系统需要支持多租户架构，提供灵活的权限管理和数据安全保障。',
          status: 'active',
          priority: 'high',
          budget: 500000,
          start_date: '2024-01-15',
          end_date: '2024-06-30',
          progress: 65,
          manager: { id: 1, name: '张三', avatar: '' },
          members: [
            { id: 1, name: '张三', role: '项目经理', avatar: '' },
            { id: 2, name: '李四', role: '前端开发', avatar: '' },
            { id: 3, name: '王五', role: '后端开发', avatar: '' },
            { id: 4, name: '赵六', role: 'UI设计师', avatar: '' }
          ],
          tasks_total: 45,
          tasks_completed: 29,
          created_at: '2024-01-10T00:00:00Z'
        },
        {
          id: 2,
          name: '移动应用开发项目',
          description: '开发一款企业内部使用的移动应用，支持iOS和Android平台。应用包含员工管理、考勤打卡、审批流程等核心功能。',
          status: 'planning',
          priority: 'medium',
          budget: 300000,
          start_date: '2024-03-01',
          end_date: '2024-08-31',
          progress: 15,
          manager: { id: 2, name: '李四', avatar: '' },
          members: [
            { id: 2, name: '李四', role: '项目经理', avatar: '' },
            { id: 5, name: '孙七', role: 'iOS开发', avatar: '' },
            { id: 6, name: '周八', role: 'Android开发', avatar: '' }
          ],
          tasks_total: 32,
          tasks_completed: 5,
          created_at: '2024-02-20T00:00:00Z'
        },
        {
          id: 3,
          name: '数据分析平台',
          description: '构建企业数据分析平台，提供实时数据监控和分析报告功能。平台支持多种数据源接入，提供可视化图表和智能分析建议。',
          status: 'completed',
          priority: 'high',
          budget: 800000,
          start_date: '2023-09-01',
          end_date: '2024-02-29',
          progress: 100,
          manager: { id: 3, name: '王五', avatar: '' },
          members: [
            { id: 3, name: '王五', role: '项目经理', avatar: '' },
            { id: 7, name: '吴九', role: '数据工程师', avatar: '' },
            { id: 8, name: '郑十', role: '前端开发', avatar: '' }
          ],
          tasks_total: 58,
          tasks_completed: 58,
          created_at: '2023-08-15T00:00:00Z'
        },
        {
          id: 4,
          name: '网站重构项目',
          description: '对公司官网进行全面重构，提升用户体验和性能。采用现代化的前端技术栈，优化SEO和移动端适配。',
          status: 'on_hold',
          priority: 'low',
          budget: 150000,
          start_date: '2024-02-15',
          end_date: '2024-05-15',
          progress: 35,
          manager: { id: 4, name: '赵六', avatar: '' },
          members: [
            { id: 4, name: '赵六', role: '项目经理', avatar: '' },
            { id: 9, name: '钱十一', role: '前端开发', avatar: '' }
          ],
          tasks_total: 25,
          tasks_completed: 9,
          created_at: '2024-02-01T00:00:00Z'
        },
        {
          id: 5,
          name: '智能客服系统',
          description: '开发基于AI的智能客服系统，支持自然语言处理和自动回复。系统能够处理常见问题，提升客服效率。',
          status: 'active',
          priority: 'urgent',
          budget: 400000,
          start_date: '2024-02-01',
          end_date: '2024-07-31',
          progress: 45,
          manager: { id: 5, name: '孙七', avatar: '' },
          members: [
            { id: 5, name: '孙七', role: '项目经理', avatar: '' },
            { id: 10, name: '李十二', role: 'AI工程师', avatar: '' },
            { id: 11, name: '周十三', role: '后端开发', avatar: '' }
          ],
          tasks_total: 38,
          tasks_completed: 17,
          created_at: '2024-01-25T00:00:00Z'
        }
      ];
      setProjects(mockProjects);
      setLoading(false);
    }, 1000);
  }, []);

  // 过滤项目
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // 统计数据
  const stats = {
    total: projects.length,
    active: projects.filter(p => p.status === 'active').length,
    completed: projects.filter(p => p.status === 'completed').length,
    onHold: projects.filter(p => p.status === 'on_hold').length,
    totalBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
    avgProgress: projects.length > 0 ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) : 0
  };

  // 重置项目表单
  const resetProjectForm = () => ({
    name: '',
    description: '',
    priority: 'medium',
    budget: '',
    start_date: null,
    end_date: null,
    status: 'planning'
  });

  const [projectForm, setProjectForm] = useState(resetProjectForm());

  // 创建项目
  const handleCreateProject = async (e) => {
    e.preventDefault();
    
    if (!projectForm.name) {
      alert('请填写项目名称');
      return;
    }

    try {
      const newProject = {
        id: projects.length + 1,
        ...projectForm,
        budget: projectForm.budget ? parseFloat(projectForm.budget) : null,
        start_date: projectForm.start_date ? format(projectForm.start_date, 'yyyy-MM-dd') : null,
        end_date: projectForm.end_date ? format(projectForm.end_date, 'yyyy-MM-dd') : null,
        progress: 0,
        manager: { id: 1, name: '当前用户', avatar: '' },
        members: [{ id: 1, name: '当前用户', role: '项目经理', avatar: '' }],
        tasks_total: 0,
        tasks_completed: 0,
        created_at: new Date().toISOString()
      };

      setProjects([...projects, newProject]);
      setIsCreateDialogOpen(false);
      setProjectForm(resetProjectForm());
      alert('项目创建成功');
    } catch (error) {
      console.error('创建项目失败:', error);
      alert('创建项目失败');
    }
  };

  // 编辑项目
  const handleEditProject = (project) => {
    setEditingProject(project);
    setProjectForm({
      name: project.name,
      description: project.description,
      priority: project.priority,
      budget: project.budget?.toString() || '',
      start_date: project.start_date ? new Date(project.start_date) : null,
      end_date: project.end_date ? new Date(project.end_date) : null,
      status: project.status
    });
    setIsEditDialogOpen(true);
  };

  // 更新项目
  const handleUpdateProject = async (e) => {
    e.preventDefault();
    
    if (!projectForm.name) {
      alert('请填写项目名称');
      return;
    }

    try {
      const updatedProjects = projects.map(project => 
        project.id === editingProject.id 
          ? { 
              ...project, 
              ...projectForm,
              budget: projectForm.budget ? parseFloat(projectForm.budget) : null,
              start_date: projectForm.start_date ? format(projectForm.start_date, 'yyyy-MM-dd') : null,
              end_date: projectForm.end_date ? format(projectForm.end_date, 'yyyy-MM-dd') : null
            }
          : project
      );
      
      setProjects(updatedProjects);
      setIsEditDialogOpen(false);
      setEditingProject(null);
      setProjectForm(resetProjectForm());
      alert('项目更新成功');
    } catch (error) {
      console.error('更新项目失败:', error);
      alert('更新项目失败');
    }
  };

  // 删除项目
  const handleDeleteProject = async (projectId) => {
    if (!confirm('确定要删除这个项目吗？此操作不可撤销。')) return;
    
    try {
      setProjects(projects.filter(project => project.id !== projectId));
      alert('项目删除成功');
    } catch (error) {
      console.error('删除项目失败:', error);
      alert('删除项目失败');
    }
  };

  // 查看项目详情
  const handleViewProject = (project) => {
    setSelectedProject(project);
    setIsViewDialogOpen(true);
  };

  // 管理项目成员
  const handleManageMembers = (project) => {
    setSelectedProject(project);
    setIsMemberDialogOpen(true);
  };

  // 项目表单组件
  const ProjectForm = ({ isEdit = false }) => (
    <form onSubmit={isEdit ? handleUpdateProject : handleCreateProject} className="space-y-4">
      <div>
        <Label htmlFor="name">项目名称 *</Label>
        <Input
          id="name"
          value={projectForm.name}
          onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
          placeholder="请输入项目名称"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="description">项目描述</Label>
        <Textarea
          id="description"
          value={projectForm.description}
          onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
          placeholder="请输入项目描述"
          rows={3}
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="priority">优先级</Label>
          <Select value={projectForm.priority} onValueChange={(value) => setProjectForm({ ...projectForm, priority: value })}>
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
        
        {isEdit && (
          <div>
            <Label htmlFor="status">项目状态</Label>
            <Select value={projectForm.status} onValueChange={(value) => setProjectForm({ ...projectForm, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="planning">规划中</SelectItem>
                <SelectItem value="active">进行中</SelectItem>
                <SelectItem value="on_hold">暂停</SelectItem>
                <SelectItem value="completed">已完成</SelectItem>
                <SelectItem value="cancelled">已取消</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      <div>
        <Label htmlFor="budget">预算</Label>
        <Input
          id="budget"
          type="number"
          value={projectForm.budget}
          onChange={(e) => setProjectForm({ ...projectForm, budget: e.target.value })}
          placeholder="请输入预算金额"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>开始日期</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !projectForm.start_date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {projectForm.start_date ? format(projectForm.start_date, "yyyy-MM-dd") : "选择日期"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={projectForm.start_date}
                onSelect={(date) => setProjectForm({ ...projectForm, start_date: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <Label>结束日期</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !projectForm.end_date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {projectForm.end_date ? format(projectForm.end_date, "yyyy-MM-dd") : "选择日期"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={projectForm.end_date}
                onSelect={(date) => setProjectForm({ ...projectForm, end_date: date })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => {
            if (isEdit) {
              setIsEditDialogOpen(false);
              setEditingProject(null);
            } else {
              setIsCreateDialogOpen(false);
            }
            setProjectForm(resetProjectForm());
          }}
        >
          取消
        </Button>
        <Button type="submit">
          {isEdit ? '更新项目' : '创建项目'}
        </Button>
      </div>
    </form>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">加载中...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="text-center py-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">项目管理系统演示</h1>
        <p className="text-lg text-gray-600">完整的项目管理功能展示，包括项目列表、搜索、筛选、新增、编辑和删除</p>
      </div>

      {/* 页面标题和统计卡片 */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">项目管理</h2>
            <p className="text-muted-foreground">管理和跟踪项目进度</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                新建项目
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>创建新项目</DialogTitle>
                <DialogDescription>
                  填写项目基本信息来创建新项目
                </DialogDescription>
              </DialogHeader>
              <ProjectForm />
            </DialogContent>
          </Dialog>
        </div>

        {/* 统计卡片 */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总项目数</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                活跃项目 {stats.active} 个
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">已完成</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completed}</div>
              <p className="text-xs text-muted-foreground">
                暂停项目 {stats.onHold} 个
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总预算</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">¥{stats.totalBudget.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                所有项目预算总和
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">平均进度</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgProgress}%</div>
              <p className="text-xs text-muted-foreground">
                所有项目平均完成度
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 搜索和筛选栏 */}
      <div className="flex space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="搜索项目名称或描述..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="筛选状态" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">所有状态</SelectItem>
            <SelectItem value="planning">规划中</SelectItem>
            <SelectItem value="active">进行中</SelectItem>
            <SelectItem value="on_hold">暂停</SelectItem>
            <SelectItem value="completed">已完成</SelectItem>
            <SelectItem value="cancelled">已取消</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="筛选优先级" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">所有优先级</SelectItem>
            <SelectItem value="low">低</SelectItem>
            <SelectItem value="medium">中</SelectItem>
            <SelectItem value="high">高</SelectItem>
            <SelectItem value="urgent">紧急</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 项目列表 */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project) => {
          const StatusIcon = statusMap[project.status]?.icon || FileText;
          return (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <div className="flex space-x-2">
                      <Badge className={statusMap[project.status]?.color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {statusMap[project.status]?.label}
                      </Badge>
                      <Badge variant="outline" className={priorityMap[project.priority]?.color}>
                        {priorityMap[project.priority]?.label}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewProject(project)}>
                        <Eye className="w-4 h-4 mr-2" />
                        查看详情
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditProject(project)}>
                        <Edit className="w-4 h-4 mr-2" />
                        编辑项目
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleManageMembers(project)}>
                        <UserPlus className="w-4 h-4 mr-2" />
                        管理成员
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteProject(project.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        删除项目
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent>
                <CardDescription className="mb-4 line-clamp-2">
                  {project.description || '暂无描述'}
                </CardDescription>
                
                <div className="space-y-3">
                  {project.budget && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <DollarSign className="mr-2 h-4 w-4" />
                      预算: ¥{project.budget.toLocaleString()}
                    </div>
                  )}
                  
                  {project.start_date && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-2 h-4 w-4" />
                      {project.start_date} - {project.end_date || '待定'}
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-2 h-4 w-4" />
                    团队成员: {project.members?.length || 0}人
                  </div>
                  
                  {project.tasks_total > 0 && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      任务: {project.tasks_completed}/{project.tasks_total}
                    </div>
                  )}
                  
                  {project.progress !== undefined && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>进度</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {/* 项目经理信息 */}
                  {project.manager && (
                    <div className="flex items-center space-x-2 pt-2 border-t">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={project.manager.avatar} />
                        <AvatarFallback>{project.manager.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        项目经理: {project.manager.name}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">
            {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all' ? '没有找到匹配的项目' : '暂无项目'}
          </div>
          {!searchTerm && statusFilter === 'all' && priorityFilter === 'all' && (
            <p className="text-gray-400 mt-2">点击"新建项目"开始创建第一个项目</p>
          )}
        </div>
      )}

      {/* 编辑项目对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>编辑项目</DialogTitle>
            <DialogDescription>
              修改项目信息
            </DialogDescription>
          </DialogHeader>
          <ProjectForm isEdit={true} />
        </DialogContent>
      </Dialog>

      {/* 项目详情对话框 */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>项目详情</DialogTitle>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">项目名称</Label>
                  <p className="text-lg font-semibold">{selectedProject.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">项目状态</Label>
                  <div className="mt-1">
                    <Badge className={statusMap[selectedProject.status]?.color}>
                      {statusMap[selectedProject.status]?.label}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">项目描述</Label>
                <p className="mt-1">{selectedProject.description || '暂无描述'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">优先级</Label>
                  <div className="mt-1">
                    <Badge className={priorityMap[selectedProject.priority]?.color}>
                      {priorityMap[selectedProject.priority]?.label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">预算</Label>
                  <p className="mt-1">¥{selectedProject.budget?.toLocaleString() || '未设置'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">开始日期</Label>
                  <p className="mt-1">{selectedProject.start_date || '未设置'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">结束日期</Label>
                  <p className="mt-1">{selectedProject.end_date || '未设置'}</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">项目进度</Label>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>完成度</span>
                    <span>{selectedProject.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${selectedProject.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">团队成员</Label>
                <div className="mt-2 space-y-2">
                  {selectedProject.members?.map((member) => (
                    <div key={member.id} className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 成员管理对话框 */}
      <Dialog open={isMemberDialogOpen} onOpenChange={setIsMemberDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>管理项目成员</DialogTitle>
            <DialogDescription>
              添加或移除项目团队成员
            </DialogDescription>
          </DialogHeader>
          {selectedProject && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">当前成员</h4>
                <Button size="sm">
                  <UserPlus className="w-4 h-4 mr-2" />
                  添加成员
                </Button>
              </div>
              
              <div className="space-y-3">
                {selectedProject.members?.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={member.avatar} />
                        <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      移除
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectsDemo;

