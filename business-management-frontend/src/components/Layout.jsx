import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Users,
  UserCheck,
  Building2,
  FolderOpen,
  Ticket,
  BarChart3,
  Settings,
  Menu,
  LogOut,
  User,
  Home,
} from 'lucide-react';
import { authAPI } from '@/lib/api';

const Layout = () => {
  const { user, logout, hasPermission } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      logout();
      navigate('/login');
    }
  };

  const menuItems = [
    {
      title: '仪表板',
      icon: Home,
      path: '/dashboard',
      permission: null,
    },
    {
      title: '用户管理',
      icon: Users,
      path: '/users',
      permission: 'user_read',
    },
    {
      title: '角色权限',
      icon: UserCheck,
      path: '/roles',
      permission: 'role_read',
    },
    {
      title: '客户管理',
      icon: Building2,
      path: '/customers',
      permission: 'customer_read',
    },
    {
      title: '项目管理',
      icon: FolderOpen,
      path: '/projects',
      permission: 'project_read',
    },
    {
      title: '售后服务',
      icon: Ticket,
      path: '/tickets',
      permission: 'ticket_read',
    },
    {
      title: '数据报表',
      icon: BarChart3,
      path: '/reports',
      permission: null,
    },
    {
      title: '系统设置',
      icon: Settings,
      path: '/settings',
      permission: 'user_read',
    },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    !item.permission || hasPermission(item.permission)
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-primary">业务管理系统</h2>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* 桌面端侧边栏 */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-1 min-h-0 bg-card border-r">
          <SidebarContent />
        </div>
      </div>

      {/* 移动端侧边栏 */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* 主内容区域 */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* 顶部导航栏 */}
        <header className="bg-card border-b px-4 py-3 flex items-center justify-between">
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-64">
                <SidebarContent />
              </SheetContent>
            </Sheet>
            <h1 className="ml-4 text-xl font-semibold text-foreground">
              {filteredMenuItems.find(item => item.path === location.pathname)?.title || '业务管理系统'}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">{user?.full_name || user?.username}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>我的账户</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  个人资料
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  设置
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  退出登录
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* 主内容 */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

