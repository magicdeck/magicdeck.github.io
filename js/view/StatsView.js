class StatsView
{
    constructor()
    {
        this.dom = div();
    }

    getDom()
    {
        return this.dom;
    }

    refresh(statsModel)
    {

        let text = "Cards: {crits}+{noncrits}+{lands} = {all}; mana costs: {costs}, suggested lands: {slands}".formatUnicorn(
            {
                crits: statsModel.creaturesCount,
                noncrits: statsModel.noncreaturesCount,
                lands: statsModel.landsCount,
                all: statsModel.cards,
                costs: statsModel.costs.join(','),
                slands: statsModel.suggested_lands.join(',')
            });

        this.dom.innerHTML = text;
    }
}