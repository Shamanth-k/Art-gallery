# Art Gallery Project

## Project Overview

This project is a full-stack web application for an **Art Gallery**. It allows users to browse exhibitions, purchase tickets, view their tickets, and for admins to manage artists, exhibitions, and ticket sales. The stack includes:

- **Frontend:** Next.js (React), Tailwind CSS, Framer Motion, Lucide Icons
- **Backend:** Node.js (Express), MySQL
- **Authentication:** JWT-based
- **Database:** MySQL

---

## Screenshots

| Home Screen | Exhibition Page | Artist Page |
|---|---|---|
| ![Home Screen](screenshots/home%20screen.png) | ![Exhibition Page](screenshots/exhibition%20page.png) | ![Artist Page](screenshots/artist%20page.png) |

| Add Artist | Add Exhibition | Buy Ticket |
|---|---|---|
| ![Add Artist](screenshots/add%20new%20artist.png) | ![Add Exhibition](screenshots/add%20exhibition.png) | ![Buy Ticket](screenshots/buy%20ticket.png) |

| My Tickets | Login Page | Sign Up Page |
|---|---|---|
| ![My Tickets](screenshots/my%20tickets.png) | ![Login Page](screenshots/login%20page.png) | ![Sign Up Page](screenshots/sign%20up%20page.png) |

---

## Key Features

### User Features
- **Authentication:** Register and login (JWT-based).
- **Browse Exhibitions:** View all current and upcoming exhibitions.
- **Purchase Tickets:** Buy tickets for exhibitions, with payment details stored.
- **My Tickets:** View and download purchased tickets.
- **Profile:** View user profile and ticket purchase history.

### Admin Features
- **Dashboard:** View stats (users, artists, exhibitions, revenue, tickets sold).
- **Manage Artists:** Add, edit, and delete artists.
- **Manage Exhibitions:** Add, edit, and delete exhibitions.
- **View Ticket Sales:** See all ticket sales and payment details.

---

## Frontend Structure

- **app/**: Main Next.js app directory
  - **/admin**: Admin dashboard page
  - **/artists**: Artists listing page
  - **/auth/login, /auth/register**: Authentication pages
  - **/exhibitions**: Exhibitions listing and detail pages
  - **/my-tickets**: User's purchased tickets page
  - **/profile**: User profile page
  - **globals.css**: Global styles (Tailwind)
  - **layout.tsx**: App layout
- **components/**: Reusable UI components (cards, buttons, dialogs, etc.)
- **hooks/**: Custom React hooks (e.g., for toast notifications)
- **lib/**: Utility functions

---

## Backend Structure

- **backend/controllers/**: Express controllers for business logic
  - **artistController.js**: CRUD for artists
  - **authController.js**: Register/login logic
  - **exhibitionController.js**: CRUD for exhibitions
  - **paymentController.js**: Handles ticket purchases and payments
  - **ticketController.js**: Ticket purchase, cancellation, and retrieval
- **backend/models/**: Database models (if used)
- **backend/routes/**: Express route definitions
- **backend/database/db.js**: MySQL connection setup
- **backend/server.js**: Main Express server entry point

---

## Database Schema

- **users**: Stores user info (id, name, email, password, role)
- **artists**: Artist details
- **exhibitions**: Exhibition details (name, dates, location, ticket price, ticket limit, etc.)
- **tickets**: Records each ticket purchase (user, exhibition, quantity, date)
- **payments**: Payment details for each ticket purchase (payment_id, user, exhibition, amount, method, status)
- **Stored Procedures**: For ticket cancellation logic

---

## Ticket Purchase Flow

1. **User selects exhibition and ticket quantity.**
2. **Frontend sends purchase request** with payment details to `/api/payment/buy-ticket`.
3. **Backend:**
   - Checks ticket availability.
   - Updates `exhibitions` (increments `ticket_sold`).
   - Inserts into `tickets` (records purchase).
   - Inserts into `payments` (records payment).
   - Returns success/failure.
4. **User redirected to "My Tickets" page** to view/download tickets.

---

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS, Framer Motion, Lucide Icons
- **Backend:** Node.js, Express
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens)
- **Other:** RESTful API, SQL transactions for ticket purchase

---

## How to Run

1. **Install dependencies** in both the root and backend folders:
   ```bash
   npm install
   cd backend
   npm install
   cd ..
   ```
2. **Set up MySQL database** using the provided SQL scripts in the `scripts/` folder.
3. **Create a `.env` file in the `backend/` directory** with your database and environment configuration (see below for an example).
4. **Start the backend server**:
   ```bash
   cd backend
   npm run dev
   ```
5. **Start the frontend** (in a new terminal, from the root):
   ```bash
   npm run dev
   ```
6. **Access the app** at [http://localhost:3000](http://localhost:3000)

### Example `.env` file for backend
```
DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=art__gallery
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

---

## Customization & Extensibility

- Add more payment methods or integrate real payment gateways.
- Add artist and exhibition images/media.
- Add user roles/permissions.
- Add analytics for admins.
- Improve ticket download (PDF, QR code, etc.).

---

## File Structure

```
artgalleryfinal /
├── app/
│   ├── admin/
│   │   └── page.tsx
│   ├── artists/
│   │   └── page.tsx
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── exhibitions/
│   │   ├── [id]/
│   │   │   └── page.tsx
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── my-tickets/
│   │   └── page.tsx
│   ├── page.tsx
│   └── profile/
│       └── page.tsx
├── backend/
│   ├── controllers/
│   │   ├── artistController.js
│   │   ├── authController.js
│   │   ├── exhibitionController.js
│   │   ├── paymentController.js
│   │   └── ticketController.js
│   ├── database/
│   │   └── db.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── artistModel.js
│   │   └── userModel.js
│   ├── package-lock.json
│   ├── package.json
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── artistRoutes.js
│   │   ├── authRoutes.js
│   │   ├── exhibitionRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── ticketRoutes.js
│   └── server.js
├── components/
│   ├── admin/
│   │   ├── add-artist-dialog.tsx
│   │   └── add-exhibition-dialog.tsx
│   ├── auth-provider.tsx
│   ├── footer.tsx
│   ├── navbar.tsx
│   ├── theme-provider.tsx
│   └── ui/
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── aspect-ratio.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── breadcrumb.tsx
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── carousel.tsx
│       ├── chart.tsx
│       ├── checkbox.tsx
│       ├── collapsible.tsx
│       ├── command.tsx
│       ├── context-menu.tsx
│       ├── dialog.tsx
│       ├── drawer.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── hover-card.tsx
│       ├── input-otp.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── menubar.tsx
│       ├── navigation-menu.tsx
│       ├── pagination.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── radio-group.tsx
│       ├── resizable.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── sonner.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       ├── toast.tsx
│       ├── toaster.tsx
│       ├── toggle-group.tsx
│       ├── toggle.tsx
│       ├── tooltip.tsx
│       ├── use-mobile.tsx
│       └── use-toast.ts
├── components.json
├── frontend/
├── hooks/
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/
│   └── utils.ts
├── next.config.mjs
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── public/
│   ├── placeholder-logo.png
│   ├── placeholder-logo.svg
│   ├── placeholder-user.jpg
│   ├── placeholder.jpg
│   └── placeholder.svg
├── scripts/
│   ├── create-database.sql
│   └── seed-data.sql
├── styles/
│   └── globals.css
├── tailwind.config.ts
├── tsconfig.json
``` 