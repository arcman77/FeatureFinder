var testStr = `
BTC-RISE	12.293	-11.5%	0.00002048
BTC-BLITZ	12.173	-0.3%	0.00030006
BTC-BTCD	12.142	-12.0%	0.01410076
BTC-SPR	11.594	-9.8%	0.00030219
BTC-SWT	11.388	-2.8%	0.00035200
BTC-BURST	10.966	-2.0%	0.00000288
BTC-EXCL	10.696	-7.0%	0.00021514
BTC-GNO	10.436	-5.6%	0.06400933
BTC-DGD	9.681	2.9%	0.02227965
BTC-NEOS	9.181	-9.1%	0.00096150
BTC-SNGLS	9.126	6.0%	0.00003569
BTC-ABY	9.012	2.0%	0.00000151
BTC-PPC	9.000	-10.0%	0.00055158
BTC-EMC	8.922	-6.2%	0.00031335
BTC-DTB	8.794	-4.6%	0.00019083
BTC-BCY	8.620	-11.5%	0.00011066
BTC-PINK	8.284	-3.9%	0.00000419
BTC-SIB	8.074	-9.3%	0.00042995
BTC-TKN	8.067	-5.7%	0.00020578
BTC-LUN	7.787	-3.8%	0.00092317
`;

// test = testStr.match(new RegExp(`[^-][A-Z]{2,}[?=\\s]`, 'g'));
test = testStr.match(new RegExp('[^-][A-Z]{2,}[\\s?]', 'g'));

function getSymbols(scrapeStr) {
    symbols = scrapeStr.match(new RegExp('[^-][A-Z]{2,}[\\s?]', 'g')).map(match => match.trim());
    let fullStr = '';
    symbols.forEach((symbol) => {
        fullStr += `'${symbol}': true,\n`;
    });
    console.log(fullStr);
}

getSymbols(testStr);
