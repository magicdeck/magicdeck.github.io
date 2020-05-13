function sanitizeDecklistText(decklist) {
    let maindeck_sideboard = {};

    decklist = decklist.replace('\s*#.*\n', '\n');
    decklist = decklist.replace('\s*\n\s*', '\n');
    decklist = decklist.replace('\n+', '\n');
    decklist = decklist.replace(' x ', ' ');

    if (decklist.indexOf('#SIDE') !== -1) {
        let decklist_sideboard = decklist.split('#SIDE');
        maindeck_sideboard['main'] = decklist_sideboard[0].split('\n');
        maindeck_sideboard['side'] = decklist_sideboard[1].split('\n');
    }
    else {
        maindeck_sideboard['main'] = decklist.split('\n');
        maindeck_sideboard['side'] = [];
    }

    return maindeck_sideboard;
}



class DeckParser {
    constructor(oracle, fuzzy) {
        this.oracle = oracle;
        this.fuzzy = fuzzy;
    }

    parse(deckText) {
        let decklist_split = sanitizeDecklistText(deckText);
        let maindeck = this.retrieve_cards(decklist_split['main']);
        let sideboard = this.retrieve_cards(decklist_split['side']);

        return new DeckModel(maindeck, sideboard);
    }

    retrieve_cards(decklist_split) {
        let jsonlist = [];
        let default_hint = '';

        for (let index = 0; index < decklist_split.length; index++) {
            let myRegexp = /^\s*(\d+)\s*([^\s\#]*)\s*#?(.*)$/g;
            let line = decklist_split[index];
            let line_split = line.split('#');
            let number_name = line_split[0];
            let hint_dirty = line_split[1];
            if ((hint_dirty != null) && (index == 0)) {
                default_hint = hint_dirty;
            }
            if (hint_dirty == null) {
                hint_dirty = default_hint;
            }
            //  if (hint_dirty == null) {
            //      hint_dirty = '';
            //   }
            let hint_upper = hint_dirty.replace(/\s*/g, '');
            let hint = hint_upper.toLowerCase();
            let quantity = number_name.replace(/[^\d]*/g, '');
            if (quantity == '') {
              quantity = 1;
            } else {
              quantity = parseInt(quantity);
            }
            let name_dirty = number_name.replace(/\d*/, '');
            let name = name_dirty.replace(/^\s*/g, '').replace(/\s*$/g, '');
            console.log('using hint ' + hint);
//            let match = myRegexp.exec(line);
            if(name != '') {//if (match !== null) {
//                let quantity = match[1];
//                let name = match[2];
//                let hint = match[3]
                console.log(quantity, name, hint);
                let cardjson = this.fuzzy.getJson(name, hint);
                if (cardjson == null) {
                    console.log('alert shit with ' + name);
                } else {
                if (cardjson !== undefined) {
                    for (let c = 0; c < quantity; c++) {
                        jsonlist.push(cardjson);
                    }
                } else {
                    console.log('alert shit with ' + name);
                }
                }
            } else {
                let name = line;
                let cardjson = this.oracle.getJson(name);
                if (cardjson !== undefined) {
                    jsonlist.push(cardjson);
                } else {
                    console.log('alert shit with ' + name);
                }
                console.log(line);
            }
        }

        return jsonlist;
    }
}
