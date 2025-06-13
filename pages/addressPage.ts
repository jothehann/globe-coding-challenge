import { Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';
import { UserType } from '../types/userType';
import { AddressType } from '../types/addressType';

export class AddressPage extends BasePage {
	private readonly lblEmail: Locator;
	private readonly btnCountry: Locator;
	private readonly txtBoxFirstName: Locator;
	private readonly txtBoxLastName: Locator;
	private readonly txtBoxAddress: Locator;
	private readonly txtBoxCity: Locator;
	private readonly txtBoxPostalCode: Locator;
	private readonly btnSaveAndContinue: Locator;

	constructor(page: Page) {
		super(page);
		this.btnCountry = page.getByLabel('Country');
		this.txtBoxFirstName = page.getByRole('textbox', { name: 'First name' });
		this.txtBoxLastName = page.getByRole('textbox', { name: 'Last name' });
		this.txtBoxAddress = page.getByRole('textbox', {
			name: 'Street and house number',
		});
		this.txtBoxCity = page.getByRole('textbox', { name: 'City' });
		this.txtBoxPostalCode = page.getByRole('textbox', { name: 'Postal Code' });
		this.btnSaveAndContinue = page.getByRole('button', {
			name: 'Save and Continue',
		});
	}

	/**
	 * Fills in the address details form using the provided user and address information,
	 * verifies the email label is visible, selects the country, inputs all required fields,
	 * and proceeds to the next page by clicking "Save and Continue".
	 * Waits for the delivery page to load and verifies the URL.
	 *
	 * @param user - The user information containing email, first name, and last name.
	 * @param address - The address information including country, street address, city, and postal code.
	 * @returns A promise that resolves when the address details have been input and the next page is loaded.
	 */
	async inputAddressDetails(user: UserType, address: AddressType) {
		// Verify email
		const lblEmail = this.page.getByText(user.email);
		await this.verifyLocatorIsVisible(lblEmail);
		// Select country
		await this.selectOptionByLocatorAndLabel(this.btnCountry, address.country);
		// Input first name
		await this.fillByLocator(this.txtBoxFirstName, user.firstName);
		// Input last name
		await this.fillByLocator(this.txtBoxLastName, user.lastName);
		// Input street and house number
		await this.fillByLocator(this.txtBoxAddress, address.streetAddress);
		// Input city
		await this.fillByLocator(this.txtBoxCity, address.city);
		// Input postal
		await this.fillByLocator(this.txtBoxPostalCode, address.postal);
		// Click save and continue
		await this.clickByLocator(this.btnSaveAndContinue);
		await this.page.waitForURL('**/delivery', { waitUntil: 'load' });
		await this.verifyUrl('delivery');
	}
}
