function callbackHoverOn(that)
{
    return function() {
        if (that.hasClass('split')) {
            that.css('transform', 'rotate(90deg) scale(' + (1.1) + ')');
        } else if (that.hasClass('aftermath')) {
            that.css('transform', 'rotate(-90deg) scale(' + (1.1) + ')');
        } else {
            that.css('transform', 'scale(' + (1.1) + ')');
        }
        that.css('z-index', 666);
        that.on('click', function () {
            that.css('transform', 'rotate(0deg) scale(1)');
            that.css('z-index', that.getAttribute('z-index'));
        });
    };
}

function callbackHoverOff(that)
{
    return function() {
        that.css('transform', 'rotate(0deg) scale(1)');
        that.css('z-index', that.getAttribute('z-index'));
    };
}

class CardView
{
    constructor()
    {
        this.dom = img();
    }
}


function Card(oracle, cardjson, attrs, preview)
{
    let newattrs = Object.assign(attrs,
        {class: 'cardimg', src: oracle.getImageUrl(cardjson.name, cardjson.set_code)});
    let cardhtml = img(newattrs);i
    cardhtml.setAttribute('z-index', attrs['zindex']);
    cardhtml.addEventListener('mouseover', function(ev){preview.dom.src = cardhtml.src; });
    $(cardhtml).hover(
        callbackHoverOn($(cardhtml)),
        callbackHoverOff($(cardhtml))
    );
    return cardhtml;
}
