import { by, device, element, expect, waitFor } from 'detox';
import { loginWithTestAccount, waitForPostsList } from './helpers/actions';

describe('Create Post', () => {
  beforeAll(async () => {
    await device.launchApp({
      delete: true,
      newInstance: true,
      url: 'thinkeasy://expo-development-client/?url=' + encodeURIComponent('http://10.0.2.2:8081'),
    });
    await waitForPostsList();
    await loginWithTestAccount();
  });

  beforeEach(async () => {
    await waitForPostsList();
  });

  it('should open create post modal', async () => {
    await element(by.id('posts-new-button')).tap();

    await waitFor(element(by.id('create-post-title-input')))
      .toBeVisible()
      .withTimeout(5000);
    await expect(element(by.id('create-post-content-input'))).toBeVisible();
    await expect(element(by.id('create-post-submit-button'))).toBeVisible();

    await device.pressBack();
  });

  it('should show validation errors on empty submit', async () => {
    await element(by.id('posts-new-button')).tap();
    await waitFor(element(by.id('create-post-title-input')))
      .toBeVisible()
      .withTimeout(5000);

    await element(by.id('create-post-submit-button')).tap();

    await expect(element(by.text('Title is required'))).toBeVisible();
    await expect(element(by.text('Content is required'))).toBeVisible();

    await device.pressBack();
  });

  it('should create a post and navigate back to posts list', async () => {
    const postTitle = `E2E Post ${Date.now()}`;
    const postContent = 'This is a test post created by Detox E2E tests.';

    await element(by.id('posts-new-button')).tap();
    await waitFor(element(by.id('create-post-title-input')))
      .toBeVisible()
      .withTimeout(5000);

    await element(by.id('create-post-title-input')).typeText(postTitle);
    await element(by.id('create-post-content-input')).typeText(postContent);
    await element(by.id('create-post-submit-button')).tap();

    // Should navigate back to posts list
    await waitForPostsList();
    await waitFor(element(by.id('posts-logout-button')))
      .toBeVisible()
      .withTimeout(10000);
  });

  it('should dismiss create post modal on back press', async () => {
    await element(by.id('posts-new-button')).tap();
    await waitFor(element(by.id('create-post-title-input')))
      .toBeVisible()
      .withTimeout(5000);

    await device.pressBack();

    await waitForPostsList();
  });
});
