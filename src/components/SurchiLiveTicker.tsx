import { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { formatAbbreviatedPrice } from '../utils/priceFormatter';

interface TickerItem {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  isNative?: boolean;
  address?: string;
}

interface SurchiLiveTickerProps {
  onSelectCoin?: (address: string, optionalToken?: any) => void;
  themeMode?: 'dark' | 'light';
}

const COIN_ADDRESS_MAP: Record<string, string> = {
  surchi: '9u9surchi_ecosystem_token_placeholder',
  bitcoin: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', // WBTC mainnet Ethereum
  ethereum: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH mainnet Ethereum
  binancecoin: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c', // WBNB Smart Chain
  solana: 'So11111111111111111111111111111111111111112', // WSOL native Solana mint
  ripple: '0x1d2f0da169232536e1541a78d8b6e26b5e1a437d',
  'usd-coin': '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  cardano: '0x3ee2200efb3400fabb9aacf31297cbdd1d435d47',
  'avalanche-2': '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
  dogecoin: '0xba2ae4247960542353e3014c02737e911293e7ee5',
  tron: '0x50327e0212ccc7724d30f6a251a3511eb9bdfb10',
  chainlink: '0x514910771af9ca656af840dff83e8264ecf986ca',
  polkadot: '0x7083609fce4d1d8dc0c979aab8c869ea2c873402',
  'matic-network': '0x7d1afbc70cf79790a9131d37b6de2c6c9429a306',
  uniswap: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
  litecoin: '0x4338665c0f57242d47d2beb7c3a4115162a3cdcb',
  cosmos: '0x1fa4ad03b22cf9a1ff0e1e9badb64c01f0b51478',
  stellar: '0x43c934a845205f0b514417d757d7235b8f53f1b9',
  'internet-computer': '0x2bf7ab5db7edf685c29012f2c8a306fe963dcedf',
  filecoin: '0xfa8959d332616f7435fca3d68bcbb05b8214b7e1',
  aptos: '0x1fa4ad03b22cf9a1ff0e1e9badb64c01f0b51478'
};

const INITIAL_COINS: TickerItem[] = [
  {
    id: 'surchi',
    name: 'SURCHI',
    symbol: 'SURCHI',
    image: 'https://raw.githubusercontent.com/surchiai/surchiai.github.io/refs/heads/main/SURCHI%20logo.jpg',
    current_price: 0.0215,
    price_change_percentage_24h: 3.42,
    isNative: true,
    address: COIN_ADDRESS_MAP['surchi']
  },
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'btc', image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', current_price: 68450.20, price_change_percentage_24h: 1.45, address: COIN_ADDRESS_MAP['bitcoin'] },
  { id: 'ethereum', name: 'Ethereum', symbol: 'eth', image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', current_price: 3450.15, price_change_percentage_24h: -0.85, address: COIN_ADDRESS_MAP['ethereum'] },
  { id: 'binancecoin', name: 'BNB', symbol: 'bnb', image: 'https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png', current_price: 582.40, price_change_percentage_24h: 0.12, address: COIN_ADDRESS_MAP['binancecoin'] },
  { id: 'solana', name: 'Solana', symbol: 'sol', image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png', current_price: 145.22, price_change_percentage_24h: 4.85, address: COIN_ADDRESS_MAP['solana'] },
  { id: 'ripple', name: 'XRP', symbol: 'xrp', image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png', current_price: 0.5234, price_change_percentage_24h: -0.42, address: COIN_ADDRESS_MAP['ripple'] },
  { id: 'usd-coin', name: 'USD Coin', symbol: 'usdc', image: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png', current_price: 1.00, price_change_percentage_24h: 0.01, address: COIN_ADDRESS_MAP['usd-coin'] },
  { id: 'cardano', name: 'Cardano', symbol: 'ada', image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png', current_price: 0.4421, price_change_percentage_24h: -1.82, address: COIN_ADDRESS_MAP['cardano'] },
  { id: 'avalanche-2', name: 'Avalanche', symbol: 'avax', image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png', current_price: 32.40, price_change_percentage_24h: 3.12, address: COIN_ADDRESS_MAP['avalanche-2'] },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'doge', image: 'https://assets.coingecko.com/coins/images/759/large/doge.png', current_price: 0.1385, price_change_percentage_24h: 2.15, address: COIN_ADDRESS_MAP['dogecoin'] },
  { id: 'tron', name: 'TRON', symbol: 'trx', image: 'https://assets.coingecko.com/coins/images/1094/large/tron.png', current_price: 0.1172, price_change_percentage_24h: 0.45, address: COIN_ADDRESS_MAP['tron'] },
  { id: 'chainlink', name: 'Chainlink', symbol: 'link', image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-link-logo.png', current_price: 14.85, price_change_percentage_24h: 1.22, address: COIN_ADDRESS_MAP['chainlink'] },
  { id: 'polkadot', name: 'Polkadot', symbol: 'dot', image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png', current_price: 5.85, price_change_percentage_24h: -1.15, address: COIN_ADDRESS_MAP['polkadot'] },
  { id: 'matic-network', name: 'Polygon', symbol: 'matic', image: 'https://assets.coingecko.com/coins/images/4713/large/polygon.png', current_price: 0.6215, price_change_percentage_24h: -0.95, address: COIN_ADDRESS_MAP['matic-network'] },
  { id: 'uniswap', name: 'Uniswap', symbol: 'uni', image: 'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png', current_price: 7.25, price_change_percentage_24h: -2.40, address: COIN_ADDRESS_MAP['uniswap'] },
  { id: 'litecoin', name: 'Litecoin', symbol: 'ltc', image: 'https://assets.coingecko.com/coins/images/2/large/litecoin.png', current_price: 76.80, price_change_percentage_24h: 0.50, address: COIN_ADDRESS_MAP['litecoin'] },
  { id: 'cosmos', name: 'Cosmos', symbol: 'atom', image: 'https://assets.coingecko.com/coins/images/1481/large/cosmos_hub.png', current_price: 8.50, price_change_percentage_24h: -0.75, address: COIN_ADDRESS_MAP['cosmos'] },
  { id: 'stellar', name: 'Stellar', symbol: 'xlm', image: 'https://assets.coingecko.com/coins/images/100/large/stellar.png', current_price: 0.1085, price_change_percentage_24h: -0.22, address: COIN_ADDRESS_MAP['stellar'] },
  { id: 'internet-computer', name: 'ICP', symbol: 'icp', image: 'https://assets.coingecko.com/coins/images/14495/large/Internet_Computer_logo.png', current_price: 11.20, price_change_percentage_24h: 4.10, address: COIN_ADDRESS_MAP['internet-computer'] },
  { id: 'filecoin', name: 'Filecoin', symbol: 'fil', image: 'https://assets.coingecko.com/coins/images/12817/large/filecoin.png', current_price: 5.65, price_change_percentage_24h: -2.10, address: COIN_ADDRESS_MAP['filecoin'] },
  { id: 'aptos', name: 'Aptos', symbol: 'apt', image: 'https://assets.coingecko.com/coins/images/26455/large/aptos_logo.png', current_price: 8.40, price_change_percentage_24h: 1.85, address: COIN_ADDRESS_MAP['aptos'] }
];

export function SurchiLiveTicker({ onSelectCoin, themeMode = 'dark' }: SurchiLiveTickerProps) {
  // Initialize prices as null for each coin to render blank spaces initially
  const [livePrices, setLivePrices] = useState<Record<string, { price: number; change: number } | null>>({});

  const fetchTickerData = async () => {
    try {
      const newPrices: Record<string, { price: number; change: number }> = {};

      // 1. Try CoinGecko Public API
      try {
        const cgRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,solana,ripple,usd-coin,cardano,avalanche-2,dogecoin,tron,chainlink,polkadot,matic-network,uniswap,litecoin,cosmos,stellar,internet-computer,filecoin,aptos&vs_currencies=usd&include_24hr_change=true');
        if (cgRes.ok) {
          const data = await cgRes.json();
          if (data && typeof data === 'object') {
            Object.keys(data).forEach((id) => {
              if (data[id] && typeof data[id].usd === 'number') {
                newPrices[id] = {
                  price: data[id].usd,
                  change: data[id].usd_24h_change || 0
                };
              }
            });
          }
        } else {
          throw new Error('CoinGecko API returned error status');
        }
      } catch (err) {
        // Fallback to CryptoCompare
        try {
          const ccRes = await fetch('https://min-api.cryptocompare.com/data/pricemultifull?fsyms=BTC,ETH,BNB,SOL,XRP,USDC,ADA,AVAX,DOGE,TRX,LINK,DOT,MATIC,UNI,LTC,ATOM,XLM,ICP,FIL,APT&tsyms=USD');
          if (ccRes.ok) {
            const data = await ccRes.json();
            if (data && data.RAW) {
              INITIAL_COINS.forEach((coin) => {
                if (coin.id === 'surchi') return;
                const sym = coin.symbol.toUpperCase();
                const rawCoin = data.RAW[sym]?.USD || data.RAW[sym]?.usd;
                if (rawCoin && typeof rawCoin.PRICE === 'number') {
                  newPrices[coin.id] = {
                    price: rawCoin.PRICE,
                    change: rawCoin.CHANGEPCT24HOUR || 0
                  };
                }
              });
            }
          }
        } catch (ccErr) {
          // Silent fallback
        }
      }

      // 2. Fetch Native SURCHI price from DexScreener search
      try {
        const sRes = await fetch('https://api.dexscreener.com/latest/dex/search?q=SURCHI');
        if (sRes.ok) {
          const data = await sRes.json();
          if (data && data.pairs && data.pairs.length > 0) {
            const filtered = data.pairs.filter((p: any) => p.baseToken?.symbol?.toUpperCase() === 'SURCHI');
            if (filtered.length > 0) {
              filtered.sort((a: any, b: any) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0));
              const bestPair = filtered[0];
              newPrices['surchi'] = {
                price: parseFloat(bestPair.priceUsd || '0.0215'),
                change: parseFloat(bestPair.priceChange?.h24 || '3.42')
              };
            }
          }
        }
        if (!newPrices['surchi']) {
          // Support backup fetch of SURCHI via proxy on backend
          const bkRes = await fetch('/api/proxy/tickerCoins');
          if (bkRes.ok) {
            const bkData = await bkRes.json();
            const bkSurchi = bkData?.coins?.find((c: any) => c.id === 'surchi');
            if (bkSurchi) {
              newPrices['surchi'] = {
                price: bkSurchi.current_price || 0.0215,
                change: bkSurchi.price_change_percentage_24h || 3.42
              };
            }
          }
        }
      } catch (sErr) {
        try {
          const bkRes = await fetch('/api/proxy/tickerCoins');
          if (bkRes.ok) {
            const bkData = await bkRes.json();
            const bkSurchi = bkData?.coins?.find((c: any) => c.id === 'surchi');
            if (bkSurchi) {
              newPrices['surchi'] = {
                price: bkSurchi.current_price || 0.0215,
                change: bkSurchi.price_change_percentage_24h || 3.42
              };
            }
          }
        } catch (bkErr) {
          // Silent
        }
      }

      // Update the state using prev state callback to preserve previous successfully fetched items 
      setLivePrices(prev => {
        const updated = { ...prev };
        Object.entries(newPrices).forEach(([id, val]) => {
          if (val) {
            updated[id] = val;
          }
        });
        return updated;
      });
    } catch (globalErr) {
      // Handle silently as required
    }
  };

  useEffect(() => {
    fetchTickerData();

    // Poll every 10–30 seconds (randomize within that range to avoid rate limits)
    const randomizedInterval = Math.floor(Math.random() * (30000 - 10000 + 1)) + 10000;
    const intervalId = setInterval(fetchTickerData, randomizedInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // Duplicate items array to make the infinite horizontal animation perfectly seamless
  const duplicatedItems = [...INITIAL_COINS, ...INITIAL_COINS];

  return (
    <div className={`w-full relative overflow-hidden select-none flex h-[50px] items-center border-t border-b transition-all duration-300 ${
      themeMode === 'light' 
        ? 'bg-white border-gray-200 shadow-3xs text-gray-800' 
        : 'bg-[#030308]/60 border-cyber-border text-slate-300'
    }`}>
      <style>{`
        @keyframes tickerMarquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-ticker {
          display: flex;
          width: max-content;
          animation: tickerMarquee 59.5s linear infinite;
        }
      `}</style>
      
      <div className="animate-ticker py-0.5">
        {duplicatedItems.map((item, index) => {
          const liveData = livePrices[item.id];
          const hasData = !!liveData;

          const price = hasData ? liveData.price : 0;
          const changePct = hasData ? liveData.change : 0;
          const isUp = changePct >= 0;
          const rank = (index % INITIAL_COINS.length) + 1;

          const displayPrice = hasData 
            ? (item.isNative 
              ? '0.000'
              : (price < 0.1 
                ? price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 6 }) 
                : formatAbbreviatedPrice(price)))
            : '';
            
          const displayChange = hasData ? Math.abs(changePct).toFixed(2) : '';
          
          return (
            <div 
              key={`${item.id}-${index}`} 
              onClick={() => {
                if (onSelectCoin && item.address) {
                  onSelectCoin(item.address, {
                    name: item.name,
                    symbol: item.symbol?.toUpperCase(),
                    address: item.address,
                    priceUsd: hasData ? price : item.current_price,
                    priceChange24h: hasData ? changePct : item.price_change_percentage_24h,
                    logo: item.image,
                    chainId: item.id === 'solana' ? 'solana' : 'ethereum'
                  });
                }
              }}
              className="flex items-center gap-3 px-5 shrink-0 border-r border-gray-100/10 cursor-pointer hover:opacity-85 transition-all select-none"
              title={`Click to analyze ${item.name}`}
            >
              <div className="py-1" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                
                {/* 1. Coin Icon */}
                <div className={`w-[20px] h-[20px] rounded-full overflow-hidden flex items-center justify-center shrink-0 bg-gray-100 border-[1.5px] relative shadow-sm ${
                  themeMode === 'light' ? 'border-gray-500' : 'border-cyber-cyan/80'
                }`}>
                  <img 
                    src={item.image} 
                    alt={item.symbol} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full select-none"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      if (e.currentTarget.nextElementSibling) {
                        e.currentTarget.nextElementSibling.classList.remove('hidden');
                      }
                    }}
                  />
                  <div className="hidden absolute inset-0 flex items-center justify-center text-[7px] text-gray-500 font-extrabold bg-[#8b5cf6]/20">
                    {item.symbol.slice(0, 2)}
                  </div>
                </div>

                {/* 2. Rank */}
                <span className={`text-[11px] font-mono font-medium opacity-60 ${
                  themeMode === 'light' ? 'text-gray-500' : 'text-slate-400'
                }`}>
                  #{rank}
                </span>

                {/* 3. Ticker */}
                <span className={`text-[11px] uppercase font-mono font-bold flex items-center gap-0.5 ${
                  themeMode === 'light' ? 'text-gray-950' : 'text-white'
                }`}>
                  {item.symbol.toUpperCase()}
                  {item.isNative && (
                    <span className="bg-cyan-500/20 text-[#00E5FF] text-[6.5px] px-0.5 py-0.1 rounded-xs scale-90 font-sans tracking-wide font-black">
                      NATIVE
                    </span>
                  )}
                </span>

                {/* 4. Price */}
                {hasData ? (
                  <span 
                    className={`text-[11px] font-mono font-bold tracking-tight ${
                      themeMode === 'light' ? 'text-gray-950' : 'text-slate-100'
                    }`}
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    ${displayPrice}
                  </span>
                ) : null}

                {/* 5. 24h % Change with directional indicator */}
                {hasData ? (
                  <span className={`text-[10.5px] font-mono font-bold tracking-tight ${
                    isUp ? 'text-emerald-500' : 'text-rose-500'
                  }`}>
                    {isUp ? `▲ +${displayChange}%` : `▼ -${displayChange}%`}
                  </span>
                ) : (
                  <span className={`text-[10.5px] font-mono font-bold tracking-tight ${
                    themeMode === 'light' ? 'text-gray-400' : 'text-slate-500'
                  }`}>
                    —
                  </span>
                )}
              </div>

              {/* Ticker Separator */}
              <span className={`font-light text-[11px] font-mono leading-none select-none ml-1 opacity-20 ${themeMode === 'light' ? 'text-gray-400' : 'text-slate-500'}`}>|</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
