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
        this.deck_cmcs = deckModel.maindeck.map(function(cardjson){return cardjson['convertedManaCost'] || 0;});
        this.deck_cost = deckModel.maindeck.map(function(cardjson){return cardjson['manaCost'] || '';});
        this.cmcs = group(deckModel.maindeck, cmcGetter);

        this.deck_texts = deckModel.maindeck.map(function(cardjson){
          if (cardjson['type'].indexOf("Land") != -1) {
            return '';
          } else {
            return cardjson['text'] || '';
          }
        });

        this.land_texts = deckModel.maindeck.map(function(cardjson){
          if (cardjson['type'].indexOf("Land") != -1) {
            return cardjson['text'] || '';
          } else {
            return '';
          }
        });

        let x = this.deck_cost.reduce(function(a,e){return a+e;}, '');

        let all_texts = this.deck_texts.reduce(function(a,e){return a+e;}, '');

        let land_texts = this.land_texts.reduce(function(a,e){return a+e;}, '');

        this.costs = col.map(function(c){
            let reg = color_pattern.replace('COLOR', c.toUpperCase());
            return count_string_in_string(x, reg);
        });

        this.inner_costs = col.map(function(c){
            let reg = color_pattern.replace('COLOR', c.toUpperCase());
            return count_string_in_string(all_texts, reg);
        });

        this.lands = col.map(function(c){
            let reg = color_pattern.replace('COLOR', c.toUpperCase());
            return count_string_in_string(land_texts, reg);
        });

        this.manas = this.costs.reduce(function(a,e){return a+e;}, 0);
        this.expected_lands = 40 - this.creaturesCount - this.noncreaturesCount;
        this.suggested_lands = this.costs.map(function(c){
            return Math.round(Number(c) * Number(that.expected_lands) / Number(that.manas));
        });

        this.sideCount = deckModel.sideboard.length;
    }
}

var col = ['w', 'u', 'b', 'r', 'g'];
var color_pattern = "{.?/?COLOR/?.?}";
