export const DEFAULT_DATA = {
    context: 'You are automation tester.',
    task: 'Go to next site: ${currentUrl} and using WebdriverIO generate full page object model for all components and navigations.',
    example: {
        context: 'Example of what the result should look like, for site "https://the-internet.herokuapp.com/login" a result should look like the following example in javascript language:',
        expectedResoult: `import Page from './page.js'
        class FormPage extends Page {
            /**
             * define elements
             */
            get username () { return $('#username') }
            get password () { return $('#password') }
            get submitButton () { return $('#login button[type=submit]') }
            get flash () { return $('#flash') }
        
            /**
             * define or overwrite page methods
             */
            open () {
                return super.open('login')
            }
        
            async submit () {
                await this.submitButton.click()
            }
        }`
    },
    additionInformation: 'result should be filed without explanation, only: POM, Classes, Object and etc.'
};
