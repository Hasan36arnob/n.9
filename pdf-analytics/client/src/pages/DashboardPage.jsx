import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatCard = ({ title, value, unit }) => (
  <div className="bg-card p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-300">
    <h3 className="text-muted-foreground text-sm font-medium">{title}</h3>
    <p className="text-3xl font-bold text-primary">{value} <span className="text-lg font-medium text-muted-foreground">{unit}</span></p>
  </div>
);

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
    return <div className="min-h-screen bg-background flex items-center justify-center text-primary">Loading analytics...</div>;
  }

  if (!analytics) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-destructive">Could not load analytics.</div>;
  }

  const { totalViewers, avgReadingTimeSeconds, completionRate, pageStats, viewers } = analytics;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-400">Analytics Dashboard</h1>
        <p className="text-muted-foreground">{shareToken}</p>
      </header>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Viewers" value={totalViewers} />
        <StatCard title="Avg. Reading Time" value={(avgReadingTimeSeconds / 60).toFixed(2)} unit="min" />
        <StatCard title="Completion Rate" value={completionRate.toFixed(2)} unit="%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h3 className="font-bold mb-4 text-lg">Time Spent Per Page</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pageStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="page" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', color: '#E5E7EB' }} />
              <Legend />
              <Bar dataKey="avgTimeSeconds" fill="#818CF8" name="Avg. Time (s)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-md">
          <h3 className="font-bold mb-4 text-lg">Viewer Drop-off</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={pageStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="page" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" domain={[0, 100]} unit="%" />
              <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', color: '#E5E7EB' }} />
              <Legend />
              <Bar dataKey="dropoffPercent" fill="#F87171" name="Drop-off %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-md">
        <h3 className="font-bold mb-4 text-lg">Viewer Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left table-auto">
            <thead className="border-b border-gray-700">
              <tr>
                <th className="p-3">Viewer ID</th>
                <th className="p-3">First Seen</th>
                <th className="p-3">Last Seen</th>
                <th className="p-3">Pages Viewed</th>
                <th className="p-3">Total Time</th>
                <th className="p-3">Last Page</th>
              </tr>
            </thead>
            <tbody>
              {viewers.map(viewer => (
                <tr key={viewer.viewerId} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="p-3 truncate max-w-xs font-mono text-sm">{viewer.viewerId}</td>
                  <td className="p-3">{new Date(viewer.firstSeen).toLocaleString()}</td>
                  <td className="p-3">{new Date(viewer.lastSeen).toLocaleString()}</td>
                  <td className="p-3">{viewer.pagesViewed.join(', ')}</td>
                  <td className="p-3">{(viewer.totalTimeSeconds / 60).toFixed(2)} min</td>
                  <td className="p-3">{viewer.lastPage}</td>
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
