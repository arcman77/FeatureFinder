
class GA {
    constructor(config) {
        this.appName = config.APP_NAME;
        this.appId = config.APP_ID;
        this.appVersion = config.APP_VERSION;
        this.appInstallerId = config.APP_INSTALLER_ID;
        this.cookieDomain = config.COOKIE_DOMAIN;
        this.campaign = config.CAMPAIGN;
        this.trackers = {};
        this.trackersMap = {};
        //eslint-disable-next-line no-undef
        this.ga = ga;
        this.counter = 0;
    }
    getTracker(userTrackerName) {
        return this.trackers[this.trackersMap[userTrackerName]];
    }
    getAllTrackers() {
        return this.trackers;
    }
    createTracker(trackingId, userTrackerName) {
        /* eslint-disable prefer-rest-params */
        var options = {
            trackingId: trackingId,
            appName: this.appName,
            appId: this.appId,
            appVersion: this.appVersion,
            appInstallerId: this.appInstallerId,
            cookieDomain: this.cookieDomain
        };

        var trackerName = `t${this.counter}`;
        var useName = userTrackerName || trackerName;
        var self = this;
        options.name = trackerName;
        const wrapper = function wrapper() {
            arguments[0] = `${trackerName}.${arguments[0]}`;
            self.ga.apply(self.ga, arguments);
        };

        try {
            this.ga('create', options);
            self.trackers[useName] = wrapper;

            this.ga(() => {
                var tracker = self.ga.getByName(trackerName);
                wrapper.ready = true;
                wrapper.data = tracker;
            });
        } catch (err) {
            console.error('Google analytics script tag misssing from document.');
            this.trackers[useName] = null;
        }

        return this.trackers[useName];
    }
}

export default GA;
