// Date range: Nov 2024 to Oct 2025, approximately 12 months
const months = [
    '2024-11', '2024-12', '2025-01', '2025-02', '2025-03',
    '2025-04', '2025-05', '2025-06', '2025-07', '2025-08',
    '2025-09', '2025-10'
];

// Initial and final BTC prices for the model
const btcStartPrice = 69000;
const btcEndPrice = 400000;

// Model parameters for MSTR and SOL
const mstrMultiplier = 1.5;  // Approximate multiplier for MSTR to follow BTC growth
const solMultiplier = 5;     // SOL trading bot's target multiplier on BTC growth

// Generate BTC, MSTR, and SOL prices over time
function generateData() {
    const btcPrices = [];
    const mstrPrices = [];
    const solPrices = [];

    for (let i = 0; i < months.length; i++) {
        // Linear interpolation for BTC prices
        const btcPrice = btcStartPrice + (btcEndPrice - btcStartPrice) * (i / (months.length - 1));

        // Calculate MSTR and SOL prices based on BTC price
        const mstrPrice = btcPrice * mstrMultiplier;
        const solPrice = btcPrice * solMultiplier;

        // Store prices
        btcPrices.push(btcPrice);
        mstrPrices.push(mstrPrice);
        solPrices.push(solPrice);
    }

    return { months, btcPrices, mstrPrices, solPrices };
}

// Plot the data
function plotData(data) {
    // Define traces for BTC, MSTR, and SOL
    const btcTrace = {
        x: data.months,
        y: data.btcPrices,
        type: 'scatter',
        mode: 'lines',
        name: 'BTC Price',
        line: { width: 2 }
    };

    const mstrTrace = {
        x: data.months,
        y: data.mstrPrices,
        type: 'scatter',
        mode: 'lines',
        name: 'MSTR Price (1.5x BTC)',
        line: { width: 2, dash: 'dash' }
    };

    const solTrace = {
        x: data.months,
        y: data.solPrices,
        type: 'scatter',
        mode: 'lines',
        name: 'SOL Trading Bot (5x BTC)',
        line: { width: 2, dash: 'dot' }
    };

    // Define layout
    const layout = {
        title: 'Projected Prices: BTC, MSTR, and SOL Trading Bot',
        xaxis: { title: 'Date' },
        yaxis: { title: 'Price (USD)', type: 'log' }, // Log scale to better visualize differences
    };

    // Plot the chart
    Plotly.newPlot('chart', [btcTrace, mstrTrace, solTrace], layout);
}

// Generate data and plot
const data = generateData();
plotData(data);
