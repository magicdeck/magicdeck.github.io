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
        that.css('z-index', 7);
        that.on('click', function () {
            that.css('transform', 'rotate(0deg) scale(1)');
            that.css('z-index', 0);
        });
    };
}

function callbackHoverOff(that)
{
    return function() {
        that.css('transform', 'rotate(0deg) scale(1)');
        that.css('z-index', 0);
    };
}

class CardView
{
    constructor()
    {
        this.dom = img();
    }
}


function Card(oracle, name, attrs, preview)
{
    let newattrs = Object.assign(attrs,
        {class: 'cardimg', src: oracle.getImageUrl(name)});
    let cardhtml = img(newattrs);
    cardhtml.addEventListener('mouseover', function(ev){preview.dom.src = cardhtml.src; });
    $(cardhtml).hover(
        callbackHoverOn($(cardhtml)),
        callbackHoverOff($(cardhtml))
    );
    return cardhtml;
}