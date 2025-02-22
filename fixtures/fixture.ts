import { test as base, createBdd } from 'playwright-bdd';
import { HomePage } from '../pages/homePage';
import { CreateDucatiPage } from '../pages/createDucatiPage';

type MyFixtures = {
  homePage: HomePage;
  gotoCreateDucatiPage: CreateDucatiPage;
  generateImagePage: CreateDucatiPage;
};

export const test = base.extend<MyFixtures>({
  homePage: async ({ page }, use) => {
    const homepage = new HomePage(page);
    await homepage.gotoHomePage();
    await page.getByRole('button', { name: 'Accept All Cookies' }).click();
    await use(homepage);
  },

  gotoCreateDucatiPage: async ({ page }, use) => {
    const createDucatiPage = new CreateDucatiPage(page);
    await createDucatiPage.goto();
    await use(createDucatiPage);
  },

  generateImagePage: async ({ page }, use) => {
    const createDucatiPage = new CreateDucatiPage(page);
    await createDucatiPage.goto();
    await createDucatiPage.generateImage('Generate');
    
    // wait for the image generation process
    await createDucatiPage.elements.messages.generationInProgress().waitFor({ state: 'attached' });

    // validate all generated images are visible
    await createDucatiPage.validateAllImagesAreVisible();

    // use the createDucatiPage fixture after the setup
    await use(createDucatiPage);
  },
});


export const { Given, When, Then } = createBdd(test); // <- export Given, When, Then
