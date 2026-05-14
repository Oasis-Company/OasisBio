# Contributing to OasisBio

Thank you for your interest in contributing to OasisBio! This project is evolving toward becoming **open identity context infrastructure for the AI era**. We welcome contributions from developers, designers, researchers, and anyone excited about building the future of digital identity.

## Development Philosophy

- **Modularity First**: All features should be independent, testable, and replaceable
- **Type Safety**: Strict TypeScript with no `any` types in production code
- **Machine-Readable by Design**: Every API endpoint should return structured, parseable data
- **Privacy by Default**: Identity data should only be accessible with explicit user consent

## Getting Started

### Prerequisites

- Node.js 20.x or later
- PostgreSQL database (local or Supabase)
- pnpm 8.x or later

### Setup

```bash
# Clone the repository
git clone https://github.com/zbbsdsb/oasisbio.git
cd oasisbio

# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local
# Edit .env.local with your database URL and OAuth credentials

# Initialize the database
pnpm db:push

# Start the development server
pnpm dev
```

### Environment Variables

At minimum, you need:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/oasisbio"
DIRECT_URL="postgresql://user:password@localhost:5432/oasisbio"
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
OAUTH_JWT_SECRET="your-oauth-jwt-secret"
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── api/               # REST API endpoints
│   ├── bio/[slug]/        # Public character pages
│   └── oauth/             # OAuth 2.0 authorization flow
├── components/            # React components
├── hooks/                 # Custom React hooks
├── lib/                   # Core business logic
│   ├── auth/             # Authentication utilities
│   ├── nuwa/             # Nuwa AI distillation system
│   └── oauth/            # OAuth provider implementation
└── generated/            # Prisma client (auto-generated)
```

## Coding Standards

### TypeScript

- Use strict TypeScript mode
- Avoid `any` — use `unknown` and type guards instead
- Export types for all API responses
- Use `interface` for object shapes, `type` for unions and primitives

### Error Handling

```typescript
// Good: specific error types with proper HTTP status codes
return NextResponse.json(
  { error: 'Identity context not found' },
  { status: 404 }
);

// Bad: generic errors without context
return NextResponse.json(
  { error: 'Something went wrong' },
  { status: 500 }
);
```

### API Routes

- Use proper HTTP methods (GET for reads, POST for creates, etc.)
- Always return JSON with consistent error format
- Include appropriate cache headers for public endpoints
- Validate all input with Zod or similar

```typescript
// Example: /api/context/[slug]/route.ts
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    // Implementation...
  } catch (error) {
    return handleApiError(error);
  }
}
```

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run with coverage
pnpm test:coverage

# Run specific test file
pnpm test src/app/api/context/[slug]/route.test.ts
```

### Test Coverage Goals

- **Critical paths**: 100% coverage required
- **API routes**: All status codes must be tested
- **OAuth flows**: Authorization code, token exchange, refresh, revocation
- **Business logic**: All utility functions must have unit tests

## Branching Strategy

- `main` — Production-ready code
- `develop` — Integration branch for features
- `feature/*` — New features (e.g., `feature/context-api`)
- `fix/*` — Bug fixes (e.g., `fix/oauth-scope-validation`)
- `docs/*` — Documentation improvements

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(context): add /api/context/[slug] endpoint for machine-readable identity
fix(oauth): correct scope validation for context:read
docs(technical): update API reference with new endpoints
refactor(abilities): extract level calculation to utility function
```

## Pull Request Process

1. **Fork** the repository and create your branch from `develop`
2. **Write tests** for any new functionality
3. **Ensure all tests pass** locally before opening a PR
4. **Update documentation** if you're changing APIs or adding features
5. **Request review** from at least one maintainer
6. **Address feedback** promptly

### PR Template

```markdown
## Summary
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings or errors
```

## Security Considerations

- Never log or expose OAuth secrets or tokens
- Validate all user input before database queries
- Use parameterized queries (Prisma prevents SQL injection by default)
- Implement rate limiting on sensitive endpoints
- Follow OAuth 2.0 security best practices

## Code of Conduct

By participating, you agree to uphold our community standards. See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

## Questions?

- **Issues**: Open a GitHub issue for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions and ideas
- **Email**: Contact the maintainers for sensitive concerns

## Recognition

Contributors will be recognized in our documentation and release notes. Every meaningful contribution matters — from bug reports to documentation improvements.
