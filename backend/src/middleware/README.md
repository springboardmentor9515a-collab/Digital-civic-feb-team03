# Authentication Middleware

## Overview
This directory contains authentication and authorization middleware for the Digital Civic platform.

## Files

### 1. authMiddleware.js
Main authentication middleware that:
- Extracts JWT token from cookies or Authorization header
- Verifies token using jsonwebtoken
- Attaches user object to request (req.user)
- Handles invalid/expired tokens

**Usage:**
```javascript
const auth = require("../middleware/authMiddleware");

router.get("/protected-route", auth, controller);
```

### 2. roleMiddleware.js
Role-based access control middleware with functions:
- `isCitizen`: Restricts access to users with "citizen" role
- `isOfficial`: Restricts access to users with "official" role

**Usage:**
```javascript
const { isCitizen, isOfficial } = require("../middleware/roleMiddleware");

// Official-only route
router.get("/official-dashboard", auth, isOfficial, controller);

// Citizen-only route
router.get("/citizen-dashboard", auth, isCitizen, controller);
```

## API Endpoints

### GET /api/auth/me
Retrieves current user information (excluding password).

**Headers:**
- `Authorization: Bearer <token>` OR
- Cookie: `token=<token>`

**Response:**
```json
{
  "message": "User retrieved successfully",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "citizen|official",
    "location": "City Name",
    "isVerified": false,
    "governmentId": null,
    "verificationDocument": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Error Handling

### 401 Unauthorized
- No token provided
- Invalid token
- Token expired
- User not found

### 403 Forbidden
- User doesn't have required role

## Implementation Notes

1. **Token Extraction**: Middleware checks both cookies and Authorization header
2. **Password Security**: Password field is always excluded from responses
3. **Role Validation**: Role middleware validates user role after authentication
4. **Error Messages**: Clear, specific error messages for different failure scenarios
