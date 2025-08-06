## 3. 系统设置页面 (Settings.jsx) 完善后的代码结构与关键代码片段（伪代码）

根据之前制定的详细开发完善方案，我们将对 `Settings.jsx` 进行模块化拆分和功能增强。以下是完善后的文件结构、主要组件的代码结构以及关键功能的伪代码实现。

### 3.1 文件结构概览

为了提高代码的可读性、可维护性和组件复用性，我们将 `Settings.jsx` 拆分为多个独立的组件，并引入新的 API 服务。新的文件结构将如下所示：

```
src/
├── components/
│   ├── ui/ (Shadcn UI 组件)
│   └── common/ (通用可复用组件)
│       └── LoadingSpinner.jsx (现有：加载指示器)
├── pages/
│   └── Settings.jsx (主页面，负责协调和数据流)
├── features/
│   └── settings/ (与系统设置相关的特定功能模块)
│       ├── components/
│       │   ├── GeneralSettingsForm.jsx (新增：通用设置表单)
│       │   └── NotificationSettingsForm.jsx (新增：通知设置表单)
│       └── hooks/
│           └── useSettingsForm.js (新增：通用表单保存逻辑Hook)
├── lib/
│   ├── apiClient.js (增强：Axios实例封装)
│   └── settingsAPI.js (新增：系统设置相关API封装)
└── contexts/
    └── AuthContext.js (现有：认证上下文)
```

### 3.2 `Settings.jsx` (主页面) 伪代码

`Settings.jsx` 将主要负责协调各个子组件，处理数据的获取和传递，并管理整体的加载状态。它将变得更加简洁，专注于组件的组合和高层逻辑。

```jsx
// src/pages/Settings.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { settingsAPI } from '@/lib/settingsAPI';
import GeneralSettingsForm from '@/features/settings/components/GeneralSettingsForm';
import NotificationSettingsForm from '@/features/settings/components/NotificationSettingsForm';
import LoadingSpinner from '@/components/common/LoadingSpinner';

function Settings() {
  const [generalSettings, setGeneralSettings] = useState(null);
  const [notificationSettings, setNotificationSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const [generalRes, notificationRes] = await Promise.all([
        settingsAPI.getGeneralSettings(),
        settingsAPI.getNotificationSettings(),
      ]);
      setGeneralSettings(generalRes);
      setNotificationSettings(notificationRes);
    } catch (error) {
      console.error("获取设置失败:", error);
      toast.error("获取系统设置失败，请稍后再试。");
      // 可以设置默认值或空状态
      setGeneralSettings({});
      setNotificationSettings({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSaveGeneralSettings = async (data) => {
    try {
      await settingsAPI.updateGeneralSettings(data);
      setGeneralSettings(data); // 乐观更新UI
      toast.success("通用设置保存成功！");
    } catch (error) {
      console.error("保存通用设置失败:", error);
      toast.error("通用设置保存失败，请重试。");
      // 如果是悲观更新，这里需要重新fetchSettings()来同步后端数据
    }
  };

  const handleSaveNotificationSettings = async (data) => {
    try {
      await settingsAPI.updateNotificationSettings(data);
      setNotificationSettings(data); // 乐观更新UI
      toast.success("通知设置保存成功！");
    } catch (error) {
      console.error("保存通知设置失败:", error);
      toast.error("通知设置保存失败，请重试。");
      // 如果是悲观更新，这里需要重新fetchSettings()来同步后端数据
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">系统设置</h1>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">通用设置</TabsTrigger>
          <TabsTrigger value="notifications">通知设置</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="mt-4">
          {generalSettings && (
            <GeneralSettingsForm 
              initialSettings={generalSettings} 
              onSave={handleSaveGeneralSettings} 
            />
          )}
        </TabsContent>
        <TabsContent value="notifications" className="mt-4">
          {notificationSettings && (
            <NotificationSettingsForm 
              initialSettings={notificationSettings} 
              onSave={handleSaveNotificationSettings} 
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Settings;
```

### 3.3 `GeneralSettingsForm.jsx` (通用设置表单) 伪代码

此组件将封装通用设置的表单逻辑，包括输入字段、验证和保存。

```jsx
// src/features/settings/components/GeneralSettingsForm.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useSettingsForm } from '../hooks/useSettingsForm';

// 定义表单验证 Schema
const generalSettingsSchema = z.object({
  siteName: z.string().min(1, { message: "系统名称不能为空" }),
  contactEmail: z.string().email({ message: "请输入有效的联系邮箱地址" }),
  contactPhone: z.string().optional(), // 可根据需求添加更复杂的电话号码验证
});

const GeneralSettingsForm = ({ initialSettings, onSave }) => {
  const { register, handleSubmit, formState: { errors, isDirty }, reset } = useForm({
    resolver: zodResolver(generalSettingsSchema),
    defaultValues: initialSettings,
  });

  // 使用自定义Hook封装保存逻辑
  const { saving, handleSave } = useSettingsForm(onSave, reset);

  // 当 initialSettings 变化时，重置表单
  React.useEffect(() => {
    reset(initialSettings);
  }, [initialSettings, reset]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>通用设置</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(handleSave)}>
          <div className="grid gap-2 mb-4">
            <Label htmlFor="siteName">系统名称</Label>
            <Input id="siteName" {...register("siteName")} />
            {errors.siteName && <p className="text-red-500 text-xs mt-1">{errors.siteName.message}</p>}
          </div>
          <div className="grid gap-2 mb-4">
            <Label htmlFor="contactEmail">联系邮箱</Label>
            <Input id="contactEmail" type="email" {...register("contactEmail")} />
            {errors.contactEmail && <p className="text-red-500 text-xs mt-1">{errors.contactEmail.message}</p>}
          </div>
          <div className="grid gap-2 mb-4">
            <Label htmlFor="contactPhone">联系电话</Label>
            <Input id="contactPhone" {...register("contactPhone")} />
            {errors.contactPhone && <p className="text-red-500 text-xs mt-1">{errors.contactPhone.message}</p>}
          </div>
          <Button type="submit" disabled={saving || !isDirty}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : (
              '保存通用设置'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default GeneralSettingsForm;
```

### 3.4 `NotificationSettingsForm.jsx` (通知设置表单) 伪代码

此组件将封装通知设置的表单逻辑，包括复选框和保存。

```jsx
// src/features/settings/components/NotificationSettingsForm.jsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox'; // 使用Shadcn UI的Checkbox
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useSettingsForm } from '../hooks/useSettingsForm';

const NotificationSettingsForm = ({ initialSettings, onSave }) => {
  const { register, handleSubmit, formState: { isDirty }, reset } = useForm({
    defaultValues: initialSettings,
  });

  // 使用自定义Hook封装保存逻辑
  const { saving, handleSave } = useSettingsForm(onSave, reset);

  // 当 initialSettings 变化时，重置表单
  React.useEffect(() => {
    reset(initialSettings);
  }, [initialSettings, reset]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>通知设置</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(handleSave)}>
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              id="emailNotifications"
              {...register("emailNotifications", { type: "boolean" })}
              checked={initialSettings.emailNotifications} // 确保Checkbox受控
              onCheckedChange={(checked) => {
                // react-hook-form的register对于checkbox需要特殊处理
                // 或者直接使用setValue
                // register("emailNotifications").onChange({ target: { checked } });
                reset(prev => ({ ...prev, emailNotifications: checked }));
              }}
            />
            <Label htmlFor="emailNotifications">邮件通知</Label>
          </div>
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              id="smsNotifications"
              {...register("smsNotifications", { type: "boolean" })}
              checked={initialSettings.smsNotifications}
              onCheckedChange={(checked) => {
                reset(prev => ({ ...prev, smsNotifications: checked }));
              }}
            />
            <Label htmlFor="smsNotifications">短信通知</Label>
          </div>
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              id="pushNotifications"
              {...register("pushNotifications", { type: "boolean" })}
              checked={initialSettings.pushNotifications}
              onCheckedChange={(checked) => {
                reset(prev => ({ ...prev, pushNotifications: checked }));
              }}
            />
            <Label htmlFor="pushNotifications">推送通知</Label>
          </div>
          <Button type="submit" disabled={saving || !isDirty}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                保存中...
              </>
            ) : (
              '保存通知设置'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NotificationSettingsForm;
```

### 3.5 `useSettingsForm.js` (通用表单保存逻辑 Hook) 伪代码

此自定义 Hook 将封装表单的保存逻辑，包括 `loading` 状态管理和 `toast` 提示，减少代码重复。

```jsx
// src/features/settings/hooks/useSettingsForm.js
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export const useSettingsForm = (onSave, resetForm) => {
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async (data) => {
    setSaving(true);
    try {
      await onSave(data);
      // 如果onSave成功，重置表单的dirty状态
      if (resetForm) {
        resetForm(data); // 将表单重置为当前保存的数据，清除dirty状态
      }
    } catch (error) {
      // 错误处理已在apiClient或onSave中进行toast提示
      console.error("保存失败:", error);
    } finally {
      setSaving(false);
    }
  }, [onSave, resetForm]);

  return { saving, handleSave };
};
```

### 3.6 `settingsAPI.js` (系统设置相关 API 封装) 伪代码

基于 `apiClient` 封装具体的 API 调用函数。

```jsx
// src/lib/settingsAPI.js
import apiClient from './apiClient';

export const settingsAPI = {
  getGeneralSettings: async () => {
    const response = await apiClient.get('/settings/general');
    return response.data;
  },
  updateGeneralSettings: async (settingsData) => {
    const response = await apiClient.put('/settings/general', settingsData);
    return response.data;
  },
  getNotificationSettings: async () => {
    const response = await apiClient.get('/settings/notifications');
    return response.data;
  },
  updateNotificationSettings: async (settingsData) => {
    const response = await apiClient.put('/settings/notifications', settingsData);
    return response.data;
  },
  // ... 未来可能扩展的其他设置API
};
```

### 3.7 `apiClient.js` (增强：Axios 实例封装) 伪代码

在 `src/lib/apiClient.js` 中添加统一的错误处理和认证逻辑。这部分与 `Profile.jsx` 方案中的 `apiClient.js` 相同，确保全局统一。

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

以上伪代码展示了 `Settings.jsx` 页面及其相关组件在功能增强、用户体验优化、性能提升和代码质量改进后的结构。通过模块化、API 抽象、表单验证和通用 Hook 的引入，整个系统设置模块将变得更加健壮、高效和易于维护。实际开发中，需要根据具体的技术栈和项目需求，填充伪代码中的具体实现细节，并进行充分的测试。


