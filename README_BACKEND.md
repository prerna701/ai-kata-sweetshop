# 🍬 Sweet Shop Management System - Backend API

A robust, production-ready Node.js/Express backend for managing a sweet shop with MongoDB, JWT authentication, role-based access control, and comprehensive admin features.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Authentication & Authorization](#authentication--authorization)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Development Guide](#development-guide)
- [My AI Usage](#my-ai-usage)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🎯 Project Overview

This is a complete backend solution for a sweet shop e-commerce platform. It provides RESTful APIs for:
- **User Management**: Registration, login, role-based access
- **Sweet Catalog**: Create, read, update, delete sweets
- **Inventory Management**: Stock tracking and restocking
- **Order Management**: Place and track orders
- **Admin Analytics**: Sales statistics and insights

Built with enterprise-level practices including TypeScript, comprehensive error handling, input validation, rate limiting, and security best practices.

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication with refresh tokens
- bcryptjs password hashing with configurable salt rounds
- Role-based access control (RBAC) - Admin and User roles
- Helmet for HTTP security headers
- Express rate limiting to prevent abuse
- Input validation with express-validator
- CORS configuration for frontend integration

### 🍬 Sweet Management
- **Create** new sweets with category, price, quantity, description
- **Read** all sweets with pagination, filtering, and search
- **Update** sweet details (price, quantity, category)
- **Delete** sweets from catalog
- **Automatic availability** calculation based on stock
- **Category filtering** - 8 predefined categories
- **Price range filtering** - min/max price search

### 📦 Inventory Management
- Track sweet quantity in real-time
- Restock sweets (increase quantity)
- Purchase sweets (decrease quantity)
- Low stock alerts (< 5 items)
- Automatic "out of stock" status

### 📊 Admin Features
- Shop statistics dashboard
  - Total sweets count
  - Total inventory value
  - Average sweet price
  - Out of stock items
  - Category breakdown
- View all orders
- Manage sweet catalog
- Monitor inventory levels

### 📱 Search & Filtering
- Full-text search by name and description
- Filter by category
- Price range filtering (min-max)
- Availability status filtering
- Pagination with customizable limits

### 🧪 Testing & Quality
- Jest unit and integration tests
- Supertest for API testing
- >80% code coverage
- TypeScript for type safety
- ESLint for code quality

### 📚 Documentation
- Swagger/OpenAPI integration
- Interactive API docs at `/api-docs`
- Detailed endpoint documentation
- Request/response examples

## 🛠️ Tech Stack

```
Backend Framework:  Express.js 4.x
Language:          TypeScript 5.x
Runtime:           Node.js 18+
Database:          MongoDB 6.0+
ODM:               Mongoose 8.x
Authentication:    JWT (jsonwebtoken)
Password Hashing:   bcryptjs 2.x
Validation:        express-validator 7.x
Security:          Helmet 7.x
Rate Limiting:     express-rate-limit 7.x
Testing:           Jest 29.x, Supertest 6.x
Documentation:     Swagger UI Express 5.x
Development:       ts-node, nodemon, ESLint, TypeScript
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── app.ts                      # Express app setup & middleware config
│   ├── config/
│   │   ├── env.ts                 # Environment variables & validation
│   │   └── database.ts            # MongoDB connection setup
│   ├── controllers/
│   │   ├── AuthController.ts      # Authentication endpoints
│   │   ├── SweetController.ts     # Sweet management endpoints
│   │   └── OrderController.ts     # Order management endpoints
│   ├── middleware/
│   │   ├── auth.ts                # JWT verification middleware
│   │   ├── errorHandler.ts        # Global error handling
│   │   └── validation.ts          # Input validation middleware
│   ├── models/
│   │   ├── User.ts                # User schema & validation
│   │   ├── Sweet.ts               # Sweet schema & validation
│   │   └── Order.ts               # Order schema & validation
│   ├── routes/
│   │   ├── auth.ts                # Auth routes
│   │   ├── sweets.ts              # Sweet routes
│   │   └── orders.ts              # Order routes
│   ├── services/
│   │   ├── UserService.ts         # User business logic
│   │   ├── SweetService.ts        # Sweet business logic
│   │   └── OrderService.ts        # Order business logic
│   ├── types/
│   │   └── express.d.ts           # Express type extensions
│   ├── utils/
│   │   └── tokenUtils.ts          # JWT utilities
│   └── tests/
│       └── integration/           # Integration tests
├── .env.example                    # Environment template
├── jest.config.js                  # Jest testing config
├── tsconfig.json                   # TypeScript config
├── package.json                    # Dependencies
├── swagger.yaml                    # API documentation
└── README.md                       # This file
```

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** 18.0.0 or higher
- **MongoDB** 6.0 or higher (local or MongoDB Atlas)
- **npm** 9.0 or higher (or yarn)
- **Git** for version control

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd sweet-shop/backend
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Environment Setup

Create `.env` file in the backend root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# ============ SERVER ============
PORT=3000
NODE_ENV=development

# ============ DATABASE ============
# Local MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/sweet_shop

# OR MongoDB Atlas (cloud)
# MONGODB_URI=mongodb+srv://username:password@cluster-name.mongodb.net/sweet_shop?retryWrites=true&w=majority

# ============ AUTHENTICATION ============
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_please
JWT_EXPIRES_IN=24h

# ============ SECURITY ============
BCRYPT_SALT_ROUNDS=10

# ============ RATE LIMITING ============
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# ============ CORS ============
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### Step 4: Database Setup

#### Option A: Local MongoDB

```bash
# Start MongoDB service (macOS with Homebrew)
brew services start mongodb-community

# Or on Windows (if installed), MongoDB should auto-start
# Or start manually:
mongod
```

#### Option B: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account and cluster
3. Get connection string
4. Add to `.env` as `MONGODB_URI`

#### Seed Database (Optional)

```bash
npm run seed
```

This creates sample sweets for testing.

### Step 5: Start Development Server

```bash
npm run dev
```

Server starts at: `http://localhost:3000`

### Step 6: Verify Setup

```bash
# Check health endpoint
curl http://localhost:3000/health

# Expected response:
# {
#   "success": true,
#   "message": "API is running",
#   "timestamp": "2024-01-15T10:30:00.000Z",
#   "database": "connected"
# }
```

## 📡 API Documentation

### Quick Links

- **Interactive Docs**: http://localhost:3000/api-docs
- **Base URL**: `http://localhost:3000/api`
- **Auth Header**: `Authorization: Bearer {jwt_token}`

### Authentication Endpoints

#### 1. User Signup

**Request:**
```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123!",
  "role": "customer"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "customer"
    }
  }
}
```

#### 2. User Login

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "role": "customer"
    }
  }
}
```

### Sweet Management Endpoints

#### 3. Get All Sweets (Public)

**Request:**
```http
GET /api/sweets?page=1&limit=10&category=Traditional&minPrice=100&maxPrice=500&search=Rasgulla
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10, max: 100) |
| `category` | string | Filter by category |
| `minPrice` | number | Minimum price filter |
| `maxPrice` | number | Maximum price filter |
| `search` | string | Search by name or description |
| `isAvailable` | boolean | Filter by availability |

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Sweets retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Rasgulla",
      "price": 250,
      "quantity": 10,
      "category": "Traditional",
      "description": "Sweet milk product with sugar syrup",
      "isAvailable": true,
      "inStock": true,
      "createdAt": "2024-01-01T10:00:00Z",
      "updatedAt": "2024-01-15T15:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3,
    "hasNext": true,
    "hasPrev": false
  }
}
```

#### 4. Create Sweet (Admin Only)

**Request:**
```http
POST /api/sweets
Authorization: Bearer {admin_jwt_token}
Content-Type: application/json

{
  "name": "Kaju Katli",
  "price": 900,
  "quantity": 50,
  "category": "Traditional",
  "description": "Delicious cashew brittle sweet"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Sweet created successfully",
  "data": {
    "sweet": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Kaju Katli",
      "price": 900,
      "quantity": 50,
      "category": "Traditional",
      "isAvailable": true
    }
  }
}
```

**Validation Rules:**
- `name`: 2-100 characters, unique
- `price`: 0-10000, 2 decimal places
- `quantity`: non-negative integer
- `category`: one of 8 predefined categories

#### 5. Update Sweet (Admin Only)

**Request:**
```http
PUT /api/sweets/507f1f77bcf86cd799439012
Authorization: Bearer {admin_jwt_token}
Content-Type: application/json

{
  "price": 950,
  "quantity": 40,
  "description": "Updated description"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Sweet updated successfully",
  "data": {
    "sweet": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Kaju Katli",
      "price": 950,
      "quantity": 40
    }
  }
}
```

#### 6. Delete Sweet (Admin Only)

**Request:**
```http
DELETE /api/sweets/507f1f77bcf86cd799439012
Authorization: Bearer {admin_jwt_token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Sweet deleted successfully"
}
```

#### 7. Restock Sweet (Admin Only)

**Request:**
```http
POST /api/sweets/507f1f77bcf86cd799439012/restock
Authorization: Bearer {admin_jwt_token}
Content-Type: application/json

{
  "quantity": 20
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Restock successful",
  "data": {
    "sweet": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "Kaju Katli",
      "quantity": 60,
      "addedQuantity": 20,
      "newQuantity": 60
    }
  }
}
```

#### 8. Get Statistics (Admin Only)

**Request:**
```http
GET /api/sweets/stats/statistics
Authorization: Bearer {admin_jwt_token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "statistics": {
      "totalSweets": 25,
      "totalQuantity": 500,
      "totalValue": 150000.50,
      "averagePrice": 6000.02,
      "outOfStock": 2,
      "inStock": 23,
      "categories": {
        "Traditional": 10,
        "Chocolate": 8,
        "Candy": 7
      }
    }
  }
}
```

## 🗄️ Database Schema

### User Model

```typescript
{
  _id: ObjectId (auto-generated),
  name: String {
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: String {
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: /email-regex/
  },
  password: String {
    required: true,
    minlength: 6,
    select: false (hidden by default)
  },
  role: Enum {
    values: ['customer', 'admin'],
    default: 'customer'
  },
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}

// Indexes
- email (unique)
- createdAt (descending)
```

### Sweet Model

```typescript
{
  _id: ObjectId (auto-generated),
  name: String {
    required: true,
    unique: true,
    trim: true,
    minlength: 2,
    maxlength: 100
  },
  category: Enum {
    required: true,
    values: ['Chocolate', 'Candy', 'Biscuit', 'Cake', 
             'Pastry', 'Ice Cream', 'Traditional', 'Other']
  },
  price: Number {
    required: true,
    min: 0,
    max: 10000,
    set: (val) => parseFloat(val.toFixed(2))
  },
  quantity: Integer {
    required: true,
    min: 0,
    default: 0,
    validate: Number.isInteger
  },
  description: String {
    trim: true,
    maxlength: 500,
    default: ''
  },
  isAvailable: Boolean {
    default: true,
    auto-calculated from quantity > 0
  },
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}

// Virtual Fields
- inStock: Boolean (quantity > 0)

// Middleware
- pre('save'): Updates isAvailable based on quantity
- post('findByIdAndUpdate'): Updates isAvailable

// Indexes
- name (unique, text search)
- category (filtering)
- price (range queries)
- quantity (low stock alerts)
- isAvailable (availability filter)
- createdAt (sorting)
```

### Order Model

```typescript
{
  _id: ObjectId (auto-generated),
  userId: ObjectId {
    required: true,
    reference: 'User'
  },
  items: Array {
    sweetId: ObjectId,
    quantity: Number,
    price: Number (snapshot at purchase time)
  },
  totalAmount: Number {
    required: true,
    min: 0
  },
  status: Enum {
    values: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  deliveryAddress: String {
    required: true,
    minlength: 10
  },
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}

// Indexes
- userId (user's orders)
- status (order filtering)
- createdAt (sorting)
```

## 🔐 Authentication & Authorization

### JWT Token Structure

```typescript
{
  // Payload
  userId: string,
  email: string,
  role: 'admin' | 'customer',
  
  // Metadata
  iat: number (issued at timestamp),
  exp: number (expiration timestamp)
}
```

### Token Lifecycle

1. **User Signup/Login**
   - User credentials validated
   - Password verified with bcryptjs
   - JWT token created with user info
   - Token sent in response (NOT in cookie)

2. **Protected Route Access**
   - Client sends: `Authorization: Bearer {token}`
   - Middleware verifies token signature
   - Token expiration checked
   - User info injected into `req.user`

3. **Role-Based Access**
   - `authorize('admin')` middleware checks role
   - Only admin users can create/update/delete sweets
   - Other users get 403 Forbidden

### Middleware Stack

```javascript
// Auth flow:
authenticate → (checks if token valid & user exists)
  ↓
authorize('admin') → (checks if user role is admin)
  ↓
Route Handler
```

## ⚠️ Error Handling

### Global Error Handler

All errors caught and formatted consistently:

**Standard Error Response**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Email already exists"
    }
  ]
}
```

### HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | OK | Sweet retrieved successfully |
| 201 | Created | Sweet created successfully |
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Admin access required |
| 404 | Not Found | Sweet not found |
| 409 | Conflict | Email already exists |
| 422 | Unprocessable | Validation failed |
| 500 | Server Error | Database error |

### Custom Error Classes

```typescript
class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
  }
}
```

### Validation Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    },
    {
      "field": "password",
      "message": "Password must be at least 6 characters"
    }
  ]
}
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run in watch mode
npm test -- --watch

# Run with coverage report
npm run test:coverage

# Run specific test file
npm test -- auth.test.ts
```

### Test Coverage

- **Unit Tests**: Service layer logic
- **Integration Tests**: API endpoints with database
- **Coverage Target**: >80% of codebase

### Test Structure

```
tests/
├── unit/
│   ├── SweetService.test.ts
│   └── UserService.test.ts
└── integration/
    ├── auth.test.ts
    ├── sweets.test.ts
    └── orders.test.ts
```

## 🔨 Development Guide

### Available Commands

```bash
# Start development server (auto-reload)
npm run dev

# Build TypeScript to JavaScript
npm run build

# Run built application
npm start

# Run tests
npm test

# Check code for linting errors
npm run lint

# Fix linting errors automatically
npm run lint:fix

# Type checking without building
npm run type-check

# Seed database with sample data
npm run seed
```

### Code Style

- **Language**: TypeScript
- **Linter**: ESLint
- **Formatting**: Prettier (auto-format with ESLint)
- **Import order**: External → Internal → Relative paths

### Debugging

Using VS Code debugger:

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "program": "${workspaceFolder}/backend/src/app.ts",
      "preLaunchTask": "tsc: build",
      "outFiles": ["${workspaceFolder}/dist/**/*.js"]
    }
  ]
}
```

## My AI Usage

### Overview
This project was developed with significant assistance from GitHub Copilot CLI, which helped accelerate development while maintaining code quality and best practices.

### Specific Use Cases

#### 1. **API Endpoint Design & Structure**
- **Tool**: GitHub Copilot
- **Usage**: Used Copilot to brainstorm RESTful endpoint designs following standard conventions
- **Example**: When designing the `/api/sweets` endpoints, Copilot suggested the standard CRUD pattern (GET all, GET by ID, POST create, PUT update, DELETE) with appropriate HTTP methods and status codes
- **Impact**: Ensured consistent and professional API design without manual research

#### 2. **Validation Middleware**
- **Tool**: GitHub Copilot
- **Usage**: Asked Copilot to generate validation rules for sweets data using express-validator
- **Example**: Generated comprehensive validation for sweet name (2-100 chars, unique), price (0-10000, 2 decimals), and category enum validation
- **Code Suggestion**:
```typescript
body('price')
  .isFloat({ min: 0 })
  .withMessage('Price must be a positive number'),
body('quantity')
  .isInt({ min: 0 })
  .withMessage('Quantity must be a non-negative integer')
```
- **Impact**: Created production-grade validation without manual implementation

#### 3. **MongoDB Schema Design**
- **Tool**: GitHub Copilot
- **Usage**: Used Copilot to suggest mongoose schema design patterns and best practices
- **Example**: For the Sweet model, Copilot suggested:
  - Using virtual fields for `inStock` calculation
  - Pre-save middleware for auto-calculating `isAvailable`
  - Proper indexing strategy for common queries
  - Schema-level validation rules
- **Impact**: Designed optimized database schema with proper indexing and validation

#### 4. **Authentication Flow**
- **Tool**: GitHub Copilot
- **Usage**: Asked Copilot to generate JWT-based auth middleware with proper error handling
- **Example**: Generated the authenticate middleware that:
  - Extracts token from Authorization header
  - Verifies signature and expiration
  - Handles token errors gracefully
- **Impact**: Implemented secure authentication without security vulnerabilities

#### 5. **Error Handling System**
- **Tool**: GitHub Copilot
- **Usage**: Used Copilot to create consistent error handling patterns across the application
- **Example**: Generated global error handler middleware that:
  - Catches all errors (operational & programming)
  - Formats consistent error responses
  - Logs errors for debugging
  - Returns appropriate HTTP status codes
- **Impact**: Eliminated error handling inconsistencies and improved debugging

#### 6. **Testing Patterns**
- **Tool**: GitHub Copilot
- **Usage**: Asked Copilot to generate test cases for API endpoints and services
- **Example**: Generated integration tests for sweet endpoints with:
  - Proper setup/teardown
  - Mock data
  - Assertions for success and error cases
  - Database cleanup
- **Code Pattern**:
```typescript
describe('POST /api/sweets', () => {
  it('should create a sweet with valid data', async () => {
    const res = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(validSweetData);
    
    expect(res.status).toBe(201);
    expect(res.body.data.sweet.name).toBe(validSweetData.name);
  });
});
```
- **Impact**: Achieved >80% test coverage with well-structured tests

#### 7. **Rate Limiting & Security**
- **Tool**: GitHub Copilot
- **Usage**: Used Copilot to configure Helmet and rate-limiting middleware
- **Example**: Suggested security headers configuration and rate-limit rules
- **Impact**: Implemented industry-standard security practices without manual research

#### 8. **Documentation Generation**
- **Tool**: GitHub Copilot
- **Usage**: Asked Copilot to generate detailed API documentation in Swagger/OpenAPI format
- **Example**: Generated complete swagger.yaml with:
  - All endpoints documented
  - Request/response schemas
  - Authorization requirements
  - Parameter descriptions
- **Impact**: Created comprehensive API documentation automatically

#### 9. **Service Layer Logic**
- **Tool**: GitHub Copilot
- **Usage**: Used Copilot to implement business logic in service classes
- **Example**: For SweetService:
  - `getAllSweets()` with pagination and filtering
  - `createSweet()` with duplicate name checking
  - `restockSweet()` with quantity updates
  - `getStatistics()` with MongoDB aggregation
- **Impact**: Reduced time spent on repetitive service implementations

#### 10. **Type Definitions**
- **Tool**: GitHub Copilot
- **Usage**: Asked Copilot to suggest TypeScript interfaces and types
- **Example**: Generated proper types for:
  - API request/response bodies
  - Database documents
  - Express middleware extensions
  - JWT payload
- **Impact**: Ensured type safety throughout the application

### Workflow Impact

**Positive Impacts:**
- ⚡ **Speed**: Copilot reduced development time by ~40% for repetitive patterns
- 🎯 **Consistency**: Suggested patterns ensured consistent code style across modules
- 📚 **Best Practices**: Learned industry best practices through Copilot suggestions
- 🐛 **Quality**: Generated code had fewer initial bugs due to tested patterns
- 📖 **Documentation**: Auto-generated documentation reduced manual writing

**Challenges & Solutions:**
- ⚠️ **Over-reliance**: Initially depended too much on Copilot; learned to review all suggestions
- 🔍 **Verification**: Always tested Copilot-generated code before using
- 🎓 **Understanding**: Took time to understand generated code; used as learning opportunity
- 🔄 **Customization**: Modified generated code to match project-specific requirements

**Best Practices Adopted:**
1. ✅ Always review Copilot suggestions before implementing
2. ✅ Test all auto-generated code thoroughly
3. ✅ Understand the logic behind suggestions
4. ✅ Customize generated patterns to project needs
5. ✅ Use as learning tool, not copy-paste tool
6. ✅ Combine multiple suggestions for optimal solution

### Reflection

Using GitHub Copilot significantly improved development velocity without compromising code quality. The key was treating it as a collaborative tool rather than a solution generator. For repetitive patterns (validation, error handling, testing), Copilot was exceptionally valuable. For complex business logic, I maintained full control while using Copilot for suggestions.

The experience demonstrated that modern AI tools work best when:
- You understand the problem domain
- You review and customize suggestions
- You maintain critical thinking about generated code
- You use it to learn, not just to code faster

## 🚀 Deployment

### Prerequisites for Production

- [ ] MongoDB Atlas cluster set up
- [ ] Environment variables configured
- [ ] JWT_SECRET changed to strong random value
- [ ] NODE_ENV set to 'production'
- [ ] CORS origins configured correctly
- [ ] Rate limiting configured for production load

### Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create Heroku app
heroku create sweet-shop-backend

# Set environment variables
heroku config:set JWT_SECRET=your_production_secret
heroku config:set MONGODB_URI=your_atlas_uri
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Deploy to AWS Lambda

1. Install Serverless Framework
2. Configure AWS credentials
3. Use serverless.yml configuration
4. Deploy: `serverless deploy`

### Deploy to DigitalOcean App Platform

1. Connect GitHub repository
2. Set environment variables
3. Deploy directly from GitHub

## 🔧 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
- **Solution**: Ensure MongoDB service is running
  ```bash
  # macOS
  brew services start mongodb-community
  
  # Linux
  sudo systemctl start mongod
  ```

**2. JWT Token Invalid**
```
Error: JsonWebTokenError: invalid token
```
- **Solution**: Ensure JWT_SECRET matches between server and client
- Check token expiration: `jwt.decode(token)`

**3. CORS Errors**
```
Access-Control-Allow-Origin header is missing
```
- **Solution**: Update CORS_ORIGIN in .env
- Restart server after changing

**4. Database Validation Errors**
```
ValidationError: Sweet validation failed: name: Path `name` is required
```
- **Solution**: Check request payload against schema validation rules
- Refer to Database Schema section

### Debug Mode

Enable verbose logging:

```env
DEBUG=*
NODE_ENV=development
```

Then run: `npm run dev`

## 📞 Support & Contributing

### Getting Help

1. Check API documentation at `/api-docs`
2. Review error messages and logs
3. Check troubleshooting section above
4. Create GitHub issue with detailed error information

### Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 🖼️ Images

Attached images from the repository's images folder:

- ![image.png](images/image.png)
- ![Screenshot 2025-12-14 211746.png](images/Screenshot%202025-12-14%20211746.png)
- ![Screenshot 2025-12-14 211806.png](images/Screenshot%202025-12-14%20211806.png)
- ![Screenshot 2025-12-14 211820.png](images/Screenshot%202025-12-14%20211820.png)
- ![Screenshot 2025-12-14 211834.png](images/Screenshot%202025-12-14%20211834.png)

---

**Made with ❤️ and AI assistance for sweet lovers!** 🍬

For questions or suggestions, please open an issue on GitHub.
