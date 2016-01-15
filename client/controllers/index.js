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
