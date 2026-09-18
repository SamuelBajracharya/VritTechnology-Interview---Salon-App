# SalonFlow — Backend API

RESTful backend API for the **Salon Appointment Booking System**, built with **Python 3.10+**, **Django 5**, and **Django REST Framework (DRF)**.

The backend provides endpoints for managing the salon service catalog, booking customer appointments, enforcing scheduling conflict prevention, and managing strict status workflow state transitions with relational SQLite persistence.

---

## 🛠️ Technology Stack

| Technology | Purpose |
| :--- | :--- |
| **Python 3.10+** | Programming language |
| **Django 5.x** | High-level Python web framework |
| **Django REST Framework** (`^3.14.0`) | Powerful toolkit for building Web APIs |
| **SQLite** | Embedded relational database |
| **django-filter** (`^24.1`) | Declarative query parameter filtering for appointments |
| **django-cors-headers** (`^4.3.1`) | Cross-Origin Resource Sharing for the React frontend |

---

## 🏛️ Database Design & Models

The database maintains two core models with relational integrity:

```
┌─────────────────────────┐          1:N          ┌─────────────────────────┐
│         Service         │ ◄───────────────────  │       Appointment       │
├─────────────────────────┤ (on_delete=PROTECT)   ├─────────────────────────┤
│ id: AutoField (PK)      │                       │ id: AutoField (PK)      │
│ name: CharField(100)    │                       │ customer_name: CharField│
│ price: DecimalField     │                       │ customer_phone: CharFld │
│ duration: PositiveInt   │                       │ service: FK -> Service  │
│ created_at: DateTime    │                       │ appointment_date: Date  │
│ updated_at: DateTime    │                       │ appointment_time: Time  │
└─────────────────────────┘                       │ status: CharField       │
                                                  │ notes: TextField        │
                                                  │ created_at: DateTime    │
                                                  │ updated_at: DateTime    │
                                                  └─────────────────────────┘
```

### 1. `Service` (`services.models.Service`)
- **`name`**: `CharField(max_length=100, unique=True)` — Unique salon service name.
- **`price`**: `DecimalField(max_digits=10, decimal_places=2, min_value=0.01)` — Pricing in NPR (must be greater than zero).
- **`duration`**: `PositiveIntegerField(min_value=1)` — Duration in minutes (must be at least 1 minute).
- **`created_at`** & **`updated_at`**: Auto-managed timestamps.

### 2. `Appointment` (`appointments.models.Appointment`)
- **`customer_name`**: `CharField(max_length=100)` — Customer full name.
- **`customer_phone`**: `CharField(max_length=20)` — Customer contact phone.
- **`service`**: `ForeignKey(Service, on_delete=models.PROTECT)` — References the booked service. Cannot be deleted while referenced.
- **`appointment_date`**: `DateField` — Date of the appointment.
- **`appointment_time`**: `TimeField` — Time slot of the appointment.
- **`status`**: `CharField(choices=StatusChoices, default='Pending')` — Workflow status (`Pending`, `Confirmed`, `Completed`, `Cancelled`).
- **`notes`**: `TextField(blank=True)` — Optional customer notes.

---

## 📋 Business Rules & Validation

1. **Required Fields**:
   - `customer_name`, `customer_phone`, `service`, `appointment_date`, and `appointment_time` must be present and non-empty.
2. **Positive Numeric Values**:
   - Service `price` must be strictly positive (`> 0.00`).
   - Service `duration` must be strictly positive (`>= 1` minute).
3. **Double-Booking Conflict Prevention**:
   - The system prevents two customers from booking the **same service** on the **same date** at the **same time**.
   - If a conflict occurs, the API rejects the request with HTTP `400 Bad Request`:
     ```json
     {"error": "An appointment for this service at the selected date and time already exists."}
     ```
4. **Status Workflow State Machine**:
   - Transitions strictly follow the salon business flow:
     - `Pending` ➔ `Confirmed` or `Cancelled`
     - `Confirmed` ➔ `Completed` or `Cancelled`
     - `Completed` and `Cancelled` are terminal states (no further transitions permitted).
   - Invalid or backward transitions return HTTP `400 Bad Request`.
5. **Protected Deletion**:
   - Deleting a service referenced by existing appointments is blocked with HTTP `400 Bad Request` to preserve historical integrity:
     ```json
     {"error": "Cannot delete this service because it has associated appointments."}
     ```

---

## 📡 REST API Reference

All API routes are prefixed with `/api/`.

### Services Endpoints

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/services/` | List all salon services | `200 OK` |
| `POST` | `/api/services/` | Create a new service | `201 Created` / `400 Bad Request` |
| `GET` | `/api/services/:id/` | Retrieve service details | `200 OK` / `404 Not Found` |
| `PUT` | `/api/services/:id/` | Update an existing service | `200 OK` / `400 Bad Request` |
| `DELETE` | `/api/services/:id/` | Delete a service (protected) | `204 No Content` / `400 Bad Request` |

#### Example Request: Create Service (`POST /api/services/`)
```json
{
  "name": "Haircut",
  "price": "500.00",
  "duration": 30
}
```

---

### Appointments Endpoints

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/appointments/` | List all appointments | `200 OK` |
| `GET` | `/api/appointments/?status=Pending` | Filter appointments by status | `200 OK` |
| `POST` | `/api/appointments/` | Book a new appointment | `201 Created` / `400 Bad Request` |
| `GET` | `/api/appointments/:id/` | Retrieve appointment details | `200 OK` / `404 Not Found` |
| `PATCH` | `/api/appointments/:id/status/` | Update status transition | `200 OK` / `400 Bad Request` |
| `DELETE` | `/api/appointments/:id/` | Delete an appointment | `204 No Content` / `404 Not Found` |

#### Example Request: Book Appointment (`POST /api/appointments/`)
```json
{
  "customer_name": "Ram Sharma",
  "customer_phone": "9841234567",
  "service": 1,
  "appointment_date": "2026-09-18",
  "appointment_time": "10:00:00",
  "notes": "Prefers scissors over machine"
}
```

#### Example Request: Update Status (`PATCH /api/appointments/:id/status/`)
```json
{
  "status": "Confirmed"
}
```

---

## 📁 Project Structure

```
backend/
├── appointments/            # Appointments app
│   ├── migrations/          # Schema migrations
│   ├── models.py            # Appointment model & status choices
│   ├── serializers.py       # Validation & nested service name serialization
│   ├── urls.py              # Router URL registration
│   ├── views.py             # AppointmentViewSet with custom status action
│   └── tests.py             # Unit tests for appointments & business logic
├── services/                # Services catalog app
│   ├── management/
│   │   └── commands/
│   │       └── seed_data.py # Database seeder command
│   ├── migrations/          # Schema migrations
│   ├── models.py            # Service model
│   ├── serializers.py       # Validation logic (price > 0, duration > 0)
│   ├── urls.py              # Router URL registration
│   ├── views.py             # ServiceViewSet with protected deletion handling
│   └── tests.py             # Unit tests for services CRUD & validation
├── salon_backend/           # Django project root
│   ├── settings.py          # CORS, DRF, Apps, & DB configuration
│   ├── urls.py              # Top-level URL routing (/api/)
│   └── wsgi.py
├── db.sqlite3               # SQLite database file
├── manage.py                # Django CLI entrypoint
├── requirements.txt         # Python dependencies
└── README.md                # Backend documentation
```

---

## ⚡ Installation & Setup

### Prerequisites
- Python `3.10` or higher
- `pip` package manager

### 1. Create and Activate Virtual Environment

**On Windows (PowerShell):**
```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

**On Linux / macOS:**
```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run Database Migrations
```bash
python manage.py migrate
```

### 4. Seed Initial Sample Data
Populates default services (`Haircut`, `Hair Coloring`, `Facial`):
```bash
python manage.py seed_data
```

### 5. Start the Development Server
```bash
python manage.py runserver
```
The API server will run at:
```
http://127.0.0.1:8000/api/
```

---

## 🧪 Automated Testing

The backend includes a comprehensive automated test suite covering all functional requirements, edge cases, conflict scenarios, and status transitions.

To run the test suite:
```bash
python manage.py test
```

### Test Coverage Highlights (27 Tests)
- **Services App (`services/tests.py`)**:
  - Valid service creation, retrieval, and updating.
  - Rejection of non-positive price (`<= 0`).
  - Rejection of non-positive duration (`<= 0`).
  - Enforcement of unique service names.
  - Safe deletion and prevention of deleting services linked to active appointments (`ProtectedError`).
- **Appointments App (`appointments/tests.py`)**:
  - Valid appointment creation and required field checks.
  - Conflict detection: blocks same-service, same-date, same-time bookings.
  - Non-conflict cases: allows different time slots, different dates, or different services.
  - Valid status transitions (`Pending` ➔ `Confirmed` ➔ `Completed`, `Pending` ➔ `Cancelled`).
  - Rejection of invalid status transitions (e.g. `Completed` ➔ `Pending`, `Cancelled` ➔ `Confirmed`).
  - Filtering by status query parameter (`?status=Pending`).
  - Appointment deletion.