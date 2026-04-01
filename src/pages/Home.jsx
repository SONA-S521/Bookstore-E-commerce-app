import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = 'http://localhost:5001';
function Home({ addToCart, addToWishlist, cart, user, onLogout }) {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('books');
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [returnReason, setReturnReason] = useState("");
  const [returnDescription, setReturnDescription] = useState("");
  const [returnRequests, setReturnRequests] = useState([]);
  const [ordersError, setOrdersError] = useState(null);
  const getBookImage = (bookName) => {
    const imageMap = {
      "Atomic Habits": "/src/assets/Books/atomic.jpeg",
      "Rich Dad Poor Dad": "/src/assets/Books/rich.jpg",
      "The Alchemist": "/src/assets/Books/alchemist.jpeg",
      "Think and Grow Rich": "/src/assets/Books/think.jpg",
      "Ikigai": "/src/assets/Books/ikigai.jpeg",
      "The Psychology of Money": "/src/assets/Books/money.jpeg",
      "Wings of Fire": "/src/assets/Books/wings.jpeg",
      "Deep Work": "/src/assets/Books/deep.jpg",
      "The Power of Now": "/src/assets/Books/power.jpeg"
    };
    return imageMap[bookName] || "/src/assets/Books/default-book.jpeg";
  };
  useEffect(() => {
    const savedReturns = localStorage.getItem('returnRequests');
    if (savedReturns) {
      setReturnRequests(JSON.parse(savedReturns));
    }
  }, []);
  useEffect(() => {
    localStorage.setItem('returnRequests', JSON.stringify(returnRequests));
  }, [returnRequests]);

  useEffect(() => {
    fetchBooks();
  }, []);
  useEffect(() => {
    if (view === 'orders' && user?.email) {
      fetchUserOrders();
    }
  }, [view, user]);
  const fetchBooks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/books`);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };
  const fetchUserOrders = async () => {
    setLoading(true);
    setOrdersError(null);
    try {
      console.log("Fetching orders for:", user.email);
      const response = await fetch(`${API_URL}/api/orders/user/${user.email}`);
      const data = await response.json();
      console.log("Orders fetched:", data);
      setUserOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrdersError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = () => {
    setShowDropdown(false);
    onLogout();
    navigate("/");
  };
  const goToBooks = () => {
    setView('books');
  };
  const goToMyOrders = () => {
    setView('orders');
  };
  const handleReturnRequest = () => {
    if (!returnReason) {
      alert("Please select an issue");
      return;
    }
    if (!selectedOrder) {
      alert("No order selected");
      return;
    }
    const newRequest = {
      id: `RET${String(returnRequests.length + 1).padStart(3, '0')}`,
      orderId: selectedOrder.id,
      bookName: selectedOrder.book,
      author: selectedOrder.author,
      price: selectedOrder.total,
      quantity: selectedOrder.quantity,
      reason: returnReason,
      description: returnDescription,
      customer: user?.name,
      customerEmail: user?.email,
      requestDate: new Date().toISOString().split('T')[0],
      status: "Pending"
    };
    setReturnRequests([...returnRequests, newRequest]);
    setShowReturnForm(false);
    setSelectedOrder(null);
    setReturnReason("");
    setReturnDescription("");
    alert("Return request submitted successfully! Admin will review it.");
  };
  const openReturnForm = (order) => {
    console.log("Opening return form for:", order);
    setSelectedOrder(order);
    setShowReturnForm(true);
    setReturnReason("");
    setReturnDescription("");
  };
  const filteredBooks = books.filter((book) =>
    book.name.toLowerCase().includes(search.toLowerCase()) ||
    book.author.toLowerCase().includes(search.toLowerCase())
  );
  const handleCartClick = (book) => {
    addToCart(book);
    alert(`✅ "${book.name}" has been added to your cart!`);
    navigate("/cart");
  };
  const handleWishlistClick = (book) => {
    addToWishlist(book);
    alert(`❤️ "${book.name}" has been added to your wishlist!`);
    navigate("/wishlist");
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "Delivered": return '#48bb78';
      case "Processing": return '#fbbf24';
      case "Pending": return '#f56565';
      case "Shipped": return '#667eea';
      default: return '#666';
    }
  };
  const getStatusMessage = (status) => {
    switch (status) {
      case "Delivered": return "✅ Your order has been delivered!";
      case "Processing": return "⚙️ Your order is being processed";
      case "Pending": return "⏳ Your order is pending";
      case "Shipped": return "🚚 Your order has been shipped";
      default: return "📦 Order placed";
    }
  };
  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered": return '✅';
      case "Processing": return '⚙️';
      case "Pending": return '⏳';
      case "Shipped": return '🚚';
      default: return '📦';
    }
  };
  const Navbar = () => (
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
      <h1 style={{ margin: 0, color: '#2c3e50', fontSize: '24px', cursor: 'pointer' }}
          onClick={goToBooks}>
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
                onClick={() => {
                  setShowDropdown(false);
                  goToMyOrders();
                }}
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
                <span>My Orders {userOrders.length > 0 && `(${userOrders.length})`}</span>
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
  );
  if (view === 'books') {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
        <Navbar />
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            placeholder="Search books by name or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 20px',
              border: '2px solid #e0e0e0',
              borderRadius: '25px',
              fontSize: '16px',
              outline: 'none'
            }}
          />
        </div>
        <h2 style={{ color: '#2c3e50', marginBottom: '20px' }}>
          📚 Available Books {filteredBooks.length > 0 && `(${filteredBooks.length})`}
        </h2>
        {books.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '50px' }}>Loading books...</p>
        ) : filteredBooks.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
            No books found matching "{search}"
          </p>
        ) : (
          <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
            {filteredBooks.map((book) => {
              const bookImage = getBookImage(book.name);
              return (
                <div key={book._id || book.id} style={{
                  padding: '20px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '10px',
                  background: 'white',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                  transition: 'transform 0.3s, box-shadow 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
                }}>
                  {}
                  <div style={{
                    width: '100%',
                    height: '200px',
                    marginBottom: '15px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: '#f0f0f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img 
                      src={bookImage} 
                      alt={book.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.3s'
                      }}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                      onError={(e) => {
                        e.target.src = "/src/assets/Books/default-book.jpeg";
                      }}
                    />
                  </div>
                  <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>{book.name}</h3>
                  <p style={{ margin: '5px 0' }}><strong>Author:</strong> {book.author}</p>
                  <p style={{ margin: '5px 0' }}><strong>Price:</strong> ₹{book.price}</p>
                  <p style={{ margin: '5px 0' }}><strong>Stock:</strong> {book.stock} available</p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                    <button 
                      onClick={() => handleCartClick(book)}
                      style={{
                        padding: '8px 16px',
                        background: '#3498db',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        flex: 1
                      }}
                    >
                      Add to Cart
                    </button>
                    <button 
                      onClick={() => handleWishlistClick(book)}
                      style={{
                        padding: '8px 16px',
                        background: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        width: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Add to Wishlist"
                    >
                      ❤️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <Navbar />
      <div style={{
        padding: '30px',
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        minHeight: '500px'
      }}>
        <h2 style={{ color: '#2c3e50', marginBottom: '30px' }}>📦 My Orders</h2>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '50px' }}>Loading your orders...</p>
        ) : ordersError ? (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            background: '#fee',
            borderRadius: '8px',
            color: '#c00'
          }}>
            <p><strong>Error loading orders:</strong></p>
            <p>{ordersError}</p>
            <button
              onClick={fetchUserOrders}
              style={{
                marginTop: '15px',
                padding: '8px 16px',
                background: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
          </div>
        ) : userOrders.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            background: '#f8f9fa',
            borderRadius: '8px'
          }}>
            <p style={{ fontSize: '18px', color: '#666', marginBottom: '15px' }}>
              You haven't placed any orders yet
            </p>
            <button
              onClick={goToBooks}
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
              Browse Books
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {userOrders.map((order) => (
              <div key={order._id || order.id} style={{
                padding: '20px',
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                background: '#f9f9f9'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#2c3e50' }}>{order.book}</h3>
                    <p><strong>Order ID:</strong> {order.id}</p>
                    <p><strong>Quantity:</strong> {order.quantity}</p>
                    <p><strong>Total:</strong> ₹{order.total}</p>
                    <p><strong>Payment:</strong> {order.paymentMethod}</p>
                    <p><strong>Date:</strong> {order.date}</p>
                  </div>
                  <div style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    background: getStatusColor(order.status),
                    color: 'white',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    {getStatusIcon(order.status)} {order.status}
                  </div>
                </div>
                <div style={{
                  marginTop: '15px',
                  padding: '10px',
                  background: getStatusColor(order.status),
                  color: 'white',
                  borderRadius: '5px',
                  fontWeight: '500'
                }}>
                  {getStatusMessage(order.status)}
                </div>
                
                {order.status === "Delivered" && (
                  <div style={{ marginTop: '15px' }}>
                    <button
                      onClick={() => openReturnForm(order)}
                      style={{
                        padding: '8px 16px',
                        background: '#fbbf24',
                        color: '#2c3e50',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        width: '100%'
                      }}
                    >
                      🔄 Return Book
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      {}
      {showReturnForm && selectedOrder && (
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
            maxWidth: '500px',
            width: '90%',
            maxHeight: '85vh',
            overflow: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '25px' }}>
              <h3 style={{ margin: 0, color: '#2c3e50', fontSize: '24px' }}>📝 Return Request</h3>
              <button
                onClick={() => {
                  setShowReturnForm(false);
                  setSelectedOrder(null);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ marginBottom: '25px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
              <p style={{ fontSize: '16px' }}><strong>📖 Book:</strong> {selectedOrder.book}</p>
              <p style={{ fontSize: '16px' }}><strong>🆔 Order ID:</strong> {selectedOrder.id}</p>
              <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#e67e22' }}>
                <strong>💰 Price:</strong> ₹{selectedOrder.total}
              </p>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
                Issue with the Book:
              </label>
              <select
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  marginBottom: '15px'
                }}
              >
                <option value="">-- Select an issue --</option>
                <option value="Damaged Book">📕 Damaged Book (torn pages, dented cover)</option>
                <option value="Missing Pages">📄 Missing Pages</option>
                <option value="Wrong Book">📚 Wrong Book Delivered</option>
                <option value="Printing Error">🖨️ Printing Error</option>
                <option value="Defective Binding">🔧 Defective Binding</option>
                <option value="Other">❓ Other Issue</option>
              </select>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
                Description:
              </label>
              <textarea
                rows="4"
                placeholder="Please describe the issue in detail..."
                value={returnDescription}
                onChange={(e) => setReturnDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>
            <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
              <button
                onClick={handleReturnRequest}
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
                Submit Return Request
              </button>
              <button
                onClick={() => {
                  setShowReturnForm(false);
                  setSelectedOrder(null);
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
export default Home;