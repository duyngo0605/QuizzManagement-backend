# README: QuizzApp Application
---

## Back-end

### Technologies Used
- **Node.js**: For server-side scripting.
- **ExpressJS**: For API development.
- **MongoDB**: For database storage.
- **Mongoose**: For object data modeling.
- **JWT**: For secure authentication.
- **Bcrypt**: For password hashing.

### Setup Instructions
1. Make sure that you installed Node.js
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set environment variables in a `.env` file:
   ```env
   PORT = 5000
   BACKEND_ENDPOINT = 'your mongodb url'
   ACCESS_TOKEN = access_token
   REFRESH_TOKEN = refresh_token
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. API endpoints will be available at `http://localhost:5000`.

### Directory Structure
```
src/
├── controllers/  # Handle to call services
├── models/       # Mongoose schemas
├── routes/       # API routes
├── services/     # Handle business logic
├── middleware/   # Authentication and error handling
├── utils/        # Utility functions
├── server.js     # Entry point
└── config/       # Environment configuration
```

---

## Contributors
- **Ngô Vũ Đức Duy - 21512999**
- **Phan Quốc Tuấn - 21521637**



