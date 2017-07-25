class CardPreview
{
    constructor(magicController)
    {
        this.oracle = magicController.oracle;
        this.dom = img({src: this.oracle.getBackImageUrl()});
    }

    getDom()
    {
        return this.dom;
    }

    update(cardModel)
    {
        console.log(cardModel, cardModel.name);
        this.dom.src = this.oracle.getImageUrl(cardModel.name);
    }
}