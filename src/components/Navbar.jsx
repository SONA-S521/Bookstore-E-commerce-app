import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Navbar({ admin, onLogout }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const handleLogout = () => {
    onLogout();
    navigate("/admin");
  };
  return (
    <nav style={{
      background: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)',
      padding: '15px 30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: 'white',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
        <div 
          onClick={() => navigate('/admin/dashboard')} 
          style={{ 
            fontSize: '20px', 
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          Admin Panel
        </div>
        <div style={{ display: 'flex', gap: '25px' }}>
          <span 
            onClick={() => navigate('/admin/dashboard')} 
            style={{ 
              cursor: 'pointer', 
              color: 'white',
              padding: '5px 10px',
              borderRadius: '5px',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            📊 Dashboard
          </span>
          <span 
            onClick={() => navigate('/admin/books')} 
            style={{ 
              cursor: 'pointer', 
              color: 'white',
              padding: '5px 10px',
              borderRadius: '5px',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            📚 Books
          </span>
          <span 
            onClick={() => navigate('/admin/users')} 
            style={{ 
              cursor: 'pointer', 
              color: 'white',
              padding: '5px 10px',
              borderRadius: '5px',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            👥 Users
          </span>
          <span 
            onClick={() => navigate('/admin/orders')} 
            style={{ 
              cursor: 'pointer', 
              color: 'white',
              padding: '5px 10px',
              borderRadius: '5px',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            📦 Orders
          </span>
          <span 
            onClick={() => navigate('/admin/returns')} 
            style={{ 
              cursor: 'pointer', 
              color: 'white',
              padding: '5px 10px',
              borderRadius: '5px',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            🔄 Returns
          </span>
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        <div 
          onClick={() => setShowDropdown(!showDropdown)}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            cursor: 'pointer',
            padding: '5px 10px',
            borderRadius: '5px',
            transition: 'background-color 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
          onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
        >
          <span style={{ fontSize: '20px' }}>👤</span>
          <span>{admin?.name}</span>
          <span style={{ fontSize: '12px' }}>▼</span>
        </div>
        {showDropdown && (
          <div style={{
            position: 'absolute',
            top: '45px',
            right: '0',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            width: '150px',
            zIndex: 1000,
            overflow: 'hidden'
          }}>
            <div 
              onClick={handleLogout}
              style={{
                padding: '12px 15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                color: '#e74c3c',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
            >
              <span>🚪</span>
              <span>Logout</span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
export default Navbar;
