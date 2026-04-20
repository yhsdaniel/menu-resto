# RestoMenu

RestoMenu is a digital restaurant menu project built around QR codes for each table. Customers can open a table-specific menu, add items to a cart, continue to checkout, and interact with an AI-powered chat assistant. On the admin side, the project also includes a simple panel for viewing table QR codes and managing menu items.

The repository is split into two apps:

- `client-side`: customer and admin web interface
- `backend-side`: Express API for Midtrans token generation and AI chat

## What This Project Does

The current implementation includes:

- QR-based table menu routes such as `/table/1`
- Category filtering, search, and popular menu sections
- Cart management with quantity updates and item notes
- Midtrans Snap token generation for checkout
- Payment and success flow for customers
- Admin page for viewing generated table QR codes
- Admin menu CRUD UI using local React state
- AI restaurant assistant backed by Ollama

## Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS
- shadcn/ui + Radix UI
- TanStack Query
- Framer Motion
- Vitest + Testing Library
- Playwright

### Backend

- Node.js
- Express 5
- TypeScript
- Midtrans Snap
- Ollama
- `dotenv`
- `cors`

## Project Structure

```text
menu-resto/
|-- client-side/     # Vite + React frontend
`-- backend-side/    # Express backend API
```

## Getting Started

### 1. Install dependencies

Install packages in both apps:

```bash
cd client-side
npm install
```

```bash
cd backend-side
npm install
```

### 2. Configure environment variables

Create a `.env` file inside `backend-side`:

```env
PORT=3000
MIDTRANS_CLIENT_KEY=your_midtrans_client_key
MIDTRANS_SERVER_KEY=your_midtrans_server_key
OLLAMA_URL=http://localhost:11434
```

Create a `.env` file inside `client-side`:

```env
VITE_SERVER_URL=http://localhost:3000
VITE_MIDTRANS_CLIENT_KEY=your_midtrans_client_key
VITE_PUBLIC_URL=http://localhost:8080
```

### 3. Start the backend

```bash
cd backend-side
npm run dev
```

The backend runs on `http://localhost:3000` by default.

### 4. Start the frontend

```bash
cd client-side
npm run dev
```

The frontend runs on `http://localhost:8080`.

## Available Scripts

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run test
```

### Backend

```bash
npm run dev
npm start
```

## Main Routes

### Customer

- `/` - landing page
- `/table/:tableId` - table-specific menu
- `/table/:tableId/cart` - cart
- `/table/:tableId/payment` - payment page
- `/table/:tableId/success` - payment success page

### Admin

- `/admin` - QR code and menu management

## API Endpoints

- `POST /api/token` - generate Midtrans Snap transaction token
- `POST /api/ai-chat` - send a question to the restaurant AI assistant

## Notes

- The menu and table data are currently hardcoded in `client-side/src/data/menuData.ts`.
- Admin menu changes are stored only in frontend state and are not persisted to a database.
- The AI assistant uses a local Ollama instance and the `llama3.2` model in the current backend implementation.
- Midtrans is configured in sandbox mode in the backend.

## Testing

Frontend tests are available with Vitest:

```bash
cd client-side
npm run test
```
