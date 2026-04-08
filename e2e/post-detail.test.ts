import { by, device, element, expect, waitFor } from 'detox';
import { loginWithTestAccount, waitForPostsList } from './helpers/actions';

describe('Post Detail', () => {
  beforeAll(async () => {
    await device.launchApp({
      delete: true,
      newInstance: true,
      url: 'thinkeasy://expo-development-client/?url=' + encodeURIComponent('http://10.0.2.2:8081'),
    });
    await waitForPostsList();
  });

  async function openFirstPost() {
    const postCard = element(by.id('posts-post-card-container-0'));
    await postCard.tap();
    await waitFor(element(by.id('post-detail-title')))
      .toBeVisible()
      .withTimeout(5000);
  }

  describe('Unauthenticated', () => {
    beforeEach(async () => {
      await device.reloadReactNative();
      await waitForPostsList();
    });

    it('should display post title and content', async () => {
      await openFirstPost();

      await expect(element(by.id('post-detail-title'))).toBeVisible();
      await expect(element(by.id('post-detail-content'))).toBeVisible();
    });

    it('should display post status badge', async () => {
      await openFirstPost();

      await expect(element(by.id('post-detail-status'))).toBeVisible();
    });

    it('should display author link', async () => {
      await openFirstPost();

      await expect(element(by.id('post-detail-author-link'))).toBeVisible();
    });

    it('should navigate to login when tapping author link while unauthenticated', async () => {
      await openFirstPost();
      await element(by.id('post-detail-author-link')).tap();

      await waitFor(element(by.id('login-email-input')))
        .toBeVisible()
        .withTimeout(5000);
    });

    it('should navigate back to posts list', async () => {
      await openFirstPost();
      await device.pressBack();

      await waitForPostsList();
    });
  });

  describe('Authenticated', () => {
    beforeAll(async () => {
      await device.reloadReactNative();
      await waitForPostsList();
      await loginWithTestAccount();
    });

    it('should navigate to user posts when tapping author link', async () => {
      await openFirstPost();
      await element(by.id('post-detail-author-link')).tap();

      await waitFor(element(by.id('user-posts-list')).atIndex(0))
        .toBeVisible()
        .withTimeout(10000);
      await expect(element(by.id('user-posts-user-id'))).toBeVisible();

      await device.pressBack();
      await device.pressBack();
    });
  });
});
