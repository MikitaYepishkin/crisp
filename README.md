# CRISP overview

CRISP is an open-source Chrome extension which helps to select web elements on the page, automatically populate its selectors, assign configured actions and generate ready test code based on the customized patterns. It can speed up the process of test development by replacing manual time-consuming operations with automated features.
<br>
### CRISP configured to use [WebdriverIO Cucumber Boilerplate](https://github.com/webdriverio/cucumber-boilerplate#cucumber-boilerplate) project by default.
1. follow the [quick start](https://github.com/webdriverio/cucumber-boilerplate#quick-start) guide to setup the project
1. install and use CRISP to generate test steps
1. add them to [new scenario](https://github.com/webdriverio/cucumber-boilerplate#how-to-write-a-test) in Boilerplate project
1. [run](https://github.com/webdriverio/cucumber-boilerplate#how-to-run-the-test) the test

![](./docs/overview.gif)
## Installation

```
$ npm install
```

## Usage

Run `$ npm start` and load the `dist`-directory into chrome.
_______
## How to get started

To start using CRISP:
1. Launch Chrome browser.
2. Open Developer tools:
- Click “Customize and control Google Chrome” (3-dots icon)  at the status bar -> Select “More Tools” -> select “Developer Tools”;
- Or press Ctrl+Shift+I;
- Or press F12 key.
3. Open “Elements” tab.
4. Open "CRISP" sub-tab on the same level with the "Styles" sub-tab.
5. Click [+] icon to open “Add element” screen.
6. Launch the “Inspect” tool and select the necessary element at the page. 
<br>_(As a result, CRISP will populate found locators of the element into the related fields “ID”, “CSS”, “xPath”_).
7. Select the necessary test “Actions\Verifications” for this element.
<br>_(e.g. “`click`” or “`expect element is displayed`”)_
8. Click [Save] button.
9. Open “Test Actions\Verifications” tab in the bottom.
10. Click “Generate for page” button and see results.
11. Copy & Paste the generated test steps into new scenario in WebdriverIO Cucumber Boilerplate project and run it


## Tips & Tricks
- Use ![](./app/images/sign-in.svg) to generate test steps sequentially for different elements and create comprehensive E2E scenarios.
- [Create new pages](./docs/crisp-help.md#saved-pages) to store elements.
- Customize and define your own steps and patterns in the “Settings” -> [“Framework”](./docs/crisp-help.md#framework)

For more details please refer to the [CRISP manual](./docs/crisp-help.md).
_______

## Entryfiles (bundles)

There are two kinds of entryfiles that create bundles.

1. All ts-files in the root of the `./app/scripts` directory
2. All css-,scss- and less-files in the root of the `./app/styles` directory

_______
## Upcoming features

1. UI/UX redesign
2. Highlight elements
3. Verify locators of elements
4. User actions history
5. Presets for actions/verifications
6. User-friendly merge conflict resolution during Import/Pull/Push