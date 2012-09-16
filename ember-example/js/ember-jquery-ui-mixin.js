// Based on Luke Melia È Using Ember.js with jQuery UI
// http://www.lukemelia.com/blog/archives/2012/03/10/using-ember-js-with-jquery-ui/

JQ = {};

JQ.Widget = Em.Mixin.create({
    
  didInsertElement: function() {
    var options = this._gatherOptions();
    this._gatherEvents(options);
    var ui = jQuery.ui[this.get('uiType')](options, this.get('element'));
    this.set('ui', ui);
  },

  willDestroyElement: function() {
    var ui = this.get('ui');
    if (ui) {
      var observers = this._observers;
      for (var prop in observers) {
        if (observers.hasOwnProperty(prop)) {
          this.removeObserver(prop, observers[prop]);
        }
      }
      ui._destroy();
    }
  },

  _gatherOptions: function() {
    var uiOptions = this.get('uiOptions'), options = {};
    uiOptions.forEach(function(key) {
      options[key] = this.get(key);
      var observer = function() {
        var value = this.get(key);
        this.get('ui')._setOption(key, value);
      };
      this.addObserver(key, observer);
      this._observers = this._observers || {};
      this._observers[key] = observer;
    }, this);
    return options;
  },

  _gatherEvents: function(options) {
    var uiEvents = this.get('uiEvents') || [], self = this;
    uiEvents.forEach(function(event) {
      var callback = self[event];
      if (callback) {
        options[event] = function(event, ui) { callback.call(self, event, ui); };
      }
    });
  }
});

JQ.Dialog = Ember.View.extend(JQ.Widget, {
    uiType: 'dialog',
    uiOptions: ['title','autoOpen','modal','width','height','resizable','buttons']
});

JQ.AutoComplete = Ember.TextField.extend(JQ.Widget, {
    uiType: 'autocomplete',
    uiOptions: ['disabled','autoFocus','delay','minLength','position','source'],
    uiEvents: ['select']
});

JQ.TextField = Ember.TextField.extend({
    classNames: 'text ui-widget-content ui-corner-all'
});

JQ.Button = Em.View.extend(JQ.Widget, {
    uiType: 'button',
    uiOptions: ['label', 'disabled'],
    tagName: 'button'
});
