import { useState } from "react";
import { useNavigate } from "react-router-dom";
function ReturnBook({ user, onLogout, cart }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [returnRequests, setReturnRequests] = useState([]);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [returnReason, setReturnReason] = useState("");
  const [returnDetails, setReturnDetails] = useState({
    issue: "",
    description: "",
    bookCondition: "good"
  });
  const [orders, setOrders] = useState([
    {
      id: "#ORD001",
      book: "Atomic Habits",
      author: "James Clear",
      price: 500,
      orderDate: "2024-03-20",
      status: "Delivered"
    },
    {
      id: "#ORD002",
      book: "Rich Dad Poor Dad",
      author: "Robert Kiyosaki",
      price: 400,
      orderDate: "2024-03-15",
      status: "Delivered"
    }
  ]);
  const handleLogout = () => {
    setShowDropdown(false);
    onLogout();
    navigate("/");
  };
  const handleReturnRequest = () => {
    if (!returnReason) {
      alert("Please select an issue");
      return;
    }

    if (!selectedBook) {
      alert("No book selected");
      return;
    }
    const newRequest = {
      id: `RET${String(returnRequests.length + 1).padStart(3, '0')}`,
      bookId: selectedBook.id,
      bookName: selectedBook.book,
      author: selectedBook.author,
      price: selectedBook.price,
      reason: returnReason,
      description: returnDetails.description,
      bookCondition: returnDetails.bookCondition,
      orderId: selectedBook.id,
      customer: user?.name,
      customerEmail: user?.email,
      requestDate: new Date().toISOString().split('T')[0],
      status: "Pending"
    };
    setReturnRequests([...returnRequests, newRequest]);
    setShowReturnForm(false);
    setSelectedBook(null);
    setReturnReason("");
    setReturnDetails({
      issue: "",
      description: "",
      bookCondition: "good"
    });
    alert("Return request submitted successfully!");
  };
  const getStatusColor = (status) => {
    switch(status) {
      case "Approved": return '#48bb78';
      case "Rejected": return '#f56565';
      case "Pending": return '#fbbf24';
      default: return '#666';
    }
  };
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '15px 20px',
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0, color: '#2c3e50', cursor: 'pointer' }} 
            onClick={() => navigate('/home')}>
          📚 Bookstore
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span
            onClick={() => navigate('/home')}
            style={{ cursor: 'pointer', color: '#2c3e50' }}
          >
            🏠 Home
          </span>
          <span
            onClick={() => navigate('/my-orders')}
            style={{ cursor: 'pointer', color: '#2c3e50' }}
          >
            📦 My Orders
          </span>
          <span
            onClick={() => navigate('/return-book')}
            style={{ cursor: 'pointer', color: '#667eea', fontWeight: 'bold' }}
          >
            🔄 Return Book
          </span>
          {}
          <div style={{ position: 'relative' }}>
            <div
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ fontSize: '24px', cursor: 'pointer' }}
            >
              👤
            </div>
            {showDropdown && (
              <div style={{
                position: 'absolute',
                top: '35px',
                right: '0',
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: '5px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                width: '180px',
                zIndex: 1000
              }}>
                <div style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                  <strong>{user?.name}</strong>
                  <p style={{ fontSize: '12px', margin: '5px 0 0', color: '#666' }}>{user?.email}</p>
                </div>
                <div
                  onClick={handleLogout}
                  style={{
                    padding: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'red'
                  }}
                >
                  <span>🚪</span>
                  <span>Logout</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {}
      <div style={{
        padding: '30px',
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>🔄 Return a Book</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>
          Please note: You can return books within 7 days of delivery. Books must be in original condition.
        </p>
        {}
        <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>Your Delivered Orders</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {orders.map((order) => (
            <div key={order.id} style={{
              padding: '15px',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#f9f9f9'
            }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0' }}>{order.book}</h4>
                <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                  Order ID: {order.id} | Author: {order.author} | Price: ₹{order.price}
                </p>
                <p style={{ margin: '5px 0 0 0', color: '#48bb78', fontSize: '14px' }}>
                  Delivered on: {order.orderDate}
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedBook(order);
                  setShowReturnForm(true);
                }}
                style={{
                  padding: '8px 20px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Return Book
              </button>
            </div>
          ))}
        </div>
        {}
        {showReturnForm && selectedBook && (
          <div style={{
            marginTop: '30px',
            padding: '25px',
            background: '#f8f9fa',
            borderRadius: '10px',
            border: '2px solid #667eea'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#2c3e50' }}>Return Request Form</h3>
              <button
                onClick={() => {
                  setShowReturnForm(false);
                  setSelectedBook(null);
                }}
                style={{
                  padding: '5px 15px',
                  background: '#e74c3c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                ✕ Cancel
              </button>
            </div>
            <div>
              <p><strong>Book:</strong> {selectedBook.book}</p>
              <p><strong>Order ID:</strong> {selectedBook.id}</p>
              <p><strong>Price:</strong> ₹{selectedBook.price}</p>
            </div>
            <div style={{ marginTop: '20px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Issue with the Book:</label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  marginBottom: '15px'
                }}
              >
                <option value="">Select an issue</option>
                <option value="Damaged Book">📕 Damaged Book (torn pages, dented cover)</option>
                <option value="Missing Pages">📄 Missing Pages</option>
                <option value="Wrong Book">📚 Wrong Book Delivered</option>
                <option value="Printing Error">🖨️ Printing Error</option>
                <option value="Defective Binding">🔧 Defective Binding</option>
                <option value="Other">❓ Other Issue</option>
              </select>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Book Condition:</label>
              <select
                value={returnDetails.bookCondition}
                onChange={(e) => setReturnDetails({ ...returnDetails, bookCondition: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  marginBottom: '15px'
                }}
              >
                <option value="good">Good (No visible damage)</option>
                <option value="fair">Fair (Minor wear and tear)</option>
                <option value="damaged">Damaged (Visible damage)</option>
              </select>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description of the Issue:</label>
              <textarea
                rows="4"
                placeholder="Please describe the issue in detail..."
                value={returnDetails.description}
                onChange={(e) => setReturnDetails({ ...returnDetails, description: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  marginBottom: '15px',
                  resize: 'vertical'
                }}
              />
              <button
                onClick={handleReturnRequest}
                style={{
                  padding: '12px 30px',
                  background: '#48bb78',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                Submit Return Request
              </button>
            </div>
          </div>
        )}
        {}
        {returnRequests.length > 0 && (
          <div style={{ marginTop: '30px' }}>
            <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>Your Return Requests</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {returnRequests.map((request) => (
                <div key={request.id} style={{
                  padding: '15px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  background: '#f9f9f9'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0' }}>{request.bookName}</h4>
                      <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>
                        Request ID: {request.id} | Reason: {request.reason}
                      </p>
                      <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
                        Submitted on: {request.requestDate}
                      </p>
                    </div>
                    <span style={{
                      padding: '5px 15px',
                      borderRadius: '20px',
                      background: getStatusColor(request.status),
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {request.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default ReturnBook;