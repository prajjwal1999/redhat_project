const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const STORE_PATH = "/Users/prajjwalsingh/Downloads/storage/";

app.use(bodyParser.json());

// Helper function to check if a file exists in the store
async function fileExists(filename) {
  try {
    await fs.access(path.join(STORE_PATH, filename));
    return true;
  } catch (error) {
    return false;
  }
}

// Add files to the store
app.post('/add', async (req, res) => {
  const filenames = req.body.filenames;

  for (const filename of filenames) {
    const fileExistsInStore = await fileExists(filename);

    if (fileExistsInStore) {
      return res.status(400).json({ error: `${filename} already exists in the store.` });
    }

    const fileContent = req.body.contents[filename];
    await fs.writeFile(path.join(STORE_PATH, filename), fileContent);
  }

  res.json({ message: 'Files added successfully.' });
});

// List files in the store
app.get('/ls', async (req, res) => {
  try {
    const files = await fs.readdir(STORE_PATH);
    res.json({ files });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Remove a file from the store
app.delete('/rm/:filename', async (req, res) => {
  const filename = req.params.filename;

  try {
    await fs.unlink(path.join(STORE_PATH, filename));
    res.json({ message: `${filename} removed successfully.` });
  } catch (error) {
    res.status(404).json({ error: `${filename} not found in the store.` });
  }
});

// Update contents of a file in the store
app.put('/update/:filename', async (req, res) => {
  const filename = req.params.filename;
  const fileContent = req.body.content;

  try {
    await fs.writeFile(path.join(STORE_PATH, filename), fileContent);
    res.json({ message: `${filename} updated successfully.` });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`File Store Server listening on port ${PORT}`);
});
