import { Locator, Page } from '@playwright/test';
import { Header } from './header';
import { BasePage } from './basePage';
import { ProductType } from '../types/productType';

export class ProductsPage extends BasePage {
	private readonly header: Header;
	private readonly btnQuantity: Locator;
	private readonly btnSelectSize: Locator;
	private readonly menuSelectSize: Locator;
	private readonly btnProductVariantSize: Locator;
	private readonly btnAddToCart: Locator;
	private readonly btnCloseSidebar: Locator;
	private readonly lblTotal: Locator;

	constructor(page: Page) {
		super(page);
		this.header = new Header(page);
		this.btnQuantity = page.locator('#product-details-page').getByRole('button').nth(1);
		this.btnSelectSize = page.locator('#product-variant-picker').getByRole('button', { name: 'Please choose Size' });
		this.menuSelectSize =page.locator('//div[@data-dropdown-target="menu"]');
		this.btnProductVariantSize = page.locator('#product-variant-picker label');
		this.btnAddToCart = page.getByRole('button', { name: 'Add To Cart' });
		this.btnCloseSidebar = page.getByRole('button', { name: 'Close sidebar' });
		this.lblTotal = page.locator('shopping-cart-total-amount')
	}

	/**
	 * Adds a product to the cart by navigating to the product page, selecting the desired size and quantity,
	 * and clicking the "Add To Cart" button. Returns the updated total for the specified product index.
	 *
	 * @param {ProductType} param0 - The product details.
	 * @param {string} param0.productName - The name of the product to add.
	 * @param {number} [param0.count=1] - The quantity of the product to add (default is 1).
	 * @param {string} [param0.size] - The size of the product to select (if applicable).
	 * @param {number} param0.prize - The price of the product.
	 * @param {number} index - The index of the product in the cart for which to get the total.
	 * @returns {Promise<number>} The updated total for the specified product index.
	 */
	async addProduct({ productName, count = 1, size, prize }: ProductType, index: number ): Promise<number> {
		// Click product
		await this.page.getByRole('link', { name: new RegExp(productName, 'i') }).click();
		const dashedProduct = productName.replace(/\s+/g, '-').toLowerCase();
		await this.page.waitForURL(`**/${dashedProduct}`, { waitUntil: 'load' });
		await this.verifyUrl(dashedProduct);

		// Select size
		if (size) {
			await this.selectSize(size);
		}
		// Click quantity if count > 1
		if (count > 1) {
			for (let i = 1; i < count; i++) {
				await this.btnQuantity.click();
			}
		}
		// Click add to cart
		await this.clickByLocator(this.btnAddToCart, 'Add To Cart Button');
		return await this.getTotal(index, prize);
	}

	/**
	 * Selects a product size by interacting with the size selection UI.
	 *
	 * This method first clicks the button to open the size selection dropdown or menu,
	 * then selects the specified size by clicking the corresponding size option.
	 *
	 * @param size - The size to select (as displayed in the UI).
	 * @returns A promise that resolves when the size has been selected.
	 */
	private async selectSize(size: string) {
		// Click select size
		await this.clickByLocator(this.btnSelectSize, 'Select Size Button');
		// // Verify selectSize menu
		await this.verifyLocatorIsVisible(this.menuSelectSize, 'Select Size Menu');
		await this.page.waitForTimeout(3000);
		// Set size
		await this.clickByLocator(this.btnProductVariantSize.filter({ hasText: `${size}` }), 'Size Button');
	}

	/**
	 * Handles the navigation flow based on whether the current item is the last in a sequence.
	 *
	 * - If `isLast` is `false`, closes the sidebar, clicks the "Show All" button in the header,
	 *   waits for the products page to load, and verifies the URL.
	 * - If `isLast` is `true`, verifies the total, clicks the "Check Out" button in the header,
	 *   waits for the address page to load, and verifies the URL.
	 *
	 * @param isLast - Indicates if the current item is the last in the sequence.
	 * @param total - The expected total value to verify when checking out.
	 * @returns A promise that resolves when the navigation and verification steps are complete.
	 */
	async showAllOrCheckOut(isLast: boolean, total: number) {
		if (!isLast) {
			// Click close sidebar
			await this.clickByLocator(this.btnCloseSidebar, 'Close Button');
			// Click show all
			await this.header.clickShowAll();
			await this.page.waitForURL('**/products', { waitUntil: 'load' });
			await this.verifyUrl('products');
		} else {
			// Verify total
			await this.verifyTotal(total)
			// Click check out
			await this.header.clickCheckOut();
			await this.page.waitForURL('**/address', { waitUntil: 'load' });
			await this.verifyUrl('address');
		}
	}

	/**
	 * Calculates the total price for a product line item based on its quantity and unit price.
	 *
	 * @param index - The zero-based index of the product line item. If greater than 0, selects the corresponding input field; otherwise, selects the first input field.
	 * @param prize - The unit price of the product.
	 * @returns A promise that resolves to the total price (quantity multiplied by unit price) for the specified line item.
	 */
	private async getTotal(index: number, prize: number): Promise<number> {
		let quantity: number;
		if(index > 0) {
			quantity = Number(await this.page.locator(`(//input[@name="line_item[quantity]"])[${index+1}]`).getAttribute('value'));
		} else {
			quantity = Number(await this.page.locator('//input[@name="line_item[quantity]"]').getAttribute('value'));
		}
		return quantity * prize
	}

	/**
	 * Verifies that the total amount displayed in the cart summary matches the expected value.
	 *
	 * @param total - The expected total amount to verify, as a number.
	 * @returns A promise that resolves when the verification is complete.
	 */
	private async verifyTotal(total: number) {
		await this.verifyLocatorIsVisible(this.page.locator('#cart_summary').getByText(`$${total}`), 'Total');
	}
}
