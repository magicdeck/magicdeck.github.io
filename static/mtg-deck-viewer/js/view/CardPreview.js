class CardPreview
{
    constructor(magicController)
    {
        this.fuzzy = magicController.fuzzy;
        this.dom = img({src: this.fuzzy.getBackImageUrl()});
    }

    getDom()
    {
        return this.dom;
    }

    update(cardModel)
    {
        console.log(cardModel, cardModel.name);
        this.dom.src = this.fuzzy.getImageUrl(cardModel.name, cardModel.set);
    }
}
