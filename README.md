# Blog Management System

A MERN stack application to create, view, edit, and delete blog posts with optional multi-image upload.


## Features

- User login and signup
- View all blogs (read-only feed)
- Manage your own blogs (edit & delete)
- Add blogs with title, description, and optional images

## Project Structure

```
blog Management/
├── client/          # React frontend
│   ├── public/
│   └── src/
│       ├── componets/
│       ├── store/
│       └── utils/
├── docs/
│   └── screenshots/ # README screenshots
└── server/          # Express + MongoDB backend
    ├── config/
    ├── controller/
    ├── middleware/
    ├── model/
    ├── routes/
    ├── uploads/
    └── utils/
```

## Setup

1. Install dependencies:
```bash
cd server && npm install
cd ../client && npm install
```

2. Create `server/.env`:
```
MONGO_URI=mongodb://127.0.0.1:27017/BlogApp
```

3. Start the server:
```bash
cd server && npm start
```

4. Start the client:
```bash
cd client && npm start
```

5. Open [http://localhost:3000](http://localhost:3000)


