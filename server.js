import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(join(__dirname, 'dist')));

// Generate random ID
const generateId = () => {
  return Math.random().toString(36).substring(2, 6);
};

// Read db.json
const getDb = () => {
  const data = readFileSync('./db.json', 'utf-8');
  return JSON.parse(data);
};

const saveDb = (data) => {
  writeFileSync('./db.json', JSON.stringify(data, null, 2));
};

// API Routes
app.get('/api/list', (req, res) => {
  const db = getDb();
  res.json(db.list || []);
});

app.post('/api/list', (req, res) => {
  const db = getDb();
  const newItem = { 
    id: generateId(), 
    task: req.body.task,
    status: req.body.status || "Incomplete"
  };
  db.list = [...(db.list || []), newItem];
  saveDb(db);
  res.status(201).json(newItem);
});

app.put('/api/list/:id', (req, res) => {
  const db = getDb();
  const id = req.params.id;
  const index = db.list.findIndex(item => item.id === id);
  
  if (index !== -1) {
    db.list[index] = { 
      ...db.list[index], 
      task: req.body.task,
      status: req.body.status 
    };
    saveDb(db);
    res.json(db.list[index]);
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

app.delete('/api/list/:id', (req, res) => {
  const db = getDb();
  const id = req.params.id;
  db.list = db.list.filter(item => item.id !== id);
  saveDb(db);
  res.status(204).send();
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log(`API available at http://localhost:${port}/api`);
});