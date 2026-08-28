import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const routes = [
  '/p/dashboard',
  '/p/calls/active',
  '/p/calls/history',
  '/p/recordings',
  '/p/missed-calls',
  '/p/reports',
  '/p/contacts',
  '/p/settings',
  '/p/account',
  '/p/design-system'
];

for (const route of routes) {
  test(`@a11y ${route} has a stable accessible shell`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState('networkidle');
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('h1')).toHaveCount(1);
    const dimensions = await page.evaluate(() => ({ width: window.innerWidth, scrollWidth: document.documentElement.scrollWidth }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.width);
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    const blocking = results.violations.filter((violation) => ['serious', 'critical'].includes(violation.impact));
    expect(blocking, blocking.map((violation) => `${violation.id}: ${violation.help}`).join('\n')).toEqual([]);
  });
}

for (const route of ['/p/dashboard', '/p/calls/history', '/p/settings', '/p/design-system']) {
  test(`@visual ${route} matches its release baseline`, async ({ page }) => {
    await page.goto(route);
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot(`${route.replaceAll('/', '-').replace(/^-/, '')}.png`, {
      fullPage: true,
      animations: 'disabled',
      caret: 'hide',
      maxDiffPixelRatio: 0.01
    });
  });
}
