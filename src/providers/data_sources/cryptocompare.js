import io from 'socket.io-client';

class CryptoCompare {
    constructor(selectedCoins) {
        this.name = 'cryptocompare';
        this.baseUrl = 'https://www.cryptocompare.com';
        this.socket = io.connect('https://streamer.cryptocompare.com/');
        this.selectedCoins = selectedCoins || [];
        this.actions = {

        };
    }
    getAction(actionName) {
        return this.actions[actionName];
    }
}

export default CryptoCompare;
