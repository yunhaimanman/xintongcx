import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Edit, Trash2, Shield, UserCheck } from 'lucide-react';

const API_BASE_URL = '/api';

function Roles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [newRole, setNewRole] = useState({ name: '', description: '' });
  const [editingRole, setEditingRole] = useState(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/roles`);
      const data = await response.json();
      setRoles(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching roles:', error);
      setLoading(false);
    }
  };

  const handleAddRole = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRole),
      });
      if (response.ok) {
        fetchRoles();
        setNewRole({ name: '', description: '' });
      } else {
        console.error('Failed to add role');
      }
    } catch (error) {
      console.error('Error adding role:', error);
    }
  };

  const handleEditRole = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/roles/${editingRole.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingRole),
      });
      if (response.ok) {
        fetchRoles();
        setEditingRole(null);
      } else {
        console.error('Failed to edit role');
      }
    } catch (error) {
      console.error('Error editing role:', error);
    }
  };

  const handleDeleteRole = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/roles/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchRoles();
      } else {
        console.error('Failed to delete role');
      }
    } catch (error) {
      console.error('Error deleting role:', error);
    }
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="p-6">加载中...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">角色权限管理</h1>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">角色列表</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" />添加新角色</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingRole ? '编辑角色' : '添加新角色'}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">角色名称</Label>
                  <Input id="name" value={editingRole ? editingRole.name : newRole.name} onChange={(e) => editingRole ? setEditingRole({ ...editingRole, name: e.target.value }) : setNewRole({ ...newRole, name: e.target.value })} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">描述</Label>
                  <Textarea id="description" value={editingRole ? editingRole.description : newRole.description} onChange={(e) => editingRole ? setEditingRole({ ...editingRole, description: e.target.value }) : setNewRole({ ...newRole, description: e.target.value })} className="col-span-3" />
                </div>
              </div>
              <Button onClick={editingRole ? handleEditRole : handleAddRole}>{editingRole ? '保存更改' : '添加角色'}</Button>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <Input
              placeholder="搜索角色..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Search className="ml-2 h-4 w-4 text-muted-foreground" />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>名称</TableHead>
                <TableHead>描述</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.id}</TableCell>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm" onClick={() => setEditingRole(role)}><Edit className="h-4 w-4" /></Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>编辑角色</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">角色名称</Label>
                            <Input id="name" value={editingRole?.name || ''} onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })} className="col-span-3" />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="description" className="text-right">描述</Label>
                            <Textarea id="description" value={editingRole?.description || ''} onChange={(e) => setEditingRole({ ...editingRole, description: e.target.value })} className="col-span-3" />
                          </div>
                        </div>
                        <Button onClick={handleEditRole}>保存更改</Button>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="sm" onClick={() => handleDeleteRole(role.id)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default Roles;


