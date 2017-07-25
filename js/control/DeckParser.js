function sanitizeDecklistText(decklist) {
    let maindeck_sideboard = {};

    decklist = decklist.replace('\s*#.*\n', '\n');
    decklist = decklist.replace('\s*\n\s*', '\n');
    decklist = decklist.replace('\n+', '\n');
    decklist = decklist.replace(' x ', ' ');

    if (decklist.indexOf('SB:') !== -1) {
        let decklist_sideboard = decklist.split('SB:');
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
    constructor(oracle) {
        this.oracle = oracle;
    }

    parse(deckText) {
        let decklist_split = sanitizeDecklistText(deckText);
        let maindeck = this.retrieve_cards(decklist_split['main']);
        let sideboard = this.retrieve_cards(decklist_split['side']);

        return new DeckModel(maindeck, sideboard);
    }

    retrieve_cards(decklist_split) {
        let jsonlist = [];

        for (let index = 0; index < decklist_split.length; index++) {
            let myRegexp = /^\s*(\d+)\s*(.*?)$/g;
            let line = decklist_split[index];
            let match = myRegexp.exec(line);
            if (match !== null) {
                let quantity = match[1];
                let name = match[2];
                let cardjson = this.oracle.getJson(name);
                if (cardjson !== undefined) {
                    for (let c = 0; c < quantity; c++) {
                        jsonlist.push(cardjson);
                    }
                } else {
                    console.log('alert shit with ' + name);
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