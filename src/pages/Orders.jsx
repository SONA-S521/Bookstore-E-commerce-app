import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
function Orders({ admin, onLogout }) {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchOrders();
  }, []);
  const fetchOrders = async () => {
    try {
      console.log("📦 Fetching orders...");
      const response = await fetch('http://localhost:5001/api/orders');
      const data = await response.json();
      console.log("📦 Orders fetched:", data);
      setOrders(data);
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
      alert("Error fetching orders. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      console.log(`🔄 Updating order ${orderId} status to:`, newStatus);
      const response = await fetch(`http://localhost:5001/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        const updatedOrder = await response.json();
        console.log("✅ Order updated:", updatedOrder);
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        ));
        alert(`Order status updated to ${newStatus}`);
      } else {
        const error = await response.json();
        alert(error.message || "Failed to update order status");
      }
    } catch (error) {
      console.error("❌ Error updating order:", error);
      alert("Error updating order. Make sure backend is running.");
    }
  };
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
      return;
    }
    try {
      console.log(`🗑️ Deleting order with ID: ${orderId}`);
      const response = await fetch(`http://localhost:5001/api/orders/${orderId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        console.log("✅ Order deleted successfully");
        const updatedOrders = orders.filter(order => order._id !== orderId);
        setOrders(updatedOrders);
        alert("Order deleted successfully!");
      } else {
        const error = await response.json();
        alert(error.message || "Failed to delete order");
      }
    } catch (error) {
      console.error("❌ Error deleting order:", error);
      alert("Error deleting order. Make sure backend is running.");
    }
  };
  const getStatusColor = (status) => {
    switch(status) {
      case "Delivered": return '#48bb78';
      case "Processing": return '#fbbf24';
      case "Pending": return '#f56565';
      case "Shipped": return '#667eea';
      default: return '#95a5a6';
    }
  };
  const getStatusIcon = (status) => {
    switch(status) {
      case "Delivered": return '✅';
      case "Processing": return '⚙️';
      case "Pending": return '⏳';
      case "Shipped": return '🚚';
      default: return '📦';
    }
  };
  if (!admin) {
    navigate("/admin");
    return null;
  }
  return (
    <div>
      <Navbar admin={admin} onLogout={onLogout} />
      <div style={{ padding: '30px' }}>
        {}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#2c3e50', margin: 0 }}>📦 Manage Orders</h1>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button
              onClick={fetchOrders}
              style={{
                padding: '8px 16px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🔄 Refresh
            </button>
          </div>
        </div>
        {}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>Loading orders...</h2>
          </div>
        ) : orders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            background: 'white',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <p style={{ fontSize: '18px', color: '#666' }}>No orders found</p>
          </div>
        ) : (
          <div style={{
            background: 'white',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            overflow: 'auto'
          }}>
            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              minWidth: '1000px'
            }}>
              <thead style={{ background: '#667eea', color: 'white' }}>
                <tr>
                  <th style={{ padding: '15px', textAlign: 'left' }}>S.No</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Order ID</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Customer</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Book</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Qty</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Total</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Payment</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '15px', textAlign: 'center' }}>Actions</th>
                 </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={order._id || order.id || index} style={{
                    borderBottom: '1px solid #e0e0e0',
                    backgroundColor: index % 2 === 0 ? '#f8fafc' : 'white'
                  }}>
                    <td style={{ padding: '15px' }}>{index + 1}</td>
                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{order.id}</td>
                    <td style={{ padding: '15px' }}>{order.customer}</td>
                    <td style={{ padding: '15px' }}>{order.customerEmail}</td>
                    <td style={{ padding: '15px' }}>{order.book}</td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>{order.quantity}</td>
                    <td style={{ padding: '15px', fontWeight: 'bold', color: '#2c3e50' }}>
                      ₹{order.total}
                    </td>
                    <td style={{ padding: '15px' }}>{order.paymentMethod}</td>
                    <td style={{ padding: '15px' }}>{order.date}</td>
                    <td style={{ padding: '15px' }}>
                      <span style={{
                        padding: '6px 12px',
                        borderRadius: '20px',
                        background: getStatusColor(order.status),
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px'
                      }}>
                        {getStatusIcon(order.status)} {order.status}
                      </span>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexDirection: 'column' }}>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order._id || order.id, e.target.value)}
                          style={{
                            padding: '8px 12px',
                            border: '2px solid #e0e0e0',
                            borderRadius: '5px',
                            fontSize: '14px',
                            cursor: 'pointer',
                            backgroundColor: 'white',
                            width: '120px'
                          }}
                        >
                          <option value="Pending">⏳ Pending</option>
                          <option value="Processing">⚙️ Processing</option>
                          <option value="Shipped">🚚 Shipped</option>
                          <option value="Delivered">✅ Delivered</option>
                        </select>
                        <button
                          onClick={() => handleDeleteOrder(order._id || order.id)}
                          style={{
                            padding: '8px 16px',
                            background: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '5px'
                          }}
                          onMouseEnter={(e) => e.target.style.background = '#c0392b'}
                          onMouseLeave={(e) => e.target.style.background = '#e74c3c'}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {}
        {orders.length > 0 && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            background: '#f8f9fa',
            borderRadius: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px'
          }}>
            <span style={{ color: '#2c3e50' }}>
              <strong>Total Orders:</strong> {orders.length}
            </span>
            <span style={{ color: '#2c3e50' }}>
              <strong>Pending:</strong> {orders.filter(o => o.status === 'Pending').length}
            </span>
            <span style={{ color: '#2c3e50' }}>
              <strong>Processing:</strong> {orders.filter(o => o.status === 'Processing').length}
            </span>
            <span style={{ color: '#2c3e50' }}>
              <strong>Shipped:</strong> {orders.filter(o => o.status === 'Shipped').length}
            </span>
            <span style={{ color: '#2c3e50' }}>
              <strong>Delivered:</strong> {orders.filter(o => o.status === 'Delivered').length}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
export default Orders;