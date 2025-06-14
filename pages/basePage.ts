import { Page, Locator } from '@playwright/test';

export class BasePage {
	protected page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	/**
	 * Navigates to the home page of the application.
	 *
	 * This method sets the browser viewport size to 1280x720, navigates to the root URL ('/'),
	 * waits for the page to fully load, and then verifies that the current URL matches
	 * 'demo.spreecommerce.org'.
	 *
	 * @returns {Promise<void>} A promise that resolves when the navigation and verification are complete.
	 */
	async openHomePage() {
		await this.page.setViewportSize({ width: 1280, height: 720 });
		await this.page.goto('/', { waitUntil: 'load' });
		await this.verifyUrl('demo.spreecommerce.org');
	}

	/**
	 * Verifies that the current page URL contains the specified substring.
	 * Throws an error if the current URL does not include the provided value.
	 *
	 * @param url - The substring to check for in the current page URL.
	 * @throws {Error} If the current URL does not include the specified substring.
	 */
	async verifyUrl(url: string) {
		const currentUrl = this.page.url();
		if (!currentUrl.includes(url)) {
			throw new Error(`❌ Failed to navigate to ${url} page`);
		}
	}

	/**
	 * Clicks on the specified locator after verifying its visibility.
	 *
	 * @param locator - The Locator object representing the element to interact with.
	 * @param selector - A string representing the selector used for logging or error messages.
	 * @returns A promise that resolves when the click action is completed.
	 */
	async clickByLocator(locator: Locator, selector: string) {
		await this.verifyLocatorIsVisible(locator, selector);
		await locator.click();
	}

	/**
	 * Fills the specified text into an input element identified by the given locator.
	 * 
	 * @param locator - The Playwright Locator representing the input element to fill.
	 * @param text - The text string to input into the element.
	 * @param selector - A string representation of the selector, used for verification and error reporting.
	 * @returns A promise that resolves when the input has been filled.
	 * @throws Will throw an error if the locator is not visible before filling.
	 */
	async fillByLocator(locator: Locator, text: string, selector: string): Promise<void> {
		await this.verifyLocatorIsVisible(locator, selector);
		await locator.fill(text);
	}

	/**
	 * Selects an option from a dropdown element identified by the given locator, using the option's label.
	 *
	 * @param locator - The Playwright Locator for the dropdown element.
	 * @param text - The visible label of the option to select.
	 * @param selector - A string selector used for verification purposes.
	 * @returns A promise that resolves when the option has been selected.
	 */
	async selectOptionByLocatorAndLabel(locator: Locator, text: string, selector: string) {
		await locator.waitFor({ state: 'visible' });
		await this.verifyLocatorIsVisible(locator, selector);
		await locator.selectOption({ label: text });
	}

	/**
	 * Verifies that the given locator is visible on the page.
	 *
	 * Waits for the locator to become visible, then checks its visibility.
	 * Throws an error with details if the locator is not visible.
	 *
	 * @param locator - The Playwright Locator to verify.
	 * @param selector - A string representing the selector, used for error reporting.
	 * @throws {Error} If the locator is not visible on the page.
	 */
	async verifyLocatorIsVisible(locator: Locator, selector: string): Promise<void> {
		await locator.waitFor({ state: 'visible' });
		try {
			await locator.isVisible();
		} catch (error) {
			throw new Error(`❌ ${selector} is not visible on the page. Error details: ${error} `);
		}
	}
}
