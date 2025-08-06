## 3. 个人资料页面 (Profile.jsx) 完善后的代码结构与关键代码片段（伪代码）

根据之前制定的详细开发完善方案，我们将对 `Profile.jsx` 进行模块化拆分和功能增强。以下是完善后的文件结构、主要组件的代码结构以及关键功能的伪代码实现。

### 3.1 文件结构概览

为了提高代码的可读性、可维护性和组件复用性，我们将 `Profile.jsx` 拆分为多个独立的组件，并引入状态管理和工具函数文件。新的文件结构将如下所示：

```
src/
├── components/
│   ├── ui/ (Shadcn UI 组件)
│   └── common/ (通用可复用组件)
│       ├── AvatarUploader.jsx (新增：头像上传组件)
│       ├── LoadingSpinner.jsx (现有：加载指示器)
│       └── Toast.jsx (现有：统一的Toast提示组件)
├── pages/
│   └── Profile.jsx (主页面，负责协调和数据流)
├── features/
│   └── users/ (与用户相关的特定功能模块)
│       ├── components/
│       │   ├── ProfileForm.jsx (新增：个人信息编辑表单)
│       │   ├── ProfileInfoCard.jsx (新增：个人信息概览卡片)
│       │   └── ChangePasswordDialog.jsx (新增：修改密码对话框或页面)
│       ├── stores/
│       │   └── userProfileStore.js (新增：Zustand状态管理)
│       └── utils/
│           └── userUtils.js (新增：用户相关工具函数，如表单验证)
├── lib/
│   ├── api.js (现有：API调用)
│   ├── apiClient.js (增强：Axios实例封装)
│   └── userAPI.js (新增：用户相关API封装)
└── contexts/
    └── AuthContext.js (现有：认证上下文)
```

### 3.2 `Profile.jsx` (主页面) 伪代码

`Profile.jsx` 将主要负责协调各个子组件，通过 `useUserProfileStore` 管理全局状态，并处理数据流。它将变得更加简洁，专注于组件的组合和高层逻辑。

```jsx
// src/pages/Profile.jsx
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useUserProfileStore } from '@/features/users/stores/userProfileStore';
import ProfileInfoCard from '@/features/users/components/ProfileInfoCard';
import ProfileForm from '@/features/users/components/ProfileForm';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import ChangePasswordDialog from '@/features/users/components/ChangePasswordDialog';

function Profile() {
  const { userProfile, loading, saving, fetchProfile, saveProfile, resetProfile } = useUserProfileStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleSave = async () => {
    try {
      await saveProfile();
    } catch (error) {
      // 错误已在store中处理，这里可以做额外处理或不处理
      console.error('保存个人资料失败:', error);
    }
  };

  const hasChanges = () => {
    // 比较 userProfile 和 originalProfile 来判断是否有更改
    const { userProfile, originalProfile } = useUserProfileStore.getState();
    if (!userProfile || !originalProfile) return false;
    // 仅比较可编辑字段
    const editableFields = ['full_name', 'email', 'phone', 'address', 'bio'];
    return editableFields.some(field => userProfile[field] !== originalProfile[field]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2 text-lg">加载中...</span>
      </div>
    );
  }

  if (!userProfile) {
    return <div className="p-6 text-center text-red-500">无法加载用户资料。</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">个人资料</h1>
        <div className="flex space-x-2">
          {hasChanges() && (
            <Button variant="outline" onClick={resetProfile}>
              重置
            </Button>
          )}
          <Button 
            onClick={handleSave} 
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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">修改密码</Button>
            </DialogTrigger>
            <ChangePasswordDialog />
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 用户信息概览 */}
        <ProfileInfoCard userProfile={userProfile} />

        {/* 编辑表单 */}
        <ProfileForm userProfile={userProfile} />
      </div>
    </div>
  );
}

export default Profile;
```

### 3.3 `userProfileStore.js` (Zustand 状态管理) 伪代码

使用 Zustand 管理用户个人资料相关的全局状态，包括用户资料、加载/保存状态以及数据操作逻辑。

```jsx
// src/features/users/stores/userProfileStore.js
import { create } from 'zustand';
import { userAPI } from '@/lib/userAPI'; // 引入封装好的API
import { toast } from 'sonner';

export const useUserProfileStore = create((set, get) => ({
  userProfile: null,
  originalProfile: null, // 用于重置功能
  loading: false,
  saving: false,
  error: null,

  fetchProfile: async () => {
    set({ loading: true, error: null });
    try {
      const data = await userAPI.getProfile();
      set({ userProfile: data, originalProfile: data });
    } catch (err) {
      set({ error: err });
      toast.error('获取个人资料失败。');
    } finally {
      set({ loading: false });
    }
  },

  updateProfileField: (field, value) => {
    set((state) => ({
      userProfile: { ...state.userProfile, [field]: value },
    }));
  },

  saveProfile: async () => {
    set({ saving: true, error: null });
    try {
      const { userProfile } = get();
      // 仅发送可编辑字段
      const dataToSave = {
        email: userProfile.email,
        full_name: userProfile.full_name,
        phone: userProfile.phone,
        address: userProfile.address,
        bio: userProfile.bio,
      };
      // 假设后端支持PATCH，如果不支持则使用PUT
      const updatedData = await userAPI.updateProfile(dataToSave);
      set({ userProfile: updatedData, originalProfile: updatedData });
      toast.success('个人资料保存成功！');
    } catch (err) {
      set({ error: err });
      toast.error('保存个人资料失败，请重试。');
      throw err; // 抛出错误以便组件可以捕获
    } finally {
      set({ saving: false });
    }
  },

  resetProfile: () => {
    set((state) => ({ userProfile: state.originalProfile }));
    toast.info('已重置为原始信息');
  },
}));
```

### 3.4 `ProfileInfoCard.jsx` (个人信息概览卡片) 伪代码

此组件将负责展示用户的基本信息、角色、联系方式等。

```jsx
// src/features/users/components/ProfileInfoCard.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, MapPin, Calendar, Shield } from 'lucide-react';
import { formatDate } from '@/lib/utils'; // 假设有formatDate工具函数
import AvatarUploader from '@/components/common/AvatarUploader';

const ProfileInfoCard = ({ userProfile }) => {
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="lg:col-span-1">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4 relative">
          <Avatar className="h-24 w-24">
            <AvatarImage src={userProfile.avatar_url} alt={userProfile.full_name} />
            <AvatarFallback className="text-2xl">
              {getInitials(userProfile.full_name || userProfile.username)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0">
            <AvatarUploader currentAvatarUrl={userProfile.avatar_url} />
          </div>
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
  );
};

export default ProfileInfoCard;
```

### 3.5 `ProfileForm.jsx` (个人信息编辑表单) 伪代码

此组件将封装个人信息编辑的表单逻辑，包括输入字段、验证和状态同步。

```jsx
// src/features/users/components/ProfileForm.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUserProfileStore } from '@/features/users/stores/userProfileStore';
import { useForm } from 'react-hook-form'; // 假设使用react-hook-form
import { zodResolver } from '@hookform/resolvers/zod'; // 假设使用zod进行验证
import * as z from 'zod';

// 定义表单验证 Schema
const profileFormSchema = z.object({
  full_name: z.string().min(1, { message: "姓名不能为空" }),
  email: z.string().email({ message: "请输入有效的邮箱地址" }),
  phone: z.string().optional(), // 可选，可添加更复杂的电话号码验证
  address: z.string().optional(),
  bio: z.string().optional(),
});

const ProfileForm = ({ userProfile }) => {
  const { updateProfileField } = useUserProfileStore();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileFormSchema),
    defaultValues: userProfile, // 初始化表单值
  });

  // 当userProfile从store更新时，同步表单默认值
  React.useEffect(() => {
    if (userProfile) {
      for (const key in userProfile) {
        if (profileFormSchema.shape[key]) { // 仅更新表单中存在的字段
          register(key).onChange({ target: { name: key, value: userProfile[key] } });
        }
      }
    }
  }, [userProfile, register]);

  const onSubmit = (data) => {
    // 实际的保存逻辑由父组件或store处理
    // 这里只是将表单数据同步到store
    for (const key in data) {
      updateProfileField(key, data[key]);
    }
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>编辑个人信息</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)}>
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
                {...register("full_name")}
                onChange={(e) => { register("full_name").onChange(e); updateProfileField('full_name', e.target.value); }}
                placeholder="请输入您的姓名"
              />
              {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="email">邮箱 *</Label>
              <Input 
                id="email" 
                type="email" 
                {...register("email")}
                onChange={(e) => { register("email").onChange(e); updateProfileField('email', e.target.value); }}
                placeholder="请输入您的邮箱"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">电话</Label>
              <Input 
                id="phone" 
                {...register("phone")}
                onChange={(e) => { register("phone").onChange(e); updateProfileField('phone', e.target.value); }}
                placeholder="请输入您的电话号码"
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <Label htmlFor="address">地址</Label>
            <Input 
              id="address" 
              {...register("address")}
              onChange={(e) => { register("address").onChange(e); updateProfileField('address', e.target.value); }}
              placeholder="请输入您的地址"
            />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
          </div>

          <div className="space-y-2 mt-4">
            <Label htmlFor="bio">个人简介</Label>
            <Textarea 
              id="bio" 
              {...register("bio")}
              onChange={(e) => { register("bio").onChange(e); updateProfileField('bio', e.target.value); }}
              placeholder="请输入您的个人简介"
              rows={4}
            />
            {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
          {/* 提交按钮由父组件Profile.jsx统一管理 */}
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileForm;
```

### 3.6 `AvatarUploader.jsx` (头像上传组件) 伪代码

此组件将处理头像的选择、预览和上传逻辑。

```jsx
// src/components/common/AvatarUploader.jsx
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Loader2 } from 'lucide-react';
import { useUserProfileStore } from '@/features/users/stores/userProfileStore';
import { userAPI } from '@/lib/userAPI';
import { toast } from 'sonner';

const AvatarUploader = ({ currentAvatarUrl }) => {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const { fetchProfile } = useUserProfileStore();

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('请选择图片文件。');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await userAPI.updateAvatar(formData);
      // 假设后端返回更新后的用户资料或新的头像URL
      // 如果后端只返回URL，需要手动更新store
      // useUserProfileStore.getState().updateProfileField('avatar_url', response.avatar_url);
      fetchProfile(); // 重新获取最新资料以更新头像
      toast.success('头像上传成功！');
    } catch (error) {
      console.error('头像上传失败:', error);
      toast.error('头像上传失败，请重试。');
    } finally {
      setUploading(false);
      // 清空文件输入，以便再次选择相同文件时能触发onChange
      event.target.value = null;
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <Button
        type="button"
        variant="secondary"
        size="icon"
        className="rounded-full w-8 h-8"
        onClick={handleClick}
        disabled={uploading}
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Camera className="h-4 w-4" />
        )}
        <span className="sr-only">上传头像</span>
      </Button>
    </div>
  );
};

export default AvatarUploader;
```

### 3.7 `ChangePasswordDialog.jsx` (修改密码对话框) 伪代码

此组件将提供一个模态对话框，用于用户修改密码。

```jsx
// src/features/users/components/ChangePasswordDialog.jsx
import React, { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from 'sonner';
import { userAPI } from '@/lib/userAPI';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const passwordSchema = z.object({
  oldPassword: z.string().min(1, { message: "旧密码不能为空" }),
  newPassword: z.string().min(6, { message: "新密码至少需要6个字符" }),
  confirmPassword: z.string().min(1, { message: "请确认新密码" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "两次输入的新密码不一致",
  path: ["confirmPassword"], // 错误信息关联到confirmPassword字段
});

const ChangePasswordDialog = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleChangePassword = async (data) => {
    setSaving(true);
    try {
      await userAPI.changePassword({
        old_password: data.oldPassword,
        new_password: data.newPassword,
      });
      toast.success('密码修改成功！');
      reset(); // 重置表单
      // 关闭对话框 (假设由父组件控制)
      // onOpenChange(false);
    } catch (error) {
      console.error('修改密码失败:', error);
      toast.error('修改密码失败，请检查旧密码或稍后再试。');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DialogContent className="max-w-md">
      <DialogHeader>
        <DialogTitle>修改密码</DialogTitle>
        <DialogDescription>请输入您的旧密码和新密码。</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(handleChangePassword)} className="space-y-4">
        <div>
          <Label htmlFor="oldPassword">旧密码</Label>
          <Input id="oldPassword" type="password" {...register("oldPassword")} />
          {errors.oldPassword && <p className="text-red-500 text-xs mt-1">{errors.oldPassword.message}</p>}
        </div>
        <div>
          <Label htmlFor="newPassword">新密码</Label>
          <Input id="newPassword" type="password" {...register("newPassword")} />
          {errors.newPassword && <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>}
        </div>
        <div>
          <Label htmlFor="confirmPassword">确认新密码</Label>
          <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>
        <DialogFooter className="flex justify-end space-x-2 mt-6">
          <Button variant="outline" onClick={() => { /* 关闭对话框 */ reset(); }}>
            取消
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : (
              '确认修改'
            )}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default ChangePasswordDialog;
```

### 3.8 `userAPI.js` (用户相关 API 封装) 伪代码

基于 `apiClient` 封装具体的 API 调用函数。

```jsx
// src/lib/userAPI.js
import apiClient from './apiClient';

export const userAPI = {
  getProfile: async () => {
    const response = await apiClient.get('/users/profile');
    return response.data;
  },
  updateProfile: async (profileData) => {
    // 假设后端支持PATCH，如果不支持则使用PUT
    const response = await apiClient.patch('/users/profile', profileData);
    return response.data;
  },
  updateAvatar: async (formData) => {
    // 专门用于头像上传的API，formData包含文件
    const response = await apiClient.post('/users/profile/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  changePassword: async (passwordData) => {
    const response = await apiClient.post('/users/change-password', passwordData);
    return response.data;
  },
  // ... 其他用户相关API
};
```

### 3.9 `apiClient.js` (增强：Axios 实例封装) 伪代码

在 `src/lib/apiClient.js` 中添加统一的错误处理和认证逻辑。

```jsx
// src/lib/apiClient.js
import axios from 'axios';
import { toast } from 'sonner'; // 假设全局toast可用

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
      const errorMessage = error.response.data.message || '服务器错误';
      toast.error(`操作失败: ${errorMessage}`);
      if (error.response.status === 401) {
        // 可选：重定向到登录页或刷新token
        // window.location.href = '/login';
      }
    } else if (error.request) {
      console.error('No response received:', error.request);
      toast.error('网络请求失败，请检查您的网络连接。');
    } else {
      console.error('Error:', error.message);
      toast.error(`发生未知错误: ${error.message}`);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### 总结

以上伪代码展示了 `Profile.jsx` 页面及其相关组件在功能增强、用户体验优化、性能提升和代码质量改进后的结构。通过模块化、状态管理、通用组件和工具函数的引入，整个个人资料管理模块将变得更加健壮、高效和易于维护。实际开发中，需要根据具体的技术栈和项目需求，填充伪代码中的具体实现细节，并进行充分的测试。


