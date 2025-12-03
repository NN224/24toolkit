# 📧 Firebase Email Templates - 24Toolkit

Professional email templates for Firebase Authentication.

---

## 1️⃣ Email Address Verification

**Use for:** When users sign up with email/password

### Settings:
- **Sender name:** `24Toolkit`
- **From:** `noreply`
- **Subject:** `Verify your email for 24Toolkit`

### Message Template:

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; padding: 20px 0;">
    <h1 style="color: #8B5CF6;">24Toolkit</h1>
  </div>
  <div style="background: #f9fafb; padding: 30px; border-radius: 10px;">
    <h2 style="color: #1f2937;">Hi %DISPLAY_NAME%,</h2>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
      Welcome to 24Toolkit! Please verify your email address to get started.
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="%LINK%" style="background: linear-gradient(to right, #8B5CF6, #0EA5E9); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verify Email</a>
    </div>
    <p style="color: #6b7280; font-size: 14px;">
      If you didn't create this account, you can safely ignore this email.
    </p>
  </div>
  <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
    <p>© 2024 24Toolkit. All rights reserved.</p>
    <p>
      <a href="https://24toolkit.com" style="color: #8B5CF6; text-decoration: none;">Visit Website</a> |
      <a href="https://24toolkit.com/privacy-policy" style="color: #8B5CF6; text-decoration: none;">Privacy Policy</a>
    </p>
  </div>
</div>
```

---

## 2️⃣ Password Reset

**Use for:** When users request password reset

### Settings:
- **Sender name:** `24Toolkit`
- **From:** `noreply`
- **Subject:** `Reset your password for 24Toolkit`

### Message Template:

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; padding: 20px 0;">
    <h1 style="color: #8B5CF6;">24Toolkit</h1>
  </div>
  <div style="background: #f9fafb; padding: 30px; border-radius: 10px;">
    <h2 style="color: #1f2937;">Password Reset Request</h2>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
      Hi %DISPLAY_NAME%,
    </p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
      We received a request to reset your password. Click the button below to create a new password:
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="%LINK%" style="background: linear-gradient(to right, #8B5CF6, #0EA5E9); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
    </div>
    <p style="color: #dc2626; font-size: 14px; background: #fef2f2; padding: 15px; border-radius: 5px; border-left: 4px solid #dc2626;">
      ⚠️ This link will expire in 1 hour for security reasons.
    </p>
    <p style="color: #6b7280; font-size: 14px;">
      If you didn't request this, please ignore this email or contact support if you have concerns.
    </p>
  </div>
  <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
    <p>© 2024 24Toolkit. All rights reserved.</p>
    <p>
      <a href="https://24toolkit.com" style="color: #8B5CF6; text-decoration: none;">Visit Website</a> |
      <a href="https://24toolkit.com/contact" style="color: #8B5CF6; text-decoration: none;">Contact Support</a>
    </p>
  </div>
</div>
```

---

## 3️⃣ Email Address Change

**Use for:** When users change their email address

### Settings:
- **Sender name:** `24Toolkit`
- **From:** `noreply`
- **Subject:** `Verify your new email for 24Toolkit`

### Message Template:

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; padding: 20px 0;">
    <h1 style="color: #8B5CF6;">24Toolkit</h1>
  </div>
  <div style="background: #f9fafb; padding: 30px; border-radius: 10px;">
    <h2 style="color: #1f2937;">Email Address Change</h2>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
      Hi %DISPLAY_NAME%,
    </p>
    <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
      You recently changed your email address. Please verify your new email to continue using 24Toolkit:
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="%LINK%" style="background: linear-gradient(to right, #8B5CF6, #0EA5E9); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verify New Email</a>
    </div>
    <p style="color: #6b7280; font-size: 14px;">
      If you didn't make this change, please contact support immediately.
    </p>
  </div>
  <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
    <p>© 2024 24Toolkit. All rights reserved.</p>
    <p>
      <a href="https://24toolkit.com/contact" style="color: #8B5CF6; text-decoration: none;">Contact Support</a>
    </p>
  </div>
</div>
```

---

## 📝 How to Apply Templates

1. Go to [Firebase Console > Authentication > Templates](https://console.firebase.google.com/project/toolkit-34bf6/authentication/emails)
2. Click on each template (Email verification, Password reset, Email change)
3. Copy the HTML from above
4. Paste into the "Message" field
5. Update "Sender name" and "From" fields
6. Update "Subject" field
7. Click "Save"

---

## 🎨 Design Features

- **Modern gradient buttons** (Purple to Sky)
- **Responsive design** (works on mobile)
- **Professional layout** with proper spacing
- **Security warnings** for password reset
- **Footer with links** to website and policies
- **Brand colors** matching 24Toolkit theme

---

## 🔧 Customization

### Colors:
- Primary: `#8B5CF6` (Purple)
- Secondary: `#0EA5E9` (Sky)
- Text: `#1f2937` (Dark gray)
- Muted: `#6b7280` (Light gray)
- Warning: `#dc2626` (Red)

### Variables:
- `%DISPLAY_NAME%` - User's display name
- `%LINK%` - Action link (verify/reset)
- `%APP_NAME%` - App name (24Toolkit)

---

**Last Updated:** 2024-12-03

