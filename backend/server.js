require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/test', (req, res) => res.json({ message: 'Backend đang chạy ngon lành!' }));

app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/categories', require('./src/routes/categories'));
app.use('/api/products', require('./src/routes/products'));
app.use('/api/customers', require('./src/routes/customers'));
app.use('/api/orders', require('./src/routes/orders'));
app.use('/api/contacts', require('./src/routes/contacts'));
app.use('/api/payment', require('./src/routes/payment'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Lỗi máy chủ' });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server chạy tại http://localhost:${PORT}`));
