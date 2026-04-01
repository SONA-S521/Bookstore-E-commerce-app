import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
function AdminReturns({ admin, onLogout }) {
  const navigate = useNavigate();
  const [returnRequests, setReturnRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filter, setFilter] = useState("all");
  useEffect(() => {
    const savedReturns = localStorage.getItem('returnRequests');
    if (savedReturns) {
      setReturnRequests(JSON.parse(savedReturns));
    }
  }, []);
  useEffect(() => {
    const handleStorageChange = () => {
      const savedReturns = localStorage.getItem('returnRequests');
      if (savedReturns) {
        setReturnRequests(JSON.parse(savedReturns));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  const handleApprove = (request) => {
    if (window.confirm(`Approve return request for ${request.bookName}?`)) {
      const updatedRequests = returnRequests.map(r => 
        r.id === request.id 
          ? { ...r, status: "Approved", resolution: "Return approved. Pickup scheduled within 3 days." }
          : r
      );
      setReturnRequests(updatedRequests);
      localStorage.setItem('returnRequests', JSON.stringify(updatedRequests));
      alert("Return request approved!");
    }
  };
  const handleReject = (request) => {
    const reason = prompt("Reason for rejection:");
    if (reason) {
      const updatedRequests = returnRequests.map(r => 
        r.id === request.id 
          ? { ...r, status: "Rejected", resolution: `Rejected: ${reason}` }
          : r
      );
      setReturnRequests(updatedRequests);
      localStorage.setItem('returnRequests', JSON.stringify(updatedRequests));
      alert("Return request rejected!");
    }
  };
  const handleViewDetails = (request) => {
    setSelectedRequest(request);
  };
  const getStatusColor = (status) => {
    switch(status) {
      case "Approved": return '#48bb78';
      case "Rejected": return '#f56565';
      case "Pending": return '#fbbf24';
      default: return '#666';
    }
  };
  const getStatusIcon = (status) => {
    switch(status) {
      case "Approved": return '✅';
      case "Rejected": return '❌';
      case "Pending": return '⏳';
      default: return '📦';
    }
  };
  const filteredRequests = returnRequests.filter(request => {
    if (filter === "all") return true;
    return request.status === filter;
  });
  if (!admin) {
    navigate("/admin");
    return null;
  }
  return (
    <div>
      <Navbar admin={admin} onLogout={onLogout} />
      <div style={{ padding: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#2c3e50', margin: 0 }}>🔄 Return Requests Management</h1>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setFilter("all")}
              style={{
                padding: '8px 16px',
                background: filter === "all" ? '#667eea' : '#e0e0e0',
                color: filter === "all" ? 'white' : '#666',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              All ({returnRequests.length})
            </button>
            <button
              onClick={() => setFilter("Pending")}
              style={{
                padding: '8px 16px',
                background: filter === "Pending" ? '#fbbf24' : '#e0e0e0',
                color: filter === "Pending" ? 'white' : '#666',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Pending ({returnRequests.filter(r => r.status === "Pending").length})
            </button>
            <button
              onClick={() => setFilter("Approved")}
              style={{
                padding: '8px 16px',
                background: filter === "Approved" ? '#48bb78' : '#e0e0e0',
                color: filter === "Approved" ? 'white' : '#666',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Approved ({returnRequests.filter(r => r.status === "Approved").length})
            </button>
            <button
              onClick={() => setFilter("Rejected")}
              style={{
                padding: '8px 16px',
                background: filter === "Rejected" ? '#f56565' : '#e0e0e0',
                color: filter === "Rejected" ? 'white' : '#666',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Rejected ({returnRequests.filter(r => r.status === "Rejected").length})
            </button>
          </div>
        </div>
        {}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div style={{ background: '#fbbf24', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
            <h3 style={{ color: 'white', margin: 0 }}>Pending</h3>
            <p style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0 0' }}>
              {returnRequests.filter(r => r.status === "Pending").length}
            </p>
          </div>
          <div style={{ background: '#48bb78', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
            <h3 style={{ color: 'white', margin: 0 }}>Approved</h3>
            <p style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0 0' }}>
              {returnRequests.filter(r => r.status === "Approved").length}
            </p>
          </div>
          <div style={{ background: '#f56565', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
            <h3 style={{ color: 'white', margin: 0 }}>Rejected</h3>
            <p style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0 0' }}>
              {returnRequests.filter(r => r.status === "Rejected").length}
            </p>
          </div>
          <div style={{ background: '#667eea', padding: '20px', borderRadius: '10px', textAlign: 'center' }}>
            <h3 style={{ color: 'white', margin: 0 }}>Total</h3>
            <p style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', margin: '10px 0 0 0' }}>
              {returnRequests.length}
            </p>
          </div>
        </div>
        {}
        {returnRequests.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            background: 'white',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
          }}>
            <p style={{ fontSize: '18px', color: '#666' }}>No return requests yet</p>
          </div>
        ) : (
          <div style={{
            background: 'white',
            borderRadius: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#667eea', color: 'white' }}>
                <tr>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Request ID</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Book</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Customer</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Reason</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Date</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '15px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRequests.map((request) => (
                  <tr key={request.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                    <td style={{ padding: '15px', fontWeight: 'bold' }}>{request.id}</td>
                    <td style={{ padding: '15px' }}>
                      <strong>{request.bookName}</strong>
                      <br />
                      <span style={{ fontSize: '12px', color: '#666' }}>₹{request.price}</span>
                    </td>
                    <td style={{ padding: '15px' }}>
                      {request.customer}
                      <br />
                      <span style={{ fontSize: '12px', color: '#666' }}>{request.customerEmail}</span>
                    </td>
                    <td style={{ padding: '15px' }}>
                      <span style={{ 
                        padding: '4px 8px',
                        background: '#f0f0f0',
                        borderRadius: '5px',
                        fontSize: '12px'
                      }}>
                        {request.reason}
                      </span>
                    </td>
                    <td style={{ padding: '15px' }}>{request.requestDate}</td>
                    <td style={{ padding: '15px' }}>
                      <span style={{
                        padding: '5px 12px',
                        borderRadius: '20px',
                        background: getStatusColor(request.status),
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {getStatusIcon(request.status)} {request.status}
                      </span>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleViewDetails(request)}
                        style={{
                          padding: '5px 10px',
                          background: '#3498db',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          marginRight: '5px'
                        }}
                      >
                        View
                      </button>
                      {request.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleApprove(request)}
                            style={{
                              padding: '5px 10px',
                              background: '#48bb78',
                              color: 'white',
                              border: 'none',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              marginRight: '5px'
                            }}
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(request)}
                            style={{
                              padding: '5px 10px',
                              background: '#f56565',
                              color: 'white',
                              border: 'none',
                              borderRadius: '5px',
                              cursor: 'pointer'
                            }}
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {}
        {selectedRequest && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              borderRadius: '10px',
              padding: '30px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>Return Request Details</h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '20px',
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <p><strong>Request ID:</strong> {selectedRequest.id}</p>
                <p><strong>Book:</strong> {selectedRequest.bookName}</p>
                <p><strong>Author:</strong> {selectedRequest.author}</p>
                <p><strong>Price:</strong> ₹{selectedRequest.price}</p>
                <p><strong>Order ID:</strong> {selectedRequest.orderId}</p>
                <p><strong>Quantity:</strong> {selectedRequest.quantity}</p>
                <p><strong>Customer:</strong> {selectedRequest.customer}</p>
                <p><strong>Email:</strong> {selectedRequest.customerEmail}</p>
                <p><strong>Request Date:</strong> {selectedRequest.requestDate}</p>
              </div>
              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                <h4 style={{ margin: '0 0 10px 0' }}>Issue Details:</h4>
                <p><strong>Reason:</strong> {selectedRequest.reason}</p>
                <p><strong>Description:</strong> {selectedRequest.description}</p>
              </div>
              <div style={{ background: '#f0f7ff', padding: '15px', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 10px 0' }}>Resolution:</h4>
                <p>{selectedRequest.resolution || "Awaiting admin action"}</p>
                {selectedRequest.status === "Pending" && (
                  <p style={{ marginTop: '10px', color: '#fbbf24' }}>
                    ⏳ This request is pending review
                  </p>
                )}
                {selectedRequest.status === "Approved" && (
                  <p style={{ marginTop: '10px', color: '#48bb78' }}>
                    ✅ Return approved. Pickup will be arranged.
                  </p>
                )}
                {selectedRequest.status === "Rejected" && (
                  <p style={{ marginTop: '10px', color: '#f56565' }}>
                    ❌ Return request rejected
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                style={{
                  marginTop: '20px',
                  padding: '10px 20px',
                  background: '#667eea',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default AdminReturns;