var helpers = require('../helpers');
var selectedNetwork = '334:020';

helpers.startCasper({
  useFxA: true,
  setUp: function(){
    helpers.fakeFxA({super_powers: true});
    casper.on('url.changed', function () {
      helpers.fakeFxA({super_powers: true});
      helpers.fakeStartTransaction();
    });
  },
  tearDown: function() {
    casper.removeAllListeners('url.changed');
  }
});

casper.test.begin('simulated network selection is sticky', {
  test: function(test) {

    casper.waitForUrl(helpers.url('super-simulate'), function() {
      test.assertVisible('#network-simulation',
                         'network simulation dropdown is visible');
      helpers.selectOption('#network-simulation', selectedNetwork);
    });

    casper.then(function () {
      this.back();
      this.reload();
    });

    casper.waitForUrl(helpers.url('super-simulate'), function() {
      test.assertVisible('#network-simulation',
                         'network simulation dropdown is visible');
      var selected = casper.evaluate(function() {
        return $('#network-simulation option:selected').val();
      });
      test.assertEqual(selected, selectedNetwork);
    });

    casper.run(function() {
      test.done();
    });
  },
});
