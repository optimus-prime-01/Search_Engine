cat <<EOF > README.md
# 📚 PDF Search Engine (Military Intranet)

A full-stack web application for searching PDF documents hosted on an intranet, designed especially for internal defense-related document management. Built with React, Node.js, Python, and MongoDB.

## 🔧 Features

- 🔍 Full-text search across intranet-hosted PDF documents  
- 🌓 Dark/Light mode toggle  
- 📊 Metadata display (title, author, page count, etc.)  
- 🔐 Secure intranet deployment  

## ⚙️ Tech Stack

- **Frontend**: React.js + Material-UI  
- **Backend**: Node.js + Express  
- **Database**: MongoDB  
- **PDF Processing**: Python with PyMuPDF & pdfminer.six  

## ✅ Prerequisites

- Node.js (v14+)
- Python (v3.7+)
- MongoDB
- Git

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/pdf-search-engine.git
cd pdf-search-engine
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

### 4. Install Python Dependencies

```bash
cd pdf_processor
pip install PyMuPDF pdfminer.six
```

## ⚙️ Configuration

### Backend .env file

Create \`.env\` in \`backend/\`:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/pdfsearch
```

## ▶️ Running the Application

1. Ensure MongoDB is running  
2. Run Python script to extract and store data  
3. Start backend with \`npm start\`  
4. Start frontend with \`npm start\`

## 🔒 Deployment on Intranet

1. Build frontend:

```bash
cd frontend
npm run build
```

2. Serve frontend using Nginx:

```
server {
  listen 80;
  server_name your.intranet.ip;
  location / {
    root /var/www/html;
    index index.html;
    try_files \$uri /index.html;
  }
}
```

3. Use PM2 to keep backend running:

```bash
cd backend
pm2 start server/server.js
```

4. Restrict access with firewall rules or VPN  

## 🗂️ Project Structure

```
pdf-search-engine/
├── frontend/
├── backend/
│   ├── server/
│   └── pdf_processor/
```

## 🤝 Contributing

1. Fork the repo  
2. Create a new branch  
3. Commit and push your changes  
4. Open a Pull Request  

