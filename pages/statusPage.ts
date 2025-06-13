import { Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';
import { UserType } from '../types/userType';

export class StatusPage extends BasePage {
	private readonly lblPaid: Locator;
	private readonly lblOrderIsConfirmed: Locator;

	constructor(page: Page) {
		super(page);
		this.lblOrderIsConfirmed = page.getByRole('heading', {
			name: 'Your order is confirmed!',
		});
		this.lblPaid = page.getByText('Paid');
	}

	/**
	 * Verifies the order confirmation page for a given user.
	 *
	 * This method performs the following checks:
	 * - Ensures the "Thanks" heading with the user's first name is visible.
	 * - Confirms the order confirmation label is visible.
	 * - Checks that the "Paid" status label is visible.
	 *
	 * @param user - The user object containing order and personal information.
	 * @returns A promise that resolves when all verifications are complete.
	 */
	async verifyOrder(user: UserType) {
		// Verify Thanks
		const lblThanks = this.page.getByRole('heading', {
			name: `Thanks ${user.firstName} for your order!`,
		});
		await this.verifyLocatorIsVisible(lblThanks);
		// Verify Order is confirmed
		await this.verifyLocatorIsVisible(this.lblOrderIsConfirmed);
		// Verify status paid
		await this.verifyLocatorIsVisible(this.lblPaid);
	}
}
