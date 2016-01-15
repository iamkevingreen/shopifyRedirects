if (Meteor.isClient) {
  Template.form.events({
    'submit form': function (template) {
      event.preventDefault();
      var file = document.getElementById('file').files[0];
          fr = new FileReader();
      var creds = {
            store: template.target.store.value,
            key: template.target.key.value,
            password: template.target.password.value,
          }
          fr.onload = function(e) {
            var json = JSON.parse(fr.result),
                redirects = json.redirects;
            Meteor.call("shopifyRedirects", redirects, creds, function(err) {
              if (err) {
                Bert.alert(err.reason, 'warning');
              } else {
                Bert.alert('Redirects Imported', 'success');
                template.target.store.value = '';
                template.target.key.value = '';
                template.target.password.value = '';
              }
            })
          }
          fr.readAsText(file);
    },
  });
}

if (Meteor.isServer) {


  /**
   * Shopify Client API
   */
  var Shopify = {}

  var API = Shopify.API = function ShopifyAPI(options) {

    this.config = {
      shop: options.shop,
      api_key: options.api_key || null,
      password: options.password || null,
      debug: options.debug || false
    }

    this.getCredentials = function() {
      return this.config;
    }

    this.getPrivateAppHeaders = function() {
      return this.config.api_key + ":" + this.config.password;
    }

    this.getBaseAPIURL = function() {
      var url = 'https://'+this.config.shop+'.myshopify.com/';
      return url;
    }
    this.getBaseAPIURLWithCredentials = function() {
      var url = 'https://'+this.config.api_key+':'+this.config.password+'@'+this.config.shop+'.myshopify.com/';
      return url;
    }

    /**
     * Shopify Request
     *
     * @param  {String}   method
     * @param  {String}   endpoint
     * @param  {Object}   options
     *  {
     *    content : ''    // string to use as the http request body
     *    data : { },     // JSON-able object to use as http request body. overwrites content
     *    params : '',    // URL params
     *    auth : '',      // basic auth in the form of username:password
     *    headers : '',   // dict of strings
     *    timeout : null, // timeout
     *  }
     *
     * @param  {Function} callback
     */
    this.request = function(method, endpoint, options, callback) {

      var method   = method || 'GET',
          endpoint = endpoint || '',
          options  = options || {};

          options.auth = this.getPrivateAppHeaders()

      // Checks
      // check(method, String)
      // check(endpoint, String)
      // check(options, Object)
      // check(callback, Function)

      var api_url = this.getBaseAPIURL()

      try {
        var result = HTTP.call(method, (api_url + endpoint), options )

        if (200 <= result.statusCode && result.statusCode <= 299) {
          return result.data;
        }
      } catch (e) {
        console.log(e);
        // network error
        return false;
      }
    }
  }



  Meteor.startup(function () {
    // code to run on server at startup
  });
  Meteor.methods({
    shopifyRedirects(redirects, creds) {
      let ShopifyAPI = new Shopify.API({
        shop: creds.store,
        api_key: creds.key,
        password: creds.password,
        debug: true
      });

      [].forEach.call(redirects, function(redirect, i) {
        let shopifyRedirect = ShopifyAPI.request('POST', 'admin/redirects.json', {
          data : {
            redirect : {
              path: redirect.path,
              target: redirect.target
            }
          }
        });
      });
    }
  });
}
