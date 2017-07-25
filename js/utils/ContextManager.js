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
                this.contextCollection = {};
                this.contextCollection[this.selectedKey] = copy(this.context);
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
