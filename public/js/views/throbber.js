define([
  'log',
  'views/base'
], function(log, BaseView){

  'use strict';

  var console = log('view', 'throbber');
  var ThrobberView = BaseView.extend({

    el: '#progress',

    render: function(msg){
      console.log('rendering throbber: ' + msg);
      this.setTitle(msg || this.gettext('Loading'));
      this.renderTemplate('throbber.html', {msg: msg || this.gettext('Loading')});
      return this;
    }

  });

  return ThrobberView;

});
