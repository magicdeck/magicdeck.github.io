class StatsBuilder
{
    constructor()
    {
    }

    compute(deckModel)
    {
        let that = this;
        this.creaturesCount = deckModel.maindeck.filter(isCreature).length;
        this.noncreaturesCount = deckModel.maindeck.filter(isNoncreature).length;
        this.landsCount = deckModel.lands.length;

        this.cards = deckModel.maindeck.length;
        this.deck_cmcs = deckModel.maindeck.map(function(cardjson){return cardjson['cmc'] || 0;});
        this.deck_cost = deckModel.maindeck.map(function(cardjson){return cardjson['manaCost'] || '';});
        this.cmcs = group(deckModel.maindeck, cmcGetter);

        let x = this.deck_cost.reduce(function(a,e){return a+e;}, '');

        this.costs = col.map(function(c){
            let reg = color_pattern.replace('COLOR', c.toUpperCase());
            return count_string_in_string(x, reg);
        });

        this.manas = this.costs.reduce(function(a,e){return a+e;}, 0);
        this.expected_lands = 40 - this.creaturesCount - this.noncreaturesCount;
        this.suggested_lands = this.costs.map(function(c){
            return Math.round(Number(c) * Number(that.expected_lands) / Number(that.manas));
        });

    }
}

var col = ['w', 'u', 'b', 'r', 'g'];
var color_pattern = "{.?/?COLOR/?.?}";
