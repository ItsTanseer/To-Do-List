// File: /api/list.js

import { kv } from '@vercel/kv';
import { readFileSync } from 'fs';
import path from 'path';

// Helper function to generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 6);

// Helper function to load initial data from db.json if the database is empty
const initializeDb = async () => {
  let list = await kv.get('todolist');
  if (!list) {
    // process.cwd() gives the root directory of the deployment
    const filePath = path.join(process.cwd(), 'db.json');
    const fileData = readFileSync(filePath, 'utf-8');
    const jsonData = JSON.parse(fileData);
    await kv.set('todolist', jsonData.list);
    console.log('Database initialized from db.json');
    return jsonData.list;
  }
  return list;
};

export default async function handler(req, res) {
  try {
    // Make sure the database is initialized
    await initializeDb();
    
    // GET request: Fetch all tasks
    if (req.method === 'GET') {
      const list = await kv.get('todolist');
      return res.status(200).json(list || []);
    }

    // POST request: Add a new task
    if (req.method === 'POST') {
      const { task, status } = req.body;
      const list = await kv.get('todolist') || [];
      const newItem = { id: generateId(), task, status: status || "Incomplete" };
      await kv.set('todolist', [...list, newItem]);
      return res.status(201).json(newItem);
    }
    
    // PUT request: Update a task
    if (req.method === 'PUT') {
      const { id } = req.query; // Get ID from query parameter
      const { task, status } = req.body;
      let list = await kv.get('todolist') || [];
      const index = list.findIndex(item => item.id === id);

      if (index !== -1) {
        list[index] = { ...list[index], task, status };
        await kv.set('todolist', list);
        return res.status(200).json(list[index]);
      } else {
        return res.status(404).json({ error: 'Item not found' });
      }
    }

    // DELETE request: Remove a task
    if (req.method === 'DELETE') {
      const { id } = req.query; // Get ID from query parameter
      let list = await kv.get('todolist') || [];
      const updatedList = list.filter(item => item.id !== id);
      await kv.set('todolist', updatedList);
      return res.status(204).send(); // 204 No Content
    }

    // Handle other methods
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
}