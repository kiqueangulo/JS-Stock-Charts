async function main() {

    const timeChartCanvas = document.querySelector('#time-chart');
    const highestPriceChartCanvas = document.querySelector('#highest-price-chart');
    const averagePriceChartCanvas = document.querySelector('#average-price-chart');

    /*const response = await fetch('https://api.twelvedata.com/time_series?symbol=GME,MSFT,DIS,BNTX&interval=1day&apikey=da0d5096ac3945039e52754d3c5f400a');
    const result = response.json();*/
    
    // This is to use the data from mockData.js instead of twelvedata.com
    const {GME, MSFT, DIS, BNTX} = mockData; // This process is called destructuring...
    const stocks = [GME, MSFT, DIS, BNTX]; // ...and makes possible unpack values from arrays, or properties from objects, into distinct variables
    
    // This allows the time on the x-axis be shwon ascendently
    stocks.forEach(stock => stock.values.reverse());

    // This draw the graphic (in this case line), for each stock
    new Chart(timeChartCanvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: stocks[0].values.map(value => value.datetime),
            datasets: stocks.map(stock => ({
                label: stock.meta.symbol,
                data: stock.values.map(value => parseFloat(value.high)),
                backgroundColor: getColor(stock.meta.symbol),
                borderColor: getColor(stock.meta.symbol),
            }))
        }
    });

    // Assign the line color depending on the stock
    function getColor(stock) {
        if (stock === 'GME') {
            return 'rgba(61, 161, 61, 0.7)';
        }
        if (stock === 'MSFT') {
            return 'rgba(209, 4, 25, 0.7)';
        }
        if (stock === 'DIS') {
            return 'rgba(18, 4, 209, 0.7)';
        }
        if (stock === 'BNTX') {
            return 'rgba(166, 43, 158, 0.7)';
        }
    };

    // Bar graphic
    new Chart(highestPriceChartCanvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: stocks.map(stock => stock.meta.symbol),
            datasets: [{
                label: 'The Highest Stock Price',
                data: stocks.map(stock => highestNumber(stock.values)),
                backgroundColor: stocks.map(stock => getColor(stock.meta.symbol)),
                borderColor: stocks.map(stock => getColor(stock.meta.symbol)),
            }]
        }
    });

    // This gets the highest number of each stock
    function highestNumber(stockValues) {
        let num = 0;
        stockValues.forEach(stockValue => {
            if (parseFloat(stockValue.high) > num) {
                num = stockValue.high;
            }
        })
        return num;
    }

    // Average pie graph
    new Chart(averagePriceChartCanvas.getContext('2d'), {
        type: 'pie',
        data: {
            labels: stocks.map(stock => stock.meta.symbol),
            datasets: [{
                label: 'The Highest Stock Price',
                data: stocks.map(stock => averageNumber(stock.values)),
                backgroundColor: stocks.map(stock => getColor(stock.meta.symbol)),
                borderColor: stocks.map(stock => getColor(stock.meta.symbol)),
            }]
        }
    });

    // This gets the average high price
    function averageNumber(stockValues) {
        let totalSum = 0;
        stockValues.forEach(stockValue => {
            totalSum += parseFloat(stockValue.high);
        })
        return totalSum / stockValues.length;
    }
};

main();