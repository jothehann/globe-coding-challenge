import { Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';

export class HomePage extends BasePage {
	private readonly lblSignUpSuccessfully: Locator;

	constructor(page: Page) {
		super(page);
		this.lblSignUpSuccessfully = page.getByText('Welcome! You have signed up');
	}

	/**
	 * Verifies that the sign-up success message is visible on the page.
	 *
	 * This method waits for the locator associated with the sign-up success message
	 * (`txtSignUpSuccessfully`) to become visible, indicating that the sign-up process
	 * has completed successfully.
	 *
	 * @returns {Promise<void>} A promise that resolves when the verification is complete.
	 */
	async verifySignUpSuccessfully(): Promise<void> {
		await this.verifyLocatorIsVisible(this.lblSignUpSuccessfully, 'Sign Up Successfully Label');
	}
}
