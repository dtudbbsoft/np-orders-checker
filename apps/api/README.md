# NP Orders Checker API

FastAPI backend for the NP Orders Checker application.

## Prerequisites

Make sure you have Poetry installed. If not, install it:
```bash
curl -sSL https://install.python-poetry.org | python3 -
```

## Setup

1. Install dependencies:
```bash
poetry install
```

## Development

Start the development server:
```bash
npm run dev
# or
poetry run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at http://localhost:8000

## Available Commands

- `npm run dev` / `poetry run uvicorn main:app --reload` - Start development server with hot reload
- `npm run start` / `poetry run uvicorn main:app` - Start production server
- `npm run install` / `poetry install` - Install dependencies
- `npm run lint` / `poetry run flake8 .` - Run linter
- `npm run format` / `poetry run black . && poetry run isort .` - Format code
- `npm run type-check` / `poetry run mypy .` - Run type checking
- `npm run test` / `poetry run pytest` - Run tests

### Database Migration Commands

- `npm run db:migrate` / `poetry run alembic upgrade head` - Apply all pending migrations
- `npm run db:revision` / `poetry run alembic revision --autogenerate` - Create a new migration
- `npm run db:downgrade` / `poetry run alembic downgrade -1` - Rollback last migration
- `npm run db:history` / `poetry run alembic history` - Show migration history
- `npm run db:current` / `poetry run alembic current` - Show current migration

## Database Setup

1. **Create initial migration**:
   ```bash
   npm run db:revision -m "Initial migration"
   ```

2. **Apply migrations**:
   ```bash
   npm run db:migrate
   ```

## Database Configuration

The application uses SQLite by default. To use a different database:

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and set your database URL:
   ```bash
   APP_DATABASE_URL=postgresql://user:password@localhost/np_orders
   ```

## API Documentation

Once the server is running, you can access:
- Interactive API docs: http://localhost:8000/docs
- ReDoc documentation: http://localhost:8000/redoc

## Available Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check endpoint

## Poetry Benefits

- **Dependency Management**: Poetry resolves and locks dependencies automatically
- **Virtual Environment**: Automatically creates and manages virtual environments
- **Build System**: Built-in packaging and publishing capabilities
- **Development Tools**: Integrated linting, formatting, and testing tools