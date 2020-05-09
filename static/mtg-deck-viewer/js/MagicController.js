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

        this.fuzzy  = new Fuzzy();
        this.oracle = new Oracle([
            /*'APC', 'STH', 'LGN', 'TMP',
            'DDO',
            'DDP',
            'DDQ',
            'DDR',
            'DDS',
            // Value sets

            'E01', 'CMA', 'MMA', 'MM2', 'MM3', 'EMA',
            // Conspiracy sets
            'CNS', 'CN2', 'PCA',
            // Commander sets
            'C14', 'C15', 'C16',
              // Duel Decks
            'DD3_DVD',       'DD3_EVG',             'DD3_GVL',             'DD3_JVC',             //'BVC',
              //
            'MRD',            'DST',             '5DN',            'CHK',            'BOK',
            'SOK',            '9ED',            'RAV',            'GPT',            'DIS',
            'CSP',            'TSP',            'PLC',            'FUT',            '10E',
            'LRW',            'MOR',            'SHM',            'EVE',            'ALA',
            'CON',            'ARB',
              // Core Set
            'M10',
              // Zendicar block
            'ZEN', 'WWK', 'ROE',
              // Core Set
            'M11',
              //
            'SOM', 'MBS', 'NPH',
              // Core Set
            'M12',
            // Innistrad block
            'ISD', 'DKA', 'AVR',
            // Core Set
            'M13',
            // Return to Ravnica block
            'RTR', 'GTC', 'DGM',
            // Core Set
            'M14',
            // Theros block
            'THS', 'BNG', 'JOU',
            // Core Set
            'M15',
            // Khans of Tarkir
            'KTK', 'FRF', 'DTK',
            // Origins
            'ORI',
            // Battle for Zendikar block
            'BFZ', 'OGW', 'EXP',
            // Shadows over Innistrad block
            'SOI', 'EMN',
            // Kaladesh block
            'KLD', 'AER',
            // Amonkhet block
            'HOU', 'AKH',
            // Ixalan block
            'XLN', 'RIX',
            // Dominaria
            'DOM', 'M19',
            // Return to Return to Ravnica
            'GRN', 'RNA', 'WAR',
          'MH1', 'C14', 'EMA', 'A25', 'BBD', 'M19', 'DDU', 'ELD'*/
        ]);

        this.contextManager = new ContextManager();
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

        this.deckParser = new DeckParser(this.oracle, this.fuzzy);
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
