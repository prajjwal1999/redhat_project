# File Store Service

File Store Service is a simple HTTP server and command-line client for storing plain-text files in Node.js. The server receives requests from clients to store, update, delete files, and perform operations on files stored in the server.

## Features

- Add files to the store
- List files in the store
- Remove a file from the store
- Update contents of a file in the store
- Support operations on files:
  - Word count
  - Least or most frequent words

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/file-store-service.git

2. Install dependencies

    cd file-store-service
    npm install

3. Command-line Client
    Use the command-line client to interact with the server:
    Replace <command> with one of the following commands:

add <filenames>: Add files to the store
ls: List files in the store
rm <filename>: Remove a file from the store
update <filename>: Update contents of a file in the store
wc: Get the number of words in all files stored in the server
freq-words [--limit|-n 10] [--order=dsc|asc]: Get the least or most frequent words in all files combined
Replace [options] with the appropriate options for each command.
