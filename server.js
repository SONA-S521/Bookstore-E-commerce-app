import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import connectDB from './db.js';
import Book from './models/books.js';
import User from './models/users.js';
import Order from './models/orders.js';
const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));
app.use(express.json());
connectDB();
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});
app.get('/api/books', async (req, res) => {
  try {
    console.log('📚 Fetching all books...');
    const books = await Book.find();
    console.log('📚 Books fetched:', books.length);
    res.json(books);
  } catch (error) {
    console.error('❌ Error fetching books:', error);
    res.status(500).json({ message: error.message });
  }
});
app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    console.error('❌ Error fetching book:', error);
    res.status(500).json({ message: error.message });
  }
});
app.post('/api/books', async (req, res) => {
  try {
    console.log('📝 Adding new book:', req.body);
    const { name, author, price, stock } = req.body;
    if (!name || !author || !price || !stock) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (price <= 0 || stock <= 0) {
      return res.status(400).json({ message: 'Price and stock must be positive numbers' });
    }
    const book = new Book({
      name,
      author,
      price: Number(price),
      stock: Number(stock)
    });
    const newBook = await book.save();
    console.log('✅ Book added successfully:', newBook);
    res.status(201).json(newBook);
  } catch (error) {
    console.error('❌ Error adding book:', error);
    res.status(400).json({ message: error.message });
  }
});
app.put('/api/books/:id', async (req, res) => {
  try {
    const { name, author, price, stock } = req.body;
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { name, author, price: Number(price), stock: Number(stock) },
      { new: true }
    );
    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    console.log('✅ Book updated successfully:', updatedBook);
    res.json(updatedBook);
  } catch (error) {
    console.error('❌ Error updating book:', error);
    res.status(400).json({ message: error.message });
  }
});
app.delete('/api/books/:id', async (req, res) => {
  try {
    const bookId = req.params.id;
    console.log('🗑️ Deleting book ID:', bookId);
    const deletedBook = await Book.findByIdAndDelete(bookId);
    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }
    console.log('✅ Book deleted successfully');
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting book:', error);
    res.status(500).json({ message: error.message });
  }
});
app.get('/api/users', async (req, res) => {
  try {
    console.log('👥 Fetching all users...');
    const users = await User.find().select('-password');
    console.log('👥 Users fetched:', users.length);
    res.json(users);
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    res.status(500).json({ message: error.message });
  }
});
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('❌ Error fetching user:', error);
    res.status(500).json({ message: error.message });
  }
});
app.post('/api/users/signup', async (req, res) => {
  try {
    console.log('📝 Signup request received:', req.body);
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists' 
      });
    }
    const user = new User({
      name,
      email,
      password,
      role: 'user',
      joined: new Date().toISOString().split('T')[0]
    });
    const newUser = await user.save();
    console.log('✅ User created successfully:', newUser.email);
    res.status(201).json({ 
      success: true, 
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('❌ Signup error:', error);
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
});
app.post('/api/users/login', async (req, res) => {
  try {
    console.log('🔵 Login request received for email:', req.body.email);
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }
    if (email === 'admin@gmail.com' && password === 'admin123') {
      console.log('🟢 Admin login successful');
      return res.json({ 
        success: true, 
        role: 'admin',
        user: { 
          name: 'Admin', 
          email: 'admin@gmail.com', 
          role: 'admin' 
        }
      });
    }
    const user = await User.findOne({ email, password });
    if (user) {
      console.log('🟢 User login successful:', user.email);
      res.json({ 
        success: true, 
        role: 'user',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      });
    } else {
      console.log('🔴 Login failed - invalid credentials');
      res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
  } catch (error) {
    console.error('🔴 Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});
app.delete('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (user && user.email === 'admin@gmail.com') {
      return res.status(403).json({ message: 'Cannot delete main admin user' });
    }
    await User.findByIdAndDelete(userId);
    console.log('✅ User deleted successfully:', userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting user:', error);
    res.status(500).json({ message: error.message });
  }
});
app.get('/api/orders', async (req, res) => {
  try {
    console.log('📦 Fetching all orders...');
    const orders = await Order.find().sort({ createdAt: -1 });
    console.log('📦 Orders fetched:', orders.length);
    res.json(orders);
  } catch (error) {
    console.error('❌ Error fetching orders:', error);
    res.status(500).json({ message: error.message });
  }
});
app.get('/api/orders/user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    console.log(`📦 Fetching orders for ${email}...`);
    const orders = await Order.find({ customerEmail: email }).sort({ createdAt: -1 });
    console.log(`📦 Orders found for ${email}:`, orders.length);
    res.json(orders);
  } catch (error) {
    console.error('❌ Error fetching user orders:', error);
    res.status(500).json({ message: error.message });
  }
});
app.get('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('❌ Error fetching order:', error);
    res.status(500).json({ message: error.message });
  }
});
app.post('/api/orders', async (req, res) => {
  try {
    console.log('📦 Creating new order:', req.body);
    const { customer, customerEmail, book, bookId, quantity, total, paymentMethod, source } = req.body;
    if (!customer || !customerEmail || !book || !quantity || !total || !paymentMethod) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const orderCount = await Order.countDocuments();
    const orderId = `#ORD${String(orderCount + 1).padStart(3, '0')}`;
    const order = new Order({
      id: orderId,
      customer,
      customerEmail,
      book,
      bookId: String(bookId),
      quantity: Number(quantity),
      total: Number(total),
      paymentMethod,
      source: source || 'cart',
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    });
    const newOrder = await order.save();
    console.log('✅ Order created successfully:', orderId);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('❌ Error creating order:', error);
    res.status(400).json({ message: error.message });
  }
});
app.put('/api/orders/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;
    console.log(`🔄 Updating order ${orderId} to status:`, status);
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    console.log('✅ Order updated successfully:', order);
    res.json(order);
  } catch (error) {
    console.error('❌ Error updating order:', error);
    res.status(400).json({ message: error.message });
  }
});
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const orderId = req.params.id;
    console.log('🗑️ Deleting order ID:', orderId);
    const deletedOrder = await Order.findByIdAndDelete(orderId);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    console.log('✅ Order deleted successfully');
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting order:', error);
    res.status(500).json({ message: error.message });
  }
});
app.get('/api/stats', async (req, res) => {
  try {
    console.log('📊 Fetching dashboard stats...');
    const totalBooks = await Book.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const orders = await Order.find();
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;
    const processingOrders = orders.filter(o => o.status === 'Processing').length;
    const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    console.log('📊 Stats:', {
      totalBooks,
      totalUsers,
      totalOrders,
      totalRevenue,
      pendingOrders,
      processingOrders,
      deliveredOrders
    });
    res.json({
      totalBooks,
      totalUsers,
      totalOrders,
      totalRevenue,
      pendingOrders,
      processingOrders,
      deliveredOrders
    });
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    res.status(500).json({ message: error.message });
  }
});
const PORT = 5001;
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log(`🚀 SERVER RUNNING ON http://localhost:${PORT}`);
  console.log(`🔧 Test: http://localhost:${PORT}/test`);
  console.log(`📚 Books API: http://localhost:${PORT}/api/books`);
  console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
  console.log(`📦 Orders API: http://localhost:${PORT}/api/orders`);
  console.log(`📊 Stats API: http://localhost:${PORT}/api/stats`);
  console.log('='.repeat(60) + '\n');
});