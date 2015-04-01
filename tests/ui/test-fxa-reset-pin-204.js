var pageUrls = [];

helpers.startCasper({
  useFxA: true,
  setUp: function(){
    helpers.fakeFxA();
    casper.on('url.changed', function(url) {
      pageUrls.push(url);
      helpers.fakeFxA();
      helpers.fakeStartTransaction();
      helpers.fakePinData({data: {pin: true}});
      helpers.fakeWaitPoll({type: 'start', statusData: 3});
    });
  },
  tearDown: function() {
    casper.removeAllListeners('url.changed');
  }
});

casper.test.begin('Reset pin returns 204, then onto wait for tx.', {
  test: function(test) {

    // On enter pin page click forgot pin link.
    casper.waitForUrl(helpers.url('enter-pin'), function() {
      test.assertDoesntExist('.terms', 'Terms are not visible on enter-pin');
      this.click('.forgot-pin a');
    });

    // Then continue...
    casper.waitForUrl(helpers.url('reset-start'), function() {
      helpers.fakeLogout();
      this.click('.button.cta');
    });

    casper.waitForUrl(helpers.url('reset-pin'), function() {
      // Make sure FxA was loaded with the force_auth parameter.
      var lastUrl = pageUrls.slice(-1)[0];
      test.assert(lastUrl.indexOf('action=force_auth') !== -1,
                  'Unexpected FxA URL: ' + lastUrl);

      // Setup 204 for a successful reset.
      helpers.fakePinData({data: {pin: true}, method: 'PATCH', statusCode: 204});

      test.assertVisible('.pinbox', 'Pin reset widget should be displayed');
      this.sendKeys('.pinbox', '1234');
      test.assertExists('.cta:enabled', 'Submit button is enabled');
      this.click('.cta');
      test.assertExists('.cta:disabled', 'Submit button is disabled at start of pin confirmation.');
      this.sendKeys('.pinbox', '1234');
      test.assertExists('.cta:enabled', 'Submit button is enabled');
      this.click('.cta');
    });

    casper.waitForUrl(helpers.url('wait-to-start'), function() {
      test.assertVisible('.progress');
    });

    casper.run(function() {
      test.done();
    });
  },
});
