(function($) {

    if (!$.extend) {
        $.extend = function(target, options) {
            for (var name in options) {
                target[name] = options[name];
            }
            return target;
        };
    }

    if (!String.prototype.format) {
        String.prototype.format = function() {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function(match, number) {
                return typeof args[number] != 'undefined' ? args[number] : match;
            });
        };
    }

    //// 8 character ID (base=2)
    //uuid(8, 2)  //  "01001010"
    //// 8 character ID (base=10)
    //uuid(8, 10) // "47473046"
    //// 8 character ID (base=16)
    //uuid(8, 16) // "098F4D35"
    function uuid(len, radix) {
        var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        var uuid = [],
            i;
        radix = radix || chars.length;
        if (len) {
            // Compact form
            for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
        } else {
            // rfc4122, version 4 form
            var r;
            // rfc4122 requires these characters
            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';
            // Fill in random data.  At i==19 set the high bits of clock sequence as
            // per rfc4122, sec. 4.1.5
            for (i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    }

    function CreateID(prefix){
        if(!prefix) prefix = 'ID';
        return '{0}_{1}_{2}'.format(prefix, uuid(8, 16), Math.round( Math.random() * 100 ));
    }

    $.bind = {};

    $.bind.map = new Map();

    $.bind.formElement = function(element) {
        var bindId = CreateID();
        var data = { element: element };
        Object.defineProperty(data, "value", {
            get : function(){
                return this.element.value;
            },
            set : function(newValue){
                this.element.value = newValue;
            },
            enumerable : true,
            configurable : true
        });
        $(element)
            .attr('data-bind-id', bindId)
            .data('bindId', bindId)
            .change(function(e) {
                data.value = e.target.value;
            });
        $.bind.map.set(bindId, {element: element, data: data});
        return data;
    };

    $.bind.input = function(element) {
        return $.bind.formElement(element);
    };

    $.bind.createText = function(options) {
        var defaultOptions = {
            id: '',
            name: '',
            value: '',
            className: ''
        };
        var opts = $.extend(defaultOptions, options);
        var element = document.createElement('input');
        element.type = 'text';
        if (opts.id) element.id = opts.id;
        if (opts.name) element.name = opts.name;
        if (opts.className) element.className = opts.className;
        if (opts.value) element.value = opts.value;
        return $.bind.input(element);
    };

    $.bind.createTextArea = function(options) {
        var defaultOptions = {
            id: '',
            name: '',
            value: '',
            className: ''
        };
        var opts = $.extend(defaultOptions, options);
        var element = document.createElement('textarea');
        if (opts.id) element.id = opts.id;
        if (opts.name) element.name = opts.name;
        if (opts.className) element.className = opts.className;
        if (opts.value) element.value = opts.value;
        return $.bind.input(element);
    };

})(jQuery);