import { defineConfig } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
	testDir: './tests',
	/* Run tests in files in parallel */
	fullyParallel: true,
	/* Fail the build on CI if you accidentally left test.only in the source code. */
	forbidOnly: !!process.env.CI,
	/* Retry on CI only */
	retries: process.env.CI ? 2 : 0,
	/* Opt out of parallel tests on CI. */
	workers: process.env.CI ? 1 : undefined,
	/* Reporter to use. See https://playwright.dev/docs/test-reporters */
	reporter: 'html',
	timeout: 60 * 1000,
	/* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
	use: {
		baseURL: process.env.BASE_URL ?? 'https://demo.spreecommerce.org/',
		headless: process.env.HEADLESS !== 'false',
		ignoreHTTPSErrors: true,
		trace: 'retain-on-failure',
	},

	/* Configure projects for major browsers */
	projects: [
		{
			name: 'firefox',
			use: {
				browserName: 'firefox',
				viewport: null,
				launchOptions: {
					args: [],
				},
			},
		},
	],
});
