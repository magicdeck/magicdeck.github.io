class MainView
{
    constructor(magicController)
    {
        this.magicController = magicController;
        this.dom = $$(div({style: 'height: 100%; width: 100%'}),
            this.crit = div({style: 'position: absolute; top: 0px;'}),
            this.land = div({style: 'position: absolute; height: 100%;'}),
            this.nonc = div({style: 'position: absolute;'})
        );

        this.cardHeight = 680;
        this.titleRatio = 0.10;
        this.offsetRatio = 0.01;
    }

    getDom()
    {
        return this.dom;
    }

    refresh(deckModel)
    {
        let creatures = this.aggregate(deckModel.creatures);
        let noncreatures = this.aggregate(deckModel.noncreatures);

        this.calculate_scale(this.dom, creatures, noncreatures, deckModel.lands);
        this.redraw(deckModel, creatures, noncreatures);
    }

    redraw(deckModel, creatures, noncreatures)
    {
        this.crit.innerHTML = '';
        this.nonc.innerHTML = '';
        this.land.innerHTML = '';

        this.draw_group(this.crit, creatures);
        this.draw_group(this.nonc, noncreatures);
        this.draw_group(this.land, [deckModel.lands]);
    }

    aggregate(pool, threshold=5)
    {
        let aggregatedPool = [];

        while((pool.length > 0) && (pool[pool.length-1].length === 0))
        {
            pool.pop();
        }

        for(let i = 0; i < pool.length; i++)
        {
            if (i <= threshold) {
                aggregatedPool[i] = pool[i];
            }
            else
            {
                aggregatedPool[threshold] = aggregatedPool[threshold].concat(pool[i]);
            }
        }

        return aggregatedPool;
    }

    calculate_scale(box, creatures, noncreatures, lands, aggregateCmc = 7)
    {
        let X = box.getBoundingClientRect().width;
        let Y = box.getBoundingClientRect().height;

        this.X = X;
        this.Y = Y;

        console.log(X, Y);

        this.offset = Math.min(X, Y) * this.offsetRatio;

        let critCountY = creatures.reduce(function(maxY, column){if (column.length > maxY) return column.length; else return maxY;}, 0);
        let noncritCountY = noncreatures.reduce(function(maxY, column){if (column.length > maxY) return column.length; else return maxY;}, 0);

        if (lands.length === 0 && critCountY === 0 && noncritCountY === 0)
        {
            return;
        }

        let coveredCreatureCountY = Math.max(0, critCountY - 1);
        let coveredNoncreatureCountY = Math.max(0, noncritCountY - 1);
        let topCreatureCountY = Math.min(1, critCountY);
        let topNoncreatureCountY = Math.min(1, noncritCountY);


        let landY = (Y - 2 * this.offset) / (1 + (lands.length - 1) * this.titleRatio);
        console.log((Y - 2 * this.offset), (1 + (lands.length - 1) * this.titleRatio), landY);
        let nonLandY = (Y - 3 * this.offset) / (topCreatureCountY + topNoncreatureCountY + (coveredCreatureCountY + coveredNoncreatureCountY) * this.titleRatio);

        if (lands.length === 0) {
            this.cardHeight = nonLandY;
        }
        else if (creatures.length === 0 && noncreatures.length === 0) {
            this.cardHeight = landY;
        } else {
            this.cardHeight = Math.min(landY, nonLandY);
        }

        console.log(this.cardHeight);

        this.cardWidth = this.cardHeight * 480 / 680;


        let nonLandXCount = Math.max(creatures.length, noncreatures.length);

        console.log(nonLandXCount);

        let cardX = (X - (4 + nonLandXCount - 1) * this.offset) / (1 + nonLandXCount);

        if (nonLandXCount != 0) {
        if (this.cardWidth > cardX) {
            this.cardWidth = cardX;
            this.cardHeight = this.cardWidth * 680.0 / 480.0;
        }}
     /*   else
        {
            if (this.cardHeight / this.cardWidth > 680.0 / 480.0) {
                this.cardWidth = this.cardHeight / 680.0 * 480.0;
            }
        }
*/

        console.log(this.cardWidth, this.cardHeight);

        this.landsWidth = this.offset * 2 + this.cardWidth;

        if (critCountY !== 0) {
            this.critsHeight = this.offset + (1 + (critCountY - 1) * this.titleRatio) * this.cardHeight;
        } else
        {
            this.critsHeight = 0;
        }

        if (noncritCountY !== 0)
        {
            this.nonCritsHeight = Y - this.critsHeight;
        }
        else
        {
            this.nonCritsHeight = 0;
        }

        this.nonLandWidth = X - this.landsWidth;

        this.land.style = 'position: absolute; left: 0px; top: 0px; width: {width}px; height: {height}px;'.formatUnicorn(
            {
                height: Y,
                width: this.landsWidth
            });
        this.crit.style = 'position: absolute; left: {left}px; top: 0px; width: {width}px; height: {height}px;'.formatUnicorn(
        {
            left: this.landsWidth,
            height: this.critsHeight,
            width: this.nonLandWidth
        });
        this.nonc.style = 'position: absolute; left: {left}px; top: {top}px; width: {width}px; height: {height}px'.formatUnicorn(
            {
                left: this.landsWidth,
                top: this.critsHeight,
                height: this.nonCritsHeight,
                width: this.nonLandWidth
            });
    }

    draw_group(target, listgroup) {
        for (let x = 0; x < listgroup.length; x++) {
            for (let y = 0; y < listgroup[x].length; y++) {
                console.log(listgroup[x][y], listgroup[x][y].name);
                let cardname = listgroup[x][y].name;
                this.draw(target, x, y, cardname);
            }
        }
    }

    draw(target,x,y,name)
    {

        let xdim = this.cardWidth;
        let ydim = this.cardHeight;

        let xmargin = this.offset;
        let ymargin = this.offset;
        let ypad = this.cardHeight * this.titleRatio;
        let xoffset = this.offset;
        let yoffset = this.offset;

        let left = xmargin + x * (xdim+xmargin);
        let top = ymargin + y * ypad;
        let zindex = y + 1;

        let attrs = {
            style: 'position: absolute; left: {left}px; top: {top}px; z-index: {zindex};'.formatUnicorn(
                {
                    left: left,
                    top: top,
                    zindex: zindex
                }
            ),
            width: xdim,
            height: ydim
        };

        target.appendChild(Card(this.magicController.oracle, name, attrs, this.magicController.cardPreview));
    }
}
