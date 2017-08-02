import io from 'socket.io-client';
import EventEmitter from 'eventemitter3';

const watch = (obj) => {
    obj.emitter = new EventEmitter();
    obj.emit = obj.emitter.emit.bind(obj.emitter);
    obj.on = obj.emitter.on.bind(obj.emitter);

    return new Proxy(obj, {
        set(target, key, value) {
            console.log('Changing!', key, value);
            obj.emit('change', { [key]: value });
            target[key] = value;
        }
    });
};

// TODO: need to establish working reactivity of selected coins
class CryptoCompare {
    constructor(opts = {}) {
        this.name = 'cryptocompare';
        this.baseUrl = 'https://www.cryptocompare.com';
        this.socket = io.connect('https://streamer.cryptocompare.com/');
        // this.selectedCoins = watch(opts.selectedCoins || []);
        // this.selectedCoins = opts.selectedCoins;
        this.selectedCoins = [{ symbol: 'BTC' }, { symbol: 'ETH' }, { symbol: 'NMR' }];
        this.liveData = opts.liveData || [];
        this.console = chrome.extension.getBackgroundPage().console;
        this.subscriptions = [];
        this.initSubscriptions();
        // this.socket.on('m', this.handleUpdate.bind(this));
        this.socket.on('m', this.handleUpdate.bind(this));
    }

    initSubscriptions() {
        const FIAT_COINS = ['BTC', 'ETH'];

        this.selectedCoins.forEach((coin) => {
            this.console.log('This is coins', coin);
            const quotePair = FIAT_COINS.includes(coin.symbol) ? 'USD' : 'BTC';

            this.subscriptions.push(`5~CCCAGG~${coin.symbol}~${quotePair}`);
        });

        console.log('Adding', this.subscriptions);
        this.socket.emit('SubAdd', { subs: this.subscriptions });

        // this.selectedCoins.on('change', this.updateSubscriptions.bind(this));
    }

    updateSubscriptions() {
        const newSubscriptions = [];
        const FIAT_COINS = ['BTC', 'ETH'];

        this.selectedCoins.forEach((coin) => {
            this.console.log('This is new coins', coin);
            const quotePair = FIAT_COINS.includes(coin.symbol) ? 'USD' : 'BTC';

            const subcription = `5~CCCAGG~${coin.symbol}~${quotePair}`;

            if (!this.subscriptions.includes(subcription)) {
                this.subscriptions.push(subcription);
                newSubscriptions.push(subcription);
            }
        });

        console.log('Adding new', newSubscriptions);
        this.socket.emit('SubAdd', { subs: newSubscriptions });
    }

    handleUpdate(message) {
        this.console.log('Got an update from socket!', message);
    }

    getAction(actionName) {
        return this.actions[actionName];
    }
}


export default CryptoCompare;
