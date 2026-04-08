import { by, device, element, expect, waitFor } from 'detox';
import { TEST_ACCOUNT, generateRandomAccount } from './helpers/account';
import {
  login,
  logout,
  navigateToLogin,
  navigateToSignup,
  signup,
  waitForPostsList,
} from './helpers/actions';

describe('Auth', () => {
  beforeAll(async () => {
    await device.launchApp({
      delete: true,
      newInstance: true,
      url: 'thinkeasy://expo-development-client/?url=' + encodeURIComponent('http://10.0.2.2:8081'),
    });
    await waitForPostsList();
  });

  describe('Signup', () => {
    beforeEach(async () => {
      await device.reloadReactNative();
      await waitForPostsList();
    });

    it('should show validation errors on empty submit', async () => {
      await navigateToSignup();
      await element(by.id('signup-submit-button')).tap();

      await expect(element(by.text('First name is required'))).toBeVisible();
      await expect(element(by.text('Last name is required'))).toBeVisible();
      await expect(element(by.text('Email is required'))).toBeVisible();
      await expect(element(by.text('Password is required'))).toBeVisible();
    });

    it('should sign up with a random account and redirect to posts', async () => {
      const account = generateRandomAccount();
      await navigateToSignup();
      await signup(account);

      await waitForPostsList();
      await waitFor(element(by.id('posts-logout-button')))
        .toBeVisible()
        .withTimeout(10000);
      await expect(element(by.id('posts-new-button'))).toBeVisible();

      await logout();
    });

    it('should navigate from signup to login via footer link', async () => {
      await navigateToSignup();
      await element(by.id('auth-footer-action')).tap();

      await waitFor(element(by.id('login-email-input')))
        .toBeVisible()
        .withTimeout(5000);
      await expect(element(by.id('auth-title'))).toHaveText('Login');
    });
  });

  describe('Login', () => {
    beforeEach(async () => {
      await device.reloadReactNative();
      await waitForPostsList();
    });

    it('should show validation errors on empty submit', async () => {
      await navigateToLogin();
      await element(by.id('login-submit-button')).tap();

      await expect(element(by.text('Email is required'))).toBeVisible();
      await expect(element(by.text('Password is required'))).toBeVisible();
    });

    it('should login with test account and redirect to posts', async () => {
      await navigateToLogin();
      await login(TEST_ACCOUNT.email, TEST_ACCOUNT.password);

      await waitForPostsList();
      await waitFor(element(by.id('posts-logout-button')))
        .toBeVisible()
        .withTimeout(10000);
      await expect(element(by.id('posts-new-button'))).toBeVisible();

      await logout();
    });

    it('should navigate from login to signup via footer link', async () => {
      await navigateToLogin();
      await element(by.id('auth-footer-action')).tap();

      await waitFor(element(by.id('signup-firstname-input')))
        .toBeVisible()
        .withTimeout(5000);
      await expect(element(by.id('auth-title'))).toHaveText('Sign Up');
    });
  });

  describe('Logout', () => {
    beforeEach(async () => {
      await device.reloadReactNative();
      await waitForPostsList();
    });

    it('should logout and show unauthenticated state', async () => {
      // Login first
      await navigateToLogin();
      await login(TEST_ACCOUNT.email, TEST_ACCOUNT.password);
      await waitForPostsList();
      await waitFor(element(by.id('posts-logout-button')))
        .toBeVisible()
        .withTimeout(10000);

      // Logout
      await logout();

      // Verify unauthenticated state
      await waitFor(element(by.id('posts-login-button')))
        .toBeVisible()
        .withTimeout(5000);
      await expect(element(by.id('posts-signup-button'))).toBeVisible();
      await expect(element(by.id('posts-new-button'))).not.toBeVisible();
    });
  });
});
