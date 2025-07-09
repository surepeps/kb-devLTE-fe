# Forgot Password Backend Implementation Guide

## Overview

This document provides the backend implementation requirements for the complete forgot password flow. The frontend is fully implemented and needs these backend endpoints to function properly.

## Current Frontend Implementation Status

✅ **Request Password Reset**: Fully implemented with email validation
✅ **Email Verification Page**: Shows confirmation with resend functionality  
✅ **Password Reset Form**: Complete with password validation and confirmation
✅ **Error Handling**: Comprehensive error handling throughout the flow
✅ **Navigation Logic**: Proper routing between forgot password steps

## Required Backend Endpoints

### 1. Request Password Reset

**Endpoint**: `POST /user/request-password-reset`
**Current Frontend Call**: `URLS.BASE + URLS.user + URLS.requestPasswordReset`

**Payload**:

```json
{
  "email": "user@example.com"
}
```

**Expected Response**:

```json
{
  "success": true,
  "message": "Password reset link sent to your email"
}
```

**Error Response**:

```json
{
  "success": false,
  "error": "Email not found" | "Invalid email format" | "Too many requests"
}
```

### 2. Reset Password

**Endpoint**: `POST /user/reset-password`
**Current Frontend Call**: `URLS.BASE + URLS.user + URLS.resetPassword`

**Payload**:

```json
{
  "token": "reset_token_from_email",
  "password": "new_password_here"
}
```

**Expected Response**:

```json
{
  "success": true,
  "message": "Password reset successful"
}
```

**Error Response**:

```json
{
  "success": false,
  "error": "Invalid or expired token" | "Password too weak" | "Token already used"
}
```

## Backend Implementation Requirements

### 1. Request Password Reset Endpoint

```javascript
// Pseudocode for /user/request-password-reset
async function requestPasswordReset(email) {
  // 1. Validate email format
  if (!isValidEmail(email)) {
    return { success: false, error: "Invalid email format" };
  }

  // 2. Check if user exists
  const user = await User.findOne({ email });
  if (!user) {
    return { success: false, error: "Email not found" };
  }

  // 3. Rate limiting (prevent spam)
  const recentResets = await PasswordReset.countDocuments({
    email,
    createdAt: { $gte: new Date(Date.now() - 15 * 60 * 1000) }, // 15 minutes
  });

  if (recentResets >= 3) {
    return {
      success: false,
      error: "Too many requests. Please try again later.",
    };
  }

  // 4. Generate secure token
  const token = crypto.randomBytes(64).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  // 5. Store reset token
  await PasswordReset.create({
    userId: user._id,
    email: user.email,
    token,
    expiresAt,
    used: false,
  });

  // 6. Send email
  const resetUrl = `${process.env.FRONTEND_URL}/auth/forgot-password/reset?token=${token}`;
  await sendPasswordResetEmail(user.email, user.firstName, resetUrl);

  return { success: true, message: "Password reset link sent to your email" };
}
```

### 2. Reset Password Endpoint

```javascript
// Pseudocode for /user/reset-password
async function resetPassword(token, newPassword) {
  // 1. Validate password strength
  if (!isPasswordStrong(newPassword)) {
    return { success: false, error: "Password does not meet requirements" };
  }

  // 2. Find and validate token
  const resetRequest = await PasswordReset.findOne({
    token,
    used: false,
    expiresAt: { $gt: new Date() },
  });

  if (!resetRequest) {
    return { success: false, error: "Invalid or expired token" };
  }

  // 3. Update user password
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await User.findByIdAndUpdate(resetRequest.userId, {
    password: hashedPassword,
  });

  // 4. Mark token as used
  await PasswordReset.findByIdAndUpdate(resetRequest._id, {
    used: true,
    usedAt: new Date(),
  });

  // 5. Optional: Invalidate all sessions for security
  await Session.deleteMany({ userId: resetRequest.userId });

  return { success: true, message: "Password reset successful" };
}
```

### 3. Database Schema

```sql
-- Password Reset Tokens Table
CREATE TABLE password_resets (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  email VARCHAR(255) NOT NULL,
  token VARCHAR(128) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id),
  INDEX idx_token (token),
  INDEX idx_email_created (email, created_at),
  INDEX idx_expires (expires_at)
);
```

### 4. Email Template

Create an HTML email template for password reset:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Reset Your Khabi-Teq Password</title>
  </head>
  <body>
    <div
      style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;"
    >
      <h2>Reset Your Password</h2>
      <p>Hi {{firstName}},</p>
      <p>You requested to reset your password for your Khabi-Teq account.</p>
      <p>Click the button below to reset your password:</p>

      <div style="text-align: center; margin: 30px 0;">
        <a
          href="{{resetUrl}}"
          style="background-color: #8DDB90; color: white; padding: 12px 24px; 
                text-decoration: none; border-radius: 4px; font-weight: bold;"
        >
          Reset Password
        </a>
      </div>

      <p>Or copy and paste this link in your browser:</p>
      <p style="word-break: break-all; color: #0066cc;">{{resetUrl}}</p>

      <p><strong>This link will expire in 1 hour.</strong></p>

      <p>
        If you didn't request this password reset, you can safely ignore this
        email.
      </p>

      <hr style="margin: 30px 0;" />
      <p style="color: #666; font-size: 12px;">
        Khabi-Teq Realty<br />
        This is an automated email, please do not reply.
      </p>
    </div>
  </body>
</html>
```

### 5. Security Requirements

- **Token Security**: Use cryptographically secure random tokens (64+ bytes)
- **Token Expiration**: Tokens should expire within 1 hour
- **Rate Limiting**: Limit reset requests (3 per 15 minutes per email)
- **One-Time Use**: Tokens should be invalidated after successful use
- **Password Validation**: Enforce strong password requirements
- **Session Invalidation**: Optional but recommended for security

### 6. Password Requirements (Frontend Implemented)

The frontend already validates:

- Minimum 8 characters
- At least one lowercase letter
- At least two special characters
- Passwords must match

### 7. Error Handling

- Invalid tokens: Clear error message with link to request new reset
- Expired tokens: Suggest requesting a new password reset
- Used tokens: Prevent reuse with clear error message
- Rate limiting: Inform user when they can try again

## Environment Variables Required

```env
FRONTEND_URL=https://your-frontend-domain.com
EMAIL_SERVICE_API_KEY=your_email_service_key
EMAIL_FROM_ADDRESS=noreply@khabiteq.com
```

## Testing Checklist

1. ✅ Request password reset with valid email
2. ✅ Request password reset with invalid email
3. ✅ Rate limiting (multiple requests)
4. ✅ Email delivery with correct reset link
5. ✅ Reset password with valid token
6. ✅ Reset password with expired token
7. ✅ Reset password with used token
8. ✅ Password validation on reset
9. ✅ Login with new password after reset

## Integration Notes

The frontend is production-ready and includes:

- Email storage in localStorage for the verification step
- Automatic navigation between steps
- Comprehensive error handling
- Loading states and user feedback
- Responsive design

Once these backend endpoints are implemented according to this specification, the forgot password flow will work seamlessly with the existing frontend implementation.
