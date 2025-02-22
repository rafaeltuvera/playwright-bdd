import { expect } from '@playwright/test';
import { CreateDucatiPage } from '../../pages/createDucatiPage';
import { Given, When, Then } from '../../fixtures/fixture';

let createDucatiPage: CreateDucatiPage

Given('I am on the Ducati Scrambler website', async ({homePage}) => {
     await homePage.checkHomeButtonisSelected();
  });
  
  When('I click {string}', async ({page, homePage}, buttonName) => {
    await homePage.startToCreate(buttonName);
    await expect(page).toHaveURL(/.*create/);  // validate that we have navigated to the create page
  });
  
  Then('I should see the {string} page', async ({page}, pageTitle) => {
    createDucatiPage = new CreateDucatiPage(page);
    const heading = createDucatiPage.elements.headings.createDucati(pageTitle);
    await expect(heading).toBeVisible();  // validate the correct page heading is visible
  });

Given('I am on the image creation page', async ({page, homePage, gotoCreateDucatiPage}) => {
    await gotoCreateDucatiPage.checkCreateButtonisSelected();
  });

  When('I fill in the prompt and click {string}', async ({gotoCreateDucatiPage}, buttonName: string) => {
    await gotoCreateDucatiPage.generateImage(buttonName);
  });

  When('I wait for the generation process to complete', async ({gotoCreateDucatiPage, page}) => {
    // wait for generation in progress
    await gotoCreateDucatiPage.elements.messages.generationInProgress().waitFor({ state: 'attached' });
    await expect(gotoCreateDucatiPage.elements.messages.generationInProgress()).toBeVisible();

    // wait for the generated images heading to appear
    await gotoCreateDucatiPage.elements.headings.generatedImages().waitFor({ state: 'attached' });
  });

  Then('I should see the {int} generated images', async ({gotoCreateDucatiPage ,page}, numOfImages: number) => {
    const images = gotoCreateDucatiPage.elements.generatedImages.images();
    await expect(images).toHaveCount(numOfImages);  // validate the number of generated images
    });

Given('the {int} images have been generated and are visible', async ({homePage, generateImagePage}, numOfImages: number) => {
  await generateImagePage.elements.headings.generatedImages().waitFor({ state: 'attached' });
  const images = generateImagePage.elements.generatedImages.images();
  await expect(images).toHaveCount(numOfImages);
  await generateImagePage.validateAllImagesAreVisible();  // validate all images are visible
  });

  When('I fill in my details and accept the terms' , async ({generateImagePage}) =>{
    await generateImagePage.fillForm();
  });

  When('I click “Submit”', async ({ generateImagePage}) => {
   await generateImagePage.clickSubmit();
  });

  Then('I should be able to choose one of the {int} images', async ({generateImagePage}, numOfImages: number) => {
    await generateImagePage.selectGeneratedImage(numOfImages);
    await generateImagePage.clickNext();
  });

  Then('the resolution of the saved file should be {int} x {int}', async ({generateImagePage}, width: number, height: number) => {
      await generateImagePage.downloadImage(width, height);
  });