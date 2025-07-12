// MOOSH WALLET - LIVE BITCOIN DATA IMPLEMENTATION
// Fetches real-time Bitcoin price, block time, and fee data

(function() {
    'use strict';

    console.log('[LiveBitcoinData] Initializing real-time data updates...');

    // Configuration
    const UPDATE_INTERVALS = {
        price: 30000,      // 30 seconds for price
        blockTime: 60000,  // 1 minute for block time
        fees: 120000       // 2 minutes for fees
    };

    // Cache for data
    let dataCache = {
        price: { value: 0, change: 0, lastUpdate: 0 },
        blockTime: { minutes: 10, lastUpdate: 0 },
        fees: { fast: 0, medium: 0, slow: 0, lastUpdate: 0 }
    };

    // Wait for wallet to be ready
    function waitForWallet() {
        return new Promise((resolve) => {
            const checkInterval = setInterval(() => {
                if (window.MooshWallet && window.MooshWallet.apiService) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
            
            setTimeout(() => {
                clearInterval(checkInterval);
                resolve();
            }, 10000);
        });
    }

    // Fetch Bitcoin price from multiple sources
    async function fetchBitcoinPrice() {
        try {
            // Try CoinGecko first
            const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true');
            const data = await response.json();
            
            if (data.bitcoin) {
                dataCache.price = {
                    value: data.bitcoin.usd,
                    change: data.bitcoin.usd_24h_change || 0,
                    lastUpdate: Date.now()
                };
                return dataCache.price;
            }
        } catch (error) {
            console.warn('[LiveBitcoinData] CoinGecko API failed:', error);
        }

        // Fallback to alternative API
        try {
            const response = await fetch('https://blockchain.info/ticker');
            const data = await response.json();
            
            if (data.USD) {
                dataCache.price = {
                    value: data.USD.last,
                    change: 0, // Blockchain.info doesn't provide 24h change
                    lastUpdate: Date.now()
                };
                return dataCache.price;
            }
        } catch (error) {
            console.error('[LiveBitcoinData] All price APIs failed:', error);
        }

        return dataCache.price;
    }

    // Fetch mempool data (block time and fees)
    async function fetchMempoolData() {
        try {
            // Fetch recommended fees
            const feesResponse = await fetch('https://mempool.space/api/v1/fees/recommended');
            const feesData = await feesResponse.json();
            
            if (feesData) {
                dataCache.fees = {
                    fast: feesData.fastestFee || 0,
                    medium: feesData.halfHourFee || 0,
                    slow: feesData.hourFee || 0,
                    lastUpdate: Date.now()
                };
            }

            // Fetch latest blocks to estimate next block time
            const blocksResponse = await fetch('https://mempool.space/api/blocks');
            const blocks = await blocksResponse.json();
            
            if (blocks && blocks.length > 0) {
                // Calculate average block time from last 10 blocks
                let totalTime = 0;
                let count = 0;
                
                for (let i = 1; i < Math.min(blocks.length, 10); i++) {
                    const timeDiff = blocks[i-1].timestamp - blocks[i].timestamp;
                    totalTime += timeDiff;
                    count++;
                }
                
                const avgBlockTime = totalTime / count / 60; // Convert to minutes
                const lastBlockAge = (Date.now() / 1000 - blocks[0].timestamp) / 60; // Minutes since last block
                const estimatedTimeToNext = Math.max(1, Math.round(avgBlockTime - lastBlockAge));
                
                dataCache.blockTime = {
                    minutes: estimatedTimeToNext,
                    lastUpdate: Date.now()
                };
            }
        } catch (error) {
            console.error('[LiveBitcoinData] Mempool API failed:', error);
        }

        return { fees: dataCache.fees, blockTime: dataCache.blockTime };
    }

    // Update UI with real data
    function updateUI() {
        // Update price
        const priceElement = document.getElementById('btcPrice');
        const priceChangeElement = priceElement?.nextElementSibling?.nextElementSibling;
        
        if (priceElement && dataCache.price.value > 0) {
            priceElement.textContent = dataCache.price.value.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            });
        }
        
        if (priceChangeElement && dataCache.price.change !== undefined) {
            const change = dataCache.price.change;
            const arrow = change >= 0 ? '↑' : '↓';
            const color = change >= 0 ? '#69fd97' : '#ff4444';
            priceChangeElement.textContent = `${arrow} ${Math.abs(change).toFixed(1)}%`;
            priceChangeElement.style.color = color;
        }

        // Update block time
        const blockElement = document.getElementById('nextBlock');
        if (blockElement && dataCache.blockTime.minutes > 0) {
            blockElement.textContent = dataCache.blockTime.minutes.toString();
        }

        // Update fee rate (use medium fee as default)
        const feeElement = document.getElementById('feeRate');
        if (feeElement && dataCache.fees.medium > 0) {
            feeElement.textContent = dataCache.fees.medium.toString();
        }
    }

    // Initialize and start periodic updates
    async function init() {
        await waitForWallet();
        
        console.log('[LiveBitcoinData] Starting real-time data updates...');

        // Initial fetch
        await Promise.all([
            fetchBitcoinPrice(),
            fetchMempoolData()
        ]);
        
        updateUI();

        // Set up periodic updates
        setInterval(async () => {
            await fetchBitcoinPrice();
            updateUI();
        }, UPDATE_INTERVALS.price);

        setInterval(async () => {
            await fetchMempoolData();
            updateUI();
        }, UPDATE_INTERVALS.blockTime);

        console.log('[LiveBitcoinData] Real-time updates active');

        // Also update when dashboard is rendered
        const originalRender = window.MooshWallet?.router?.render;
        if (originalRender) {
            window.MooshWallet.router.render = function() {
                const result = originalRender.call(this);
                
                // Update data after render
                setTimeout(() => {
                    updateUI();
                }, 100);
                
                return result;
            };
        }
    }

    // Expose functions for manual updates
    window.MooshLiveData = {
        fetchPrice: fetchBitcoinPrice,
        fetchMempool: fetchMempoolData,
        updateUI: updateUI,
        getCache: () => dataCache,
        refreshAll: async () => {
            await Promise.all([
                fetchBitcoinPrice(),
                fetchMempoolData()
            ]);
            updateUI();
        }
    };

    // Start the system
    init();

})();