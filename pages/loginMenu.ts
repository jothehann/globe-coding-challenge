import { Locator, Page } from '@playwright/test';
import { NEW_USER_PASSWORD } from '../utils/constant';
import { BasePage } from './basePage';

export class LoginMenu extends BasePage {
	private readonly menuLogin: Locator;
	private readonly lblSignUp: Locator;
	private readonly lnkSignUp: Locator;
	private readonly txtBoxEmail: Locator;
	private readonly txtBoxPassword: Locator;
	private readonly txtBoxPasswordConfirmation: Locator;
	private readonly btnSignUp: Locator;

	constructor(page: Page) {
		super(page);
		this.menuLogin = page.locator('#slideover-account');
		this.lnkSignUp = page.getByRole('link', { name: 'Sign Up' });
		this.lblSignUp = page.getByRole('heading', { name: 'Sign Up' });
		this.txtBoxEmail = page.getByRole('textbox', {
			name: 'Email',
			exact: true,
		});
		this.txtBoxPassword = page.getByRole('textbox', {
			name: 'Password',
			exact: true,
		});
		this.txtBoxPasswordConfirmation = page.getByRole('textbox', {
			name: 'Password Confirmation',
		});
		this.btnSignUp = page.getByRole('button', { name: 'Sign Up' });
	}

	/**
	 * Signs up a new user by automating the sign-up process.
	 *
	 * This method performs the following steps:
	 * 1. Clicks the sign-up link.
	 * 2. Verifies that the sign-up label is visible.
	 * 3. Fills in the email field with the provided email address.
	 * 4. Fills in the password and password confirmation fields with a predefined password.
	 * 5. Clicks the sign-up button to submit the form.
	 *
	 * @param email - The email address to use for signing up the new user.
	 * @returns A promise that resolves when the sign-up process is complete.
	 */
	async signUpNewUser(email: string) {
		// Verify menu Login is visible
		await this.verifyLocatorIsVisible(this.menuLogin, 'Login Menu');
		// Click sign up link
		await this.clickByLocator(this.lnkSignUp, 'Sign Up Link');
		// Verify sign up label
		await this.verifyLocatorIsVisible(this.lblSignUp, 'Sign Up Label');
		// Fill email
		await this.fillByLocator(this.txtBoxEmail, email, 'Email Textbox');
		// Fill password
		await this.fillByLocator(this.txtBoxPassword, NEW_USER_PASSWORD, 'Password Textbox');
		// Fill password confirmation
		await this.fillByLocator(this.txtBoxPasswordConfirmation, NEW_USER_PASSWORD, 'Password Confirmation Textbox');
		// Click sign up button
		await this.clickByLocator(this.btnSignUp, 'Sign Up Button');
	}
}
