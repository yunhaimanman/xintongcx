import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const API_BASE_URL = '/api';

function Profile() {
  const [userProfile, setUserProfile] = useState({
    username: 'admin',
    email: 'admin@example.com',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // In a real application, fetch user profile data here
    // For demonstration, we use mock data
    // const fetchProfile = async () => {
    //   setLoading(true);
    //   try {
    //     const response = await fetch(`${API_BASE_URL}/profile`);
    //     const data = await response.json();
    //     setUserProfile(data);
    //   } catch (error) {
    //     console.error('Error fetching profile:', error);
    //     toast.error('获取个人资料失败！');
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserProfile((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      // In a real app, send updated profile to API
      console.log('Saving profile:', userProfile);
      toast.success('个人资料保存成功！');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('个人资料保存失败！');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">个人资料</h1>

      <Card>
        <CardHeader>
          <CardTitle>编辑个人资料</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="username">用户名</Label>
            <Input id="username" value={userProfile.username} onChange={handleChange} disabled />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">邮箱</Label>
            <Input id="email" type="email" value={userProfile.email} onChange={handleChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">电话</Label>
            <Input id="phone" value={userProfile.phone} onChange={handleChange} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">地址</Label>
            <Input id="address" value={userProfile.address} onChange={handleChange} />
          </div>
          <Button onClick={handleSaveProfile} disabled={loading}>保存更改</Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default Profile;


