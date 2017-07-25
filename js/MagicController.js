class MagicController {
    constructor() {
        let that = this;

        this.resizeDelayAction = new DelayAction(
            function () {
                that.doResize();
            },
            null, 300, 100, null
        );

        window.onresize = function (event) {
            that.resizeDelayAction.restart();
        };

        this.refreshHelayAction = new DelayAction(
            function () {
                that.doRefresh();
            },
            null, 300, 100, null
        );

        this.oracle = new Oracle([
            // Kaladesh block
            'KLD', 'AER',
            // Amonkhet block
            'HOU', 'AKH'
        ]);

        this.contextManager = new ContextManager({deck: '3 Sacred Cat\n3 Feral Prowler\n3 Adorned Pouncer\n1 Prowling Serpopard\n3 Pride Sovereign\n2 Regal Caracal\n\n2 Prepare\n2 Cast Out\n2 Anointed Procession\n1 Overcome\n\n2 Endless Sands\n9 Plains\n7 Forest', sets: 'kld aer'});
        this.contextManager.setRefreshCallback(function(){
           that.doRefresh();
        });
        this.decklistView = new ListView(this);
        this.decklistView.registerContextManager(this.contextManager);
        this.decklistView.registerUpdateCallback(function () {
            that.refresh();
        });

        this.mainView = new MainView(this);
        this.sideView = new SideView(this);
        this.statsView = new StatsView(this);
        this.cardPreview = new CardPreview(this);

        this.deckParser = new DeckParser(this.oracle);
        this.statsBuilder = new StatsBuilder();

        this.contextManager.onLoad();

        document.getElementById('context').appendChild(this.contextManager.getDom());
        document.getElementById('decklist').appendChild(this.decklistView.getDom());
        document.getElementById('stats').appendChild(this.statsView.getDom());
        document.getElementById('deckview').appendChild(this.mainView.getDom());
        document.getElementById('cardview').appendChild(this.cardPreview.getDom());

        this.doResize();
    }

    resize() {
        this.resizeDelayAction.restart();
    }

    doResize() {
        let pattern = Trianglify({
            width: window.innerWidth,
            height: window.innerHeight
        });
        if (typeof this.background !== 'undefined') {
            this.background.parentNode.removeChild(this.background);
        }
        this.background = pattern.canvas();
        this.background.style = 'position: fixed; left: 0px; top: 0px; z-index: -1; opacity: 0.4;';
        document.body.appendChild(this.background);
        this.doRefresh();
    }

    refresh() {
        this.refreshHelayAction.restart();
    }

    doRefresh() {
        this.contextManager.storeContext();
        let deckText = this.decklistView.getText();
        let deckModel = this.deckParser.parse(deckText);
        this.statsBuilder.compute(deckModel);
        this.mainView.refresh(deckModel);
        this.sideView.refresh(deckModel);
        this.statsView.refresh(this.statsBuilder);
    }
}
