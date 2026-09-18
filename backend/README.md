# Salon Appointment Booking System — Backend

RESTful backend API for the Salon Appointment Booking System, built with
Python, Django, and Django REST Framework (DRF).

The backend provides APIs for managing salon services, creating and managing
appointments, validating booking conflicts, and updating appointment statuses.

---

## 1. Overview

The backend is responsible for:

- Managing salon services
- Creating and managing appointments
- Validating appointment data
- Preventing duplicate bookings for the same service, date, and time
- Managing appointment status transitions
- Persisting data using SQLite
- Providing REST APIs for the frontend application
- Providing sample data through a Django management command
- Providing automated backend tests

The backend is organized into two main Django applications:

### `services`

Handles the salon service catalog.

Responsibilities include:

- Creating services
- Listing services
- Updating services
- Deleting services
- Validating service price and duration
- Providing sample service data

### `appointments`

Handles customer appointments.

Responsibilities include:

- Creating appointments
- Listing appointments
- Retrieving appointments
- Updating appointments
- Deleting appointments
- Filtering appointments by status
- Preventing duplicate bookings
- Managing appointment status transitions

---

## 2. Technology Stack

| Technology | Purpose |
|---|---|
| Python 3.10+ | Programming language |
| Django | Backend web framework |
| Django REST Framework | REST API development |
| SQLite | Relational database |
| django-filter | API filtering |
| django-cors-headers | Cross-Origin Resource Sharing |

---

## 3. Project Structure

```text
backend/
│
├── .venv/
│   └── Python virtual environment
│
├── appointments/
│   ├── migrations/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── tests.py
│
├── services/
│   ├── migrations/
│   ├── management/
│   │   └── commands/
│   │       ├── __init__.py
│   │       └── seed_data.py
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── serializers.py
│   ├── views.py
│   ├── urls.py
│   └── tests.py
│
├── salon_backend/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── db.sqlite3
├── manage.py
├── requirements.txt
└── README.md