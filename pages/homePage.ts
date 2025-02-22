import { expect, Page } from "@playwright/test";
import { CreateDucatiPage } from "./createDucatiPage";

export class HomePage {

    readonly page: Page;

    constructor(page: Page){
        this.page = page;
    }

    readonly elements = {
        buttons: {
            home: () => this.page.getByText('Home'),  // Reference to the 'Home' button
            create: (text: string) =>  this.page.locator('a[class="primary-button"]', {hasText: text}).first(), // Reference to the 'Start to create' button
        }
      };

    async gotoHomePage (){
        await this.page.goto('/', {waitUntil: 'domcontentloaded'})
    }

    async checkHomeButtonisSelected(expectedClass = /underline/) {
        await expect(this.elements.buttons.home()).toHaveClass(expectedClass);
      }

      async startToCreate(buttonName: string) {
         await this.elements.buttons.create(buttonName).click();
      }
    
}