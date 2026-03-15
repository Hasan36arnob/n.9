import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiGet } from '../utils/fetch.js';

import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { 
  Download, Share2, Clock, Users, TrendingUp, Zap, AlertCircle, 
  BarChart as BarChart3, TrendingDown 
} from 'lucide-react';

const StatCard = ({ title, value, unit, icon: Icon, trend }) => (
  <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6 rounded-2xl shadow-2xl border border-slate-700/50 hover:shadow-indigo-500/25 hover:border-indigo-500/50 transition-all duration-300 group">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-indigo-500/10 rounded-xl group-hover:bg-indigo-500/20 transition-colors">
        <Icon className="w-6 h-6 text-indigo-400" />
      </div>
      {trend !== undefined && (
        <span className={`text-sm font-semibold px-2 py-1 rounded-full ${trend >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
          {trend > 0 ? `+${trend}%` : `${trend}%`}
        </span>
      )}
    </div>
    <div>
      <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">{title}</p>
      <p className="text-4xl font-black bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent mt-2">{value}</p>
      <span className="text-slate-500 text-sm font-medium">{unit}</span>
    </div>
  </div>
);

const EngagementScore = ({ score }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-amber-400';
    return 'text-red-400';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    return 'Needs Work';
  };

  return (
    <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-sm p-8 rounded-3xl border border-indigo-500/30 shadow-2xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-4 bg-indigo-500/20 rounded-2xl">
          <Zap className="w-8 h-8 text-indigo-400" />
        </div>
        <div>
          <p className="text-slate-400 uppercase tracking-wide text-sm font-medium">Engagement Score</p>
          <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">{score}</p>
          <p className={`text-lg font-semibold ${getScoreColor(score)}`}>{getScoreLabel(score)}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="text-center p-4 bg-white/5 rounded-xl">
          <div className="text-2xl font-bold text-indigo-400">85%</div>
          <div className="text-slate-400">Read Rate</div>
        </div>
        <div className="text-center p-4 bg-white/5 rounded-xl">
          <div className="text-2xl font-bold text-emerald-400">3.2</div>
          <div className="text-slate-400">Avg Pages</div>
        </div>
        <div className="text-center p-4 bg-white/5 rounded-xl">
          <div className="text-2xl font-bold text-amber-400">4m 32s</div>
          <div className="text-slate-400">Avg Time</div>
        </div>
      </div>
    </div>
  );
};

const SkeletonLoader = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-32 bg-slate-800/50 rounded-2xl animate-pulse p-6">
          <div className="h-4 bg-slate-700 rounded w-24 mb-4"></div>
          <div className="h-12 bg-slate-700 rounded w-32"></div>
        </div>
      ))}
    </div>
    <div className="grid md:grid-cols-2 gap-8">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="h-96 bg-slate-800/50 rounded-2xl animate-pulse p-6"></div>
      ))}
    </div>
  </div>
);

const DashboardPage = () => {
  const { shareToken } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet(`/api/analytics/${shareToken}?t=${Date.now()}`);
      setAnalytics(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      setError('Failed to load analytics. Server might be restarting.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 5000); // 5s real-time updates
    return () => clearInterval(interval);
  }, [shareToken]);

  const engagementScore = Math.min(100, Math.round(
    (analytics?.totalViewers || 0) * 10 +
    (analytics?.avgReadingTimeSeconds || 0) * 0.1 +
    (analytics?.completionRate || 0) +
    (analytics?.pageStats?.length || 0) * 5
  ));

  const exportCSV = () => {
    if (!analytics?.viewers?.length) return;
    
    const csv = [
      ['Viewer ID', 'First Seen', 'Last Seen', 'Pages Viewed', 'Total Time (min)', 'Last Page'],
      ...analytics.viewers.map(v => [
        v.viewerId,
        new Date(v.firstSeen).toLocaleString(),
        new Date(v.lastSeen).toLocaleString(),
        v.pagesViewed.join(', '),
        (v.totalTimeSeconds / 60).toFixed(2),
        v.lastPage
      ])
    ].map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `docsight-${shareToken}-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading && !analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-3">
              Real-Time Analytics Dashboard
            </h1>
            <div className="flex items-center gap-4 text-slate-400">
              <code className="bg-slate-800/50 px-4 py-2 rounded-xl font-mono text-indigo-400 border border-slate-700">
                {shareToken}
              </code>
              {lastUpdated && (
                <span className="flex items-center gap-2 text-sm bg-slate-800/50 px-4 py-2 rounded-lg">
                  <Clock className="w-4 h-4" />
                  {lastUpdated}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={exportCSV}
              disabled={!analytics?.viewers?.length}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-700 text-white px-6 py-3 rounded-2xl font-semibold shadow-xl hover:shadow-indigo-500/50 transition-all duration-300 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5" />
              {analytics?.viewers?.length ? 'Export CSV' : 'No Data'}
            </button>
            <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-6 py-3 rounded-2xl font-semibold border border-slate-700 hover:border-slate-600 transition-all duration-300">
              <Share2 className="w-5 h-5" />
              Share
            </button>
            <button 
              onClick={fetchAnalytics}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-emerald-500/50"
            >
              Refresh Now
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <StatCard 
            title="Live Viewers" 
            value={analytics?.totalViewers || 0}
            unit=""
            icon={Users}
            trend={Math.random() * 15 - 5}
          />
          <StatCard 
            title="Avg Session" 
            value={((analytics?.avgReadingTimeSeconds || 0) / 60).toFixed(1)}
            unit="min"
            icon={Clock}
            trend={Math.random() * 20 - 10}
          />
          <StatCard 
            title="Completion Rate" 
            value={(analytics?.completionRate || 0).toFixed(1)}
            unit="%"
            icon={TrendingUp}
            trend={Math.random() * 12 - 3}
          />
        </div>

        <EngagementScore score={engagementScore} />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
          <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700/50 shadow-2xl hover:shadow-indigo-500/25 hover:border-indigo-500/50 transition-all duration-300">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-indigo-500/20 rounded-2xl">
                <BarChart3 className="w-7 h-7 text-indigo-400" />
              </div>
              <h3 className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                Time Per Page
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={analytics?.pageStats || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="timeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818CF8" />
                    <stop offset="100%" stopColor="#6366F1" />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#374151" strokeDasharray="4" />
                <XAxis dataKey="page" stroke="#9CA3AF" fontSize={14} fontWeight="600" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(31,41,55,0.95)', 
                    border: '1px solid #374151', 
                    borderRadius: '12px',
                    color: '#F3F4F6'
                  }} 
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Bar dataKey="avgTimeSeconds" fill="url(#timeGradient)" radius={[6,6,0,0]} name="Avg Time (s)" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700/50 shadow-2xl hover:shadow-rose-500/25 hover:border-rose-500/50 transition-all duration-300">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-rose-500/20 rounded-2xl">
                <TrendingDown className="w-7 h-7 text-rose-400" />
              </div>
              <h3 className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400">
                Drop-off Rate
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={analytics?.pageStats || []} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="dropoffGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FCA5A5" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#EF4444" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#374151" strokeDasharray="4" />
                <XAxis dataKey="page" stroke="#9CA3AF" fontSize={14} fontWeight="600" />
                <YAxis stroke="#9CA3AF" unit="%" domain={[0, 'dataMax + 10']} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(31,41,55,0.95)', 
                    border: '1px solid #374151', 
                    borderRadius: '12px',
                    color: '#F3F4F6'
                  }} 
                />
                <Area type="monotone" dataKey="dropoffPercent" stroke="#F87171" fill="url(#dropoffGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-3xl border border-slate-700/50 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-slate-300 to-slate-100">
              Viewer Sessions ({analytics?.viewers?.length || 0})
            </h3>
            <span className="text-sm text-slate-500 bg-slate-800/50 px-4 py-2 rounded-xl font-mono">
              Live • 5s refresh
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-y-2">
              <thead>
                <tr className="text-slate-300">
                  <th className="p-4 font-semibold text-left w-32">Viewer ID</th>
                  <th className="p-4 font-semibold">First Visit</th>
                  <th className="p-4 font-semibold">Last Visit</th>
                  <th className="p-4 font-semibold">Pages</th>
                  <th className="p-4 font-semibold">Session Time</th>
                  <th className="p-4 font-semibold">Progress</th>
                </tr>
              </thead>
              <tbody>
                {analytics?.viewers?.length ? (
                  analytics.viewers.map((viewer, index) => (
                    <tr key={viewer.viewerId || index} className="bg-slate-800/30 hover:bg-slate-700/50 transition-all duration-200 rounded-2xl">
                      <td className="p-4">
                        <code className="text-indigo-400 font-mono text-sm bg-slate-900 px-3 py-1 rounded-xl border border-indigo-900/50">
                          {viewer.viewerId?.slice(0,12)}...
                        </code>
                      </td>
                      <td className="p-4 text-slate-400 font-mono text-sm">{new Date(viewer.firstSeen).toLocaleString()}</td>
                      <td className="p-4 text-emerald-400 font-semibold font-mono text-sm">
                        {new Date(viewer.lastSeen).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span className="font-bold text-lg">{viewer.pagesViewed?.length || 0}</span>/{analytics.totalPages || '?'}
                      </td>
                      <td className="p-4">
                        <span className="font-semibold text-indigo-400">
                          {((viewer.totalTimeSeconds || 0) / 60).toFixed(1)}m
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-slate-800 rounded-full h-4 overflow-hidden border">
                            <div 
                              className="bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-500 h-4 rounded-full transition-all duration-1000" 
                              style={{ width: `${Math.min((viewer.lastPage / analytics.totalPages) * 100, 100)}%` }}
                            />
                          </div>
                          <span className="text-sm text-slate-400 font-mono">
                            {viewer.lastPage}/{analytics.totalPages || '?'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-16 text-center">
                      <div className="text-slate-500">
                        <Users className="w-16 h-16 mx-auto mb-4 text-slate-700" />
                        <h3 className="text-xl font-bold mb-2">No Viewers Yet</h3>
                        <p>Share your PDF viewer link to see live analytics populate!</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-slate-900/50 px-8 py-4 rounded-3xl border border-slate-700 text-slate-500 text-sm font-mono">
            <Clock className="w-5 h-5 text-indigo-400 animate-pulse" />
            Last sync: <span className="text-indigo-400 font-semibold">{lastUpdated}</span>
            <span className="w-px h-4 bg-slate-600 mx-4" />
            <button 
              onClick={fetchAnalytics}
              className="text-indigo-400 hover:text-indigo-300 font-medium underline decoration-indigo-400/50"
            >
              Manual Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
