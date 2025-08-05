import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const API_BASE_URL = '/api';

function Settings() {
  const [generalSettings, setGeneralSettings] = useState({
    siteName: '业务管理系统',
    contactEmail: 'admin@example.com',
    contactPhone: '+1234567890',
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
  });
  const [loading, setLoading] = useState(false);

  // In a real application, you would fetch existing settings here
  useEffect(() => {
    // Mock fetching settings
    // setLoading(true);
    // setTimeout(() => {
    //   setGeneralSettings({ siteName: 'My Business CRM', contactEmail: 'info@mybusiness.com', contactPhone: '123-456-7890' });
    //   setNotificationSettings({ emailNotifications: true, smsNotifications: false, pushNotifications: true });
    //   setLoading(false);
    // }, 1000);
  }, []);

  const handleGeneralSettingsChange = (e) => {
    const { id, value } = e.target;
    setGeneralSettings((prev) => ({ ...prev, [id]: value }));
  };

  const handleNotificationSettingsChange = (e) => {
    const { id, checked } = e.target;
    setNotificationSettings((prev) => ({ ...prev, [id]: checked }));
  };

  const saveGeneralSettings = async () => {
    setLoading(true);
    try {
      // In a real app, send to API
      console.log('Saving general settings:', generalSettings);
      toast.success('通用设置保存成功！');
    } catch (error) {
      console.error('Error saving general settings:', error);
      toast.error('通用设置保存失败！');
    } finally {
      setLoading(false);
    }
  };

  const saveNotificationSettings = async () => {
    setLoading(true);
    try {
      // In a real app, send to API
      console.log('Saving notification settings:', notificationSettings);
      toast.success('通知设置保存成功！');
    } catch (error) {
      console.error('Error saving notification settings:', error);
      toast.error('通知设置保存失败！');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">系统设置</h1>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">通用设置</TabsTrigger>
          <TabsTrigger value="notifications">通知设置</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>通用设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="siteName">系统名称</Label>
                <Input id="siteName" value={generalSettings.siteName} onChange={handleGeneralSettingsChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contactEmail">联系邮箱</Label>
                <Input id="contactEmail" type="email" value={generalSettings.contactEmail} onChange={handleGeneralSettingsChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contactPhone">联系电话</Label>
                <Input id="contactPhone" value={generalSettings.contactPhone} onChange={handleGeneralSettingsChange} />
              </div>
              <Button onClick={saveGeneralSettings} disabled={loading}>保存通用设置</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>通知设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="emailNotifications"
                  checked={notificationSettings.emailNotifications}
                  onChange={handleNotificationSettingsChange}
                  className="h-4 w-4"
                />
                <Label htmlFor="emailNotifications">邮件通知</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="smsNotifications"
                  checked={notificationSettings.smsNotifications}
                  onChange={handleNotificationSettingsChange}
                  className="h-4 w-4"
                />
                <Label htmlFor="smsNotifications">短信通知</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="pushNotifications"
                  checked={notificationSettings.pushNotifications}
                  onChange={handleNotificationSettingsChange}
                  className="h-4 w-4"
                />
                <Label htmlFor="pushNotifications">推送通知</Label>
              </div>
              <Button onClick={saveNotificationSettings} disabled={loading}>保存通知设置</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Settings;


