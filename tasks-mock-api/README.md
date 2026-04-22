# Mock API (json-server)

REST API for the **Tasks** exercise. Base URL: `http://localhost:4001`.

## Setup

```bash
cd mock-api
pnpm install
pnpm start
```

## Endpoints

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/tasks` | List all tasks |
| POST | `/tasks` | Create task. Body: `{ "title": "string" }`. Returns full task with `id` and `completed: false`. |
| PATCH | `/tasks/:id` | Update task. Body: `{ "completed": boolean }` and/or `{ "title": "string" }`. |
| DELETE | `/tasks/:id` | Delete task. Returns 204. |

## Query params

### Conditions

Use field:operator=value.

#### Operators

- no operator -> `eq` (equal)
- `lt` less than, `lte` less than or equal
- `gt` greater than, `gte` greater than or equal
- `eq` equal, `ne` not equal
- `in` included in comma-separated list
- `contains` string contains (case-insensitive)
- `startsWith` string starts with (case-insensitive)
- `endsWith` string ends with (case-insensitive)

## Task shape

```json
{
  "id": 1,
  "title": "Task title",
  "completed": false
}
```

## Data

Seed data is in `db.json`. POST/PATCH/DELETE changes are written to `db.json` by json-server.
