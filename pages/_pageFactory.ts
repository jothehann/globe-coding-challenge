import { Page } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { LoginMenu } from '../pages/loginMenu';
import { Header } from '../pages/header';
import { AddressPage } from '../pages/addressPage';
import { ProductsPage } from '../pages/productsPage';
import { DeliveryPage} from '../pages/deliveryPage';
import { PaymentPage } from '../pages/paymentPage';
import { StatusPage } from './statusPage';

export class PageFactory {
    homePage: HomePage;
    loginMenu: LoginMenu;
    header: Header;
    addressPage: AddressPage;
    productsPage: ProductsPage;
    deliveryPage: DeliveryPage;
    paymentPage: PaymentPage;
    statusPage: StatusPage;

    constructor(page: Page) {
        this.homePage = new HomePage(page);
        this.loginMenu = new LoginMenu(page);
        this.header = new Header(page);
        this.addressPage = new AddressPage(page);
        this.productsPage = new ProductsPage(page);
        this.deliveryPage = new DeliveryPage(page);
        this.paymentPage = new PaymentPage(page);
        this.statusPage = new StatusPage(page);
    }
}
