class DeckModel
{
    constructor(maindeck, sideboard)
    {
        let creatures = maindeck.filter(isCreature);
        creatures = convertIntegerIndexedDictToEnumeratedList(group(creatures, cmcGetter));
        creatures.shift();

        let noncreatures = maindeck.filter(isNoncreature);
        noncreatures = convertIntegerIndexedDictToEnumeratedList(group(noncreatures, cmcGetter));
        noncreatures.shift();

        let lands = maindeck.filter(isLand);

        this.creatures = creatures;
        this.noncreatures = noncreatures;
        this.lands = lands;

        this.maindeck = maindeck;
        this.sidebeard = sideboard;
    }
}

function group(jsonlist, criteriaGetter) {
    let dictgroup = {};
    for (let index = 0; index < jsonlist.length; index++) {
        let criteria = criteriaGetter(jsonlist[index]);
        if (!(criteria in dictgroup)) {
            dictgroup[criteria] = [];
        }
        dictgroup[criteria].push(jsonlist[index]);
    }
    return dictgroup;
}

function convertIntegerIndexedDictToEnumeratedList(dict) {
    let list = [];
    let max = 5;
    for (let key in dict) {
        if (key > max) max = key;
    }
    for (let index = 0; index <= max; index++) {
        list.push(dict[index] || []);
    }
    return list;
}

function cmcGetter(cardjson) {
    return cardjson['cmc'] || 0;
}

function isCreature(jsoncard) {
    return jsoncard['types'].indexOf('Creature') !== -1;
}

function isLand(jsoncard) {
    return jsoncard['types'].indexOf('Land') !== -1;
}

function isNoncreature(jsoncard) {
    return ((jsoncard['types'].indexOf('Land') === -1) && (jsoncard['types'].indexOf('Creature') === -1));
}
