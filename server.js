const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const wordcount = require('wordcount'); // Add this line

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
  
    for (const clientPath of filenames) {
      const fullPath = path.isAbsolute(clientPath) ? clientPath : path.join(process.cwd(), clientPath);
      const storagePath = path.join(STORE_PATH, path.basename(fullPath));
  
      const fileExistsInStore = await fileExists(storagePath);
  
      if (fileExistsInStore) {
        return res.status(400).json({ error: `${clientPath} already exists in the store.` });
      }
  
      const fileContent = req.body.contents[clientPath];
      await fs.writeFile(storagePath, fileContent);
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

// Helper function to calculate word count in a file
// WC endpoint to get the word count of each file in the store
app.get('/wc', async (req, res) => {
    try {
      const files = await fs.readdir(STORE_PATH);
      const wordCounts = [];
  
      for (const file of files) {
        const filepath = path.join(STORE_PATH, file);
        const fileContent = await fs.readFile(filepath, 'utf-8');
        const wordCount = countWords(fileContent);
        wordCounts.push({ file, wordCount });
      }
      console.log("wordcount: ",wordCounts);
  
      res.json({ wordCounts });
    } catch (error) {
      console.log("error: ",error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  // Helper function to count words in a string
  function countWords(text) {
    const words = text.split(/\s+/).filter(word => word !== '');
    return words.length;
  }
// Start the server
app.listen(PORT, () => {
  console.log(`File Store Server listening on port ${PORT}`);
});
