String.prototype.formatUnicorn = String.prototype.formatUnicorn ||
    function () {
        "use strict";
        var str = this.toString();
        if (arguments.length) {
            var t = typeof arguments[0];
            var key;
            var args = ("string" === t || "number" === t) ?
                Array.prototype.slice.call(arguments)
                : arguments[0];

            for (key in args) {
                str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
            }
        }

        return str;
    };


function count_string_in_string(pattern, str)
{
    var re = new RegExp(str, 'g');
    return count_re_in_string(pattern, re);
}

function count_re_in_string(pattern, re)
{
    var count = (pattern.match(re) || []).length;
    return count;
}