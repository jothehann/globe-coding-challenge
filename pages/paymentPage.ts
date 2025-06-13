import { Locator, Page } from '@playwright/test';
import { BasePage } from './basePage';
import { PaymentType } from '../types/paymentType';

export class PaymentPage extends BasePage {
    private readonly txtBoxCardNumber: Locator;
    private readonly txtBoxExpirationDate: Locator;
    private readonly txtBoxSecurityCode: Locator;
    private readonly btnPayNow: Locator;

    constructor(page: Page) {
        super(page);
        this.txtBoxCardNumber = page.locator('#Field-numberInput');
        this.txtBoxExpirationDate = page.locator('#Field-expiryInput');
        this.txtBoxSecurityCode = page.locator('#Field-cvcInput');
        this.btnPayNow = page.getByRole('button', { name: 'Pay now' });
    }

    /**
     * Inputs payment details into the payment form embedded within a Stripe iframe and submits the payment.
     *
     * This method performs the following steps:
     * 1. Locates the Stripe payment iframe on the page.
     * 2. Verifies that the iframe is visible.
     * 3. Fills in the card number, expiration date, and security code fields within the iframe using the provided payment details.
     * 4. Clicks the "Pay Now" button to submit the payment.
     * 5. Waits for the navigation to the completion page and verifies the URL.
     *
     * @param payment - An object containing the payment details, including card number, expiration date, and security code.
     * @returns A promise that resolves when the payment process is complete.
     */
    async inputPaymentDetails(payment: PaymentType) {
        // Get iframe
        const iframeLocator = this.page.locator('iframe[name^="__privateStripeFrame"]').nth(0);
        // Verify iframe is visible
        await this.verifyLocatorIsVisible(iframeLocator);
        // Fill card number
        await this.fillByLocator(iframeLocator.contentFrame().locator(this.txtBoxCardNumber), payment.cardNumber);
        // Fill expiration date
        await this.fillByLocator(iframeLocator.contentFrame().locator(this.txtBoxExpirationDate), payment.expirationDate);
        // Fill security code
        await this.fillByLocator(iframeLocator.contentFrame().locator(this.txtBoxSecurityCode), payment.securityCode);
        // Click pay now
        await this.clickByLocator(this.btnPayNow);
        await this.page.waitForURL('**/complete', {waitUntil: 'load'});
        await this.verifyUrl('complete');
    }
}
