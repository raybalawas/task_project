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

## Curl of api endpoints from postman 

{
	"info": {
		"_postman_id": "6875689a-9bea-4503-b408-b0017c7da3ff",
		"name": "Task Project",
		"schema": "https://schema.getpostman.com/json/collection/v2.0.0/collection.json",
		"_exporter_id": "40566482"
	},
	"item": [
		{
			"name": "User Register",
			"request": {
				"method": "POST",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\r\n    \"name\":\"Test INactive User\",\r\n    \"email\":\"userInactive@gmail.com\",\r\n    \"password\":\"123456789\",\r\n    \"role\":\"user\"\r\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": "http://localhost:3000/api/users/register"
			},
			"response": []
		},
		{
			"name": "Admin Login",
			"request": {
				"method": "POST",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\r\n    \"email\":\"admin@gmail.com\",\r\n    \"password\":\"12345678\"\r\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": "http://localhost:3000/api/users/login"
			},
			"response": []
		},
		{
			"name": "all user access by admin",
			"request": {
				"auth": {
					"type": "bearer",
					"bearer": {
						"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODZmNTQwODgzZGEwZDhiNWNiNDc3YjAiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTI3MjE3MTd9.YqzwxEGesuQ1GxwjcgbYTpFRmtrydgZFNdFoca7pX1E"
					}
				},
				"method": "GET",
				"header": [],
				"url": "http://localhost:3000/api/users/all-user"
			},
			"response": []
		},
		{
			"name": "User Login",
			"request": {
				"method": "POST",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\r\n    \"email\":\"userInactive@gmail.com\",\r\n    \"password\":\"123456789\"\r\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": "http://localhost:3000/api/users/user-login"
			},
			"response": []
		},
		{
			"name": "user create post",
			"request": {
				"auth": {
					"type": "bearer",
					"bearer": {
						"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODc4NzVmMmM3ZTg3Njg3Y2I1YmI3ZDkiLCJyb2xlIjoidXNlciIsImlhdCI6MTc1MjcyNTE4Mn0.l3_k7ek1I7VMx4YoxwWMyzPgoU8Q6TzChiYQX9m_ers"
					}
				},
				"method": "POST",
				"header": [
					{
						"key": "Content-Type",
						"value": "application/json",
						"type": "text"
					}
				],
				"body": {
					"mode": "raw",
					"raw": "{\r\n  \"title\": \"post 2\",\r\n  \"content\": \"this is my second post! created by nishu\"\r\n}\r\n"
				},
				"url": "http://localhost:3000/api/users/user-create-post"
			},
			"response": []
		},
		{
			"name": "user all post",
			"request": {
				"auth": {
					"type": "bearer",
					"bearer": {
						"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODc4NzVmMmM3ZTg3Njg3Y2I1YmI3ZDkiLCJyb2xlIjoidXNlciIsImlhdCI6MTc1MjcyNTE4Mn0.l3_k7ek1I7VMx4YoxwWMyzPgoU8Q6TzChiYQX9m_ers"
					}
				},
				"method": "GET",
				"header": [],
				"url": "http://localhost:3000/api/users/all-post-user"
			},
			"response": []
		},
		{
			"name": "user update post",
			"request": {
				"auth": {
					"type": "bearer",
					"bearer": {
						"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODc4Njg5MjZiNmRmZDlkNWM4OTU2ZDkiLCJyb2xlIjoidXNlciIsImlhdCI6MTc1MjcyMTgxOX0.znGxvpXfsUNo2xZr9JxB1UolIXXKXJlaLCaXfZZmEWE"
					}
				},
				"method": "POST",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\r\n    \"content\": \"Chnaged my post title from some content herre\"\r\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": "http://localhost:3000/api/users/user-post-update/68786b3d5133d43863fc7287"
			},
			"response": []
		},
		{
			"name": "user delete post",
			"request": {
				"auth": {
					"type": "bearer",
					"bearer": {
						"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODc4Njg5MjZiNmRmZDlkNWM4OTU2ZDkiLCJyb2xlIjoidXNlciIsImlhdCI6MTc1MjcyMTgxOX0.znGxvpXfsUNo2xZr9JxB1UolIXXKXJlaLCaXfZZmEWE"
					}
				},
				"method": "POST",
				"header": [],
				"url": "http://localhost:3000/api/users/user-post-delete/68786b97b3f1a00d6ce5eff2"
			},
			"response": []
		},
		{
			"name": "update user by admin",
			"request": {
				"auth": {
					"type": "bearer",
					"bearer": {
						"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODZmNTQwODgzZGEwZDhiNWNiNDc3YjAiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTI3MjE3MTd9.YqzwxEGesuQ1GxwjcgbYTpFRmtrydgZFNdFoca7pX1E"
					}
				},
				"method": "PUT",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\r\n    \"name\":\"NishuRahul\", \r\n    \"status\":\"1\"\r\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": "http://localhost:3000/api/users/user-update/68789def01e9cab70ed0ae53"
			},
			"response": []
		},
		{
			"name": "user delete by admin",
			"request": {
				"auth": {
					"type": "bearer",
					"bearer": {
						"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODZmNTQwODgzZGEwZDhiNWNiNDc3YjAiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTI3MjE3MTd9.YqzwxEGesuQ1GxwjcgbYTpFRmtrydgZFNdFoca7pX1E"
					}
				},
				"method": "DELETE",
				"header": [],
				"url": "http://localhost:3000/api/users/user-delete/687868926b6dfd9d5c8956d9"
			},
			"response": []
		},
		{
			"name": "All posts for Admin",
			"request": {
				"auth": {
					"type": "bearer",
					"bearer": {
						"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODZmNTQwODgzZGEwZDhiNWNiNDc3YjAiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTI3MjE3MTd9.YqzwxEGesuQ1GxwjcgbYTpFRmtrydgZFNdFoca7pX1E"
					}
				},
				"method": "GET",
				"header": [],
				"url": "http://localhost:3000/api/users/all-posts"
			},
			"response": []
		},
		{
			"name": "Post Update by admin",
			"request": {
				"auth": {
					"type": "bearer",
					"bearer": {
						"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODZmNTQwODgzZGEwZDhiNWNiNDc3YjAiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTI3MjE3MTd9.YqzwxEGesuQ1GxwjcgbYTpFRmtrydgZFNdFoca7pX1E"
					}
				},
				"method": "POST",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\r\n    \"content\":\"this is my first post by nishu and updated by admin\"\r\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": "http://localhost:3000/api/users/admin-update-post/6878796678ad598fd7af525b"
			},
			"response": []
		},
		{
			"name": "post delete by admin",
			"request": {
				"auth": {
					"type": "bearer",
					"bearer": {
						"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODZmNTQwODgzZGEwZDhiNWNiNDc3YjAiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTI3MjE3MTd9.YqzwxEGesuQ1GxwjcgbYTpFRmtrydgZFNdFoca7pX1E"
					}
				},
				"method": "POST",
				"header": [],
				"url": "http://localhost:3000/api/users/admin-delete-post/687875c8c7e87687cb5bb7ce"
			},
			"response": []
		},
		{
			"name": "Admin Comment Post",
			"request": {
				"auth": {
					"type": "bearer",
					"bearer": {
						"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODZmNTQwODgzZGEwZDhiNWNiNDc3YjAiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTI3MjE3MTd9.YqzwxEGesuQ1GxwjcgbYTpFRmtrydgZFNdFoca7pX1E"
					}
				},
				"method": "PUT",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\r\n    \"comment\":\"Admin can comment here! on post 2 \"\r\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": "http://localhost:3000/api/users/admin-comment-post/687875cfc7e87687cb5bb7d1"
			},
			"response": []
		},
		{
			"name": "User Comment Post",
			"request": {
				"auth": {
					"type": "bearer",
					"bearer": {
						"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODc4NzVmMmM3ZTg3Njg3Y2I1YmI3ZDkiLCJyb2xlIjoidXNlciIsImlhdCI6MTc1MjcyNzY4M30.CdJRF9bw34k4hMPe4TnUIAn5gy4C-FvYYP16zTsqdyI"
					}
				},
				"method": "PUT",
				"header": [
					{
						"key": "content-type",
						"value": "application/json",
						"type": "text"
					}
				],
				"body": {
					"mode": "raw",
					"raw": "{\r\n    \"comment\":\"user can comment here! for ankita's post 2\"\r\n}"
				},
				"url": "http://localhost:3000/api/users/user-comment-post/687875cfc7e87687cb5bb7d1"
			},
			"response": []
		},
		{
			"name": "User Delete Comment",
			"request": {
				"auth": {
					"type": "bearer",
					"bearer": {
						"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODc4NzVmMmM3ZTg3Njg3Y2I1YmI3ZDkiLCJyb2xlIjoidXNlciIsImlhdCI6MTc1MjcyNzY4M30.CdJRF9bw34k4hMPe4TnUIAn5gy4C-FvYYP16zTsqdyI"
					}
				},
				"method": "DELETE",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\r\n    \"postId\":\"687875cfc7e87687cb5bb7d1\"\r\n\r\n}"
				},
				"url": "http://localhost:3000/api/users/user-delete-comment/687875cfc7e87687cb5bb7d1/6878991859945d4fe4a7fd6d"
			},
			"response": []
		},
		{
			"name": "Admin Delete comment",
			"request": {
				"auth": {
					"type": "bearer",
					"bearer": {
						"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODc4OTMxMmZjNmI3MWI1MTkxNGYzOGYiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NTI3MzI0NDd9.L7GMCx97xkqqFGk2CSFxj_j3LLuiznQ0XfzA7aEAx8k"
					}
				},
				"method": "DELETE",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": ""
				},
				"url": "http://localhost:3000/api/users/admin-delete-comment/687875cfc7e87687cb5bb7d1/6878991859945d4fe4a7fd6d"
			},
			"response": []
		},
		{
			"name": "User Update Own Comment",
			"request": {
				"auth": {
					"type": "bearer",
					"bearer": {
						"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODc4NzVmMmM3ZTg3Njg3Y2I1YmI3ZDkiLCJyb2xlIjoidXNlciIsImlhdCI6MTc1MjcyNzY4M30.CdJRF9bw34k4hMPe4TnUIAn5gy4C-FvYYP16zTsqdyI"
					}
				},
				"method": "PUT",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\r\n    \"comment\":\"user can Update their own comment here! for ankita's psssssssssssssss 2\"\r\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": "http://localhost:3000/api/users/user-update-comment/687875cfc7e87687cb5bb7d1/6878bef847982ef4e9516599"
			},
			"response": []
		}
	]
}
