import { useState } from "react";
import { useNavigate } from "react-router-dom";
function Cart({ cart, removeFromCart, user, onLogout }) {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState({});
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [address, setAddress] = useState({
    fullName: user?.name || "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
    landmark: ""
  });
  const handleQuantity = (id, value) => {
    setQuantity({
      ...quantity,
      [id]: value
    });
  };
  const handleRemove = (index) => {
    removeFromCart(index);
  };
  const handleBuyNowClick = (book) => {
    const qty = quantity[book.id] || 1;
    setSelectedBook(book);
    setSelectedQuantity(qty);
    setShowAddressForm(true);
  };
  const handleAddressSubmit = () => {
    if (!address.fullName || !address.phone || !address.addressLine1 || !address.city || !address.state || !address.pincode) {
      alert("Please fill all required fields");
      return;
    }
    if (!/^\d{10}$/.test(address.phone)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }
    if (!/^\d{6}$/.test(address.pincode)) {
      alert("Please enter a valid 6-digit pincode");
      return;
    }
    const totalPrice = selectedBook.price * selectedQuantity;
    navigate("/payment", {
      state: {
        book: selectedBook,
        quantity: selectedQuantity,
        totalPrice: totalPrice,
        source: "cart",
        address: address
      }
    });
  };
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress({
      ...address,
      [name]: value
    });
  };
  const handleLogout = () => {
    setShowDropdown(false);
    onLogout();
    navigate("/");
  };
  const grandTotal = cart.reduce((sum, book) => {
    const qty = quantity[book.id] || 1;
    return sum + (book.price * qty);
  }, 0);
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
          <div
            onClick={() => navigate("/cart")}
            style={{ fontSize: '24px', cursor: 'pointer', position: 'relative' }}
          >
            🛒
            {cart.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: 'red',
                color: 'white',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '12px',
                minWidth: '18px',
                textAlign: 'center'
              }}>
                {cart.length}
              </span>
            )}
          </div>
          <div
            onClick={() => navigate("/wishlist")}
            style={{ fontSize: '24px', cursor: 'pointer' }}
          >
            ❤️
          </div>
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
                  onClick={() => navigate('/my-orders')}
                  style={{
                    padding: '12px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #eee',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
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
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        minHeight: '500px'
      }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '30px' }}>🛒 Your Cart</h2>
        {!cart || cart.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            background: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '15px' }}>
              Your cart is empty
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
                cursor: 'pointer'
              }}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {cart.map((book, index) => {
                const qty = quantity[book.id] || 1;
                const totalPrice = book.price * qty;

                return (
                  <div key={index} style={{
                    padding: '20px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    background: '#f9f9f9',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ flex: 2 }}>
                      <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>{book.name}</h3>
                      <p><strong>Author:</strong> {book.author}</p>
                      <p><strong>Price:</strong> ₹{book.price}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                        <label><strong>Quantity:</strong></label>
                        <input
                          type="number"
                          min="1"
                          value={qty}
                          onChange={(e) => handleQuantity(book.id, Number(e.target.value))}
                          style={{
                            width: '60px',
                            padding: '5px',
                            border: '1px solid #ddd',
                            borderRadius: '5px'
                          }}
                        />
                      </div>
                      <p style={{ marginTop: '10px' }}><strong>Total:</strong> ₹{totalPrice}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => handleRemove(index)}
                        style={{
                          padding: '10px 20px',
                          background: '#e74c3c',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        🗑️ Remove
                      </button>
                      <button
                        onClick={() => handleBuyNowClick(book)}
                        style={{
                          padding: '10px 20px',
                          background: '#48bb78',
                          color: 'white',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{
              marginTop: '30px',
              padding: '20px',
              background: '#f0f0f0',
              borderRadius: '8px',
              textAlign: 'right'
            }}>
              <h3 style={{ color: '#2c3e50' }}>
                Total Items: {cart.length} | Grand Total: ₹{grandTotal}
              </h3>
            </div>
          </>
        )}
      </div>
      {}
      {showAddressForm && selectedBook && (
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
            padding: '35px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '85vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
              <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '28px' }}>📦 Delivery Address</h2>
              <button
                onClick={() => {
                  setShowAddressForm(false);
                  setSelectedBook(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '28px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ marginBottom: '25px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
              <p style={{ fontSize: '16px' }}><strong>📖 Book:</strong> {selectedBook.name}</p>
              <p style={{ fontSize: '16px' }}><strong>🔢 Quantity:</strong> {selectedQuantity}</p>
              <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#e67e22' }}>
                <strong>💰 Total Amount:</strong> ₹{selectedBook.price * selectedQuantity}
              </p>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
                Full Name <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={address.fullName}
                onChange={handleAddressChange}
                placeholder="Enter full name"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  marginBottom: '15px',
                  fontSize: '14px'
                }}
              />
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
                Phone Number <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={address.phone}
                onChange={handleAddressChange}
                placeholder="Enter 10-digit mobile number"
                maxLength="10"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  marginBottom: '15px',
                  fontSize: '14px'
                }}
              />
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
                Address Line 1 <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="text"
                name="addressLine1"
                value={address.addressLine1}
                onChange={handleAddressChange}
                placeholder="House/Flat No., Building Name"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  marginBottom: '15px',
                  fontSize: '14px'
                }}
              />
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
                Address Line 2
              </label>
              <input
                type="text"
                name="addressLine2"
                value={address.addressLine2}
                onChange={handleAddressChange}
                placeholder="Street, Area, Landmark"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  marginBottom: '15px',
                  fontSize: '14px'
                }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
                    City <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={address.city}
                    onChange={handleAddressChange}
                    placeholder="City"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
                    State <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={address.state}
                    onChange={handleAddressChange}
                    placeholder="State"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
                    Pincode <span style={{ color: 'red' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={address.pincode}
                    onChange={handleAddressChange}
                    placeholder="6-digit pincode"
                    maxLength="6"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
                    Landmark
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={address.landmark}
                    onChange={handleAddressChange}
                    placeholder="Nearby landmark"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
              <button
                onClick={handleAddressSubmit}
                style={{
                  padding: '16px 30px',
                  background: '#48bb78',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  flex: 1,
                  fontSize: '18px',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#38a169'}
                onMouseLeave={(e) => e.target.style.background = '#48bb78'}
              >
                ✅ Continue to Payment
              </button>
              <button
                onClick={() => {
                  setShowAddressForm(false);
                  setSelectedBook(null);
                }}
                style={{
                  padding: '16px 30px',
                  background: '#95a5a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  flex: 1,
                  fontSize: '18px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.background = '#7f8c8d'}
                onMouseLeave={(e) => e.target.style.background = '#95a5a6'}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default Cart;