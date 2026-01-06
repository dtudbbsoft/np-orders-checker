# Playwright E2E Tests

This directory contains end-to-end tests for the web application using Playwright.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

## Running Tests

### Basic Commands
```bash
# Run all tests
npm run test:e2e

# Run tests with UI mode (interactive)
npm run test:e2e:ui

# Run tests in headed mode (visible browser)
npm run test:e2e:headed

# Debug tests
npm run test:e2e:debug

# Run specific test file
npx playwright test users.spec.ts

# Run tests in specific browser
npx playwright test --project=chromium
```

### Test Structure

- `homepage.spec.ts` - Basic homepage functionality tests
- `users.spec.ts` - User management interface tests  
- `api.spec.ts` - API integration tests
- `users-flow.spec.ts` - Complete user workflow tests
- `pages/users.page.ts` - Page Object Model for Users page

## Configuration

The tests are configured in `playwright.config.ts` with:

- **Base URL**: `http://localhost:3000`
- **Multiple browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Auto-start servers**: Both frontend (port 3000) and backend (port 8000)
- **Screenshots**: On failure only
- **Videos**: Retained on failure
- **Traces**: On retry

## Test Development Guidelines

1. **Use Page Objects**: For reusable page interactions, use the Page Object Model pattern
2. **Wait Strategies**: Use `waitForLoadState('networkidle')` for dynamic content
3. **Flexible Selectors**: Tests use multiple fallback selectors to handle UI changes
4. **Graceful Degradation**: Tests skip functionality that isn't available rather than failing
5. **Clean Data**: Tests should clean up any data they create

## API Testing

The API tests verify:
- Backend server accessibility
- API endpoint availability  
- Data format validation

## Troubleshooting

### Common Issues

1. **Server not starting**: Ensure both frontend and backend are configured to run on correct ports
2. **Tests timing out**: Increase timeout values in playwright.config.ts
3. **Flaky tests**: Add more specific wait conditions or increase wait times

### Debug Mode

Use debug mode to step through tests:
```bash
npm run test:e2e:debug
```

### View Test Reports

After running tests, view the HTML report:
```bash
npx playwright show-report
```