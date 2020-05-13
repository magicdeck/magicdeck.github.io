var scale = 1.1;

function rescale(that) {
        if (that.hasClass('split')) {
            that.css('transform', 'rotate(90deg) scale(' + (scale) + ')');
        } else if (that.hasClass('aftermath')) {
            that.css('transform', 'rotate(-90deg) scale(' + (scale) + ')');
        } else {
            that.css('transform', 'scale(' + (scale) + ')');
        }
}

function callbackHoverOn(that)
{
    return function() {
        rescale(that);
        that.css('z-index', 666);
        that.on('click', function () {
            that.css('transform', 'rotate(0deg) scale(1)');
            that.css('z-index', that.attr('z-index'));
        });
    };
}

function callbackHoverOff(that)
{
    return function() {
        that.css('transform', 'rotate(0deg) scale(1)');
        that.css('z-index', that.attr('z-index'));
    };
}

class CardView
{
    constructor(fuzzy, cardjson, attrs, preview)
    {
        this.shift = 1;
        let newattrs = Object.assign(attrs, {class: 'cardimg', src: fuzzy.get200(cardjson.multiverseId)});

        this.cardjson = cardjson;
        this.cardhtml = img(newattrs);
        this.name = cardjson.name;
        let that = this;
        that.shift = 0;
        $(this.cardhtml).addClass(this.cardjson.layout);
        this.cardhtml.setAttribute('z-index', attrs['zindex']);
        $(this.cardhtml).css('transition-duration', '0.15s');
        $(this.cardhtml).css('overflow', 'hidden');
        this.cardhtml.addEventListener('mouseover', function(){ preview.update(cardjson); });
        this.cardhtml.addEventListener('contextmenu', function(e){
            e.preventDefault();
            that.cardjson = fuzzy.getJson(that.name, '', that.shift);
            that.shift = that.shift + 1;
            that.cardhtml.src = fuzzy.get200(that.cardjson.multiverseId);
            preview.update(that.cardjson);
            return false;
        });
        this.cardhtml.addEventListener('wheel', function(event) {
           event.preventDefault();
            scale += event.deltaY * -0.05;
            scale = Math.min(Math.max(1.05, scale), 4);
            rescale($(that.cardhtml));
        });
        $(that.cardhtml).hover(
            callbackHoverOn($(that.cardhtml)),
            callbackHoverOff($(that.cardhtml))
        );
    }

    getDom() {
        return this.cardhtml;
    }
}

