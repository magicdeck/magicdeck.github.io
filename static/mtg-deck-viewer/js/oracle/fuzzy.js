const fuzzy_json = '/static/mtg-deck-viewer/fuzzydict.json';
const GUARD = '#';
const image_url = '/static';

var key_value = {};
var big_key = GUARD;

function insert(key, sub, value) {
    key = key.toLowerCase();
    sub = sub.toLowerCase();
    if (key in key_value) {
        key_value[key][sub] = value;
    } else {
        key_value[key] = {sub: value};
        big_key = big_key + key + GUARD;
    }
}

function do_fuzzy_lookup(seed) {
    seed = seed.toLowerCase();
    position = big_key.indexOf(seed);
    if (position == -1) {
        return null;
    }
    index = position;
    let begin = index;
    while(big_key.charAt(begin) != GUARD) {
        begin -= 1;
        }
    begin += 1;
    let end = index;
    while(big_key.charAt(end) != GUARD) {
        end += 1;
    }
    return key_value[big_key.substr(begin, end - begin)];
}

function lookup(seed, hint) {
console.log(seed);
    seed = seed.toLowerCase();
    hint = hint.toLowerCase();
    if (seed in key_value) {
        sub_dict = key_value[seed];
    } else {
        sub_dict = do_fuzzy_lookup(seed);
    }
    if (sub_dict == null) {
       return null;
    }
    if (!(hint in sub_dict)) {
        return sub_dict[Object.keys(sub_dict)[0]];
    } else {
        return sub_dict[hint];
    }
}

function load_fuzzy(fuzzyjson) {
    key_value = fuzzyjson;
    //console.log(fuzzyjson);
    big_key = GUARD + Object.keys(key_value).join(GUARD) + GUARD;
    //console.log(big_key);
}


function initialize_fuzzy() {
    $.ajax({
        dataType : 'json',
        url : fuzzy_json,
        success : function(fuzzyjson) { load_fuzzy(fuzzyjson); },
        async : false
    });
}

class Fuzzy
{
    constructor()
    {
        initialize_fuzzy();
    }

    getBase(mid) {
      return Math.floor(mid / 1000) * 1000;
    }

    getMid(mid) {
        return 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=' + mid + '&type=card'
    }

    get200(mid) {
        return 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=' + mid + '&type=card'
    }

    get300(mid) {
        return 'http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=' + mid + '&type=card'
    }

    getTokenImageUrl(res, jsonCard) {
      return 'http://mtg-card-viewer.brainfuck.pl/api/v1/get/tok/' + res + '/' + jsonCard['set_id'] + '/' + jsonCard['number'] + '/' + jsonCard['name'];
    }

    getJson(name, hint)
    {
        return lookup(name, hint);
    }

    getImageUrl(name, hint)
    {
        let json = this.getJson(name, hint);
        let url = this.get200(json['multiverseId']);
        return url;
    }

    getBackImageUrl()
    {
        let url = this.get200(0);
        return url;
    }
}
