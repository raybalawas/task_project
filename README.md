#  Role-Based Post Management System (Backend API)

This is a backend API built with **Node.js**, **Express.js**, and **MongoDB** that supports user registration, admin approval, authentication, role-based access, post/comment management, and more.

---

##  Features

### 1. User Registration & Authentication

- Users can register via `/api/users/register`
- Only one `admin` account can be created. All other registrations default to the `user` role.
- Registered users remain **inactive** until verified by the Admin.
- Admin can verify/update user status via `/api/users/user-update/:id`
- Only **active users** can log in via `/api/users/user-login` using email and password.
- Authenticated users receive a **JWT token** for accessing protected routes.

---

### 2. Role-Based Access Control

####  Admin Capabilities
- View, verify, and manage user accounts.
- View, edit, and delete any post.
- Comment on any post.
- Manage all comments.

####  User Capabilities
- Register and login after admin approval.
- Create, edit, and delete their own posts.
- View all posts.
- Comment on any post.
- Edit/delete only their own comments.

---

### 3. Post Management

- Users can create/edit/delete their **own posts**.
- Admins can manage **all posts**.
- All verified users can view **all posts**.

---

### 4. Commenting System

- Users can comment on any post.
- Users can edit/delete their own comments.
- Admins can manage all comments.

---

## Technology Stack

- **Node.js + Express.js**
- **MongoDB + Mongoose**
- **JWT** for authentication
- **Middleware-based Role Access**
- **Validation** with Express middleware

