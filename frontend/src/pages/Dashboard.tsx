import React, { useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Sprout, AlertCircle, Calendar, ArrowUpRight, ArrowDownRight, BarChart3 } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import { usePrediction } from '../hooks/usePrediction';
import { useAuth } from '../hooks/useAuth';
import { HISTORICAL_YIELD_TRENDS } from '../utils/constants';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { dashboardStats, fetchDashboardStats, isLoading } = usePrediction();

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  // Use actual data from predictions or fall back to historical data
  const hasPredictions = dashboardStats && dashboardStats.totalPredictions > 0;
  
  const avgYield = hasPredictions 
    ? dashboardStats.averageYield.toFixed(2) 
    : '2.15';
    
  const totalPredictions = hasPredictions 
    ? dashboardStats.totalPredictions 
    : 0;
  
  // Calculate trend percentage
  const getTrendPercentage = () => {
    if (!hasPredictions || !dashboardStats.trendData || dashboardStats.trendData.length < 2) {
      return '+8%';
    }
    
    const data = dashboardStats.trendData;
    const latest = data[data.length - 1].yield;
    const previous = data[data.length - 2].yield;
    const change = ((latest - previous) / previous) * 100;
    
    return `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  const trendPercentage = getTrendPercentage();
  const isPositiveTrend = !trendPercentage.startsWith('-');
  
  const stats = [
    { 
      label: 'Total Predictions', 
      value: totalPredictions.toString(), 
      change: hasPredictions ? 'Recent Activity' : 'Get Started', 
      up: true, 
      icon: <BarChart3 className="text-emerald-600" /> 
    },
    { 
      label: 'Avg Yield (Mt/Ha)', 
      value: avgYield, 
      change: trendPercentage, 
      up: isPositiveTrend, 
      icon: <Sprout className="text-emerald-600" /> 
    },
    { 
      label: hasPredictions ? 'Latest Prediction' : 'Make Prediction', 
      value: hasPredictions && dashboardStats.lastPredictionDate 
        ? new Date(dashboardStats.lastPredictionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        : '—', 
      change: hasPredictions ? 'Updated' : 'Start Now', 
      up: true, 
      icon: <TrendingUp className="text-blue-600" /> 
    },
  ];

  // Combine historical data with user predictions
  const getTrendData = () => {
    if (!hasPredictions || !dashboardStats.trendData || dashboardStats.trendData.length === 0) {
      // Use historical data with year labels
      return HISTORICAL_YIELD_TRENDS.map(item => ({
        dateLabel: item.year.toString(),
        yield: item.yield
      }));
    }
    
    // Use user's prediction data, label by month/year
    return dashboardStats.trendData.map(item => {
      const date = new Date(item.date);
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();
      return {
        dateLabel: `${month} ${year}`,
        yield: item.yield
      };
    });
  };

  const trendData = getTrendData();

  return (
    <Layout>
      <div className="space-y-8 animate-in fade-in duration-500">
        <header>
          <h1 className="text-4xl font-bold text-stone-900 mb-2">
            Welcome back, {user?.name || 'Farmer'}!
          </h1>
          <p className="text-stone-500">
            {hasPredictions 
              ? "Here's an overview of your crop predictions and insights." 
              : "Start making predictions to see your personalized dashboard."}
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-stone-50 rounded-xl">
                  {stat.icon}
                </div>
                <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
                  stat.up ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}>
                  {stat.up ? <ArrowUpRight size={14} className="mr-1" /> : <ArrowDownRight size={14} className="mr-1" />}
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-stone-500 text-sm font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold text-stone-900 mt-1">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-stone-800">
                {hasPredictions ? 'Your Yield Trends' : 'Historical Yield Trends'}
              </h3>
              <div className="flex gap-2">
                <span className="flex items-center text-xs text-stone-500 bg-stone-100 px-3 py-1 rounded-full">
                  {hasPredictions ? 'Your Data' : 'Historical Data'}
                </span>
              </div>
            </div>
            
            {isLoading ? (
              <div className="h-[300px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              </div>
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="dateLabel" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 12}} 
                      dy={10} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 12}}
                      label={{ value: 'Yield (Mt/Ha)', angle: -90, position: 'insideLeft', style: { fill: '#94a3b8', fontSize: 12 } }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' 
                      }}
                      formatter={(value: any) =>
                        typeof value === 'number'
                          ? [`${value.toFixed(2)} Mt/Ha`, 'Yield']
                          : ['—', 'Yield']
                      }
                    />
                    <Area 
                      type="monotone" 
                      dataKey="yield" 
                      stroke="#059669" 
                      strokeWidth={3} 
                      fillOpacity={1} 
                      fill="url(#colorYield)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            {!hasPredictions && (
              <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <p className="text-sm text-emerald-800">
                  <strong>📊 Showing historical data (2011-2021)</strong><br />
                  Make your first prediction to see personalized trends!
                </p>
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-emerald-700 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">PFJ Phase 2</h3>
                <p className="text-emerald-100 text-sm mb-4">
                  The new Planting for Food and Jobs initiative is now active in Northern districts. Input subsidies have increased by 15%.
                </p>
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white py-2 px-4 rounded-lg text-sm font-semibold transition-all">
                  Learn Impact
                </button>
              </div>
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Sprout size={100} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-100">
              <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
                <Calendar size={18} className="text-amber-500" />
                Upcoming Planting Windows
              </h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-amber-50 rounded-xl flex flex-col items-center justify-center text-amber-700">
                    <span className="text-[10px] font-bold uppercase">Mar</span>
                    <span className="text-lg font-bold leading-none">15</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-900">Southern Sector</p>
                    <p className="text-xs text-stone-500">Major Season Start</p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex flex-col items-center justify-center text-blue-700">
                    <span className="text-[10px] font-bold uppercase">May</span>
                    <span className="text-lg font-bold leading-none">01</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-900">Northern Sector</p>
                    <p className="text-xs text-stone-500">Land Preparation</p>
                  </div>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex flex-col items-center justify-center text-emerald-700">
                    <span className="text-[10px] font-bold uppercase">Jun</span>
                    <span className="text-lg font-bold leading-none">10</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-stone-900">Ashanti Region</p>
                    <p className="text-xs text-stone-500">Optimal Planting</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-stone-900 text-white p-8 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold mb-6">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a 
              href="/predict" 
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-6 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-500/20 rounded-lg">
                  <Sprout className="text-emerald-400" size={20} />
                </div>
                <h4 className="font-bold">New Prediction</h4>
              </div>
              <p className="text-sm text-stone-300">Create a yield forecast</p>
            </a>
            
            <a 
              href="/insights" 
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-6 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <TrendingUp className="text-blue-400" size={20} />
                </div>
                <h4 className="font-bold">View Insights</h4>
              </div>
              <p className="text-sm text-stone-300">Learn farming tips</p>
            </a>
            
            <a 
              href="/profile" 
              className="bg-white/10 hover:bg-white/20 backdrop-blur-md p-6 rounded-xl transition-all group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <AlertCircle className="text-amber-400" size={20} />
                </div>
                <h4 className="font-bold">Update Profile</h4>
              </div>
              <p className="text-sm text-stone-300">Manage your account</p>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;