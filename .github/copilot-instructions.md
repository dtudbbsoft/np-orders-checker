## Project Context
- **Architecture**: Turborepo monorepo
- **Languages**: TypeScript (strict mode)
- **Frontend**: React.js, Next.js
- **Backend**: FastAPI (Python)
- **Testing**: Jest, React Testing Library, Playwright
- **Database**: PostgreSQL
- **Package Manager**: npm

### Always Include
- Strict TypeScript types and interfaces
- Proper error handling with typed errors
- JSDoc comments
- Input validation and sanitization
- Logging and monitoring
- Accessibility attributes in React components
- Performance optimizations (memoization, lazy loading, etc.)
- Security best practices
- Units for metric variables (e.g., timeoutMs, etc.)

### Never Include
- `any` types without explicit justification
- Hardcoded configuration values
- Direct DOM manipulation in React
- Synchronous blocking operations
- Commented-out code blocks
- Global variables manipulation

### TypeScript Standards
- Always use strict TypeScript configuration
- Prefer explicit types over `any`
- Use proper generic constraints and conditional types
- Implement proper error handling with typed errors
- Use discriminated unions for complex state management
- Always define return types for functions
- Use readonly for immutable data structures
- Prefer type assertions over type casting when necessary

### React.js/Next.js Frontend Rules
- Use functional components with hooks over class components
- Implement proper component composition patterns
- Use proper prop validation with TypeScript interfaces
- Implement proper state management (Context API, Zustand, Jotai, or Redux Toolkit)
- Use proper form handling with validation libraries (React Hook Form + Zod)
- Implement proper accessibility standards (ARIA labels, semantic HTML)
- Use Tailwind or MUI for styling
- Implement SEO optimization in Next.js applications
- Implement proper loading and error states, including ErrorBoundaries
- Follow single responsibility principle (SRP)
- Make sure to divide components into strict layers (presentation, container, ui, etc.)

### React.js/Next.js Performance Standards
- Implement proper memoization in React components (`useMemo`, `useCallback`)
- Use lazy loading for route-based code splitting
- Implement proper bundle optimization strategies
- Follow Next.js performance best practices (ISR, SSG, SSR as appropriate)
- Use proper database query optimization in Nest.js
- Implement proper caching strategies at appropriate layers

### FastAPI Backend Rules
- Follow the project structure with routers/, services/, schemas/, and db/ modules
- Use Pydantic models for request/response validation
- Ensure all database operations are asynchronous using SQLAlchemy 2.0
- Use exception filters and interceptors
- Implement logging and monitoring
- Use proper database relations and migrations
- Implement API versioning
- Use guards for authentication and authorization, not as decorators
- Implement swagger documentation
- Use proper dependency injection container patterns

### Turborepo Monorepo Rules
- Maintain proper workspace dependencies
- Use shared configurations across workspaces
- Implement proper build caching strategies
- Use proper workspace naming conventions
- Implement proper package.json scripts organization
- Use proper workspace-to-workspace dependency management
- Implement proper shared utilities and types packages

### Testing Standards
- Maintain minimum 80% code coverage
- Use proper test organization (Arrange, Act, Assert)
- Implement proper mocking strategies, make sure to mock all 3rd party dependencies
- Use proper test data builders and factories
- Write integration tests for API endpoints
- Implement proper E2E test scenarios covering user journeys
- Use proper test isolation and cleanup
- Implement proper performance testing where applicable
- Implement accessibility testing where applicable

### Code Structure & Architecture
- Follow SOLID principles in all implementations
- Use dependency injection patterns (especially in FastAPI)
- Implement proper separation of concerns
- Use composition over inheritance
- Follow the principle of least privilege in module exports
- Implement proper error boundaries in React components
- Use proper abstraction layers (controllers, services, repositories)

### Security Guidelines
- Never hardcode sensitive information
- Use environment variables for configuration
- Implement proper input validation and sanitization
- Use HTTPS and secure headers
- Implement proper authentication and authorization
- Follow OWASP security guidelines
- Use proper CORS configuration
- Implement rate limiting and request validation
- XSS protection (e.g., sanitize user input, use CSP)
- CSRF protection (e.g., use anti-CSRF tokens)
- SQL injection protection (e.g., use parameterized queries)
- Use Rate Limiting for API requests

### Naming Conventions
- Use kebab-case for file and directory names (eg `my-folder`)
- Use PascalCase for React components (eg `my-component/MyComponent.tsx`)
- Use camelCase for functions and variables (eg `myFunction`)
- Use UPPER_SNAKE_CASE for constants (eg `MY_CONSTANT`)
- Use descriptive names that explain purpose (eg `getUserById`)

### Manual Review Focus Areas (Required, high attention Copilot)
- Code readability and maintainability
- Proper error handling implementation
- Security implications review
- Performance optimization opportunities
- Accessibility compliance verification
- API design and documentation quality

### README Requirements
- Clear setup and installation instructions
- Environment variable documentation
- API endpoint documentation
- Testing instructions
- Deployment procedures
- Troubleshooting guides

### Directory Structure
apps/
├── apps # typescript and python applications (React.js, Next.js, FastAPI) 
└── packages    # shared typescript packages

## Resources & Reference Links

To ensure all contributors and AI agents follow the rules and best practices in this monorepo, use the following authoritative resources for guidance:

### General Best Practices
- [OWASP Top Ten Security Risks](https://owasp.org/www-project-top-ten/)
- [SOLID Principles Explained](https://github.com/ryanmcdermott/clean-code-javascript#solid)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Strict Mode](https://www.typescriptlang.org/tsconfig#strict)
- [Effective TypeScript](https://effectivetypescript.com/)

### React.js / Next.js
- [React Official Docs](https://react.dev/learn)
- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js SEO Guide](https://nextjs.org/docs/advanced-features/seo)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Material UI](https://mui.com/material-ui/getting-started/overview/)

### FastAPI
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Pydantic Documentation](https://pydantic.dev/latest/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/en/20)
- [FastAPI Dependency Injection](https://fastapi.tiangolo.com/tutorial/dependencies/)
- [PostgreSQL with FastAPI](https://fastapi.tiangolo.com/tutorial/sql-databases/)


### Testing
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright](https://playwright.dev/docs/intro)
- [Pytest](https://docs.pytest.org/en/stable/)

### Database
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Knex.js Documentation](https://knexjs.org/)

### Monorepo & Turborepo
- [Turborepo Documentation](https://turbo.build/repo/docs)

### Accessibility
- [WebAIM Accessibility Guidelines](https://webaim.org/standards/wcag/)
- [MDN ARIA Reference](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)

### Code Quality & Linting
- [ESLint Documentation](https://eslint.org/docs/latest/)
- [Prettier Documentation](https://prettier.io/docs/en/index.html)

### API Design
- [OpenAPI Specification](https://swagger.io/specification/)
- [RESTful API Design](https://restfulapi.net/)

**How to use:**  
Reference these links when implementing, reviewing, or updating code to ensure compliance with project standards and best practices.