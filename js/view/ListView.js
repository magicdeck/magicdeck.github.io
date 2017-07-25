class ListView
{
    constructor(magicController)
    {
        this.dom = textarea({style: 'width: 100%; height: 100%;'});
        this.magicController = magicController;
    }

    registerContextManager(contextManager)
    {
        let that = this;

        contextManager.registerOnLoadCallback(
            function(context){
                that.onLoad(context);
            }
        );

        contextManager.registerOnSaveCallback(
            function(context){
                that.onSave(context);
            }
        );
    }

    registerUpdateCallback(updateCallback)
    {
        let events = ['change', 'keyup', 'click'];
        for(let eventIndex in events)
        {
            this.dom.addEventListener(events[eventIndex], updateCallback);
        }
    }

    onSave(context)
    {
        context.deck = this.getText();
    }

    onLoad(context)
    {
        this.setText(context.deck);
    }

    getDom()
    {
        return this.dom;
    }

    setText(text)
    {
        this.dom.value = text;
    }

    getText()
    {
        return this.dom.value;
    }
}
