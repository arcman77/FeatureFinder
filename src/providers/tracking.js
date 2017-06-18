import GA from './trackers/GA';

class Tracking {
    constructor(config) {
        this.GA = new GA(config);
        // TODO: add bench tracker
    }
    send(options) {
        var gaTrackers = this.GA.getAllTrackers();
        var key;
        //eslint-disable-next-line
        for (key in gaTrackers) {
            gaTrackers[key]('send', options);
        }
    }
    set(options) {
        var gaTrackers = this.GA.getAllTrackers();
        var key;
        //eslint-disable-next-line
        for (key in gaTrackers) {
            gaTrackers[key]('set', options);
        }
    }
    setScreen(screenName) {
        this.set({
            screenName: screenName
        });
    }
    setPage(pageUrl) {
        this.set({
            page: pageUrl
        });
    }
    sendEvent(options) {
        options.hitType = 'event';
        this.send(options);
    }
    screenViewHit(screenName) {
        this.setScreen(screenName);
        this.send({
            screenName: screenName,
            hitType: 'screenview'
        });
    }
    pageViewHit(pageUrl) {
        this.setPage(pageUrl);
        this.send({
            hitType: 'pageview',
            page: pageUrl
        });
    }

}

export default Tracking;
