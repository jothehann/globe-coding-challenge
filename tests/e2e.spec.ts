import { test } from '@playwright/test';
import { readFileSync } from 'fs';
import { generateUser } from '../utils/generateData';
import { PageFactory } from '../pages/_pageFactory';

test('E2E Testing - SpreeCommerce Order', async ({ page }) => {
	const pages = new PageFactory(page);
	const productsData = JSON.parse(readFileSync('data/products.json', 'utf-8'));
	const addressData = JSON.parse(readFileSync('data/address.json', 'utf-8'));
	const paymentData = JSON.parse(readFileSync('data/payment.json', 'utf-8'));
	const user = generateUser();

	// Open Demo Spree Commerce Page
	await pages.homePage.openHomePage();

	// Click Profile Icon
	await pages.header.clickProfileIcon();

	// Sign up using generated user
	await pages.loginMenu.signUpNewUser(user.email);

	// Verify Signed up Message
	await pages.homePage.verifySignUpSuccessfully();

	// Click Show All
	await pages.header.clickShowAll();

	// Add To Cart
	let index = 0;
	for (const product of productsData) {
		const isLast = index === productsData.length - 1;
		await pages.productsPage.addProduct(product, isLast);
		index++;
	}

	// Input address details
	await pages.addressPage.inputAddressDetails(user, addressData);

	// Verify shipping details
	await pages.deliveryPage.verifyDeliveryDetails(user, addressData);

	// Input payment details
	await pages.paymentPage.inputPaymentDetails(paymentData);

	// Verify status page
	await pages.statusPage.verifyOrder(user);
});
