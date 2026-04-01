import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
function Payment({ user, onLogout, onPlaceOrder }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { book, quantity, totalPrice, source } = location.state || {};
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [upiDetails, setUpiDetails] = useState({
    upiId: "",
    name: ""
  });
  const [cardDetails, setCardDetails] = useState({
    cardNumber: "",
    cardHolderName: "",
    expiryDate: "",
    cvv: ""
  });
  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountNumber: "",
    ifscCode: "",
    accountHolderName: ""
  });
  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }
    if (paymentMethod === "UPI") {
      if (!upiDetails.upiId || !upiDetails.name) {
        alert("Please enter UPI ID and Name");
        return;
      }
    } else if (paymentMethod === "Debit Card") {
      if (!cardDetails.cardNumber || !cardDetails.cardHolderName || 
          !cardDetails.expiryDate || !cardDetails.cvv) {
        alert("Please fill all card details");
        return;
      }
      if (cardDetails.cardNumber.length !== 16) {
        alert("Please enter valid 16-digit card number");
        return;
      }
      if (cardDetails.cvv.length !== 3) {
        alert("Please enter valid 3-digit CVV");
        return;
      }
    } else if (paymentMethod === "Net Banking") {
      if (!bankDetails.bankName || !bankDetails.accountNumber || 
          !bankDetails.ifscCode || !bankDetails.accountHolderName) {
        alert("Please fill all bank details");
        return;
      }
    }
    setLoading(true);
    const orderDetails = {
      customer: user?.name,
      customerEmail: user?.email,
      book: book.name,
      bookId: book._id || book.id,
      quantity: quantity,
      total: totalPrice,
      paymentMethod: paymentMethod,
      source: source || 'cart'
    };
    console.log("📦 Order details:", orderDetails);
    try {
      const response = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderDetails)
      });
      if (response.ok) {
        console.log("✅ Order placed successfully!");
        setOrderPlaced(true);
        setTimeout(() => navigate("/home"), 3000);
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("❌ Error placing order:", error);
      alert("Network error - cannot reach server");
    }
    
    setLoading(false);
  };
  const handleUPIPayment = () => {
    if (upiDetails.upiId && upiDetails.name) {
      alert("✅ UPI payment successful! Order placed.");
      handlePlaceOrder();
    }
  };
  const handleCardPayment = () => {
    if (cardDetails.cardNumber && cardDetails.cardHolderName && 
        cardDetails.expiryDate && cardDetails.cvv) {
      alert("✅ Card payment successful! Order placed.");
      handlePlaceOrder();
    }
  };
  const handleNetBankingPayment = () => {
    if (bankDetails.bankName && bankDetails.accountNumber && 
        bankDetails.ifscCode && bankDetails.accountHolderName) {
      alert("✅ Net Banking payment successful! Order placed.");
      handlePlaceOrder();
    }
  };
  if (orderPlaced) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2 style={{ color: '#48bb78' }}>✅ Order Placed Successfully!</h2>
        <p>Thank you for your purchase.</p>
        <p>Your order is pending and will be processed soon.</p>
        <p>Redirecting to home page...</p>
      </div>
    );
  }
  if (!book) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>No book information found</h2>
        <button onClick={() => navigate("/home")}>Back to Home</button>
      </div>
    );
  }
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ color: '#2c3e50', marginBottom: '30px', textAlign: 'center' }}>💳 Payment Page</h1>
      {}
      <div style={{ 
        background: '#f8f9fa', 
        padding: '20px', 
        borderRadius: '10px', 
        marginBottom: '30px',
        border: '1px solid #e0e0e0'
      }}>
        <h3 style={{ color: '#2c3e50', marginBottom: '15px' }}>📋 Order Summary</h3>
        <p><strong>Book:</strong> {book.name}</p>
        <p><strong>Author:</strong> {book.author}</p>
        <p><strong>Quantity:</strong> {quantity}</p>
        <p><strong>Price per book:</strong> ₹{book.price}</p>
        <p><strong>Total Amount:</strong> <span style={{ fontSize: '20px', color: '#e67e22' }}>₹{totalPrice}</span></p>
        <p><strong>Ordered from:</strong> {source === 'cart' ? '🛒 Cart' : '❤️ Wishlist'}</p>
      </div>
      {}
      <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>💳 Select Payment Method</h3>
      {}
      <div style={{
        background: paymentMethod === 'Cash on Delivery' ? '#f0f7ff' : 'white',
        border: paymentMethod === 'Cash on Delivery' ? '2px solid #667eea' : '1px solid #e0e0e0',
        borderRadius: '10px',
        padding: '15px',
        marginBottom: '15px',
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}
      onClick={() => {
        setPaymentMethod('Cash on Delivery');
      }}>
        <input 
          type="radio" 
          name="payment" 
          value="Cash on Delivery"
          checked={paymentMethod === 'Cash on Delivery'}
          onChange={() => setPaymentMethod('Cash on Delivery')}
          style={{ marginRight: '10px' }}
        />
        <label style={{ fontSize: '18px', fontWeight: '500', cursor: 'pointer' }}>
          💵 Cash on Delivery (COD)
        </label>
        <p style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
          Pay when you receive the book at your doorstep
        </p>
      </div>
      {}
      <div style={{
        background: paymentMethod === 'UPI' ? '#f0f7ff' : 'white',
        border: paymentMethod === 'UPI' ? '2px solid #667eea' : '1px solid #e0e0e0',
        borderRadius: '10px',
        padding: '15px',
        marginBottom: '15px',
        cursor: 'pointer'
      }}
      onClick={() => setPaymentMethod('UPI')}>
        <input 
          type="radio" 
          name="payment" 
          value="UPI"
          checked={paymentMethod === 'UPI'}
          onChange={() => setPaymentMethod('UPI')}
          style={{ marginRight: '10px' }}
        />
        <label style={{ fontSize: '18px', fontWeight: '500', cursor: 'pointer' }}>
          📱 UPI (Google Pay, PhonePe, Paytm)
        </label>
        {paymentMethod === 'UPI' && (
          <div style={{ marginTop: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '8px' }}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              {}
              <img 
                src="/src/assets/qr.png"
                alt="QR Code"
                style={{ 
                  width: '150px', 
                  height: '150px',
                  border: '1px solid #ddd',
                  borderRadius: '10px',
                  padding: '10px',
                  background: 'white'
                }}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150x150?text=QR+Code";
                }}
              />
              <p style={{ marginTop: '10px', color: '#666' }}>Scan QR code to pay</p>
            </div>
            <div style={{ marginTop: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>UPI ID:</label>
              <input
                type="text"
                placeholder="Enter UPI ID (e.g., name@okhdfcbank)"
                value={upiDetails.upiId}
                onChange={(e) => setUpiDetails({ ...upiDetails, upiId: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  marginBottom: '10px'
                }}
              />
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name:</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={upiDetails.name}
                onChange={(e) => setUpiDetails({ ...upiDetails, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  marginBottom: '10px'
                }}
              />
              <button
                onClick={handleUPIPayment}
                style={{
                  marginTop: '15px',
                  padding: '10px 20px',
                  background: '#48bb78',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  width: '100%',
                  fontSize: '16px'
                }}
                onMouseEnter={(e) => e.target.style.background = '#38a169'}
                onMouseLeave={(e) => e.target.style.background = '#48bb78'}
              >
                Pay with UPI
              </button>
            </div>
          </div>
        )}
      </div>
      {}
      <div style={{
        background: paymentMethod === 'Debit Card' ? '#f0f7ff' : 'white',
        border: paymentMethod === 'Debit Card' ? '2px solid #667eea' : '1px solid #e0e0e0',
        borderRadius: '10px',
        padding: '15px',
        marginBottom: '15px',
        cursor: 'pointer'
      }}
      onClick={() => setPaymentMethod('Debit Card')}>
        <input 
          type="radio" 
          name="payment" 
          value="Debit Card"
          checked={paymentMethod === 'Debit Card'}
          onChange={() => setPaymentMethod('Debit Card')}
          style={{ marginRight: '10px' }}
        />
        <label style={{ fontSize: '18px', fontWeight: '500', cursor: 'pointer' }}>
          💳 Debit Card
        </label>
        {paymentMethod === 'Debit Card' && (
          <div style={{ marginTop: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '8px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Card Number:</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                maxLength="16"
                value={cardDetails.cardNumber}
                onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value.replace(/\D/g, '') })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  marginBottom: '10px'
                }}
              />
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Card Holder Name:</label>
              <input
                type="text"
                placeholder="Name on card"
                value={cardDetails.cardHolderName}
                onChange={(e) => setCardDetails({ ...cardDetails, cardHolderName: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  marginBottom: '10px'
                }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Expiry Date:</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    maxLength="5"
                    value={cardDetails.expiryDate}
                    onChange={(e) => setCardDetails({ ...cardDetails, expiryDate: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '5px'
                    }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>CVV:</label>
                  <input
                    type="password"
                    placeholder="123"
                    maxLength="3"
                    value={cardDetails.cvv}
                    onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '5px'
                    }}
                  />
                </div>
              </div>
              <button
                onClick={handleCardPayment}
                style={{
                  marginTop: '15px',
                  padding: '10px 20px',
                  background: '#48bb78',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  width: '100%',
                  fontSize: '16px'
                }}
                onMouseEnter={(e) => e.target.style.background = '#38a169'}
                onMouseLeave={(e) => e.target.style.background = '#48bb78'}
              >
                Pay with Card
              </button>
            </div>
          </div>
        )}
      </div>
      {}
      <div style={{
        background: paymentMethod === 'Net Banking' ? '#f0f7ff' : 'white',
        border: paymentMethod === 'Net Banking' ? '2px solid #667eea' : '1px solid #e0e0e0',
        borderRadius: '10px',
        padding: '15px',
        marginBottom: '15px',
        cursor: 'pointer'
      }}
      onClick={() => setPaymentMethod('Net Banking')}>
        <input 
          type="radio" 
          name="payment" 
          value="Net Banking"
          checked={paymentMethod === 'Net Banking'}
          onChange={() => setPaymentMethod('Net Banking')}
          style={{ marginRight: '10px' }}
        />
        <label style={{ fontSize: '18px', fontWeight: '500', cursor: 'pointer' }}>
          🏦 Net Banking
        </label>
        {paymentMethod === 'Net Banking' && (
          <div style={{ marginTop: '20px', padding: '15px', background: '#f9f9f9', borderRadius: '8px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Bank Name:</label>
              <select
                value={bankDetails.bankName}
                onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  marginBottom: '10px'
                }}
              >
                <option value="">Select Bank</option>
                <option value="State Bank of India">State Bank of India</option>
                <option value="HDFC Bank">HDFC Bank</option>
                <option value="ICICI Bank">ICICI Bank</option>
                <option value="Axis Bank">Axis Bank</option>
                <option value="IDBI Bank">IDBI Bank</option>
                <option value="Canara Bank">Canara Bank</option>
                <option value="IOB Bank">IOB Bank</option>
              </select>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Account Number:</label>
              <input
                type="text"
                placeholder="Enter account number"
                value={bankDetails.accountNumber}
                onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  marginBottom: '10px'
                }}
              />
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>IFSC Code:</label>
              <input
                type="text"
                placeholder="Enter IFSC code (e.g., SBIN0001234)"
                value={bankDetails.ifscCode}
                onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value.toUpperCase() })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  marginBottom: '10px'
                }}
              />
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Account Holder Name:</label>
              <input
                type="text"
                placeholder="Enter account holder name"
                value={bankDetails.accountHolderName}
                onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '1px solid #ddd',
                  borderRadius: '5px'
                }}
              />
              <button
                onClick={handleNetBankingPayment}
                style={{
                  marginTop: '15px',
                  padding: '10px 20px',
                  background: '#48bb78',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  width: '100%',
                  fontSize: '16px'
                }}
                onMouseEnter={(e) => e.target.style.background = '#38a169'}
                onMouseLeave={(e) => e.target.style.background = '#48bb78'}
              >
                Pay with Net Banking
              </button>
            </div>
          </div>
        )}
      </div>
      {}
      {paymentMethod === 'Cash on Delivery' && (
        <div style={{ marginTop: '30px' }}>
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            style={{
              padding: '12px 30px',
              background: loading ? '#ccc' : '#48bb78',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              width: '100%'
            }}
            onMouseEnter={(e) => !loading && (e.target.style.background = '#38a169')}
            onMouseLeave={(e) => !loading && (e.target.style.background = '#48bb78')}
          >
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>
      )}
      {}
      <div style={{ marginTop: '20px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '12px 30px',
            background: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            width: '100%'
          }}
          onMouseEnter={(e) => e.target.style.background = '#7f8c8d'}
          onMouseLeave={(e) => e.target.style.background = '#95a5a6'}
        >
          ← Go Back
        </button>
      </div>
    </div>
  );
}
export default Payment;