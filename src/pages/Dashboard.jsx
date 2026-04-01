import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
function Dashboard({ admin, onLogout }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchStats();
  }, []);
  const fetchStats = async () => {
    try {
      console.log("📊 Fetching dashboard stats...");
      const booksResponse = await fetch('http://localhost:5001/api/books');
      const booksData = await booksResponse.json();
      const totalBooks = booksData.length;
      const usersResponse = await fetch('http://localhost:5001/api/users');
      const usersData = await usersResponse.json();
      const totalUsers = usersData.length;
      const ordersResponse = await fetch('http://localhost:5001/api/orders');
      const ordersData = await ordersResponse.json();
      const totalOrders = ordersData.length;
      const pendingOrders = ordersData.filter(o => o.status === 'Pending').length;
      const shippedOrders = ordersData.filter(o => o.status === 'Shipped').length;
      const deliveredOrders = ordersData.filter(o => o.status === 'Delivered').length;
      const totalRevenue = ordersData
        .filter(o => o.status === 'Delivered')
        .reduce((sum, order) => sum + order.total, 0);
      setStats({
        totalBooks,
        totalUsers,
        totalOrders,
        totalRevenue,
        pendingOrders,
        shippedOrders,
        deliveredOrders
      });
    } catch (error) {
      console.error("❌ Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };
  if (!admin) {
    navigate("/admin");
    return null;
  }
  if (loading) {
    return (
      <div>
        <Navbar admin={admin} onLogout={onLogout} />
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h2>Loading dashboard...</h2>
        </div>
      </div>
    );
  }
  return (
    <div>
      <Navbar admin={admin} onLogout={onLogout} />
      <div style={{ padding: '30px' }}>
        <h1 style={{ 
          color: '#2c3e50', 
          marginBottom: '30px',
          fontSize: '32px'
        }}>
          Admin Dashboard
        </h1>
        {}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '20px',
          marginBottom: '30px'
        }}>
          {}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '25px',
            borderRadius: '15px',
            boxShadow: '0 10px 20px rgba(102, 126, 234, 0.2)',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/admin/books')}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>📚</div>
            <h3 style={{ margin: '0', fontSize: '16px', opacity: '0.9' }}>Total Books</h3>
            <p style={{ 
              margin: '10px 0 0 0', 
              fontSize: '36px', 
              fontWeight: 'bold' 
            }}>
              {stats.totalBooks}
            </p>
          </div>
          {}
          <div style={{
            background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
            color: 'white',
            padding: '25px',
            borderRadius: '15px',
            boxShadow: '0 10px 20px rgba(72, 187, 120, 0.2)',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/admin/users')}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>👥</div>
            <h3 style={{ margin: '0', fontSize: '16px', opacity: '0.9' }}>Total Users</h3>
            <p style={{ 
              margin: '10px 0 0 0', 
              fontSize: '36px', 
              fontWeight: 'bold' 
            }}>
              {stats.totalUsers}
            </p>
          </div>
          {}
          <div style={{
            background: 'linear-gradient(135deg, #f56565 0%, #c53030 100%)',
            color: 'white',
            padding: '25px',
            borderRadius: '15px',
            boxShadow: '0 10px 20px rgba(245, 101, 101, 0.2)',
            cursor: 'pointer'
          }}
          onClick={() => navigate('/admin/orders')}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>📦</div>
            <h3 style={{ margin: '0', fontSize: '16px', opacity: '0.9' }}>Total Orders</h3>
            <p style={{ 
              margin: '10px 0 0 0', 
              fontSize: '36px', 
              fontWeight: 'bold' 
            }}>
              {stats.totalOrders}
            </p>
          </div>
          {}
          <div style={{
            background: 'linear-gradient(135deg, #ed8936 0%, #dd6b20 100%)',
            color: 'white',
            padding: '25px',
            borderRadius: '15px',
            boxShadow: '0 10px 20px rgba(237, 137, 54, 0.2)'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>💰</div>
            <h3 style={{ margin: '0', fontSize: '16px', opacity: '0.9' }}>Total Revenue</h3>
            <p style={{ 
              margin: '10px 0 0 0', 
              fontSize: '36px', 
              fontWeight: 'bold' 
            }}>
              ₹{stats.totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>
        {}
        <div style={{ 
          background: 'white',
          padding: '25px',
          borderRadius: '15px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            color: '#2c3e50', 
            marginBottom: '20px',
            fontSize: '24px'
          }}>
            Order Status
          </h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '20px'
          }}>
            {}
            <div style={{
              background: '#f56565',
              color: 'white',
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
              <h4 style={{ margin: '0', fontSize: '14px', opacity: '0.9' }}>Pending</h4>
              <p style={{ 
                margin: '10px 0 0 0', 
                fontSize: '28px', 
                fontWeight: 'bold' 
              }}>
                {stats.pendingOrders}
              </p>
            </div>
            {}
            <div style={{
              background: '#667eea',
              color: 'white',
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>🚚</div>
              <h4 style={{ margin: '0', fontSize: '14px', opacity: '0.9' }}>Shipped</h4>
              <p style={{ 
                margin: '10px 0 0 0', 
                fontSize: '28px', 
                fontWeight: 'bold' 
              }}>
                {stats.shippedOrders}
              </p>
            </div>
            {}
            <div style={{
              background: '#48bb78',
              color: 'white',
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '10px' }}>✅</div>
              <h4 style={{ margin: '0', fontSize: '14px', opacity: '0.9' }}>Delivered</h4>
              <p style={{ 
                margin: '10px 0 0 0', 
                fontSize: '28px', 
                fontWeight: 'bold' 
              }}>
                {stats.deliveredOrders}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;