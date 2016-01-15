Shopify URL Redirect Importer
=======

*don't feel like running it locally? run it [online here](http://shopify_redirects.meteor.com)*

I didn't like any of the existing options and didn't want to install an app, or even install an app that requires continuous cost.

The purpose of this application is for the initial upload of shopify redirect links, in the case of transferring to shopify from another platform for the very first time for example.

---

The app requires [Meteor](http://meteor.com), which can be downloaded in your terminal via the following command:

`curl https://install.meteor.com/ | sh`

Once installed git pull the repo and navigate to the root, and run `meteor` in the root.

`cd ~/Sites/shopifyRedirects && meteor`

Navigate to `http://localhost:3000` and enter in your creds and json file with the all of your redirects.

## Enjoy


#### Sample json

`path` is the original url from the old system and `target` is the new shopify url:

```
{
  "redirects": [
    {
      "path": "/old-product",
      "target": "/products/new-product"
    },
    {
      "path": "/products/collections/tops",
      "target": "/collections/tops"
    }
  ]
}
```

#### Meteor Settings Route

You could also create a settings.json file with the api_key/password/store and have the meteor server call access that instead of having to type them in over and over again. ;d

```
{
  "shopify": {
    "api_key": "######",
    "password": "######",
    "store": "#######"
  }
}
```

Then in your `server.js` instead of referencing the input fields you can use:

`Meteor.settings.shopify.api_key`... ect.

When running meteor you would append the run command: `meteor --settings settings.json`
