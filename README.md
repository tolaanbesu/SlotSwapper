## Slot Swapper
## Overview

Slot Swapper is a web application designed to allow users to swap scheduled time slots efficiently. Users can view available slots, send swap requests, respond to incoming requests, and manage their slots’ status.

## The application uses:

Frontend: React + tailwind

Backend: Node.js + Express

Database: Prisma + PostgreSQL

Key design choices:

Role-specific actions: Only the slot owner can create a swap request; only the receiver can accept or reject a request; senders can cancel pending requests.

Real-time status updates: Slot status updates automatically when swaps are accepted, rejected, or canceled.

API-first design: Clear RESTful endpoints for easy integration or future extension.

## Setup and Installation
## Prerequisites

Node.js v18+

npm or yarn

PostgreSQL (or any Prisma-supported database)

Optional: Postman for testing API endpoints

Backend

Clone the repository:

git clone https://github.com/tolaanbesu/SlotSwapper.git
cd slotswapper/server


Install dependencies:

npm install


## Set up environment variables:
Create a .env file in the server folder with:

DATABASE_URL="your_database_url"
JWT_SECRET="your_jwt_secret"
PORT=5000


## Run database migrations:

npx prisma migrate dev --name init


##Start the backend server:

npm run dev


Server will run at: http://localhost:5000.

## Frontend

Navigate to the frontend:

cd ../client


## Install dependencies:

npm install


## Start the React app:

npm start


Frontend will open at: http://localhost:3000.

### API Endpoints
## Auth Routes (/api/auth)
Method	Endpoint	Request Body	Description
POST	/signup	{ name, email, password }	Create a new user account. Returns JWT and user info.
POST	/login	{ email, password }	Login and receive JWT and user info.

## Event Routes (/api/events)

All routes require authentication (authMiddleware).

Method	Endpoint	      Request Body	                       Description
GET	     /	                     None	                               Get all events for the authenticated user.
GET	    /:id	                 None	                                Get a specific event by ID.
POST	/	       Event data { title, startTime, ... }	         Create a new event.
PUT	     /:id	           Event data	                                      Update an existing event.
DELETE	  /:id	         None	                                       Delete an event (note: may affect swap requests).

## Swap Routes (/api)

All routes require authentication (authMiddleware).

Method	Endpoint	           Request Body	                  Description
GET	    /swappable-slots	      None	                      Get slots available to swap (not owned, SWAPPABLE).
POST	/swap-request	  { mySlotId, theirSlotId }	   Create a swap request. Sets both slots to SWAP_PENDING.
POST	/swap-response/:id	{ accept: boolean }	        Respond to a swap request. Only receiver can respond.
POST	/swap-cancel/:id	      None	                    Cancel a sent swap request. Only sender can cancel.
GET	/requests	None	                                   Fetch all incoming and outgoing swap requests for the authenticated user.

Authorization:
All authenticated endpoints require:

Authorization: Bearer <JWT_TOKEN>

## Assumptions

Users can only swap their own slots with someone else’s slot.

Only pending requests can be canceled, accepted, or rejected.

A slot’s status can be one of: SWAPPABLE, SWAP_PENDING, or BUSY.

Requests and slot updates are handled through database transactions for consistency.

## Challenges

Handling foreign key constraints while deleting events.

Ensuring proper authorization for sender/receiver actions.

Keeping frontend state synchronized after swap actions.

Designing clear RESTful API endpoints for role-based actions.

## Future Improvements

Add notifications for incoming swap requests.

Implement real-time updates with WebSockets.

Enhance UI with drag-and-drop slot selection.

Include user profile and slot history features.