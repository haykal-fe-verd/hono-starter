# 🔥 Hono Starter

Professional REST API starter template built with modern technologies and best practices. Ready for production with authentication, authorization, and comprehensive testing.

## 📋 Description

**Hono Starter** is a REST API backend template built with a focus on **performance**, **type safety**, and **developer experience**. Powered by the ultra-fast **Hono** framework running on **Bun** runtime, equipped with **TypeScript** for type safety, **Prisma ORM** for database management, **Redis** for caching & rate limiting, and **PostgreSQL** as the primary database.

This template is production-ready with complete features including JWT authentication, role-based access control (RBAC), API documentation with OpenAPI/Scalar, structured logging, comprehensive testing, and Docker support.

## ✨ Features

-   🔐 **JWT Authentication** - Secure token-based auth with access & refresh tokens
-   👥 **Role-Based Access Control (RBAC)** - Flexible permission management
-   ⚡ **Rate Limiting** - Redis-based protection from API abuse
-   📝 **API Documentation** - Auto-generated OpenAPI/Swagger with Scalar UI
-   🧪 **Comprehensive Testing** - Unit & integration tests with Bun test
-   📊 **Structured Logging** - Winston logger with daily rotation
-   🔄 **Database Seeding** - Automated data seeding with factory pattern
-   🐳 **Docker Ready** - Docker Compose setup for development & production
-   🎯 **Type Safety** - Full TypeScript with strict mode
-   🏗️ **Modular Architecture** - Clean & maintainable code structure
-   ✅ **Input Validation** - Zod schema validation for all endpoints
-   🚦 **Health Checks** - Database & Redis health monitoring

## 🛠️ Tech Stack

### Core

-   **[Hono](https://hono.dev/)** - Ultra-fast web framework (faster than Express.js)
-   **[Bun](https://bun.sh/)** - Fast JavaScript runtime, bundler & package manager
-   **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript superset

### Database & ORM

-   **[PostgreSQL](https://www.postgresql.org/)** - Powerful relational database
-   **[Prisma](https://www.prisma.io/)** - Next-generation ORM with type-safe queries
-   **[Redis](https://redis.io/)** - In-memory data store for caching & rate limiting

### Authentication & Security

-   **JWT** - JSON Web Tokens for stateless authentication
-   **Bcrypt** - Password hashing
-   **Rate Limiting** - Redis-based request throttling

### API Documentation

-   **[@hono/zod-openapi](https://hono.dev/docs/helpers/adapter#openapi)** - OpenAPI spec generation
-   **[@scalar/hono-api-reference](https://scalar.com/)** - Beautiful API documentation UI

### Validation & Logging

-   **[Zod](https://zod.dev/)** - TypeScript-first schema validation
-   **[Winston](https://github.com/winstonjs/winston)** - Structured logging with daily rotation

### Development Tools

-   **[Biome](https://biomejs.dev/)** - Fast linter & formatter (ESLint + Prettier alternative)
-   **Bun Test** - Fast test runner with Jest-compatible API
-   **Docker & Docker Compose** - Containerization for consistency

## 📦 Installation

### Prerequisites

-   [Bun](https://bun.sh/) >= 1.0.0
-   [PostgreSQL](https://www.postgresql.org/) >= 14
-   [Redis](https://redis.io/) >= 6.0
-   [Docker](https://www.docker.com/) (optional)

### Setup

1. **Clone repository**

```bash
git clone https://github.com/haykal-fe-verd/hono-starter.git
cd hono-starter
```

2. **Install dependencies**

```bash
bun install
```

3. **Setup environment variables**

```bash
cp .env.example .env
```

Edit `.env` and configure according to your setup:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/hono_starter"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="your-super-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"
PORT=8000
NODE_ENV=development
```

4. **Setup database with Docker (optional)**

```bash
docker-compose up -d
```

5. **Run database migrations**

```bash
bun run db:migrate
```

6. **Seed database (optional)**

```bash
bun run db:seed
```

7. **Start development server**

```bash
bun run dev
```

The server will run at `http://localhost:8000`

## 🚀 Usage

### Development

```bash
bun run dev          # Start development server with hot reload
bun test             # Run all tests
bun run typecheck    # Type checking without emit
bun run format       # Format code with Biome
bun run lint         # Lint & fix code
bun run check        # Lint, format & fix all at once
```

### Database

```bash
bun run db:generate  # Generate Prisma Client
bun run db:push      # Push schema tanpa migration
bun run db:pull      # Pull schema dari database
bun run db:migrate   # Create & run migration
bun run db:seed      # Seed database
bun run db:studio    # Open Prisma Studio
bun run db:format    # Format schema.prisma
```

### Production

```bash
bun run build        # Build for production
bun run start        # Start production server (JS)
bun start:compiled   # Start compiled binary
```

## 📁 Project Structure

```
hono-starter/
├── prisma/
│   ├── migrations/          # Database migrations
│   ├── factory/            # Data factory for seeding
│   ├── schema.prisma       # Prisma schema
│   ├── seed.ts            # Database seeder
│   └── db.ts              # Database client
├── src/
│   ├── modules/           # Feature modules
│   │   ├── auth/         # Authentication (login, register, refresh)
│   │   ├── users/        # User management (CRUD)
│   │   ├── roles/        # Role management
│   │   ├── permissions/  # Permission management
│   │   ├── health/       # Health check endpoint
│   │   └── home/         # Landing page
│   ├── middleware/       # Custom middleware
│   │   ├── auth-middleware.ts
│   │   ├── role-permission-middleware.ts
│   │   ├── rate-limiter.ts
│   │   └── http-logger.ts
│   ├── application/      # App configuration
│   │   ├── app.ts       # Main app instance
│   │   ├── create-app.ts
│   │   ├── create-router.ts
│   │   ├── create-open-api.ts
│   │   ├── env.ts       # Environment validation
│   │   ├── logging.ts   # Winston logger
│   │   └── redis.ts     # Redis client
│   ├── lib/             # Utilities & helpers
│   │   ├── cache.ts
│   │   ├── cookie.ts
│   │   ├── constants.ts
│   │   ├── types.ts
│   │   └── utils.ts
│   └── index.ts         # Entry point
├── storage/
│   └── logs/            # Log files
├── docker-compose.yml   # Docker services
├── Dockerfile           # Production Docker image
├── package.json
├── tsconfig.json
└── biome.json

```

### Module Structure

Each module follows a consistent structure:

```
module-name/
├── module.controller.ts  # Request handlers
├── module.service.ts     # Business logic
├── module.route.ts       # Route definitions
├── module.validation.ts  # Zod schemas
├── module.test.ts        # Unit & integration tests
└── module.index.ts       # Module exports
```

## 🔌 API Endpoints

### Public Endpoints

```
GET    /                     - Landing page
GET    /health               - Health check
GET    /doc                  - API documentation (Scalar UI)
POST   /api/v1/auth/login    - User login
POST   /api/v1/auth/register - User registration
POST   /api/v1/auth/refresh  - Refresh access token
```

### Protected Endpoints (Require Authentication)

```
POST   /api/v1/auth/logout   - User logout
GET    /api/v1/users         - Get all users
GET    /api/v1/users/:id     - Get user by ID
POST   /api/v1/users         - Create new user
PUT    /api/v1/users/:id     - Update user
DELETE /api/v1/users/:id     - Delete user
GET    /api/v1/roles         - Get all roles
GET    /api/v1/roles/:id     - Get role by ID
POST   /api/v1/roles         - Create new role
PUT    /api/v1/roles/:id     - Update role
DELETE /api/v1/roles/:id     - Delete role
GET    /api/v1/permissions   - Get all permissions
GET    /api/v1/permissions/:id - Get permission by ID
POST   /api/v1/permissions   - Create new permission
PUT    /api/v1/permissions/:id - Update permission
DELETE /api/v1/permissions/:id - Delete permission
```

For complete documentation, visit `/doc` after the server is running.

## 🧪 Testing

This project uses **Bun test** with comprehensive coverage:

```bash
bun test                    # Run all tests
bun test src/modules/auth   # Run specific module tests
bun test --watch           # Watch mode
```

Test structure:

-   Unit tests for service layer
-   Integration tests for endpoint testing
-   Database mocking with seeded data
-   234+ test cases with 616+ assertions

## 🐳 Docker

### Development with Docker Compose

```bash
# Start all services (PostgreSQL + Redis)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Docker Image

```bash
# Build image
docker build -t hono-starter .

# Run container
docker run -p 8000:8000 --env-file .env hono-starter
```

## 🔐 Authentication Flow

1. **Register**: `POST /api/v1/auth/register`

    - Input: email, password, name
    - Output: user data + access token + refresh token

2. **Login**: `POST /api/v1/auth/login`

    - Input: email, password
    - Output: user data + access token + refresh token

3. **Access Protected Routes**:

    - Header: `Authorization: Bearer <access_token>`

4. **Refresh Token**: `POST /api/v1/auth/refresh`

    - Cookie: `refresh_token`
    - Output: new access token

5. **Logout**: `POST /api/v1/auth/logout`
    - Clears refresh token cookie

## 🎯 Role-Based Access Control (RBAC)

This project implements RBAC with the following structure:

-   **Users** → can have multiple **Roles**
-   **Roles** → can have multiple **Permissions**
-   **Users** → can also have direct **Permissions**

Example middleware usage:

```typescript
import { requirePermission } from "@/middleware/role-permission-middleware";

// Require specific permission
app.get("/admin", requirePermission("admin.access"), handler);

// Require one of permissions
app.get("/content", requirePermission(["content.read", "content.write"]), handler);
```

## 🌍 Environment Variables

| Variable                 | Description                  | Default       |
| ------------------------ | ---------------------------- | ------------- |
| `DATABASE_URL`           | PostgreSQL connection string | -             |
| `REDIS_URL`              | Redis connection string      | -             |
| `JWT_SECRET`             | JWT access token secret      | -             |
| `JWT_REFRESH_SECRET`     | JWT refresh token secret     | -             |
| `JWT_EXPIRES_IN`         | Access token expiry          | `15m`         |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry         | `7d`          |
| `PORT`                   | Server port                  | `8000`        |
| `NODE_ENV`               | Environment mode             | `development` |
| `RATE_LIMIT_WINDOW`      | Rate limit window (ms)       | `60000`       |
| `RATE_LIMIT_MAX`         | Max requests per window      | `100`         |

## 📝 Logging

Winston logger with structured logging:

```typescript
import { logger } from "@/application/logging";

logger.info({ tag: "AUTH", message: "User logged in", userId });
logger.error({ tag: "DB", message: "Connection failed", error });
logger.warn({ tag: "API", message: "Rate limit exceeded" });
```

Logs are stored in `storage/logs/` with daily rotation:

-   `application-YYYY-MM-DD.log` - All logs
-   `error-YYYY-MM-DD.log` - Error logs only

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Muhammad Haykal**

-   GitHub: [@haykal-fe-verd](https://github.com/haykal-fe-verd)
-   Email: muhammadhaykall99@gmail.com

## 🙏 Acknowledgments

-   [Hono](https://hono.dev/) - Amazing web framework
-   [Bun](https://bun.sh/) - Blazing fast runtime
-   [Prisma](https://www.prisma.io/) - Excellent ORM
-   [Scalar](https://scalar.com/) - Beautiful API docs

## 📚 Resources

-   [Hono Documentation](https://hono.dev/docs)
-   [Bun Documentation](https://bun.sh/docs)
-   [Prisma Documentation](https://www.prisma.io/docs)
-   [PostgreSQL Documentation](https://www.postgresql.org/docs)
-   [Redis Documentation](https://redis.io/docs)

---

⭐ If you find this project helpful, please give it a star!

Built with ❤️ using Hono + Bun + TypeScript
