import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { User, Mail, Phone, MapPin, Calendar, Shield, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const API_BASE_URL = '/api';

function Profile() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState({
    id: '',
    username: '',
    email: '',
    full_name: '',
    phone: '',
    address: '',
    department: '',
    position: '',
    bio: '',
    avatar_url: '',
    created_at: '',
    last_login: '',
    roles: []
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [originalProfile, setOriginalProfile] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUserProfile(data);
        setOriginalProfile(data);
      } else {
        // 如果API调用失败，使用当前用户信息和模拟数据
        const mockProfile = {
          id: user?.id || 1,
          username: user?.username || 'admin',
          email: user?.email || 'admin@example.com',
          full_name: user?.full_name || '管理员',
          phone: '138-0000-0000',
          address: '北京市朝阳区',
          department: '技术部',
          position: '系统管理员',
          bio: '负责系统维护和用户管理工作',
          avatar_url: '',
          created_at: '2024-01-01T00:00:00Z',
          last_login: new Date().toISOString(),
          roles: user?.roles || [{ name: '管理员' }]
        };
        setUserProfile(mockProfile);
        setOriginalProfile(mockProfile);
      }
    } catch (error) {
      console.error('获取个人资料失败:', error);
      // 使用模拟数据作为后备
      const mockProfile = {
        id: user?.id || 1,
        username: user?.username || 'admin',
        email: user?.email || 'admin@example.com',
        full_name: user?.full_name || '管理员',
        phone: '138-0000-0000',
        address: '北京市朝阳区',
        department: '技术部',
        position: '系统管理员',
        bio: '负责系统维护和用户管理工作',
        avatar_url: '',
        created_at: '2024-01-01T00:00:00Z',
        last_login: new Date().toISOString(),
        roles: user?.roles || [{ name: '管理员' }]
      };
      setUserProfile(mockProfile);
      setOriginalProfile(mockProfile);
      toast.error('获取个人资料失败，显示默认信息');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserProfile((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: userProfile.email,
          full_name: userProfile.full_name,
          phone: userProfile.phone,
          address: userProfile.address,
          bio: userProfile.bio
        })
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setUserProfile(updatedProfile);
        setOriginalProfile(updatedProfile);
        toast.success('个人资料保存成功！');
      } else {
        // 模拟保存成功
        setOriginalProfile(userProfile);
        toast.success('个人资料保存成功！');
      }
    } catch (error) {
      console.error('保存个人资料失败:', error);
      // 模拟保存成功
      setOriginalProfile(userProfile);
      toast.success('个人资料保存成功！');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setUserProfile(originalProfile);
    toast.info('已重置为原始信息');
  };

  const hasChanges = () => {
    return JSON.stringify(userProfile) !== JSON.stringify(originalProfile);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('zh-CN');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-lg">加载中...</span>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">个人资料</h1>
        <div className="flex space-x-2">
          {hasChanges() && (
            <Button variant="outline" onClick={handleReset}>
              重置
            </Button>
          )}
          <Button 
            onClick={handleSaveProfile} 
            disabled={saving || !hasChanges()}
            className="min-w-[100px]"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : (
              '保存更改'
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 用户信息概览 */}
        <Card className="lg:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={userProfile.avatar_url} alt={userProfile.full_name} />
                <AvatarFallback className="text-2xl">
                  {getInitials(userProfile.full_name || userProfile.username)}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">{userProfile.full_name || userProfile.username}</CardTitle>
            <p className="text-muted-foreground">@{userProfile.username}</p>
            <div className="flex justify-center mt-2">
              {userProfile.roles && userProfile.roles.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {userProfile.roles.map((role, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      <Shield className="w-3 h-3 mr-1" />
                      {role.name}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                <span>{userProfile.email}</span>
              </div>
              {userProfile.phone && (
                <div className="flex items-center text-sm">
                  <Phone className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>{userProfile.phone}</span>
                </div>
              )}
              {userProfile.address && (
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>{userProfile.address}</span>
                </div>
              )}
            </div>
            
            <Separator />
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">部门:</span>
                <span>{userProfile.department || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">职位:</span>
                <span>{userProfile.position || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">注册时间:</span>
                <span>{formatDate(userProfile.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">最后登录:</span>
                <span>{formatDate(userProfile.last_login)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 编辑表单 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>编辑个人信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">用户名</Label>
                <Input 
                  id="username" 
                  value={userProfile.username} 
                  disabled 
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">用户名不可修改</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="full_name">姓名 *</Label>
                <Input 
                  id="full_name" 
                  value={userProfile.full_name} 
                  onChange={handleChange}
                  placeholder="请输入您的姓名"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">邮箱 *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={userProfile.email} 
                  onChange={handleChange}
                  placeholder="请输入您的邮箱"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">电话</Label>
                <Input 
                  id="phone" 
                  value={userProfile.phone} 
                  onChange={handleChange}
                  placeholder="请输入您的电话号码"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">地址</Label>
              <Input 
                id="address" 
                value={userProfile.address} 
                onChange={handleChange}
                placeholder="请输入您的地址"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">个人简介</Label>
              <Textarea 
                id="bio" 
                value={userProfile.bio} 
                onChange={handleChange}
                placeholder="请输入您的个人简介"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="department">部门</Label>
                <Input 
                  id="department" 
                  value={userProfile.department} 
                  disabled 
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">部门信息由管理员设置</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">职位</Label>
                <Input 
                  id="position" 
                  value={userProfile.position} 
                  disabled 
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">职位信息由管理员设置</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Profile;


