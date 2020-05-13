const rarity = {'common': 'C', 'uncommon': 'U', 'rare': 'R', 'mythic rare': 'M'};

class CardPreview
{
    constructor(magicController)
    {
        this.fuzzy = magicController.fuzzy;
        this.wrap = $$(div({style: 'height: 100%'}),
            this.dom = img({src: this.fuzzy.getBackImageUrl()})
//          ,
//            this.txt = span(),
//            br()
        );
    }

    getDom()
    {
        return this.wrap;
    }

    update(cardjson)
    {
        this.dom.src = this.fuzzy.get200(cardjson.multiverseId); //this.fuzzy.getImageUrl(cardModel.name, cardModel.set);
//        this.txt.innerHTML = '<center>{set} {num} {rar} // {mid}</center>'.formatUnicorn({set: cardjson.set_code, num: cardjson.number.toString().padStart(3, '0'), mid: cardjson.multiverseId, rar: rarity[cardjson.rarity]});
    }
}
