import React, { useContext, useEffect, useState } from 'react';
import { UserDetailContext } from '@/context/UserDetailContext';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ChartBar as BarChart3, Activity, Zap, Users, Clock, TrendingUp, Database, Cpu, MemoryStick as Memory, HardDrive, Wifi, Plus, ArrowRight, Star, Calendar, Settings } from 'lucide-react';
import { Button } from '../ui/button';
import { useSidebar } from '../ui/sidebar';
import Link from 'next/link';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Dashboard() {
  const { userDetail } = useContext(UserDetailContext);
  const { setOpen } = useSidebar();
  const convex = useConvex();
  const [workspaces, setWorkspaces] = useState([]);
  const [metrics, setMetrics] = useState({
    totalProjects: 0,
    tokensUsed: 0,
    totalMessages: 0,
    avgResponseTime: 0,
    systemLoad: 0,
    memoryUsage: 0,
    diskUsage: 0,
    networkLatency: 0
  });
  const [loading, setLoading] = useState(true);

  // Close sidebar on dashboard load
  useEffect(() => {
    setOpen(false);
  }, [setOpen]);

  useEffect(() => {
    if (userDetail) {
      fetchDashboardData();
    }
  }, [userDetail]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const workspaceData = await convex.query(api.workspace.GetAllWorkspace, {
        userId: userDetail._id,
      });
      
      setWorkspaces(workspaceData || []);
      
      // Calculate metrics
      const totalMessages = workspaceData?.reduce((acc, workspace) => 
        acc + (workspace.messages?.length || 0), 0) || 0;
      
      const tokensUsed = Math.max(0, (userDetail.token || 50000) - 
        (workspaceData?.length * 1000 || 0));
      
      // Simulate system metrics (in real app, these would come from monitoring APIs)
      setMetrics({
        totalProjects: workspaceData?.length || 0,
        tokensUsed: tokensUsed,
        totalMessages: totalMessages,
        avgResponseTime: Math.random() * 2000 + 500, // 500-2500ms
        systemLoad: Math.random() * 100,
        memoryUsage: Math.random() * 100,
        diskUsage: Math.random() * 100,
        networkLatency: Math.random() * 100 + 10
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Chart data configurations
  const tokenUsageData = {
    labels: ['Used', 'Remaining'],
    datasets: [{
      data: [metrics.tokensUsed, Math.max(0, (userDetail?.token || 50000) - metrics.tokensUsed)],
      backgroundColor: ['#3B82F6', '#E5E7EB'],
      borderWidth: 0,
    }]
  };

  const performanceData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Response Time (ms)',
      data: [1200, 1100, 1300, 900, 1000, 1150, 950],
      borderColor: '#8B5CF6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      tension: 0.4,
    }]
  };

  const systemMetricsData = {
    labels: ['CPU', 'Memory', 'Disk', 'Network'],
    datasets: [{
      label: 'Usage %',
      data: [metrics.systemLoad, metrics.memoryUsage, metrics.diskUsage, metrics.networkLatency],
      backgroundColor: ['#EF4444', '#F59E0B', '#10B981', '#3B82F6'],
    }]
  };

  const MetricCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className="flex items-center text-green-400 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            +{trend}%
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-white mb-1">{value}</h3>
      <p className="text-gray-400 text-sm">{title}</p>
      {subtitle && <p className="text-gray-500 text-xs mt-1">{subtitle}</p>}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center animate-pulse">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {userDetail?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-400">Here's what's happening with your projects today.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Projects"
            value={metrics.totalProjects}
            icon={BarChart3}
            color="bg-blue-500"
            trend={12}
          />
          <MetricCard
            title="Tokens Used"
            value={`${(metrics.tokensUsed / 1000).toFixed(1)}K`}
            icon={Zap}
            color="bg-purple-500"
            subtitle={`${((userDetail?.token || 50000) / 1000).toFixed(1)}K available`}
          />
          <MetricCard
            title="Total Messages"
            value={metrics.totalMessages}
            icon={Users}
            color="bg-green-500"
            trend={8}
          />
          <MetricCard
            title="Avg Response Time"
            value={`${metrics.avgResponseTime.toFixed(0)}ms`}
            icon={Clock}
            color="bg-orange-500"
            subtitle="Last 24 hours"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Token Usage Chart */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-purple-400" />
              Token Usage
            </h3>
            <div className="h-64 flex items-center justify-center">
              <Doughnut 
                data={tokenUsageData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      labels: { color: '#fff' }
                    }
                  }
                }}
              />
            </div>
          </div>

          {/* Performance Chart */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-400" />
              LLM Performance
            </h3>
            <div className="h-64">
              <Line 
                data={performanceData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: { ticks: { color: '#9CA3AF' } },
                    y: { ticks: { color: '#9CA3AF' } }
                  },
                  plugins: {
                    legend: {
                      labels: { color: '#fff' }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* System Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* System Performance */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Cpu className="w-5 h-5 mr-2 text-red-400" />
              System Metrics
            </h3>
            <div className="h-48">
              <Bar 
                data={systemMetricsData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: { ticks: { color: '#9CA3AF' } },
                    y: { ticks: { color: '#9CA3AF' } }
                  },
                  plugins: {
                    legend: { display: false }
                  }
                }}
              />
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Database className="w-5 h-5 mr-2 text-blue-400" />
              System Status
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Cpu className="w-4 h-4 text-red-400 mr-2" />
                  <span className="text-gray-300">CPU Usage</span>
                </div>
                <span className="text-white font-medium">{metrics.systemLoad.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Memory className="w-4 h-4 text-yellow-400 mr-2" />
                  <span className="text-gray-300">Memory</span>
                </div>
                <span className="text-white font-medium">{metrics.memoryUsage.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <HardDrive className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-gray-300">Disk Usage</span>
                </div>
                <span className="text-white font-medium">{metrics.diskUsage.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Wifi className="w-4 h-4 text-blue-400 mr-2" />
                  <span className="text-gray-300">Network</span>
                </div>
                <span className="text-white font-medium">{metrics.networkLatency.toFixed(0)}ms</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <Settings className="w-5 h-5 mr-2 text-purple-400" />
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10">
                <Plus className="w-4 h-4 mr-2" />
                Create New Project
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10">
                <Star className="w-4 h-4 mr-2" />
                View Templates
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Demo
              </Button>
              <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10">
                <Settings className="w-4 h-4 mr-2" />
                Account Settings
              </Button>
            </div>
          </div>
        </div>

        {/* Recent Projects */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-blue-400" />
              Recent Projects
            </h3>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              View All
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
          
          {workspaces.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-white mb-2">No projects yet</h4>
              <p className="text-gray-400 mb-4">Create your first project to get started</p>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {workspaces.slice(0, 6).map((workspace, index) => (
                <Link key={workspace._id} href={`/workspace/${workspace._id}`}>
                  <div className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(workspace.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 className="text-white font-medium mb-2 truncate">
                      {workspace.messages?.[0]?.content?.substring(0, 50) || 'Untitled Project'}
                      {workspace.messages?.[0]?.content?.length > 50 && '...'}
                    </h4>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>{workspace.messages?.length || 0} messages</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;