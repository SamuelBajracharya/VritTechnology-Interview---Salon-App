# SalonFlow — Frontend

A modern, responsive Appointment Booking and Salon Service Management web application built with **React 19**, **Vite**, and **Tailwind CSS**. Designed for salon staff to manage service catalogs, book client appointments, track status workflows, and prevent scheduling conflicts.

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** (`^19.2.8`) | Core UI library & declarative component architecture |
| **Vite 8** (`^8.3.0`) | Lightning-fast build tool & local development server |
| **Tailwind CSS 4** (`^4.3.3`) | Modern utility-first styling system |
| **Zustand 5** (`^5.0.15`) | Minimal, performant state management (Modals, Toasts, Confirmations, Navigation) |
| **Axios** (`^1.20.0`) | Promise-based HTTP client for Django REST backend communication |
| **React Router DOM 7** (`^7.18.4`) | Client-side routing with clean URL navigation |
| **React Icons 5** (`^5.7.0`) | Clean icon set (Ionicons `io5`, `pi`) |

---

## 🚀 Key Features

### 1. Services Management (`/services`)
- **Service Catalog**: View all services with name, price (in NPR), and duration (in minutes).
- **Add Service**: Modal form with real-time validation (Price > 0, Duration > 0 minutes).
- **Edit Service**: Prefills existing data and updates catalog via `PUT /api/services/:id/`.
- **Delete Service**: Protected delete with confirmation modal and backend foreign key protection.

### 2. Appointment Booking (`/appointments`)
- **Booking Modal**: Create appointments with:
  - Customer Name & Phone Number (required)
  - Salon Service selection (dropdown from active services)
  - Appointment Date & Time picker
  - Optional Notes (customer preferences, hair types, allergies)
- **Conflict Handling**: Displays user-friendly error banners if a double-booking conflict occurs (same service, date, and time).

### 3. Appointment Listing & Status Workflow
- **Table View**: Clean, structured tabular display showing ID, Customer, Service, Date & Time, Status badge, Notes, and Actions.
- **Workflow State Transitions**:
  - `Pending` ➔ `Confirmed` or `Cancelled`
  - `Confirmed` ➔ `Completed` or `Cancelled`
- **Color-Coded Status Badges**:
  - 🟡 **Pending**: Amber badge
  - 🔵 **Confirmed**: Blue badge
  - 🟢 **Completed**: Emerald badge
  - 🔴 **Cancelled**: Rose badge
- **Search by Customer Name**: Instant client-side search filtering appointments by name.
- **Status Filter**: Filter list by `All`, `Pending`, `Confirmed`, `Completed`, or `Cancelled`.
- **Delete Appointment**: Remove appointment records with a confirmation prompt.

### 4. Responsive & Mobile-Optimized Design
- **Tables**: Tables always maintain a native `<table>` presentation across all screen sizes with horizontal scroll containers (`overflow-x-auto`).
- **Mobile Navigation**: Off-canvas drawer sliding in from the left with a blurred backdrop overlay, toggled via a hamburger menu in the header.
- **Modals**: Flexible modal dialogs that fit mobile screens (`p-3.5 sm:p-4`, `max-h-[92vh]`) with stacked inputs on phones and multi-column grids on desktop.

---

## 📁 Project Structure

```
frontend/
├── public/                  # Static assets
├── src/
│   ├── api/                 # Axios API service clients
│   │   ├── appointmentsAPI.js   # Appointment CRUD & status patch endpoints
│   │   ├── servicesAPI.js       # Service catalog CRUD endpoints
│   │   └── client.js            # Axios base instance (http://127.0.0.1:8000/api/)
│   ├── components/          # Reusable UI components
│   │   ├── AppointmentModal.jsx # Booking form modal
│   │   ├── ConfirmDeleteModal.jsx# Delete confirmation dialog
│   │   ├── Layout.jsx           # Main shell (Sidebar + Navbar + Content)
│   │   ├── Navbar.jsx           # Header with page title & mobile toggle
│   │   ├── ServiceModal.jsx     # Add/Edit service form modal
│   │   ├── Sidebar.jsx          # Desktop sidebar & mobile navigation drawer
│   │   └── Toast.jsx            # Dynamic toast notification alerts
│   ├── pages/               # Primary route views
│   │   ├── Appointments.jsx     # Appointments management & status updates
│   │   └── Services.jsx         # Services catalog & pricing
│   ├── store/               # Zustand state stores
│   │   ├── useAppointmentModalStore.js
│   │   ├── useConfirmStore.js
│   │   ├── useServiceModalStore.js
│   │   ├── useSidebarStore.js
│   │   └── useToastStore.js
│   ├── App.jsx              # Application router configuration
│   ├── index.css            # Tailwind CSS root imports
│   └── main.jsx             # React DOM entrypoint
├── index.html               # HTML5 shell
├── package.json             # NPM dependencies & scripts
├── vite.config.js           # Vite build configuration
└── README.md                # Frontend documentation
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js**: `v18.0.0` or later
- **npm**: `v9.0.0` or later
- Running Django backend at `http://127.0.0.1:8000`

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The application will launch at:
```
http://localhost:5173/
```

### 3. Build for Production
To create an optimized production bundle:
```bash
npm run build
```
The output will be generated in the `dist/` directory.

### 4. Preview Production Build
```bash
npm run preview
```

---

## 🔗 Backend API Contract

The frontend connects to the following Django REST Framework endpoints:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/services/` | Fetch all available salon services |
| `POST` | `/api/services/` | Create a new service |
| `PUT` | `/api/services/:id/` | Update an existing service |
| `DELETE` | `/api/services/:id/` | Delete a service |
| `GET` | `/api/appointments/` | List all appointments (supports `?status=Pending`) |
| `POST` | `/api/appointments/` | Book a new appointment (validates time conflicts) |
| `PATCH` | `/api/appointments/:id/status/` | Update workflow status (`Pending` ➔ `Confirmed`, etc.) |
| `DELETE` | `/api/appointments/:id/` | Delete an appointment |

---

## 💡 Key Design Decisions

1. **Zustand for Global UI States**: Modals, delete confirmations, and toasts are triggered globally across pages without prop-drilling or bulky Context wrappers.
2. **Instant Response Flow**: Unnecessary artificial spinners were eliminated in favor of instant local transitions paired with toast notifications.
3. **Table View Across Devices**: The staff management tables preserve their columnar format on mobile with horizontal scroll wrappers, allowing quick scanning and status actions.
