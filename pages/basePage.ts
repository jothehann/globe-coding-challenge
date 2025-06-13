import { Page, Locator } from '@playwright/test';

export class BasePage {
	protected page: Page;

	constructor(page: Page) {
		this.page = page;
	}

	/**
	 * Navigates to the home page of the application and sets the browser viewport size to 1920x1080.
	 *
	 * @remarks
	 * This method first sets the viewport size to ensure consistent rendering across tests,
	 * then navigates to the root URL ('/').
	 *
	 * @returns A promise that resolves when the navigation and viewport adjustment are complete.
	 */
	async openHomePage() {
		await this.page.setViewportSize({ width: 1920, height: 1080 });
		await this.page.goto('/', { waitUntil: 'load' });
		await this.verifyUrl('demo.spreecommerce.org');
	}

	/**
	 * Verifies that the current page URL contains the specified substring.
	 *
	 * @param url - The substring to check for in the current page URL.
	 * @throws {Error} Throws an error if the current URL does not include the specified substring.
	 */
	async verifyUrl(url: string) {
		const currentUrl = this.page.url();
		if (!currentUrl.includes(url)) {
			throw new Error(`❌ Failed to navigate to ${url} page`);
		}
	}

	/**
	 * Waits for the specified locator to become visible and then performs a click action on it.
	 *
	 * @param locator - The Playwright Locator representing the element to be clicked.
	 * @returns A promise that resolves when the click action has been performed.
	 */
	async clickByLocator(locator: Locator) {
		await this.verifyLocatorIsVisible(locator);
		await locator.click();
	}

	/**
	 * Fills the specified text into an input element identified by the given locator.
	 * Waits for the locator to become visible before filling the text.
	 *
	 * @param locator - The Playwright Locator representing the input element to fill.
	 * @param text - The string value to be entered into the input element.
	 * @returns A promise that resolves when the text has been filled.
	 */
	async fillByLocator(locator: Locator, text: string) {
		await this.verifyLocatorIsVisible(locator);
		await locator.fill(text);
	}

	/**
	 * Selects an option from a dropdown or select element using a given locator and the visible label text.
	 *
	 * @param locator - The Playwright Locator pointing to the select element.
	 * @param text - The visible label of the option to select.
	 * @returns A promise that resolves when the option has been selected.
	 */
	async selectOptionByLocatorAndLabel(locator: Locator, text: string) {
		await locator.waitFor({ state: 'visible' });
		await this.verifyLocatorIsVisible(locator);
		await locator.selectOption({ label: text });
	}

	/**
	 * Verifies that the specified locator is visible on the page.
	 * Throws an error with a custom message if the locator is not visible.
	 *
	 * @param locator - The Playwright Locator to check for visibility.
	 * @param errorMessage - The custom error message to include if the locator is not visible.
	 * @throws {Error} Throws an error with details if the locator is not visible.
	 */
	async verifyLocatorIsVisible(locator: Locator): Promise<void> {
		await locator.waitFor({ state: 'visible' });
		if (!locator.isVisible()) {
			throw new Error(`❌ Locator "${locator}" is not visible`);
		}
	}
}
