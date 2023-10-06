This is a [Next.js](https://nextjs.org/) project demonstrating Next.js's cabability to mimic a API endpoint using SQLite database file.

## Getting Started

First, run the development server:

```bash
npm install
# and
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Prisma

The project uses [Prisma](https://www.prisma.io/) as the ORM.
Database schema is saved in `/prisma/schema.prisma`. Any updates to the file would need to be synchronized by running `npx prisma migrate dev`.
