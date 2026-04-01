import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Wishlist({ wishlist, removeFromWishlist, user, onLogout }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const handleRemove = (index) => {
    console.log("Removing wishlist item at index:", index);
    removeFromWishlist(index);
  };
  const handleAddToCart = (book, index) => {
    removeFromWishlist(index);
    navigate('/home');
  };
  const handleLogout = () => {
    setShowDropdown(false);
    onLogout();
    navigate("/");
  };
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      {}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '30px',
        padding: '15px 20px',
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ margin: 0, color: '#2c3e50', fontSize: '24px', cursor: 'pointer' }}
            onClick={() => navigate('/home')}>
          📚 Bookstore
        </h1>
        {}
        <div style={{ flex: 1 }}></div>
        {}
        <div
          onClick={() => navigate("/cart")}
          style={{ fontSize: '24px', cursor: 'pointer', position: 'relative' }}
        >
          🛒
        </div>
        {}
        <div
          onClick={() => navigate("/wishlist")}
          style={{ fontSize: '24px', cursor: 'pointer' }}
        >
          ❤️
        </div>
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
                onClick={() => {
                  setShowDropdown(false);
                  navigate('/home');
                }}
                style={{
                  padding: '12px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
              >
                <span>🏠</span>
                <span>Home</span>
              </div>
              <div
                onClick={() => {
                  setShowDropdown(false);
                }}
                style={{
                  padding: '12px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #eee',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
              >
                <span>📦</span>
                <span>My Orders</span>
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
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
              >
                <span>🚪</span>
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
      {}
      <div style={{
        padding: '30px',
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        minHeight: '500px'
      }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '30px', fontSize: '28px' }}>
          ❤️ Your Wishlist
        </h2>
        {!wishlist || wishlist.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            background: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '15px' }}>
              Your wishlist is empty
            </p>
            <button
              onClick={() => navigate('/home')}
              style={{
                padding: '12px 30px',
                background: '#48bb78',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'background-color 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#38a169'}
              onMouseLeave={(e) => e.target.style.background = '#48bb78'}
            >
              Browse Books
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {wishlist.map((book, index) => (
              <div key={index} style={{
                padding: '20px',
                border: '1px solid #e0e0e0',
                borderRadius: '10px',
                background: 'white',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                transition: 'transform 0.2s, box-shadow 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
              }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50', fontSize: '18px' }}>
                  {book.name}
                </h3>
                <p style={{ margin: '5px 0', color: '#666' }}>
                  <strong>Author:</strong> {book.author}
                </p>
                <p style={{ margin: '5px 0', color: '#666' }}>
                  <strong>Price:</strong> ₹{book.price}
                </p>
                <p style={{ margin: '5px 0', color: '#666' }}>
                  <strong>Stock:</strong> {book.stock} available
                </p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                  <button
                    onClick={() => handleRemove(index)}
                    style={{
                      padding: '10px 20px',
                      background: '#e74c3c',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      flex: 1,
                      transition: 'background-color 0.3s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#c0392b'}
                    onMouseLeave={(e) => e.target.style.background = '#e74c3c'}
                  >
                    🗑️ Remove
                  </button>
                  <button
                    onClick={() => handleAddToCart(book, index)}
                    style={{
                      padding: '10px 20px',
                      background: '#3498db',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      flex: 1,
                      transition: 'background-color 0.3s'
                    }}
                    onMouseEnter={(e) => e.target.style.background = '#2980b9'}
                    onMouseLeave={(e) => e.target.style.background = '#3498db'}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {}
        {wishlist.length > 0 && (
          <div style={{
            marginTop: '30px',
            padding: '20px',
            background: '#f8f9fa',
            borderRadius: '10px',
            border: '1px solid #e0e0e0'
          }}>
            <h3 style={{ color: '#2c3e50', margin: 0 }}>
              Total Items in Wishlist: {wishlist.length}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
}
export default Wishlist;