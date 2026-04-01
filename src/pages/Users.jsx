import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
function Users({ admin, onLogout }) {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchUsers();
  }, []);
  const fetchUsers = async () => {
    try {
      console.log("👥 Fetching users...");
      const response = await fetch('http://localhost:5001/api/users');
      const data = await response.json();
      console.log("👥 Users fetched:", data);
      setUsers(data);
    } catch (error) {
      console.error("❌ Error fetching users:", error);
      alert("Error fetching users. Make sure backend is running.");
    } finally {
      setLoading(false);
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
        <div style={{
          marginBottom: '30px'
        }}>
          <h1 style={{ color: '#2c3e50', margin: 0 }}>👥 Users List</h1>
        </div>
        {}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>Loading users...</h2>
          </div>
        ) : (
          <div style={{
            background: 'white',
            borderRadius: '15px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            overflow: 'hidden'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse'
            }}>
              <thead style={{
                background: '#48bb78',
                color: 'white'
              }}>
                <tr>
                  <th style={{ padding: '15px', textAlign: 'left' }}>S.No</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Role</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Joined Date</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{
                      padding: '50px',
                      textAlign: 'center',
                      color: '#666'
                    }}>
                      No users registered yet
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={user._id || index} style={{
                      borderBottom: '1px solid #e0e0e0',
                      backgroundColor: index % 2 === 0 ? '#f8fafc' : 'white'
                    }}>
                      <td style={{ padding: '15px' }}>{index + 1}</td>
                      <td style={{ padding: '15px', fontWeight: '500' }}>{user.name}</td>
                      <td style={{ padding: '15px' }}>{user.email}</td>
                      <td style={{ padding: '15px' }}>
                        <span style={{
                          padding: '4px 8px',
                          background: user.role === 'admin' ? '#667eea' : '#48bb78',
                          color: 'white',
                          borderRadius: '12px',
                          fontSize: '12px'
                        }}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td style={{ padding: '15px' }}>{user.joined || 'N/A'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
export default Users;