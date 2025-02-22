import { expect, Page } from "@playwright/test";
import {faker} from '@faker-js/faker';
import fs from 'fs';
import sharp from 'sharp';
import path from 'path';

export class CreateDucatiPage {

    readonly page: Page;

    constructor(page: Page){
        this.page = page;
    }

      readonly elements = {
        // common locators for buttons
        buttons: {
          create: () => this.page.locator('[href$="create"]'),
          generate: (text: string) => this.page.locator('.secondary-button', { hasText: text }).first(),
          next: () => this.page.getByRole('button', { name: 'Next' }),
          download: () => this.page.getByRole('button', { name: 'DOWNLOAD' }),
        },
      
        // page headings and descriptions
        headings: {
          createDucati: (heading: string) => this.page.locator('h1').filter({ hasText: heading }).first(),
          generatedImages: () => this.page.locator('[class="xl:hidden"] > h1', { hasText: 'PICK YOUR FAVOURITE GENERATIONS' }),
        },
      
        // dynamic messages
        messages: {
          generationInProgress: () => this.page.locator('h2', { hasText: 'Your Generation is in progress. It may take up to a minute.' }).first(),
        },
      
        // generated images
        generatedImages: {
          images: () => this.page.locator('[class*="md:grid"] img[alt="generated image"]'),
        },
      
        // form section (with input fields)
        form: {
          container: () => this.page.locator('form').first(),
          fields: {
            firstName: () => this.elements.form.container().locator('[name="firstName"]'),
            lastName: () => this.elements.form.container().locator('[name="lastName"]'),
            email: () => this.elements.form.container().locator('[name="email"]'),
            countrySelect: () => this.elements.form.container().locator('[aria-label="Select Country"]'),
            countryList: () => this.elements.form.container().locator('[name="country"]'),
            automatedDecisionMaking: () => this.elements.form.container().locator('[role="checkbox"][aria-required="true"]'),
          },
          buttons: {
            submit: () => this.elements.form.container().getByRole('button', { name: 'Submit' }),
          }
        },
      
        // description input
        descriptionInput: 'Scrambler Ducati [Insert your description here]'
      };
      
      
      async goto (){
        await this.page.goto('/create', {waitUntil: 'domcontentloaded'})
      }


      async checkCreateButtonisSelected(expectedClass = /underline/) {
        await expect(this.elements.buttons.create()).toHaveClass(expectedClass);
      }

       /**
       * @param {string} buttonName - The name of the 'generate' button to be clicked.
       */
      async generateImage (buttonName: string){
        await this.page.getByRole('textbox', {name: this.elements.descriptionInput}).fill(`${faker.vehicle.manufacturer()} collab`);
        await this.elements.buttons.generate(buttonName).click()
      }

      // validate generated images are visible
      async validateAllImagesAreVisible() {
        let images = this.elements.generatedImages.images();
        for (const [index ,image] of (await images.all()).entries() ){
          try {
            await image.waitFor({state: 'visible'})
          } catch (error){
            console.error(`Image ${index + 1} not visible`);
            throw error;
          }
        }
      }

      async fillForm(){
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        const email = `${firstName}.${lastName}@testmail.com`;
        const country = faker.location.country();

        await this.elements.form.fields.firstName().fill(firstName);
        await this.elements.form.fields.lastName().fill(lastName);
        await this.elements.form.fields.email().fill(email);
        await this.elements.form.fields.countrySelect().click();
        // get available country options
        const countryOptions = await this.elements.form.fields.countryList().allTextContents();
        // check if country is in the list
        await this.elements.form.fields.countryList().selectOption(countryOptions.includes(country) ? country : 'Australia');
        await this.page.mouse.click(0, 0); // click away
        await this.elements.form.fields.automatedDecisionMaking().click();
      }

      async clickSubmit() {
        await this.elements.form.buttons.submit().click();
      }

      async selectGeneratedImage(numOfImages: number){
        const randomNumber = Math.floor(Math.random() * numOfImages);
        await this.elements.generatedImages.images().nth(randomNumber).click()
        await expect(this.elements.generatedImages.images().nth(randomNumber).locator('+ div div')).toHaveClass(/bg-primary/); // validate image is selected
      }

      async clickNext(){
        await this.elements.buttons.next().waitFor({state: 'attached'})
        await this.elements.buttons.next().click();
      }

      async downloadImage(width: number, height: number){
        const downloadPath = path.join(__dirname, '../downloads/');
        const downloadPromise = this.page.waitForEvent('download');
        await this.elements.buttons.download().click()
        const download = await downloadPromise;
        const fileName = download.suggestedFilename();
        // wait for the download process to complete and save the downloaded file somewhere.
        await download.saveAs(downloadPath + fileName);

        // wheck if the file exists
        expect(fs.existsSync(downloadPath)).toBeTruthy();

        // wse sharp to check the resolution of the image
        const image = sharp(downloadPath);
        const metadata = await sharp(`${downloadPath}/${fileName}`).metadata();

        // validate resolution is 2056 x 1368
        expect(metadata.width).toBe(width);
        expect(metadata.height).toBe(height);

        // delete the downloaded image after validation
       fs.unlinkSync(`${downloadPath}/${fileName}`); 
      }
}