# Intelligence Query Engine API

A production-ready backend API for demographic profile collection and queryable intelligence.

## Features

- Advanced filtering with combinable conditions
- Sorting by `age`, `created_at`, and `gender_probability`
- Pagination with `page`, `limit`, and `total`
- Rule-based natural language search
- Duplicate-safe seeding with upsert behavior
- CORS enabled with `Access-Control-Allow-Origin: *`

## Profile Schema

Each profile record follows this structure:

| Field | Type | Notes |
| --- | --- | --- |
| `id` | UUID v7 | Unique profile identifier |
| `name` | String | Full name, unique |
| `gender` | String | `male` or `female` |
| `gender_probability` | Number | Confidence score |
| `age` | Number | Exact age |
| `age_group` | String | `child`, `teenager`, `adult`, `senior` |
| `country_id` | String | ISO alpha-2 country code |
| `country_name` | String | Full country name |
| `country_probability` | Number | Confidence score |
| `created_at` | Date | UTC ISO 8601 timestamp |

## Setup

```bash
npm install
npm run dev
```

## Seeding

The seed command supports either a local seed file or a remote dataset URL.

1. Put the 2026 dataset at `database/seeds/profiles-2026.json`, or
2. Set `PROFILE_SEED_FILE` to a local `.json` or `.csv` file, or
3. Set `PROFILE_SEED_URL` to the provided dataset link.

Run:

```bash
npm run seed
```

Re-running the seed uses upserts, so duplicates are not created.

## Endpoints

### `GET /api/profiles`

Supported filters:

- `gender`
- `age_group`
- `country_id`
- `min_age`
- `max_age`
- `min_gender_probability`
- `min_country_probability`

Sorting:

- `sort_by=age|created_at|gender_probability`
- `order=asc|desc`

Pagination:

- `page` default `1`
- `limit` default `10`, max `50`

Response:

```json
{
  "status": "success",
  "page": 1,
  "limit": 10,
  "total": 2026,
  "data": []
}
```

Example:

```bash
/api/profiles?gender=male&country_id=NG&min_age=25&sort_by=age&order=desc
```

### `GET /api/profiles/search`

Use plain English in `q` and the API converts it into filters.

Examples:

- `young males from nigeria`
- `females above 30`
- `people from angola`
- `adult males from kenya`
- `male and female teenagers above 17`

Rules:

- Rule-based parsing only
- `young` maps to ages `16-24`
- If both `male` and `female` appear, no gender filter is applied
- If a query cannot be interpreted, the API returns:

```json
{
  "status": "error",
  "message": "Unable to interpret query"
}
```

### Other Endpoints

- `POST /api/profiles`
- `GET /api/profiles/:id`
- `DELETE /api/profiles/:id`

## Validation and Errors

All errors follow this format:

```json
{
  "status": "error",
  "message": "<error message>"
}
```

Common responses:

- `400 Bad Request` for missing or empty required parameters
- `422 Unprocessable Entity` for invalid query parameter types or values
- `404 Not Found` when a profile does not exist
- `500` or `502` for server failure

## Performance Notes

- Filtering is executed in MongoDB, not in memory
- Indexed fields support common filters and sorts
- Pagination uses `skip` and `limit`
- List endpoints use lean queries for lower overhead
