/** * 1. when given a buy signal:
*  - record price & time with bid object
*  - record bid with unique id
*  - return unique id
*  - determine how many bids if any can be completed
*
* 2. when given a sell signal
*  - record price & time with bid object
*  - return all bids with lower bought price
*  - determine how many bids if any can or should be sold
*/

//PRIVATE METHODS
// function addBuyBid(priceDatum, numberOfBids) {
//     const id = this.bCount;
//     //record all signals regardless if transaction is carried out
//     priceDatum[2] = numberOfBids;
//     this.buyLedger.push(priceDatum);
//     //only carry out purchase if there is a non-zero numberOfBids
//     if (numberOfBids) {
//         this.currentBuyLedger[id] = priceDatum;
//         this.currentFunds -= priceDatum[1] * numberOfBids;
//         this.currentFunds -= this.tFee;
//     }
//     this.bCount ++;
//     return id;
// }
// function addSellBid(priceDatum, numberOfBids) {
//     const id = this.sCount;
//     priceDatum[2] = numberOfBids;
//     //record all signals regardless if transaction is carried out
//     this.sellLedger.push(priceDatum);
//     //only carry out purchase if there is a non-zero numberOfBids
//     if (numberOfBids) {
//         this.currentSellLeger[id] = priceDatum;
//         this.currentFunds += (priceDatum[1] * numberOfBids);
//         this.currentFunds -= this.tFee;
//     }
//     this.sCount ++;
//     return id;
// }
//PUBLIC API METHODS
class AlgoUtils {
    constructor(prinicipalCash, options = {}) {
        this.buyLedger = [];
        this.currentBuyLedger = {};
        this.sellLedger = [];
        this.currentSellLeger = {};
        this.currentFunds = prinicipalCash;
        this.bCount = 0;
        this.sCount = 0;
        this.tFee = options.transactionFee || 0;
        this.sellAll = options.sellAll || false;
    }
    /**
    * @param {priceDatum} Array
    *     @index {0} Integer - time
    *     @index {1} Float - price
    */
    buy(priceDatum, numberOfBids = 0) {
        let bidId = null;
        const maxSpend = priceDatum[1] * numberOfBids;
        const canAfford = (this.currentFunds - this.tFee) >= maxSpend;
        if (numberOfBids && canAfford) {
            bidId = this.addBuyBid(priceDatum, numberOfBids);
        } else {
            const maxBids = Math.floor((this.currentFunds - this.tFee) / priceDatum[1]);
            bidId = this.addBuyBid(priceDatum, maxBids);
        }
        return bidId;
    }
    sell(priceDatum) {
        let buyBid;
        let soldCount = 0;
        const boughtIds = Object.keys(this.currentBuyLedger);
        const self = this;
        boughtIds.forEach((bidId) => {
            buyBid = this.currentBuyLedger[bidId];
            if (buyBid[1] < priceDatum[1]) {
                self.addSellBid(priceDatum, buyBid[2]);
                delete self.currentBuyLedger[bidId];
                soldCount++;
            }
        });
        if (soldCount > 0) {
            this.currentFunds += ((soldCount - 1) * this.tFee);
        }
    }
    getNetWorth(priceDatum) {
        let sum = this.currentFunds;
        let buyBid;
        const self = this;
        const boughtIds = Object.keys(this.currentBuyLedger);
        boughtIds.forEach((bidId) => {
            buyBid = self.currentBuyLedger[bidId];
            sum += (priceDatum[1] * buyBid[2]);
        });
        return [priceDatum[0], sum];
    }
    addBuyBid(priceDatum, numberOfBids) {
        const id = this.bCount;
        //record all signals regardless if transaction is carried out
        priceDatum[2] = numberOfBids;
        this.buyLedger.push(priceDatum);
        //only carry out purchase if there is a non-zero numberOfBids
        if (numberOfBids) {
            this.currentBuyLedger[id] = priceDatum;
            this.currentFunds -= priceDatum[1] * numberOfBids;
            this.currentFunds -= this.tFee;
        }
        this.bCount ++;
        return id;
    }
    addSellBid(priceDatum, numberOfBids) {
        const id = this.sCount;
        priceDatum[2] = numberOfBids;
        //record all signals regardless if transaction is carried out
        this.sellLedger.push(priceDatum);
        //only carry out purchase if there is a non-zero numberOfBids
        if (numberOfBids) {
            this.currentSellLeger[id] = priceDatum;
            this.currentFunds += (priceDatum[1] * numberOfBids);
            this.currentFunds -= this.tFee;
        }
        this.sCount ++;
        return id;
    }
    //dataSet is of type [Timeset, Priceset]
    //eslint-disable-next-line class-methods-use-this
    sliceSBAToHighcharts(dataSet, i, j) {
        let k;
        const curSet = [];
        for (k = i; k < j; k++) {
            curSet.push([dataSet[0][k], dataSet[1][k]]);
        }
        return curSet;
    }
}

export default AlgoUtils;
