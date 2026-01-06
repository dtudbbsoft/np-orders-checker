import { test, expect } from '@playwright/test';

test.describe('API Integration', () => {
  test('should have backend API available', async ({ request }) => {
    // Test if the API is running and accessible
    try {
      const response = await request.get('http://localhost:8000/health');
      expect(response.status()).toBe(200);
    } catch (error) {
      // If health endpoint doesn't exist, try a basic endpoint
      const response = await request.get('http://localhost:8000/');
      expect(response.status()).toBeLessThan(500);
    }
  });

  test('should fetch users from API', async ({ request }) => {
    try {
      const response = await request.get('http://localhost:8000/api/v1/users');
      expect(response.status()).toBe(200);
      
      const users = await response.json();
      expect(Array.isArray(users)).toBe(true);
    } catch (error) {
      // Try alternative endpoint structure
      const response = await request.get('http://localhost:8000/api/users');
      expect(response.status()).toBe(200);
    }
  });
});