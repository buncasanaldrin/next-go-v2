# Admin Web App Setup Guide

This guide outlines the steps to set up the Admin Web App.

## ![Node.js Logo](https://nodejs.org/static/images/logo.svg) Node Version

Current Long Term Support (LTS) Version: `v20.14.0`

## ![Go Gopher](https://golang.org/doc/gopher/frontpage.png) Go Version

Current Version: `v1.22.2`

## 📦 Tech Tools Used

### Next.js Frontend

- [Next.JS](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn UI](https://ui.shadcn.com)
- [Zod](https://zod.dev)
- [React Hook Form](https://www.react-hook-form.com)

### Go Backend

- [Go](https://golang.org)
- [httprouter](https://github.com/julienschmidt/httprouter)
- [pq](https://github.com/lib/pq)
- [realip](https://github.com/tomasen/realip)
- [crypto](https://pkg.go.dev/golang.org/x/crypto)
- [time](https://pkg.go.dev/golang.org/x/time)

### Database

- [PostgreSQL](https://www.postgresql.org)

## ⚙️ Environment Variables For Frontend

- **API_URL** - API Endpoint.
- **AUTH_SECRET** - Next.JS Auth Secret.

## ⚙️ Environment Variables For Backend

- **FULLSTACK_DB_DSN** - Database DSN.

## 🚀 Getting Started

`Note: Please ask your developer or admin for the env`

Run the app using Docker:

```bash
docker-compose up --build
```

**Preview**: Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.
