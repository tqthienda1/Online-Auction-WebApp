# 🏷️ Online Auction Web Application

## 📝 Description

The **Online Auction Web Application** is a full-stack web system that allows users to browse products, participate in online auctions, place bids, and manage auction-related activities.

The system is designed according to the requirements of a university Web Application Development project, with clearly separated roles: **Guest**, **Bidder**, **Seller**, and **Admin**.  
The application follows a **separated frontend–backend architecture** to ensure scalability and maintainability.

## 🚀 Demo

https://bidsmartonline.vercel.app

## 🛠 Tech Stack

### Frontend

![Tech Icons](https://skill-icons-livid.vercel.app/icons?i=react,tailwindcss)

### Backend

![Tech Icons](https://skill-icons-livid.vercel.app/icons?i=nodejs,express,postgresql,supabase)

### Deployment

![Tech Icons](https://skill-icons-livid.vercel.app/icons?i=vercel,render)

## 📷 Screenshots

<div>
    <img src="demo\CategoryPage.png"/>
    <img src="demo\DetailPage.png"/>
    <img src="demo\DetailPage_1.png"/>
    <img src="demo\DetailPage_2.png"/>
    <img src="demo\HomePage.png"/>
    <img src="demo\HomePage_1.png"/>
    <img src="demo\HomePage_2.png"/>

</div>

## ✨ Features

- Role-based access control with separated user roles: Guest, Bidder, Seller, and Admin.

- RESTful API architecture built with Node.js and Express for handling business logic and auction workflows.

- Secure authentication and authorization using Supabase Authentication and JSON Web Tokens (JWT).

- Relational data modeling with PostgreSQL, managed via Supabase.

- **Full Text Search Technique** with PostgreSql and Supabase

- Responsive user interface built with React and styled using Tailwind CSS.

- Client–Server communication via HTTPS using Axios.

- Environment-based configuration for development and production deployments.

- Separated frontend and backend deployment, improving scalability and maintainability.

- **Cron Job** handle schedule actions like mark expired products or automatically create order.

## ⚙️ Getting Started (Local Development)

Follow these steps to set up the project locally on your machine.

### Prerequisites

Make sure you have the following installed or downloaded on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)

### Cloning the Repository

```bash
git clone https://github.com/tqthienda1/Online-Auction-WebApp
cd online-auction-webapp
```

### Config .env
Create .env file in root directory
```xml
# Server port
PORT=3000

# Connect to Supabase via connection pooling
DATABASE_URL=<supabase_url>

# Direct connection to the database. Used for migrations
DIRECT_URL=<supabase_url>

# Your supabase project URL
SUPABASE_URL=<supabase_url>

# Key master of your supabase project
SUPABASE_SERVICE_ROLE_KEY=<key>

# For JWT
ACCESS_TOKEN_SECRET=<access_token_secret>

# .env config
NODE_ENV=development

# sendgrid.com SMTP service
SENDGRID_API_KEY=<send_grid_api_key>

# Depends on your frontend DIRECT_URL
# Example: "http://localhost:5173"
FRONTEND_URL= <frontend_url>
```

### Installation

```bash
# Install dependencies
npm run setup

# Generate Prisma schema and push to Supabase
cd server
npx prisma generate
npx prisma db push
cd ..
```

### Run the project

Create a new terminal

```bash
npm run server
```

Create a new terminal

```bash
npm run client
```

Click on the URL appears on the terminal and try the project by yourself!
