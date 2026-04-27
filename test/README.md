# HabTrack API Tests

This README explains the automated tests created for the HabTrack API.

The main API documentation is available in [../README.md](../README.md).

## Technologies

The test project uses:

- [Mocha](https://mochajs.org/)
- [Chai](https://www.chaijs.com/)
- [Supertest](https://github.com/ladjs/supertest)
- [Dotenv](https://www.npmjs.com/package/dotenv)

## Test Structure

```text
test
|-- api
|   |-- auth
|   `-- habits
`-- infra
    |-- fixtures
    `-- helpers
```

## How to Configure

### 1. Install dependencies

```bash
npm install
```

### 2. Configure the environment

Create a `.env` file in the project root if needed:

```env
BASE_URL="http://localhost:3000"
```

### 3. Start the API

```bash
npm start
```

The API should be running at:

- `http://localhost:3000`

## How to Run the Tests

Run all tests with:

```bash
npm test
```

## Notes

- The tests validate authentication and habits routes.
- Fixtures are used as base request payloads.
- Helpers are used to avoid repeated setup code.
- The API stores data in memory, so restarting the server resets users, habits, and tokens.
- Some tests use dynamic emails to avoid conflicts between executions.
