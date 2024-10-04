# Multi-Lingual_File_Manager_Application

## Project Overview
This project aims to demonstrate backend development skills through the creation of a multi-user file manager application using Node.js, Redis, and MySQL. It encompasses key concepts such as user management, file operations, multilingual support, queuing systems, and unit testing.

## Technical Stack
- Backend: Node.js
- Database: MySQL
- Caching/Job Queue: Redis
- Authentication: Passport.js
- Internationalization: i18n
- Logging: Morgan middleware
- API Documentation: Swagger
- Testing: Jest and Supertest

## Setup Instructions
1. Clone the repository: `git clone [repository URL]`
2. Install dependencies: `npm install`
3. Set up the MySQL database
4. Configure Redis: [Refer to redis documentation]
5. Set up environment variables
6. Start the server: `nodemon app.js`

## Key Features
1. User Management:
    - Secure user registration and login.
    - Password storage using secure hashing algorithms (e.g., bcrypt).
    - Authentication facilitated by Passport.js.

2. File Management:
    - Perform CRUD operations on files within a user's designated directory structure.

3. Multilingual Support (i18n):
    - Display user interface elements (labels, messages) in different languages based on user preferences.
    - Utilizeed i18next library for managing multilingual functionalities.

4. Queuing System:
    - Implemented a queue using Redis to handle asynchronous tasks i.e file uploads.

5. Unit Testing:
    - Write unit tests for core functionalities including user registration, file management operations, and the queuing system using Jest and Supertest

6. API Documentation
    - Used Swagger for API documentation.