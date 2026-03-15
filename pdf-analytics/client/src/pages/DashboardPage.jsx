import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardPage = () => {
  const { shareToken } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/analytics/${shareToken}`);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 10000); // Auto-refresh every 10 seconds
    return () => clearInterval(interval);
  }, [shareToken]);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  if (!analytics) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Could not load analytics.</div>;
  }

  const { totalViewers, avgReadingTimeSeconds, completionRate, pageStats, viewers } = analytics;

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400 mb-8">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card p-6 rounded-lg"> 
          <h3 className="text-gray-400">Total Viewers</h3>
          <p className="text-3xl font-bold">{totalViewers}</p>
        </div>
        <div className="bg-card p-6 rounded-lg">
          <h3 className="text-gray-400">Avg. Reading Time</h3>
          <p className="text-3xl font-bold">{(avgReadingTimeSeconds / 60).toFixed(2)} min</p>
        </div>
        <div className="bg-card p-6 rounded-lg">
          <h3 className="text-gray-400">Completion Rate</h3>
          <p className="text-3xl font-bold">{completionRate.toFixed(2)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-card p-6 rounded-lg">
          <h3 className="font-bold mb-4">Time Spent Per Page (seconds)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pageStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="page" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
              <Legend />
              <Bar dataKey="avgTimeSeconds" fill="#6366f1" name="Avg. Time (s)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card p-6 rounded-lg">
          <h3 className="font-bold mb-4">Viewer Drop-off</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pageStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="page" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" domain={[0, 100]} />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none' }} />
              <Legend formatter={(value, entry, index) => `${100 - value}%`} />
              <Bar dataKey="dropoffPercent" fill="#EF4444" name="Drop-off %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg">
        <h3 className="font-bold mb-4">Viewers</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="p-2">Viewer ID</th>
                <th className="p-2">First Seen</th>
                <th className="p-2">Last Seen</th>
                <th className="p-2">Pages Viewed</th>
                <th className="p-2">Total Time</th>
                <th className="p-2">Last Page</th>
              </tr>
            </thead>
            <tbody>
              {viewers.map(viewer => (
                <tr key={viewer.viewerId} className="border-b border-gray-800">
                  <td className="p-2 truncate max-w-xs">{viewer.viewerId}</td>
                  <td className="p-2">{new Date(viewer.firstSeen).toLocaleString()}</td>
                  <td className="p-2">{new Date(viewer.lastSeen).toLocaleString()}</td>
                  <td className="p-2">{viewer.pagesViewed.join(', ')}</td>
                  <td className="p-2">{(viewer.totalTimeSeconds / 60).toFixed(2)} min</td>
                  <td className="p-2">{viewer.lastPage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
