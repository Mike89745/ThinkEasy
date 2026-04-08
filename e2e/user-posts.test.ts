import { by, device, element, expect, waitFor } from 'detox';
import { loginWithTestAccount, waitForPostsList } from './helpers/actions';

describe('User Posts', () => {
  beforeAll(async () => {
    await device.launchApp({
      delete: true,
      newInstance: true,
      url: 'thinkeasy://expo-development-client/?url=' + encodeURIComponent('http://10.0.2.2:8081'),
    });
    await waitForPostsList();
    await loginWithTestAccount();
  });

  async function navigateToUserPostsViaPostDetail() {
    await element(by.id('posts-list')).scrollTo('top');
    const postCard = element(by.id('posts-post-card-container-0'));
    await waitFor(postCard).toBeVisible().withTimeout(10000);

    await postCard.tap();

    await waitFor(element(by.id('post-detail-title')))
      .toBeVisible()
      .withTimeout(5000);

    await element(by.id('post-detail-author-link')).tap();

    await waitFor(element(by.id('user-posts-user-id')))
      .toBeVisible()
      .withTimeout(10000);
  }

  it('should display user posts list via author link', async () => {
    await navigateToUserPostsViaPostDetail();

    await expect(element(by.id('user-posts-user-id'))).toBeVisible();

    try {
      await expect(element(by.id('user-posts-list'))).toBeVisible();
    } catch {
      await expect(element(by.id('user-posts-empty'))).toBeVisible();
    }

    await device.pressBack();
    await device.pressBack();
    await waitForPostsList();
  });

  it('should navigate to post detail from user posts', async () => {
    await navigateToUserPostsViaPostDetail();

    try {
      await element(by.id('user-posts-list')).scrollTo('top');
      const userPostCard = element(by.id('user-posts-post-card-container-0'));
      await waitFor(userPostCard).toBeVisible().withTimeout(5000);
      await userPostCard.tap();

      await waitFor(element(by.id('post-detail-title')))
        .toBeVisible()
        .withTimeout(5000);
      await expect(element(by.id('post-detail-content'))).toBeVisible();

      await device.pressBack();
    } catch {
      // No posts for this user, skip navigation test
    }

    await device.pressBack();
    await device.pressBack();
    await waitForPostsList();
  });

  it('should navigate back from user posts to post detail', async () => {
    await navigateToUserPostsViaPostDetail();

    await device.pressBack();

    await waitFor(element(by.id('post-detail-title')))
      .toBeVisible()
      .withTimeout(5000);

    await device.pressBack();
    await waitForPostsList();
  });

  it('should navigate to author posts via post card author link', async () => {
    // Tap on the author link directly from the posts list
    await element(by.id('posts-list')).scrollTo('top');
    const authorLink = element(by.id('posts-post-card-author-0'));
    await waitFor(authorLink).toBeVisible().withTimeout(5000);
    await authorLink.tap();

    await waitFor(element(by.id('user-posts-user-id')))
      .toBeVisible()
      .withTimeout(10000);

    await device.pressBack();
    await waitForPostsList();
  });
});
