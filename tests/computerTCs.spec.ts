import { test, expect } from '@playwright/test';
import computerData from './fixtures/data/computerData.json';

test.describe('Computer Database Tests', () => {

  test.beforeEach ("Navigate to computer page page", async({page}) => {
    await page.goto ("https://computer-database.gatling.io/computers");
})

  test('Verify page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'computers found' })).toContainText('computers found'); // to have titlle, to have title
  });

  test('Add new computer and verify success message', async ({ page }) => {
    await page.getByRole('link', { name: 'Add a new computer' }).click();
    await page.getByLabel('Computer name').click();
    await page.getByLabel('Computer name').fill('ASER');
    await page.getByLabel('Introduced').fill('2000-12-12');
    await page.getByLabel('Discontinued').fill('2007-12-03');
    await page.getByLabel('Company').selectOption('4');
    await page.getByRole('button', { name: 'Create this computer' }).click();
    await expect(page.getByText('Done ! Computer ASER has been')).toContainText('has been created'); // to have text, by title
  });


  test('Search for computers by name and verify result count', async ({ page }) => {
    const searchTerm = 'ACE';
    await page.locator('input#searchbox').fill(searchTerm);
    await page.locator('input#searchsubmit').click();
  
    //Verify the number of items in the table matches the count in the result message
    const resultMessage = await page.locator('#main h1').textContent();
    const itemCountFromMessage = parseInt(resultMessage?.match(/\d+/)?.[0] || '0', 10);
    const message = `The number of items found is: ${itemCountFromMessage}`;
    console.log(message);
    
    const computersTableLocator  = await page.locator('.computers.zebra-striped');
    const rows = await computersTableLocator.locator('tbody tr');
    const rowCount = await rows.count();
    console.log(rowCount);
  
    // Assertion
    expect(rowCount).toBe(itemCountFromMessage);
  });

  // data driven test
  computerData.forEach((data) => {
    test(`Add computer test: ${data.name}`, async ({ page }) => {
      await page.click('#add');
      await page.fill('#name', data.name);
      await page.fill('#introduced', data.introduced);
      await page.fill('#discontinued', data.discontinued);
      await page.selectOption('#company', { label: data.company });
      await page.click('input[type="submit"]');

      // Verify success message
      const successMessage = await page.locator('.alert-message.warning').textContent();
      expect(successMessage).toContain(`${data.name} has been created`); // expectt ot contain
    });
  });

});

