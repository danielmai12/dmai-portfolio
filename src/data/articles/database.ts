import { Article, CATEGORY } from "./types";

export const databaseArticles: Article[] = [
  {
    slug: "database-indexing-101",
    title: "Database Indexing 101",
    date: "Mar 17, 2026",
    category: CATEGORY.DATABASE,
    summary:
      "Understanding how indexes work under the hood and when to add (or avoid) them.",
    readingTime: "6 min read",
    content: `## Database Indexing 101

Indexes are the single biggest lever for query performance — but they come with trade-offs.

### How a B-Tree Index Works

A B-tree index organizes rows in a balanced tree structure, allowing the database to find rows in **O(log n)** instead of scanning the full table (**O(n)**).

\`\`\`sql
CREATE INDEX idx_users_email ON users(email);
\`\`\`

Now \`WHERE email = 'foo@bar.com'\` can use the index instead of a sequential scan.

### When to Index

- Columns in **WHERE** clauses that are queried frequently.
- Columns used in **JOIN** conditions.
- Columns used in **ORDER BY** on large tables.

### When NOT to Index

- **Small tables** — a sequential scan may be faster than an index lookup.
- **High-write tables** — every INSERT/UPDATE must also update the index.
- **Low-cardinality columns** — a boolean column (\`is_active\`) rarely benefits from a standard index.

### Composite Indexes

Order matters. An index on \`(country, city)\` helps queries filtering by **country** or **country + city**, but not **city alone**.

\`\`\`sql
CREATE INDEX idx_location ON users(country, city);

-- Uses the index:
SELECT * FROM users WHERE country = 'CA';
SELECT * FROM users WHERE country = 'CA' AND city = 'Winnipeg';

-- Does NOT use the index:
SELECT * FROM users WHERE city = 'Winnipeg';
\`\`\`

### EXPLAIN is Your Friend

Always check the query plan before and after adding an index:

\`\`\`sql
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'foo@bar.com';
\`\`\``,
  },
];
