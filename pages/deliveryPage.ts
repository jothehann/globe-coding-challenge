import { Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';
import { UserType } from '../types/userType';
import { AddressType } from '../types/addressType';

export class DeliveryPage extends BasePage {
	private readonly btnSaveAndContinue: Locator;
	constructor(page: Page) {
		super(page);
		this.btnSaveAndContinue = page.getByRole('button', {
			name: 'Save and Continue',
		});
	}

	/**
	 * Verifies the delivery details displayed on the page for a given user and address.
	 *
	 * This method checks that the user's full name, email, and shipping address are visible on the page.
	 * After verification, it clicks the "Save and Continue" button and waits for navigation to the payment page,
	 * then verifies the URL.
	 *
	 * @param user - The user information containing first name, last name, and email.
	 * @param address - The address information containing the street address.
	 * @returns A promise that resolves when all verifications and navigation are complete.
	 */
	async verifyDeliveryDetails(user: UserType, address: AddressType) {
		// Verify name
		const name = `${user.firstName} ${user.lastName}`;
		const lblUserName = this.page.getByText(name, { exact: true });
		await this.verifyLocatorIsVisible(lblUserName, 'Name Label');
		// Verify email
		const lblEmail = this.page.getByText(user.email, { exact: true });
		await this.verifyLocatorIsVisible(lblEmail, 'Email Label');
		// Verify shipping address
		const lblShippingAddress = this.page.getByText(new RegExp(address.streetAddress, 'i'));
		await this.verifyLocatorIsVisible(lblShippingAddress, 'Shipping Address Label');
		// Click save and continue
		await this.clickByLocator(this.btnSaveAndContinue, 'Save and Continue Button');
		await this.page.waitForURL('**/payment', { waitUntil: 'load' });
		await this.verifyUrl('payment');
	}
}
