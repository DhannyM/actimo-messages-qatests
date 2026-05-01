# Actimo Messages – Playwright Test Suite

Automated end-to-end tests for the **Actimo Messages** feature, built with **TypeScript** and **Playwright**.

---

## Prerequisites

| Tool       | Version  |
|------------|----------|
| Node.js    | ≥ 18.x   |
| npm        | ≥ 9.x    |

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/actimo-playwright-tests.git
cd actimo-playwright-tests
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install chromium
```

### 4. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your Actimo credentials:

```
BASE_URL=https://app.actimo.com
ACTIMO_EMAIL=your-email@example.com
ACTIMO_PASSWORD=your-password
TEST_RECIPIENT_GROUP=All Employees   # a group name that exists in your Actimo instance
```

> ⚠️ **Never commit your `.env` file.** It is already listed in `.gitignore`.

---

## Running the Tests

### Run all tests (headless)

```bash
npm run test
```

### Run in headed mode (watch the browser)

```bash
npm run test:headed
```

### Run a single test file

```bash
npx playwright test tests/tc001-create-message.spec.ts
```

### View the HTML report after a run

```bash
npm run test:report
```

---

## Project Structure

```
actimo-playwright-tests/
├── pages/
│   ├── LoginPage.ts          # Page Object: authentication
│   └── MessagesPage.ts       # Page Object: messages feature
├── tests/
│   ├── tc001-create-message.spec.ts        # TC-001: Create a message
│   ├── tc002-add-content-modules.spec.ts   # TC-002: Content modules
│   └── tc003-configure-recipients.spec.ts  # TC-003: Recipients & channels
├── utils/
│   └── helpers.ts            # Shared auth helper, test data utilities
├── TEST_PLAN.md              # Prioritized test plan (Part 1)
├── playwright.config.ts      # Playwright configuration
├── tsconfig.json
├── package.json
└── .env.example              # Environment variable template
```

---

## Design Decisions

- **Page Object Model (POM)** – Each page/feature area has a dedicated class. Selectors live in one place, making maintenance straightforward when the UI changes.
- **Environment-based credentials** – No hardcoded passwords. Credentials are injected via `.env` so the suite runs safely in CI without code changes.
- **Unique test data** – Every test that creates a message uses a timestamped title (`[AUTO] Title 1714000000000`) to avoid collisions between parallel or sequential runs.
- **Resilient selectors** – Locators use `getByRole`, `getByLabel`, and `getByPlaceholder` (semantic queries) with a fallback `.or()` for class-based selectors, reducing brittleness against minor DOM changes.
- **Workers set to 1** – Tests that share state (login session, message creation) run sequentially by default to avoid race conditions. Can be increased once test isolation is fully established.

---

## CI Integration (optional)

Add a GitHub Actions workflow (`.github/workflows/playwright.yml`):

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm test
        env:
          BASE_URL: ${{ secrets.BASE_URL }}
          ACTIMO_EMAIL: ${{ secrets.ACTIMO_EMAIL }}
          ACTIMO_PASSWORD: ${{ secrets.ACTIMO_PASSWORD }}
          TEST_RECIPIENT_GROUP: ${{ secrets.TEST_RECIPIENT_GROUP }}
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Test Plan

See [TEST_PLAN.md](./TEST_PLAN.md) for the full prioritized list of 20 test scenarios.
