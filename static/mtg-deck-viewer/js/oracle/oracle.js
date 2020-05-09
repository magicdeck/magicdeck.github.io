/**
 * Created by adiog on 07.07.17.
 */

var mtg_url = 'http://mtg-data-static.brainfuck.pl';
let mtgjson_url = 'http://mtg-card-viewer.brainfuck.pl/static/mtgjson/';
let gatherer_url = 'http://mtg-card-viewer.brainfuck.pl/api/v1/get/200/';

function get(url, successCallback, failureCallback = null, errorCallback = null)
{
    console.log(url);
    let request = new XMLHttpRequest();

    request.open("GET", url, true);

    request.onload = requestOnLoad(request, successCallback, failureCallback);

    request.onerror = requestOnError(errorCallback, failureCallback);

    request.withCredentials = true;

    request.send();
}

function processJSON(data, setjson) {
    for (let j = 0; j < setjson.cards.length; j++) {
        let card = setjson.cards[j];
        card.set = setjson.code.toUpperCase();
        if (typeof(card.colors) === "undefined") {
            card.colors = [];
        }
        data.push(card);
    }
}

function initializeData(data, sets) {
    for (let i = 0; i < sets.length; i++) {
        let url = mtgjson_url + sets[i].toUpperCase() + '.json';
        $.ajax({
            dataType : 'json',
            url : url,
            success : function(setjson) {processJSON(data, setjson); },
            async : false
        });
    }
}

function convertToDictionary(data)
{
    let dict = {};
    for(let i = 0; i < data.length; i++)
    {
        let json = data[i];
        let name = json['name'].toLowerCase();
        dict[name] = json;
    }
    return dict;
}

class Oracle
{
    constructor(sets)
    {
        this.data = [];
        initializeData(this.data, sets);
        this.dict = convertToDictionary(this.data);
        console.log(this.dict);
    }

    getFuzzyJson(name, hint)
    {
        $.ajax({
            dataType : 'json',
            url : url,
            success : function(setjson) {processJSON(data, setjson); },
            async : false
        });
        console.log(name.toLowerCase());
        return this.dict[name.toLowerCase()];
    }

    getJson(name)
    {
        console.log(name.toLowerCase());
        return this.dict[name.toLowerCase()];
    }

    getImageUrl(name)
    {
        let json = this.getJson(name.toLowerCase());
        let url = gatherer_url + json['multiverseId'];
        console.log(url);
        return get200(json['multiverseId']);
    }

    getBackImageUrl()
    {
        let url = this.get200(0);
        return url;
    }

    getBase(mid) {
      return Math.floor(mid / 1000) * 1000;
    }

    getMid(mid) {
        return mtg_url + '/mtg-cards-default/' + this.getBase(mid) + '/' + mid;
    }

    get200(mid) {
        return mtg_url + '/mtg-cards-480x680/' + this.getBase(mid) + '/' + mid;
    }

    get300(mid) {
        return mtg_url + '/mtg-cards-745x1040/' + this.getBase(mid) + '/' + mid;
    }

    getTokenImageUrl(res, jsonCard) {
      return 'http://mtg-card-viewer.brainfuck.pl/api/v1/get/tok/' + res + '/' + jsonCard['set_id'] + '/' + jsonCard['number'] + '/' + jsonCard['name'];
    }
}
