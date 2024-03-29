const axios = require('axios');
const fs = require('fs');
const yargs = require('yargs');
const crypto = require('crypto');

const BASE_URL = 'http://localhost:3000';

const argv = yargs
  .command('add <filenames...>', 'Add files to the store', {}, (argv) => addFiles(argv.filenames))
  .command('ls', 'List files in the store', {}, () => listFiles())
  .command('rm <filename>', 'Remove a file from the store', {}, (argv) => removeFile(argv.filename))
  .command('update <filename>', 'Update contents of a file in the store', {}, (argv) => updateFile(argv.filename))
  .command('wc', 'Get word count of all files in the store', {}, () => wordCount())
  .command('freq-words', 'Get the least or most frequent words in all files combined', {}, (argv) => freqWords(argv))
  .help()
  .argv;

// Add files to the store
// Helper function to calculate the MD5 hash of a string
function calculateHash(content) {
    return crypto.createHash('md5').update(content).digest('hex');
  }
  
  // Add files to the store
  async function addFiles(filenames) {
    const contents = {};
  
    for (const filename of filenames) {
      const fileContent = fs.readFileSync(filename, 'utf8');
      const hash = calculateHash(fileContent);
      contents[filename] = { content: fileContent, hash };
    }
  
    try {
      const response = await axios.post(`${BASE_URL}/add`, { filenames, contents });
      console.log(response.data.message);
    } catch (error) {
      console.error(error.response.data.error);
    }
  }

// List files in the store
async function listFiles() {
  try {
    const response = await axios.get(`${BASE_URL}/ls`);
    console.log('Files in the store:', response.data.files);
  } catch (error) {
    console.error(error.response.data.error);
  }
}

// Remove a file from the store
async function removeFile(filename) {
  try {
    const response = await axios.delete(`${BASE_URL}/rm/${filename}`);
    console.log(response.data.message);
  } catch (error) {
    console.error(error.response.data.error);
  }
}

// Update contents of a file in the store
async function updateFile(filename) {
  const content = fs.readFileSync(filename, 'utf8');

  try {
    const response = await axios.put(`${BASE_URL}/update/${filename}`, { content });
    console.log(response.data.message);
  } catch (error) {
    console.error(error.response.data.error);
  }
}
// Get word count of all files in the store
async function wordCount() {
    try {
      const response = await axios.get(`${BASE_URL}/wc`);
      console.log(response.data.wordCounts);
    } catch (error) {
      console.error(error.response.data.error);
    }
  }


  // Get the least or most frequent words in all files combined
async function freqWords(options) {
    const limit = options.limit || 10;
    const order = options.order || 'desc';
  
    try {
      const response = await axios.get(`${BASE_URL}/freq-words`, { params: { limit, order } });
      console.table(response.data.freqWords);
    } catch (error) {
      console.error(error.response.data.error);
    }
  }
