const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
// const PORT = 3000;
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

const DATA_FILE = 'data.json';

// Swagger setup
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'iBuddy API',
      version: '1.0.0',
      description: 'API to insert name and number',
    },
  },
  apis: ['./server.js'], // Path to file for documentation
};

const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Utils to read/write file
function readData() {
  if (!fs.existsSync(DATA_FILE)) {
    return [];
  }
  const jsonData = fs.readFileSync(DATA_FILE);
  return JSON.parse(jsonData);
}

function writeData(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

/**
 * @swagger
 * /addUser:
 *   post:
 *     summary: Add a new user
 *     description: Inserts a user's name and number into a local JSON file.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - number
 *             properties:
 *               name:
 *                 type: string
 *               number:
 *                 type: string
 *     responses:
 *       200:
 *         description: User added successfully
 */
app.post('/addUser', (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    return res.status(400).json({ error: 'Name and number are required.' });
  }

  const users = readData();
  users.push({ name, number, createdAt: new Date().toISOString() });
  writeData(users);

  res.json({ message: 'User added successfully', user: { name, number } });
});

// app.listen(PORT, () => {
//   console.log(`✅ Server running at http://localhost:${PORT}`);
//   console.log(`📘 Swagger docs at http://localhost:${PORT}/api-docs`);
  
// });

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running at http://0.0.0.0:${PORT}`);
});
