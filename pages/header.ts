import { Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';

export class Header extends BasePage {
	private readonly btnProfileIcon: Locator;
	private readonly btnShowAll: Locator;
	private readonly btnViewBag: Locator;
	private readonly btnCheckOut: Locator;

	constructor(page: Page) {
		super(page);
		this.btnProfileIcon = page.getByRole('navigation', { name: 'Top' }).getByRole('button').nth(2);
		this.btnShowAll = page.getByLabel('Top').getByRole('link', { name: 'Shop All' });
		this.btnViewBag = page.getByRole('link', {
			name: 'Items in cart, View bag',
		});
		this.btnCheckOut = page.getByRole('link', { name: 'Checkout' });
	}

	/**
	 * Clicks the profile icon button on the page.
	 *
	 * This method triggers a click event on the profile icon element,
	 * typically used to open the user profile menu or related actions.
	 *
	 * @returns A promise that resolves when the click action is completed.
	 */
	async clickProfileIcon(): Promise<void> {
		await this.clickByLocator(this.btnProfileIcon);
	}

	/**
	 * Clicks the "Show All" button, waits for the page to navigate to the products URL,
	 * and verifies that the current URL contains 'products'.
	 *
	 * @returns {Promise<void>} A promise that resolves when the action is complete.
	 */
	async clickShowAll(): Promise<void> {
		await this.clickByLocator(this.btnShowAll);
		await this.page.waitForURL('**/products', { waitUntil: 'load' });
		await this.verifyUrl('products');
	}

	/**
	 * Clicks the "View Bag" button on the page.
	 *
	 * This method triggers a click event on the element identified by `btnViewBag`.
	 * It is asynchronous and waits for the click action to complete.
	 *
	 * @returns {Promise<void>} A promise that resolves when the click action is finished.
	 */
	async clickViewBag(): Promise<void> {
		await this.clickByLocator(this.btnViewBag);
	}

	/**
	 * Clicks the "Check Out" button on the page.
	 *
	 * This asynchronous method triggers a click event on the element identified by `btnCheckOut`.
	 * It is typically used to proceed to the checkout process in the application's UI.
	 *
	 * @returns {Promise<void>} A promise that resolves when the click action is completed.
	 */
	async clickCheckOut(): Promise<void> {
		await this.clickByLocator(this.btnCheckOut);
	}
}
