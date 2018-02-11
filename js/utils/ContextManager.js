class ContextManager {
    constructor(defaultContext) {
        let that = this;

        this.loadCallbackCollection = [];
        this.saveCallbackCollection = [];

        this.refreshCallback = null;

        this.defaultKey = '(default)';
        this.defaultContext = defaultContext;

        this.restoreContext();

        this.dom = this.buildDom();

        this.loadButton.addEventListener('click', function () {
            that.loadButtonCallback();
        });
        this.saveasButton.addEventListener('click', function () {
            that.saveasButtonCallback();
        });
        this.renameButton.addEventListener('click', function () {
            that.renameButtonCallback();
        });
        this.deleteButton.addEventListener('click', function () {
            that.deleteButtonCallback();
        });
        //this.resetButton.addEventListener('click', function () {
        //    that.resetButtonCallback()
        //});
    }

    setRefreshCallback(refreshCallback) {
        this.refreshCallback = refreshCallback;
    }

    buildDom() {
        let dom = $$(div(),
            $$(div(),
                this.keyLabel = span({align: 'center', style: 'width: 100%; font-size: 1.1em; text-align: center; font-weight: bold;'})
            ),
            $$(table(),
              $$(tr(),
                $$(td({style: 'width: 50%'}),
                  this.select = select({style: 'width: 100%;'})
                ),
                $$(td({style: 'width: 25%'}),
                  $$(this.loadButton = $$$(button({style: 'width: 100%'}), 'load'))
                ),
                $$(td({style: 'width: 25%'}),
                  $$(this.deleteButton = $$$(button({style: 'width: 100%'}), 'delete'))
                )
              ),
              $$(tr(),
                $$(td({style: 'width: 50%'}),
                  this.newLabel = input({style: 'width: 90%;', type: 'text'})
                ),
                $$(td({style: 'width: 25%'}),
                  $$(this.saveasButton = $$$(button({style: 'width: 100%; font-size: 0.9em;'}), 'save as'))
                ),
                $$(td({style: 'width: 25%'}),
                  $$(this.renameButton = $$$(button({style: 'width: 100%'}), 'rename'))
                )
              )
            )
            //$$(this.resetButton = $$$(button(), 'reset'))
        );

        this.updateDom();

        return dom;
    }

    updateDom() {
        this.keyLabel.innerHTML = this.selectedKey;
        this.newLabel.value = '';
        this.buildSelectDom();
    }

    addSelectOption(label, selected) {
        let selectNode = $$$(option({'value': label}), label);
        if (label === selected) {
            selectNode.selected = true;
        }
        this.select.appendChild(selectNode);
        return selectNode;
    }

    buildSelectDom() {
        this.select.innerHTML = '';
        let labels = []
        for (let label in this.contextCollection) {
            labels.push(label);
        }
        labels.sort();
        for (let labelIndex in labels) {
            let selectNode = this.addSelectOption(labels[labelIndex], this.selectedKey);
        }
    }

    getDom() {
        return this.dom;
    }

    refresh() {
        if (this.refreshCallback !== null) {
            this.refreshCallback();
        }
    }

    onCallback(callbackCollection) {
        let that = this;
        callbackCollection.every(function (callback) {
            callback(that.context);
        });
    }

    onLoad() {
        this.onCallback(this.loadCallbackCollection);
    }

    onSave() {
        this.onCallback(this.saveCallbackCollection);
    }

    registerOnLoadCallback(callback) {
        this.loadCallbackCollection.push(callback);
    }

    registerOnSaveCallback(callback) {
        this.saveCallbackCollection.push(callback);
    }

    getContext() {
        return this.context;
    }

    loadButtonCallback() {
        let selectedIndex = this.select.selectedIndex;
        let option = this.select.options[selectedIndex];
        let key = option.value;

        this.context = copy(this.contextCollection[key]);
        this.selectedKey = key;
        this.keyLabel.value = key;

        this.onLoad();

        this.storeContext();
        this.updateDom();
        this.refresh();
    }

    saveasButtonCallback() {
        let newKey = this.newLabel.value;
        if ((newKey !== '') && (newKey !== this.defaultKey)) {
            this.onSave();
            this.selectedKey = newKey;
            this.storeContext();
            this.updateDom();
            this.refresh();
        }
    }

    renameButtonCallback() {
        let newKey = this.newLabel.value;
        if ((this.selectedKey !== this.defaultKey) && (newKey !== '') && (newKey !== this.defaultKey)) {
            this.onSave();
            this.contextCollection[newKey] = copy(this.context);
            delete this.contextCollection[this.selectedKey];
            this.selectedKey = newKey;
            this.storeContext();
            this.updateDom();
            this.refresh();
        }
    }

    deleteButtonCallback() {
        let selectedIndex = this.select.selectedIndex;
        let option = this.select.options[selectedIndex];
        let key = option.value;

        if (key !== this.defaultKey) {
            if (confirm("Proceed with deleting context?")) {
                delete this.contextCollection[this.selectedKey];
                this.selectedKey = this.defaultKey;
                this.context = copy(this.contextCollection[this.defaultKey]);

                this.storeContext();
                this.updateDom();
                this.refresh();
            }
        }
    }

    resetButtonCallback() {
        if (confirm("Proceed with reseting context?")) {
            this.resetLocalStorage();
            location.reload();
        }
    }

    restoreContext() {
        if (typeof(Storage) !== "undefined") {
            if (localStorage.contextCollection) {
                this.contextCollection = JSON.parse(localStorage.contextCollection);
                this.selectedKey = localStorage.selectedKey;
                this.context = copy(this.contextCollection[this.selectedKey]);
            }
            else {
                this.selectedKey = this.defaultKey;
                this.context = copy(this.defaultContext);
                this.contextCollection = {
  "XLN BR Pirates": {"deck": "1 Deadeye Tracker\n3 Rigging Runner\n2 Kitesail Freebooter\n1 Fathom Fleet Captain\n3 Dire Fleet Captain\n3 Dire Fleet Poisoner\n1 Dire Fleet Daredevil\n1 Ruin Raider\n2 Dire Fleet Neckbreaker\n \n1 March of the Drowned\n2 Fiery Cannonade\n2 Fell Flagship\n1 Vanquisher's Banner\n \n3 Unclaimed Territory\n3 Dragonskull Summit\n6 Mountain\n5 Swamp", "sets": ""},
"AKH BG -1/-1 Tokens": {"deck": "3 Hapatra, Vizier of Poisons\n3 Channeler Initiate\n3 Obelisk Spider\n3 Ammit Eternal\n2 Decimator Beetle\n \n2 Hapatra's Mark\n2 Nest of Scarabs\n2 Splendid Agony\n2 Torment of Venom\n1 Overcome\n \n2 Evolving Wilds\n2 Foul Orchard\n2 Ifnir Deadlands\n5 Swamp\n6 Forest", "sets": ""},
"AKH GW Cats": {"deck": "3 Sacred Cat\n3 Adorned Pouncer\n3 Feral Prowler\n3 Pride Sovereign\n1 Prowling Serpopard\n2 Regal Caracal\n \n2 Prepare\n3 Cast Out\n2 Anointed Procession\n1 Overcome\n \n2 Endless Sands\n9 Plains\n6 Forest", "sets": ""},
"AKH WB Zombies": {"deck": "3 Dread Wanderer\n3 Wayward Servant\n3 Lord of the Accursed\n1 Ammit Eternal\n2 Unraveling Mummy\n1 Merciless Eternal\n1 Dreamstealer\n1 Gravedigger\n1 Accursed Horde\n \n2 Grind\n1 Torment of Hailfire\n1 Torment of Scarabs\n2 Liliana's Mastery\n1 Stir the Sands\n \n2 Cradle of the Accursed\n2 Evolving wilds\n2 Forsaken Sanctuary\n2 Plains\n9 Swamp", "sets": ""},
"KLD UG Energy": {"deck": "2 Greenbelt Rampager\n3 Servant of the Conduit\n1 Shielded Aether Thief\n3 Rogue Refiner\n2 Empyreal Voyager\n3 Bristling Hydra\n1 Rashmi, Eternities Crafter\n1 Aetherwind Basker\n \n3 Attune with Aether\n2 Blossoming Defense\n1 Heroic Intervention\n1 Glimmer of Genius\n \n3 Aether Hub\n2 Island\n12 Forest", "sets": ""},
"KLD WR Vehicles": {"deck": "3 Speedway Fanatic\n3 Veteran Motorist\n1 Sram, Senior Edificer\n1 Renegade Wheelsmith\n1 Solemn Recruit\n1 Aerial Responder\n2 Depala, Pilot Exemplar\n\n1 Built to Last\n2 Hungry Flames\n1 Renegade Freighter\n3 Peacewalker Colossus\n1 Fleetwheel Cruiser\n1 Bomat Bazaar Barge\n2 Skysovereign, Consul Flagship\n\n3 Stone Quarry\n7 Plains\n7 mountain", "sets": ""}
                };
                this.contextCollection[this.selectedKey] = copy(this.contextCollection["AKH GW Cats"]);
            }
        }

        this.onLoad();
    }

    storeContext() {
        this.onSave();

        this.contextCollection[this.selectedKey] = copy(this.context);
        if (typeof(Storage) !== "undefined") {
            localStorage.contextCollection = JSON.stringify(this.contextCollection);
            localStorage.selectedKey = this.selectedKey;
        }
    }

    resetLocalStorage() {
        if (typeof(Storage) !== "undefined") {
            localStorage.clear();
        }
    }
}
