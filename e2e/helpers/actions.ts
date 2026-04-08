import { by, device, element, waitFor } from 'detox';
import { TEST_ACCOUNT } from './account';

export async function login(email: string, password: string) {
  await waitFor(element(by.id('login-email-input')))
    .toBeVisible()
    .withTimeout(5000);
  await element(by.id('login-email-input')).clearText();
  await element(by.id('login-email-input')).typeText(email);
  await element(by.id('login-password-input')).clearText();
  await element(by.id('login-password-input')).typeText(password);
  await device.pressBack(); // dismiss keyboard
  await element(by.id('login-submit-button')).tap();
}

export async function signup(account: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  await waitFor(element(by.id('signup-firstname-input')))
    .toBeVisible()
    .withTimeout(5000);
  await element(by.id('signup-firstname-input')).clearText();
  await element(by.id('signup-firstname-input')).typeText(account.firstName);
  await element(by.id('signup-lastname-input')).clearText();
  await element(by.id('signup-lastname-input')).typeText(account.lastName);
  await element(by.id('signup-email-input')).clearText();
  await element(by.id('signup-email-input')).typeText(account.email);
  await element(by.id('signup-password-input')).clearText();
  await element(by.id('signup-password-input')).typeText(account.password);
  await device.pressBack();
  await element(by.id('signup-submit-button')).tap();
}

export async function logout() {
  await element(by.id('posts-logout-button')).tap();
}

export async function waitForPostsList() {
  await waitFor(element(by.id('posts-list')))
    .toBeVisible()
    .withTimeout(10000);
}

export async function navigateToLogin() {
  await element(by.id('posts-login-button')).tap();
  await waitFor(element(by.id('login-email-input')))
    .toBeVisible()
    .withTimeout(5000);
}

export async function navigateToSignup() {
  await element(by.id('posts-signup-button')).tap();
  await waitFor(element(by.id('signup-firstname-input')))
    .toBeVisible()
    .withTimeout(5000);
}

export async function loginWithTestAccount() {
  await navigateToLogin();
  await login(TEST_ACCOUNT.email, TEST_ACCOUNT.password);
  await waitForPostsList();
  await waitFor(element(by.id('posts-logout-button')))
    .toBeVisible()
    .withTimeout(5000);
}
