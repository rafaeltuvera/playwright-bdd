## Installation

1. **Clone the repository**:
     git clone https://github.com/rafaeltuvera/playwright-bdd.git
     cd playwright-bdd
2. **Install dependencies:**
    npm install 

    ### Scripts
        npm run test - runs all tests 
        npm run test:headed - runs all tests headed mode 
        npm run test:e2e - runs tests with e2e tag 
        npm run test:smoke - runs tets with smoke tag 
        npm run report - to show reports 
        
    ### Folder structure
    `pages` - All the pages (UI screen) \
    `features` - Add features here \
    `tests\steps` - Step definitions \
    `playwright-report` - test execution report \
    `fixture` - add fixtures here \
    `package.json` - Contains all the dependencies \
    `plawright.config.ts` - playwright and bdd config 
