# Security Policy

OasisBio is committed to ensuring the security of our users' identity data. This document outlines our security practices and how to report vulnerabilities.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |

We recommend always using the latest stable release.

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

**Do NOT** create a public GitHub issue for security vulnerabilities.

Instead, please send details to **security@oasiscompany.org** with:

- Type of vulnerability
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct link)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact assessment of the vulnerability

We aim to acknowledge vulnerability reports within **48 hours** and provide a timeline for remediation:

- **Critical**: Response within 24 hours, fix within 7 days
- **High**: Response within 48 hours, fix within 14 days
- **Medium**: Response within 72 hours, fix within 30 days
- **Low**: Response within 1 week, fix within 90 days

## Security Best Practices

### Authentication

- All authentication uses Supabase Auth with secure session management
- OAuth 2.0 implementation follows RFC 6749 with PKCE (RFC 7636)
- Access tokens are JWTs signed with HS256
- Refresh token rotation is enabled by default

### Data Protection

- All database connections use SSL/TLS
- Sensitive data is encrypted at rest
- Row Level Security (RLS) is enforced on all database tables
- API endpoints validate ownership before returning data

### OAuth Scopes

The following scopes are available for third-party applications:

| Scope | Access Level |
|-------|--------------|
| `profile` | Basic profile information (username, display name, avatar) |
| `email` | Email address |
| `oasisbios:read` | View character list |
| `oasisbios:full` | Full character details |
| `dcos:read` | Read DCOS documents |
| `context:read` | Read structured identity context |

### Rate Limiting

- Public endpoints: 100 requests per minute per IP
- Authenticated endpoints: 1000 requests per minute per user
- OAuth endpoints: 20 requests per minute per client

## Security Updates

Security updates will be released as patch versions (e.g., 1.0.x) and announced through:

- GitHub Security Advisories
- Release notes
- Email notifications (for users who have opted in)

## Security-Related Dependencies

We regularly update dependencies to patch known vulnerabilities:

```bash
# Check for vulnerable dependencies
pnpm audit

# Update dependencies
pnpm update
```

## Secure Development Guidelines

When contributing to OasisBio:

1. **Never commit secrets** — Use environment variables only
2. **Validate all input** — Sanitize and validate before database queries
3. **Use parameterized queries** — Prisma ORM prevents SQL injection by default
4. **Implement proper error handling** — Don't expose stack traces in production
5. **Follow least privilege** — Request only necessary permissions

## Infrastructure Security

- Deployment on Vercel with automatic DDoS protection
- Environment variables encrypted at rest
- Database credentials rotated regularly
- Audit logs for administrative actions
- Automated backups with point-in-time recovery

## Contact

For security concerns not suitable for email, please request our security contact through GitHub's [Private vulnerability reporting](https://github.com/zbbsdsb/oasisbio/security/advisories/new) feature.

---

*Last updated: 2024*
