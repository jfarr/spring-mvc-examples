
/**
 * Serialize form fields into JSON
 **/

(function($){

  $.fn.serializeJSON = function(){
    var json = {}
    var form = $(this);
    form.find('input, select').each(function(){
      var val
      if (!this.name) return;

      if ('radio' === this.type) {
        if (json[this.name]) { return; }

        json[this.name] = this.checked ? this.value : '';
      } else if ('checkbox' === this.type) {
        val = json[this.name];

        if (!this.checked) {
          if (!val) { json[this.name] = ''; }
        } else {
          json[this.name] = 
            typeof val === 'string' ? [val, this.value] :
            $.isArray(val) ? $.merge(val, [this.value]) :
            this.value;
        }
      } else {
        json[this.name] = this.value;
      }
    })
    return json;
  }

})(jQuery)