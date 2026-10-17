import React, { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'listings' | 'reports'
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search and Filter States
  const [userSearch, setUserSearch] = useState('');
  const [listingSearch, setListingSearch] = useState('');
  const [listingCategory, setListingCategory] = useState('ALL');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [reportsRes, usersRes, listingsRes] = await Promise.all([
        fetch('/api/admin/reports', { credentials: 'include' }),
        fetch('/api/admin/users', { credentials: 'include' }),
        fetch('/api/admin/listings', { credentials: 'include' })
      ]);

      if (!reportsRes.ok || !usersRes.ok || !listingsRes.ok) {
        throw new Error("Unauthorized or failed to fetch admin data.");
      }

      const reportsData = await reportsRes.json();
      const usersData = await usersRes.json();
      const listingsData = await listingsRes.json();

      setReports(reportsData.data?.reports || reportsData.reports || []);
      setUsers(usersData.data?.users || usersData.users || []);
      setListings(listingsData.data?.listings || listingsData.listings || []);
    } catch (err) {
      console.error("Admin dashboard fetch error:", err);
      setError("Access denied or server error while loading dashboard.");
    } finally {
      setLoading(false);
    }
  };

  // Delete/Remove Listing Handler
  const handleDeleteListing = async (listingId) => {
    if (!window.confirm("Are you sure you want to remove this listing?")) return;
    try {
      const res = await fetch(`/api/items/${listingId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        setListings(prev => prev.filter(item => item._id !== listingId));
        alert("Listing removed successfully.");
      } else {
        alert("Failed to remove listing.");
      }
    } catch (err) {
      console.error(err);
      alert("Error removing listing.");
    }
  };

  // Filtered Logic
  const filteredUsers = users.filter(u => 
    (u.name || u.username || '').toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredListings = listings.filter(item => {
    const matchesSearch = (item.title || '').toLowerCase().includes(listingSearch.toLowerCase()) ||
                          (item.description || '').toLowerCase().includes(listingSearch.toLowerCase());
    const matchesCategory = listingCategory === 'ALL' || item.category === listingCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) return <div style={{ padding: '40px', fontSize: '18px' }}>Loading Admin Dashboard...</div>;
  if (error) return <div style={{ padding: '40px', color: 'red', fontSize: '18px' }}>⚠️ {error}</div>;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif', background: '#f4f6f9' }}>
      
      {/* Sidebar Navigation */}
      <aside style={{ width: '260px', background: '#1e293b', color: '#fff', padding: '24px 16px' }}>
        <h2 style={{ fontSize: '20px', margin: '0 0 30px 12px', color: '#38bdf8' }}>CampusMart Admin</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button 
            onClick={() => setActiveTab('overview')} 
            style={navBtnStyle(activeTab === 'overview')}>
            📊 Overview
          </button>
          <button 
            onClick={() => setActiveTab('users')} 
            style={navBtnStyle(activeTab === 'users')}>
            👥 Manage Users ({users.length})
          </button>
          <button 
            onClick={() => setActiveTab('listings')} 
            style={navBtnStyle(activeTab === 'listings')}>
            📦 Manage Listings ({listings.length})
          </button>
          <button 
            onClick={() => setActiveTab('reports')} 
            style={navBtnStyle(activeTab === 'reports')}>
            🚨 Reports ({reports.length})
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '32px' }}>
        
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div>
            <h1 style={{ marginBottom: '24px', color: '#0f172a' }}>Dashboard Overview</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
              <StatCard title="Total Users" count={users.length} color="#0284c7" />
              <StatCard title="Active Listings" count={listings.length} color="#16a34a" />
              <StatCard title="Total Reports" count={reports.length} color="#dc2626" />
            </div>
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div>
            <h1 style={{ marginBottom: '16px' }}>User Management</h1>
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              style={inputStyle}
            />
            <table style={tableStyle}>
              <thead>
                <tr style={{ background: '#e2e8f0', textAlign: 'left' }}>
                  <th style={thTdStyle}>Name</th>
                  <th style={thTdStyle}>Email</th>
                  <th style={thTdStyle}>Role</th>
                  <th style={thTdStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(u => (
                  <tr key={u._id} style={{ borderBottom: '1px solid #cbd5e1' }}>
                    <td style={thTdStyle}>{u.name || u.username || 'N/A'}</td>
                    <td style={thTdStyle}>{u.email}</td>
                    <td style={thTdStyle}>{u.role || 'User'}</td>
                    <td style={thTdStyle}>
                      <span style={{ color: u.isBanned ? 'red' : 'green', fontWeight: 'bold' }}>
                        {u.isBanned ? 'Banned' : 'Active'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: PRODUCT/LISTING MANAGEMENT */}
        {activeTab === 'listings' && (
          <div>
            <h1 style={{ marginBottom: '16px' }}>Product Listings Management</h1>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <input 
                type="text" 
                placeholder="Search listings by title/description..." 
                value={listingSearch}
                onChange={(e) => setListingSearch(e.target.value)}
                style={{ ...inputStyle, flex: 1, marginBottom: 0 }}
              />
            </div>

            <table style={tableStyle}>
              <thead>
                <tr style={{ background: '#e2e8f0', textAlign: 'left' }}>
                  <th style={thTdStyle}>Title</th>
                  <th style={thTdStyle}>Seller</th>
                  <th style={thTdStyle}>Price</th>
                  <th style={thTdStyle}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredListings.map(item => (
                  <tr key={item._id} style={{ borderBottom: '1px solid #cbd5e1' }}>
                    <td style={thTdStyle}>{item.title}</td>
                    <td style={thTdStyle}>{item.seller?.name || item.seller?.email || 'Unknown'}</td>
                    <td style={thTdStyle}>₹{item.price}</td>
                    <td style={thTdStyle}>
                      <button 
                        onClick={() => handleDeleteListing(item._id)}
                        style={{ padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: REPORTS */}
        {activeTab === 'reports' && (
          <div>
            <h1 style={{ marginBottom: '16px' }}>Reported Content</h1>
            <table style={tableStyle}>
              <thead>
                <tr style={{ background: '#e2e8f0', textAlign: 'left' }}>
                  <th style={thTdStyle}>Report ID</th>
                  <th style={thTdStyle}>Reason</th>
                  <th style={thTdStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {reports.map(rep => (
                  <tr key={rep._id} style={{ borderBottom: '1px solid #cbd5e1' }}>
                    <td style={thTdStyle}>{rep._id}</td>
                    <td style={thTdStyle}>{rep.reason || rep.message || 'Inappropriate Content'}</td>
                    <td style={thTdStyle}>{rep.status || 'Pending'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </main>
    </div>
  );
}

// Helper Components & Styles
function StatCard({ title, count, color }) {
  return (
    <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', borderLeft: `6px solid ${color}`, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
      <h3 style={{ margin: '0 0 8px 0', color: '#64748b', fontSize: '14px' }}>{title}</h3>
      <p style={{ margin: 0, fontSize: '28px', fontWeight: 'bold', color: '#0f172a' }}>{count}</p>
    </div>
  );
}

const navBtnStyle = (active) => ({
  width: '100%',
  textAlign: 'left',
  padding: '12px 16px',
  borderRadius: '8px',
  border: 'none',
  background: active ? '#334155' : 'transparent',
  color: active ? '#38bdf8' : '#94a3b8',
  fontWeight: active ? 'bold' : 'normal',
  cursor: 'pointer',
  fontSize: '15px'
});

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '6px',
  border: '1px solid #cbd5e1',
  marginBottom: '20px',
  fontSize: '14px'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  background: '#fff',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
};

const thTdStyle = {
  padding: '12px 16px',
  fontSize: '14px'
};