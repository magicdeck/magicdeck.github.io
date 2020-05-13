var howtoPopupVisible = false;
var howtoPopup = document.createElement('div');

function buildHowToPopup() {
    howtoPopup.innerHTML =
        "<center>" +
        "<h3>General:</h3>" +
        "Deck is live-parsed from a text input and displayed in sections:<br/>" +
        "lands, creatures (by cmc), non-creatures spells (by cmc) and sideboard.<br/>" +
        "The order in a given group is preserved.<br/>" +
        "Additionally the current deck stats are displayed.<br/>" +
        "<h3>Local Storage:</h3>" +
        "All decks are stored only locally in browser local storage." +
        "<h3>Sets available:</h3>" +
        "AER, AKH, ELD, GK1, GK2, GRN, HOU, IKO, KLD, M19, M20, MH1, MPS, RIX, RNA, THB, UMA, WAR, XLN" +
        "<h3>Special elements:</h3>" +
        "<b>#SET</b> code in first line indicates default lookup set for all cards in deck<br/>" +
        "<b>#SIDE</b> typed literaly separates mainboard and sideboard" +
        "<h3>List element:</h3>" +
        "&lt;number of copies&gt; &lt;name&gt; [#SET]<br/>" +
        "&lt;number of copies&gt; &lt;name&gt; [#SET123] - maybe used to indicate basic land printing" +
        "<h3>On-card mouse actions:</h3>" +
        "[left click] disables zoom<br/>" +
        "<b>[right click] loop over different printings</b> (if available)<br/>" +
        "(warning: this effect is temporary - to choose printing permanently modify deck text manually)<br/>" +
        "[scroll wheel] change default zoom scale<br/><br/>" +
        "</center>";

    $(howtoPopup)
        .dialog({
            close: function () {
                howtoPopupVisible = false;
            }
        });
    $(howtoPopup).dialog('option', 'width', '700px');
    $(howtoPopup).dialog("open");
    if (howtoPopupVisible) {
        $(howtoPopup).dialog("open");
    } else {
        $(howtoPopup).dialog("close");
    }
    return howtoPopup;
}

function buildHowToButton() {
    var howtoButton = document.createElement('button');

    howtoButton.innerHTML = 'HowTo';
    howtoButton.addEventListener('click', function () {
        howtoPopupVisible = !howtoPopupVisible;
        if (howtoPopupVisible) {
            $(howtoPopup).dialog("open");
        } else {
            $(howtoPopup).dialog("close");
        }
    });
    $(howtoButton).button();

    return howtoButton;
}
