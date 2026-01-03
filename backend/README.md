# IU POS Backend

This is the backend for the IU POS system, built with Django and Django REST Framework.

## Setup Instructions

### Prerequisites

- [Python](https://www.python.org/) (>= 3.11)
- [uv](https://github.com/astral-sh/uv) (recommended) or `pip`

### Installation

1.  **Clone the repository** (if you haven't already).
2.  **Navigate to the backend directory**:
    ```bash
    cd backend
    ```
3.  **Install dependencies using uv**:
    ```bash
    uv sync
    ```
    _Alternatively, using pip:_
    ```bash
    pip install -r requirements.txt
    ```

### Database Setup

1.  **Run migrations**:
    ```bash
    python manage.py migrate
    ```
2.  **Create a superuser** (optional):
    ```bash
    python manage.py createsuperuser
    ```

### Running the Server

Start the development server:

```bash
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000/`.
