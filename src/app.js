import Vue from 'vue';
// eslint-disable-next-line no-unused-vars
import _ from 'lodash';
import './stylesheets/app.scss';
import './imgs/icon.png';
import './manifest.json';
// eslint-disable-next-line no-unused-vars
import CryptoCoinDataAPI from './providers/cryptoCoinDataAPI';
import Tracking from './providers/tracking';
import DB from './providers/storage';
// eslint-disable-next-line no-unused-vars
import GraphAPI from './providers/graphAPI';

/* eslint-disable no-undef */
Vue.prototype.$bus = new Vue();
Vue.prototype.$dev = (DEV === 'true');
Vue.prototype.$Tracking = new Tracking({
    appName: APP_NAME,
    appId: APP_ID,
    appVersion: APP_VERSION,
    appInstallerId: APP_INSTALLER_ID,
    campaign: CAMPAIGN,
    cookieDomain: COOKIE_DOMAIN
});

//fake chrome extension environment
if (DEV === 'true' && !chrome.extension) {
    // eslint-disable-next-line no-unused-vars
    chrome.extension = {
        getBackgroundPage() {
            return {
                console() {
                    //eslint-disable-next-line
                    console.log(arguments);
                }
            };
        }
    };
}

// eslint-disable-next-line no-unused-vars
const app = new Vue({
    el: '#app',
    data: {
        graphContainerId: 'graphs-container',
        stockSymbolTextInputId: 'add-stock-symbol',
        DB: new DB(),
        GraphAPI: new GraphAPI(),
        console: chrome.extension.getBackgroundPage().console
    },
    components: {
      //
    },
    methods: {
        addForm() {
            var checkPageButton = document.getElementById('add-stocks');
            var textInputPresent = false;
            //scope hack
            var self = app;
            checkPageButton.addEventListener('click', () => {
                if (!textInputPresent) {
                    // eslint-disable-next-line no-unused-vars
                    chrome.tabs.getSelected(null, (tab) => {
                        textInputPresent = true;
                        self.listenForUserInput();
                    });
                }
            }, false);
        },

        addNewStockRequest(symbol) {
            //scope hack
            var self = this;
            var req = self.stockDataAPI.queryYahooFinance(symbol);
            req.then((response) => {
                self.console.log(response);
                if (response.query && response.query.results && response.query.results.quote) {
                    const stockData = response['query']['results']['quote'];
                    self.stockDataAPI.addStock(symbol, stockData);
                    // self.console.log(stockData);
                }
                // eslint-disable-next-line no-throw-literal
                throw `The stock symbol ${symbol} does not exsist. Please choose a valid ticker symbol`;
            });

            req.catch((error) => {
                //TODO: handle error better
                self.log(error);
            });
        },

        listenForUserInput() {
            //scope hack
            const self = this;
            const d = document;
            const button = d.createElement('button');
            const input = d.createElement('input');
            input.type = 'text';
            input.name = 'symbol';
            input.value = 'DIG';
            input.autocomplete = 'on';
            button.textContent = 'GO';
            button.id = self.selectors.stockSymbolTextInputId;
            // self.console.log('listenForUserInput')
            button.addEventListener('click', () => {
                var symbol = document.getElementById(self.selectors.stockSymbolTextInputId).value;
                self.addNewStockRequest(symbol);
            });
            d.body.appendChild(input);
            d.body.appendChild(button);
        }
    },
    computed: {
        //
    },
    created() {
        document.addEventListener('DOMContentLoaded', this.addForm, false);
    },
    mounted() {
    },
    beforeDestroy() {
        //clearInterval(this.updateTimer);
    },
    template: `
        <div id="app">
        </div>
    `
});

// App.prototype.log () {
//     // if (chrome && chrome.extension && chrome.getBackgroundPage) {
//         const backgroundPage = chrome.extension.getBackgroundPage();
//         backgroundPage.console.log.call(null, argument);
//     // }
// }

// console.log(app.console.log("hey"))

//function graph

//function select stock

//function upload algo

//function code-algo-in-browser
