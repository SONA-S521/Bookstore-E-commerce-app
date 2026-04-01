import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
const API_URL = 'http://localhost:5001';
function Books({ admin, onLogout }) {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBook, setNewBook] = useState({
    name: "",
    author: "",
    price: "",
    stock: ""
  });
  useEffect(() => {
    fetchBooks();
  }, []);
  const fetchBooks = async () => {
    try {
      console.log("📚 Fetching books...");
      const response = await fetch(`${API_URL}/api/books`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("📚 Books fetched:", data);
      setBooks(data);
    } catch (error) {
      console.error("❌ Error fetching books:", error);
      alert("Cannot connect to backend. Make sure server is running.");
    } finally {
      setLoading(false);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook({
      ...newBook,
      [name]: value
    });
  };
  const handleAddBook = async () => {
    if (!newBook.name || !newBook.author || !newBook.price || !newBook.stock) {
      alert("Please fill all fields");
      return;
    }
    if (Number(newBook.price) <= 0 || Number(newBook.stock) <= 0) {
      alert("Price and stock must be positive numbers");
      return;
    }
    try {
      console.log("📝 Adding new book...");
      const response = await fetch(`${API_URL}/api/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newBook.name,
          author: newBook.author,
          price: Number(newBook.price),
          stock: Number(newBook.stock)
        })
      });
      if (response.ok) {
        const addedBook = await response.json();
        console.log("✅ Book added successfully:", addedBook);
        setBooks([...books, addedBook]);
        setNewBook({ name: "", author: "", price: "", stock: "" });
        setShowAddForm(false);
        alert("Book added successfully!");
      } else {
        const errorData = await response.json();
        console.error("❌ Server error:", errorData);
        alert(errorData.message || "Failed to add book");
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      alert("Network error - cannot reach server. Make sure backend is running.");
    }
  };
  const handleDeleteBook = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) {
      return;
    }
    try {
      console.log("🗑️ Deleting book ID:", bookId);
      const response = await fetch(`${API_URL}/api/books/${bookId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        console.log("✅ Book deleted successfully");
        setBooks(books.filter(book => (book._id || book.id) !== bookId));
        alert("Book deleted successfully!");
      } else {
        const error = await response.json();
        alert(error.message || "Failed to delete book");
      }
    } catch (error) {
      console.error("❌ Error deleting book:", error);
      alert("Error deleting book. Make sure backend is running.");
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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <h1 style={{ color: '#2c3e50', margin: 0 }}>📚 Manage Books</h1>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              padding: '12px 24px',
              background: showAddForm ? '#e74c3c' : '#48bb78',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
          >
            {showAddForm ? '✕ Cancel' : '+ Add New Book'}
          </button>
        </div>
        {}
        {showAddForm && (
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '15px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
            marginBottom: '30px'
          }}>
            <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Add New Book</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '20px'
            }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Book Name:
                </label>
                <input
                  type="text"
                  name="name"
                  value={newBook.name}
                  onChange={handleInputChange}
                  placeholder="Enter book name"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '5px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Author:
                </label>
                <input
                  type="text"
                  name="author"
                  value={newBook.author}
                  onChange={handleInputChange}
                  placeholder="Enter author name"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '5px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Price (₹):
                </label>
                <input
                  type="number"
                  name="price"
                  value={newBook.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  min="1"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '5px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Stock:
                </label>
                <input
                  type="number"
                  name="stock"
                  value={newBook.stock}
                  onChange={handleInputChange}
                  placeholder="Enter stock quantity"
                  min="1"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '5px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
            <div style={{
              display: 'flex',
              gap: '10px',
              marginTop: '20px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => setShowAddForm(false)}
                style={{
                  padding: '10px 20px',
                  background: '#95a5a6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddBook}
                style={{
                  padding: '10px 20px',
                  background: '#48bb78',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Add Book
              </button>
            </div>
          </div>
        )}
        {}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>Loading books...</h2>
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
                background: '#667eea',
                color: 'white'
              }}>
                <tr>
                  <th style={{ padding: '15px', textAlign: 'left' }}>S.No</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Book Name</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Author</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Price (₹)</th>
                  <th style={{ padding: '15px', textAlign: 'left' }}>Stock</th>
                  <th style={{ padding: '15px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{
                      padding: '50px',
                      textAlign: 'center',
                      color: '#666'
                    }}>
                      No books available. Click "Add New Book" to add your first book!
                    </td>
                  </tr>
                ) : (
                  books.map((book, index) => (
                    <tr key={book._id || book.id || index} style={{
                      borderBottom: '1px solid #e0e0e0',
                      backgroundColor: index % 2 === 0 ? '#f8fafc' : 'white'
                    }}>
                      <td style={{ padding: '15px' }}>{index + 1}</td>
                      <td style={{ padding: '15px', fontWeight: '500' }}>{book.name}</td>
                      <td style={{ padding: '15px' }}>{book.author}</td>
                      <td style={{ padding: '15px', fontWeight: 'bold', color: '#2c3e50' }}>
                        ₹{book.price}
                      </td>
                      <td style={{ padding: '15px' }}>
                        <span style={{
                          padding: '5px 10px',
                          background: book.stock > 10 ? '#48bb78' : book.stock > 0 ? '#fbbf24' : '#f56565',
                          color: 'white',
                          borderRadius: '20px',
                          fontSize: '12px'
                        }}>
                          {book.stock} {book.stock === 1 ? 'unit' : 'units'}
                        </span>
                      </td>
                      <td style={{ padding: '15px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleDeleteBook(book._id || book.id)}
                          style={{
                            padding: '8px 16px',
                            background: '#e74c3c',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '14px'
                          }}
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
        {}
        <div style={{
          marginTop: '20px',
          padding: '15px',
          background: '#f8f9fa',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <span style={{ color: '#2c3e50' }}>
            <strong>Total Books:</strong> {books.length}
          </span>
        </div>
      </div>
    </div>
  );
}
export default Books;