// Date range: Nov 2024 to Oct 2025, approximately 12 months
const months = [
    '2024-11', '2024-12', '2025-01', '2025-02', '2025-03',
    '2025-04', '2025-05', '2025-06', '2025-07', '2025-08',
    '2025-09', '2025-10'
];

// Initial and final BTC, MSTR, and SOL prices
const btcStartPrice = 69000;
const btcEndPrice = 400000;
const mstrStartPrice = btcStartPrice * 1.5;
const solStartPrice = 166;
const solEndPrice = 1800;

// Initial portfolio value
const initialPortfolioValue = 460000;

// Portfolio allocations
const allocationsSolBotPortfolio = {
    BTC: 0.5 * initialPortfolioValue,
    SOL: 0.25 * initialPortfolioValue,
    SOL_BOT: 0.25 * initialPortfolioValue
};

const allocationsMstrPortfolio = {
    BTC: 0.5 * initialPortfolioValue,
    MSTR: 0.5 * initialPortfolioValue
};

// Exponential growth factors for MSTR and SOL within the given range
const mstrGrowthFactor = Math.pow(mstrStartPrice / btcStartPrice, 1 / (months.length - 1));
const solGrowthFactor = Math.pow(solEndPrice / solStartPrice, 1 / (months.length - 1));
const btcGrowthFactor = Math.pow(btcEndPrice / btcStartPrice, 1 / (months.length - 1));
const solBotMultiplier = 5; // SOL bot’s multiplier

// Generate BTC, MSTR, SOL, and SOL bot prices and portfolio values
function generateData() {
    const btcPrices = [];
    const mstrPrices = [];
    const solPrices = [];
    const solBotPrices = [];
    const portfolioSolBot = [];
    const portfolioMstr = [];

    let btcPrice = btcStartPrice;
    let mstrPrice = mstrStartPrice;
    let solPrice = solStartPrice;

    for (let i = 0; i < months.length; i++) {
        // Calculate BTC, MSTR, and SOL prices using exponential growth
        btcPrices.push(btcPrice);
        mstrPrices.push(mstrPrice);
        solPrices.push(solPrice);
        solBotPrices.push(solPrice * solBotMultiplier);

        // Calculate portfolio values
        const solBotPortfolioValue =
            allocationsSolBotPortfolio.BTC * (btcPrice / btcStartPrice) +
            allocationsSolBotPortfolio.SOL * (solPrice / solStartPrice) +
            allocationsSolBotPortfolio.SOL_BOT * (solPrice * solBotMultiplier / solStartPrice);

        const mstrPortfolioValue =
            allocationsMstrPortfolio.BTC * (btcPrice / btcStartPrice) +
            allocationsMstrPortfolio.MSTR * (mstrPrice / mstrStartPrice);

        portfolioSolBot.push(solBotPortfolioValue);
        portfolioMstr.push(mstrPortfolioValue);

        // Update prices for next month using exponential growth factors
        btcPrice *= btcGrowthFactor;
        mstrPrice *= mstrGrowthFactor;
        solPrice *= solGrowthFactor;
    }

    return { months, btcPrices, mstrPrices, solPrices, solBotPrices, portfolioSolBot, portfolioMstr };
}

// Plot the data
function plotData(data) {
    // Define traces for BTC, MSTR, SOL, SOL Bot, and both portfolio values
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
        name: 'MSTR Price (Exponential Growth)',
        line: { width: 2, dash: 'dash' }
    };

    const solTrace = {
        x: data.months,
        y: data.solPrices,
        type: 'scatter',
        mode: 'lines',
        name: 'SOL Price (Exponential Growth)',
        line: { width: 2, dash: 'dot' }
    };

    const solBotTrace = {
        x: data.months,
        y: data.solBotPrices,
        type: 'scatter',
        mode: 'lines',
        name: 'SOL Trading Bot (5x Projected)',
        line: { width: 2, dash: 'dot' }
    };

    const portfolioSolBotTrace = {
        x: data.months,
        y: data.portfolioSolBot,
        type: 'scatter',
        mode: 'lines',
        name: 'Portfolio with SOL Trading Bot',
        line: { width: 3, color: 'green' }
    };

    const portfolioMstrTrace = {
        x: data.months,
        y: data.portfolioMstr,
        type: 'scatter',
        mode: 'lines',
        name: 'Portfolio with MSTR',
        line: { width: 3, color: 'blue' }
    };

    // Define layout
    const layout = {
        title: 'Projected Portfolio Values: SOL Trading Bot vs. MSTR',
        xaxis: { title: 'Date' },
        yaxis: { title: 'Value (USD)', type: 'log' }, // Log scale to better visualize differences
    };

    // Plot the chart
    Plotly.newPlot('chart', [btcTrace, mstrTrace, solTrace, solBotTrace, portfolioSolBotTrace, portfolioMstrTrace], layout);
}

// Generate data and plot
const data = generateData();
plotData(data);
