/**
 * Created by adiog on 07.07.17.
 */

let mtgjson_url = '/mtgjson/';
let gatherer_url = 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=';
let gatherer_url_suffix = '&type=card';

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
    }

    getJson(name)
    {
        //console.log(this.dict);
        return this.dict[name.toLowerCase()];
    }

    getImageUrl(name)
    {
        let json = this.getJson(name.toLowerCase());
        let url = gatherer_url + json['multiverseid'] + gatherer_url_suffix;
        return url;
    }

    getBackImageUrl()
    {
        let url = gatherer_url + '0' + gatherer_url_suffix;
        return url;
    }
}
