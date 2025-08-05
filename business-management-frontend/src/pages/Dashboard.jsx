import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Building2, 
  FolderOpen, 
  Ticket, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, hasPermission } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    customers: 0,
    projects: 0,
    tickets: 0,
    activeProjects: 0,
    pendingTickets: 0,
    completedTasks: 0,
    totalTasks: 0,
  });

  useEffect(() => {
    // 模拟数据加载
    setStats({
      users: 25,
      customers: 156,
      projects: 12,
      tickets: 34,
      activeProjects: 8,
      pendingTickets: 12,
      completedTasks: 45,
      totalTasks: 67,
    });
  }, []);

  const quickActions = [
    {
      title: '新建客户',
      description: '添加新的客户信息',
      icon: Building2,
      path: '/customers/new',
      permission: 'customer_create',
      color: 'bg-blue-500',
    },
    {
      title: '创建项目',
      description: '启动新的项目',
      icon: FolderOpen,
      path: '/projects/new',
      permission: 'project_create',
      color: 'bg-green-500',
    },
    {
      title: '创建工单',
      description: '处理客户服务请求',
      icon: Ticket,
      path: '/tickets/new',
      permission: 'ticket_create',
      color: 'bg-orange-500',
    },
    {
      title: '用户管理',
      description: '管理系统用户',
      icon: Users,
      path: '/users',
      permission: 'user_read',
      color: 'bg-purple-500',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'project',
      title: '项目"网站重构"状态更新',
      description: '项目进度已更新至75%',
      time: '2小时前',
      status: 'info',
    },
    {
      id: 2,
      type: 'ticket',
      title: '工单 #TK001 已解决',
      description: '客户反馈的登录问题已修复',
      time: '4小时前',
      status: 'success',
    },
    {
      id: 3,
      type: 'customer',
      title: '新客户注册',
      description: 'ABC科技有限公司已加入客户列表',
      time: '1天前',
      status: 'info',
    },
    {
      id: 4,
      type: 'task',
      title: '任务逾期提醒',
      description: '有3个任务即将到期，请及时处理',
      time: '2天前',
      status: 'warning',
    },
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 欢迎信息 */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">
          欢迎回来，{user?.full_name || user?.username}！
        </h1>
        <p className="text-blue-100">
          今天是 {new Date().toLocaleDateString('zh-CN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            weekday: 'long'
          })}
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总用户数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              较上月增长 12%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">客户总数</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.customers}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              较上月增长 8%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">活跃项目</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeProjects}</div>
            <p className="text-xs text-muted-foreground">
              总项目数: {stats.projects}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">待处理工单</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTickets}</div>
            <p className="text-xs text-muted-foreground">
              总工单数: {stats.tickets}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 快捷操作 */}
        <Card>
          <CardHeader>
            <CardTitle>快捷操作</CardTitle>
            <CardDescription>
              常用功能快速入口
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {quickActions
                .filter(action => !action.permission || hasPermission(action.permission))
                .map((action) => {
                  const Icon = action.icon;
                  return (
                    <Link key={action.path} to={action.path}>
                      <Button
                        variant="outline"
                        className="h-auto p-4 flex flex-col items-center space-y-2 hover:bg-accent"
                      >
                        <div className={`p-2 rounded-full ${action.color} text-white`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-sm">{action.title}</div>
                          <div className="text-xs text-muted-foreground">
                            {action.description}
                          </div>
                        </div>
                      </Button>
                    </Link>
                  );
                })}
            </div>
          </CardContent>
        </Card>

        {/* 最近活动 */}
        <Card>
          <CardHeader>
            <CardTitle>最近活动</CardTitle>
            <CardDescription>
              系统最新动态
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {activity.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 任务进度 */}
      <Card>
        <CardHeader>
          <CardTitle>任务完成情况</CardTitle>
          <CardDescription>
            当前任务执行进度
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">总体进度</span>
            <span className="text-sm text-muted-foreground">
              {stats.completedTasks}/{stats.totalTasks}
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(stats.completedTasks / stats.totalTasks) * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>已完成: {stats.completedTasks}</span>
            <span>进行中: {stats.totalTasks - stats.completedTasks}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

