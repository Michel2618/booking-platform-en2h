#  Booking Platform - EN2H Backend Assessment

## Project Overview
This project is a fully working backend web server for a service booking platform. It handles secure user authentication, service management and appointment scheduling using RESTFul backend APIs.

#### Key Technical Features:
* **Core Architecture**: Designed using NestJS for modular scalability and Prisma ORM for type-safe database queries.
* **Database**: Backed by a relational PostgreSQL database structure.
* **Smart Business Logic**: Features custom validation to handle date/time checks, prevent double-bookings and track real-time slot availability.
* **Data Integrity**: Uses soft-deletion to keep booking history without permanently deleting customer records.

## Installation Steps
To get this project running on your local machine, follow these steps:

1. Clone the repository -

```bash
  git clone https://github.com/Michel2618/booking-platform-en2h.git
```
2. Navigate to the project directory - 

```bash
  cd booking-platform-en2h
```
3. Install the required dependencies -

```bash
  npm install
```
4. Generate the database client schema -

```bash
  npx prisma generate
```

## Environment Variables
This application requires secure environment variables to connect to the database and sign authentication tokens. 

Create a `.env` file in the root directory of the project (you can use the provided `.env.example` file as a template) and add the following lines:

```env
# Replace with your actual PostgreSQL connection string
DATABASE_URL="postgresql://username:password@hostname:5432/dbname?schema=public"

# Replace with a secure random string for JSON Web Tokens
JWT_SECRET="your_super_secret_jwt_key_here"
```

## Database Setup
This project uses a **PostgreSQL** database and integrates **Prisma ORM** for database management. The connection logic is optimized using the `@prisma/adapter-pg` and standard connection pooling, making it fully compatible with modern serverless database providers like Neon.

To set up your database connection:
1. Create a PostgreSQL database instance (either locally or via a cloud provider like Neon).
2. Obtain your standard database connection string URI.
3. Paste the connection string into your `.env` file under the `DATABASE_URL` variable.

*Note: The required database tables and relationships are already mapped out in the `prisma/schema.prisma` file.*

## Running Migrations

To synchronize your database with the Prisma schema and create all the necessary tables, run the following command in your terminal:

```bash
  npx prisma db push
```
## Running the Application

To start the NestJS backend server in development mode, run:

```Bash
  npm run start:dev
```

## API Documentation
This API is fully documented and interactive using **Swagger UI**. 
Once the local server is running, you can access the documentation, view data schemas and test endpoints by navigating to:

* **http://localhost:3000/api**

*Note: To test protected endpoints (like creating or updating services), first execute the `POST /auth/login` endpoint to receive a JWT access token. Click the "Authorize" padlock icon at the top of the Swagger page and paste the token string to authenticate your session.*

## Assumptions Made

* **Canceling Bookings:** I assumed we shouldn't completely erase a booking from the database when it gets deleted. Instead, the system just changes its status to `CANCELLED` to keep a history of it. My code then safely frees up that time slot so another customer can book it.
* **Security & Access:** I assumed that creating, updating, or deleting services is something only staff should do, so those actions require a user to be logged in with a token. However, creating a booking is for regular customers, so that route is public and works without needing an account.
* **Dates and Times:** I assumed the frontend will send dates as simple text strings (like "2026-08-15"). The backend takes care of converting that text into a real date object before saving it to the database, which makes it easier to check for things like past dates.
  

## Future Improvements

* **Simple User Roles:** Add basic "Admin" and "Customer" account types. This way, only admins have permission to add or edit services, while regular customers can only view their own booking history.
* **Pagination and Filters:** Add page numbers and date filters to the bookings list. Right now it loads everything at once, so adding this will keep the app fast as the database gets bigger.
* **Email Notifications:** Connect a basic email service to automatically send a message to the customer when their booking status changes to 'Confirmed' or 'Cancelled'.

