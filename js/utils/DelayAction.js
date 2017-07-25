// This file is a part of quicksave project.
// Copyright (c) 2017 Aleksander Gajewski <adiog@quicksave.io>.

function notify(remainingTime)
{
    console.log(remainingTime);
}

class DelayAction
{
    constructor(successCallback, cancelCallback, delayTime=60000, tickTime=1000, notificationCallback=notify)
    {
        this.isRunning = false;
        this.remainingTime = 0;
        
        this.delayTime = delayTime;
        this.tickTime = tickTime;

        this.successCallback = successCallback;
        this.cancelCallback = cancelCallback;

        this.notificationCallback = notificationCallback;
    }

    tick()
    {
        if (this.isRunning)
        {
            if (this.remainingTime > 0)
            {
                if (this.notificationCallback !== null) {
                    this.notificationCallback(this.remainingTime);
                }
                this.remainingTime = this.remainingTime - this.tickTime;

                let delayAction = this;
                setTimeout(
                    function () {
                        delayAction.tick();
                    },
                    this.tickTime
                );
            }
            else
            {
                this.stop();
                this.successCallback();
            }
        }
    }

    restart()
    {
        console.log('restart');
        //this.dom.style.visibility = 'visible';
        this.remainingTime = this.delayTime;
        if (!this.isRunning) {
            this.isRunning = true;
            this.tick();
        }

    }

    stop()
    {
        console.log('stop');
        //this.dom.style.visibility = 'hidden';
        this.isRunning = false;
    }

    doSuccessCallback()
    {
        if (this.isRunning)
        {
            this.stop();
            this.successCallback();
        }
    }

    doCancelCallback()
    {
        if (this.isRunning)
        {
            this.stop();
            this.cancelCallback();
        }
    }
}
