# Jupiter Recipe Extension

This is a Chrome extension that allows users to search products in the [Jupiter](jupiter.co) catalog and use said products to create recipes.

You can also load in a recipe from another site, such as [this recipe from Tasty](https://tasty.co/recipe/garlic-parmesan-chicken-poppers).

The extension was built with [React](https://reactjs.org/), [NodeJS](https://nodejs.org/en/), and the [Serverless framework](https://www.serverless.com/). User Authentication is handled using AWS Cognito, and all data is stored on DynamoDB (with the exception of product data, which comes from [Jupiter's GraphQL API](graphql.jupiter.co))

## Quick Start Guide

Clone this repository: `git clone https://github.com/ygaitonde/jupiter-recipe-extension`.

Add the extension to your browser, selecting the /client/dist folder (or /client/dist/manifest.json if using Firefox) when prompted.

Click [here](https://webkul.com/blog/how-to-install-the-unpacked-extension-in-chrome/) for more details on how to install local Chrome extensions and [here](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/) for how to do it on Firefox.

If you would like to play around with the app with a dummy account, use the below credentials:

- username: admin@example.com
- password: Passw0rd!

Please note: during the signup process you will have to pull up your confirmation code on another browser/device, as popup extensions close when you switch tabs/focus. If you close the extension while the app is waiting for a confirmation code you will have to register with a different email.

Also note: for the best user experience use this extension with your browser in fullscreen.

## Development

### Codebase Overview

```text
/client: the React frontend for the Chrome Extension
	/dist: generated by npm run build -- select this when loading your Chrome extension
	/public: icons for chrome extension, manifest.json required for extension, and index.html
	/script/build.sh: builds the react app so that it can be used by browsers as an extension
	/src: hosts the contents of the React app
    
/stack: backend built using NodeJS + the Serverless framework. Deployed live via AWS
	/libs: boilerplate that makes it easier to write Lambdas/use Dynamo
	/mocks: JSON files that can be used to test the Lambdas
	/resources/api-gateway-errors.yml: CORS related errors are one of the most common Serverless API errors, so we configure API Gateway to set the CORS headers in the case there is an HTTP error.
	/create.js: Lambda for creating a recipe
	/delete.js: Lambda for deleting a recipe
	/get.js: Lambda for getting a recipe
	/list.js: Lambda for listing all the recipes for a given user
	/update.js: Lambda for updating a recipe
	/serverless.yml: Define the service, AWS Lambda Functions, the events that trigger them and any AWS infrastructure resources they require
```

If you haven't already, complete the steps from the Quick Start Guide

To make changes on the frontend, navigate to `/client` and `npm install`.

After making any changes, be sure to run `npm run build` for your changes to be reflected in the local browser extension.

You can also use `npm start` to run the extension as a standard react app, hosted at `localhost:3000`. This is particularly useful for development because you don't need to build every time you want to see your changes.

To make changes to the backend, ensure that you have the Serverless framework installed: `npm install serverless -g`

To deploy whatever changes you make, you can run `sls deploy`. That being said, please don't deploy the backend yourself! Instead, submit a pull request with whatever changes you have made.

## Bonus Features

- The user can load in recipe from other site (this works best with recipes from [Tasty](https://tasty.co))
- The backend of the application is live via AWS API Gateway/Lambda
- Users can update the names of their recipes and delete their recipes
- Users can share their recipes via Facebook, Twitter, and Reddit
- The user authentication process includes an email confirmation code.

## Next Steps

- I would like to refactor NewRecipe.js so that the capability to search/add products to a recipe could be abstracted. This would allow for users to edit the contents of a recipe after they created it. In general, NewRecipe.js has grown into kind of a behemoth so some refactoring would definitely help.
- I would like to change my authentication setup such that users can view any recipe regardless of whether they are authenticated or not, while keeping the functionality that only authenticated users who created the recipe can make changes to their recipe.
- ~~It would be super cool if I could  parse through the ingredients for recipes on sites like [Tasty](tasty.co). This would allow users to paste in a link for the recipe they were viewing and all the relevant Jupiter products could automatically be added to the recipe!~~ **I ended up implementing this using the [Spoonacular API!](https://spoonacular.com/food-api)**

## Known Bugs

- If a user navigates away from the extension while they are supposed to be filling out the confirmation code, the extension will close and their user registration process will fail. This is an inherent problem to a chrome extension, but the issue is that if they try to sign up with the email they used when they closed the extension, they won't be able to register with it.
- If a user inputs an invalid url into the field on NewRecipe.js then the extension will break and needs to be reloaded.

## Questions

If you have any questions, feel free to shoot me a note: my email is gaitoyas20 at gmail dot com.
