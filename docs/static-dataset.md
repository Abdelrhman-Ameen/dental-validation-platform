# Static Validation Dataset

The validation benchmark uses 20 fixed radiographs from `DataSet/test`.

## Folder Structure

```txt
dental-validation-platform/
|-- DataSet/
|   `-- test/
|       |-- _annotations.csv
|       `-- *.jpg
|-- frontend/
|   |-- public/
|   |   `-- dataset/
|   |       |-- case1.jpg
|   |       |-- case2.jpg
|   |       `-- case20.jpg
|   `-- lib/
|       |-- local-simulation-questions.ts
|       `-- local-simulation-answer-key.ts
`-- scripts/
    `-- generate-local-simulation.mjs
```

## Generate The Fixed Set

From the project root:

```bash
npm run seed:local
```

This command:

- reads `DataSet/test/_annotations.csv`
- selects 20 fixed validation cases
- copies the real radiographs into `frontend/public/dataset/`
- generates browser-safe question metadata
- generates a server-only answer key

## Image URLs

Images are static Next.js assets:

```ts
const imageUrl = "/dataset/case1.jpg";
```

They work without Firebase Storage, without an upload server, and after deployment on Vercel.

## Security

The browser-safe file is:

```txt
frontend/lib/local-simulation-questions.ts
```

It does not include `correctAnswer`.

The private answer key is:

```txt
frontend/lib/local-simulation-answer-key.ts
```

It imports `server-only`, so it can be used by API routes but not bundled into client components.
