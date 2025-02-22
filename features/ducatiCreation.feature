Feature: Custom Scrambler Ducati creation

  @smoke
  Scenario: User navigates to the Custom Scrambler Ducati creation page
    Given I am on the Ducati Scrambler website
    When I click "Start to Create"
    Then I should see the "Create Your Custom Scrambler Ducati" page

  @smoke
  Scenario: Generate images
    Given I am on the image creation page
    When I fill in the prompt and click "Generate"
    And I wait for the generation process to complete
    Then I should see the 4 generated images

  @e2e
  Scenario: Select and save an image with the correct resolution
    Given the 4 images have been generated and are visible
    When I fill in my details and accept the terms
    And I click “Submit”
    Then I should be able to choose one of the 4 images
    And the resolution of the saved file should be 2056 x 1368