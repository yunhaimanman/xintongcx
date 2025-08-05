import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, LineChart, PieChart, Users, DollarSign, Briefcase, TrendingUp } from 'lucide-react';

const API_BASE_URL = '/api';

function Reports() {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      // This is a placeholder. In a real application, you would fetch actual report data.
      // For demonstration, we'll use mock data.
      const mockData = {
        totalUsers: 120,
        totalCustomers: 350,
        totalProjects: 80,
        totalTickets: 200,
        revenueLastMonth: 50000,
        newCustomersLastMonth: 25,
        completedProjectsLastMonth: 15,
        closedTicketsLastMonth: 180,
      };
      setReportData(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching report data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6">加载中...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">数据报表</h1>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">总览</TabsTrigger>
          <TabsTrigger value="users">用户</TabsTrigger>
          <TabsTrigger value="customers">客户</TabsTrigger>
          <TabsTrigger value="projects">项目</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总用户数</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.totalUsers}</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总客户数</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.totalCustomers}</div>
                <p className="text-xs text-muted-foreground">+18.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总项目数</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.totalProjects}</div>
                <p className="text-xs text-muted-foreground">+10.2% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总工单数</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{reportData.totalTickets}</div>
                <p className="text-xs text-muted-foreground">+5.3% from last month</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>月度收入</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {/* Placeholder for a Bar Chart */}
                  <BarChart className="w-full h-full" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>新客户增长</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {/* Placeholder for a Line Chart */}
                  <LineChart className="w-full h-full" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="users" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>用户统计</CardTitle>
            </CardHeader>
            <CardContent>
              <p>用户统计数据和图表将在这里展示。</p>
              {/* Add more detailed user reports here */}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="customers" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>客户统计</CardTitle>
            </CardHeader>
            <CardContent>
              <p>客户统计数据和图表将在这里展示。</p>
              {/* Add more detailed customer reports here */}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="projects" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>项目统计</CardTitle>
            </CardHeader>
            <CardContent>
              <p>项目统计数据和图表将在这里展示。</p>
              {/* Add more detailed project reports here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Reports;


