import { by, device, element, expect, waitFor } from 'detox';
import { loginWithTestAccount, waitForPostsList } from './helpers/actions';

describe('Posts List', () => {
  beforeAll(async () => {
    await device.launchApp({
      delete: true,
      newInstance: true,
      url: 'thinkeasy://expo-development-client/?url=' + encodeURIComponent('http://10.0.2.2:8081'),
    });
    await waitForPostsList();
  });

  describe('Unauthenticated', () => {
    beforeEach(async () => {
      await device.reloadReactNative();
      await waitForPostsList();
    });

    it('should display the posts list', async () => {
      await expect(element(by.id('posts-list'))).toBeVisible();
    });

    it('should show login and signup buttons', async () => {
      await expect(element(by.id('posts-login-button'))).toBeVisible();
      await expect(element(by.id('posts-signup-button'))).toBeVisible();
    });

    it('should not show new post or logout buttons', async () => {
      await expect(element(by.id('posts-new-button'))).not.toBeVisible();
      await expect(element(by.id('posts-logout-button'))).not.toBeVisible();
    });

    it('should filter posts using search', async () => {
      await element(by.id('posts-search-input')).typeText('nonexistent_query_xyz');
      await waitFor(element(by.id('posts-empty')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should clear search and show posts again', async () => {
      await element(by.id('posts-search-input')).typeText('nonexistent_query_xyz');
      await waitFor(element(by.id('posts-empty')))
        .toBeVisible()
        .withTimeout(5000);

      await element(by.id('posts-search-input')).clearText();
      await waitFor(element(by.id('posts-list')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should navigate to login when tapping login button', async () => {
      await element(by.id('posts-login-button')).tap();
      await waitFor(element(by.id('login-email-input')))
        .toBeVisible()
        .withTimeout(5000);
      await device.pressBack();
    });

    it('should navigate to signup when tapping signup button', async () => {
      await element(by.id('posts-signup-button')).tap();
      await waitFor(element(by.id('signup-firstname-input')))
        .toBeVisible()
        .withTimeout(10000);
    });
  });

  describe('Authenticated', () => {
    beforeAll(async () => {
      await device.reloadReactNative();
      await waitForPostsList();
      await loginWithTestAccount();
    });

    it('should show new post and logout buttons', async () => {
      await expect(element(by.id('posts-new-button'))).toBeVisible();
      await expect(element(by.id('posts-logout-button'))).toBeVisible();
    });

    it('should not show login and signup buttons', async () => {
      await expect(element(by.id('posts-login-button'))).not.toBeVisible();
      await expect(element(by.id('posts-signup-button'))).not.toBeVisible();
    });

    it('should navigate to create post when tapping new button', async () => {
      await element(by.id('posts-new-button')).tap();
      await waitFor(element(by.id('create-post-title-input')))
        .toBeVisible()
        .withTimeout(5000);
      await device.pressBack();
    });

    it('should navigate to post detail when tapping a post card', async () => {
      await waitForPostsList();
      const postCard = element(by.id('posts-post-card-container-0'));
      await waitFor(postCard).toBeVisible().withTimeout(5000);
      await postCard.tap();
      await waitFor(element(by.id('post-detail-title')))
        .toBeVisible()
        .withTimeout(5000);
      await device.pressBack();
    });
  });
});
