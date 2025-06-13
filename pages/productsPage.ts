import { Locator, Page } from '@playwright/test';
import { Header } from './header';
import { BasePage } from './basePage';
import { ProductType } from '../types/productType';

export class ProductsPage extends BasePage {
	private readonly header: Header;
	private readonly btnQuantity: Locator;
	private readonly btnSelectSize: Locator;
	private readonly btnProductVariantSize: Locator;
	private readonly btnAddToCart: Locator;
	private readonly btnCloseSidebar: Locator;

	constructor(page: Page) {
		super(page);
		this.header = new Header(page);
		this.btnQuantity = page.locator('#product-details-page').getByRole('button').nth(1);
		this.btnSelectSize = page.locator('#product-variant-picker').getByRole('button', { name: 'Please choose Size' });
		this.btnProductVariantSize = page.locator('#product-variant-picker label');
		this.btnAddToCart = page.getByRole('button', { name: 'Add To Cart' });
		this.btnCloseSidebar = page.getByRole('button', { name: 'Close sidebar' });
	}

	/**
	 * Adds a product to the cart by navigating to the product page, selecting the desired size and quantity,
	 * and performing the appropriate actions based on whether this is the last product to add.
	 *
	 * @param {ProductType} param0 - The product details.
	 * @param {string} param0.productName - The name of the product to add.
	 * @param {number} [param0.count=1] - The quantity of the product to add (default is 1).
	 * @param {string} [param0.size] - The size of the product to select (if applicable).
	 * @param {boolean} isLast - Indicates if this is the last product to add before proceeding to checkout.
	 * @returns {Promise<void>} Resolves when the product has been added and the appropriate navigation has occurred.
	 */
	async addProduct({ productName, count = 1, size }: ProductType, isLast: boolean): Promise<void> {
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
		await this.clickByLocator(this.btnAddToCart);

		if (!isLast) {
			// Click close sidebar
			await this.clickByLocator(this.btnCloseSidebar);
			// Click show all
			await this.header.clickShowAll();
			await this.page.waitForURL('**/products', { waitUntil: 'load' });
			await this.verifyUrl('products');
		} else {
			// Click check out
			await this.header.clickCheckOut();
			await this.page.waitForURL('**/address', { waitUntil: 'load' });
			await this.verifyUrl('address');
		}
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
		await this.clickByLocator(this.btnSelectSize);
		// Set size
		await this.clickByLocator(this.btnProductVariantSize.filter({ hasText: `${size}` }));
	}
}
