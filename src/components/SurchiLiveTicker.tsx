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
  cardano: '0x3ee2200efb3400fabb9aacf31297cbdd1d435d47',
  dogecoin: '0xba2ae424d960542353e3014c02737e911293e7ee5',
  'shiba-inu': '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
  'avalanche-2': '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7',
  chainlink: '0x514910771af9ca656af840dff83e8264ecf986ca',
  'matic-network': '0x7d1afbc70cf79790a9131d37b6de2c6c9429a306',
  polkadot: '0x7083609fce4d1d8dc0c979aab8c869ea2c873402',
  near: '0x1fa4a73a33019911269c542b075c61411ec50153',
  uniswap: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
  litecoin: '0x4338665c0f57242d47d2beb7c3a4115162a3cdcb',
  pepe: '0x6982508145454ce325ddbe47a25d4ec3d2311933',
  'the-open-network': '0x582d872a33c0289f3546079c5ad107d6203cf224',
  stellar: '0x43c934a845205f0b514417d757d7235b8f53f1b9',
  sui: '0xe0C600B9b719602AA2D093206497BbeAbCcFCbC5',
  aptos: '0x1fa4ad03b22cf9a1ff0e1e9badb64c01f0b51478'
};

const INITIAL_COINS: TickerItem[] = [
  {
    id: 'surchi',
    name: 'SURCHI',
    symbol: 'SURCHI',
    image: 'https://raw.githubusercontent.com/surchiecosystem/brand-assets/main/logo.png',
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
  { id: 'cardano', name: 'Cardano', symbol: 'ada', image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png', current_price: 0.4421, price_change_percentage_24h: -1.82, address: COIN_ADDRESS_MAP['cardano'] },
  { id: 'dogecoin', name: 'Dogecoin', symbol: 'doge', image: 'https://assets.coingecko.com/coins/images/759/large/doge.png', current_price: 0.1385, price_change_percentage_24h: 2.15, address: COIN_ADDRESS_MAP['dogecoin'] },
  { id: 'shiba-inu', name: 'Shiba Inu', symbol: 'shib', image: 'https://assets.coingecko.com/coins/images/11939/large/shiba.png', current_price: 0.00001850, price_change_percentage_24h: -3.42, address: COIN_ADDRESS_MAP['shiba-inu'] },
  { id: 'avalanche-2', name: 'Avalanche', symbol: 'avax', image: 'https://assets.coingecko.com/coins/images/12559/large/Avalanche_Circle_RedWhite_Trans.png', current_price: 32.40, price_change_percentage_24h: 3.12, address: COIN_ADDRESS_MAP['avalanche-2'] },
  { id: 'chainlink', name: 'Chainlink', symbol: 'link', image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-link-logo.png', current_price: 14.85, price_change_percentage_24h: 1.22, address: COIN_ADDRESS_MAP['chainlink'] },
  { id: 'matic-network', name: 'Polygon', symbol: 'matic', image: 'https://assets.coingecko.com/coins/images/4713/large/polygon.png', current_price: 0.6215, price_change_percentage_24h: -0.95, address: COIN_ADDRESS_MAP['matic-network'] },
  { id: 'polkadot', name: 'Polkadot', symbol: 'dot', image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png', current_price: 5.85, price_change_percentage_24h: -1.15, address: COIN_ADDRESS_MAP['polkadot'] },
  { id: 'near', name: 'Near', symbol: 'near', image: 'https://assets.coingecko.com/coins/images/10365/large/near.png', current_price: 5.40, price_change_percentage_24h: 6.30, address: COIN_ADDRESS_MAP['near'] },
  { id: 'uniswap', name: 'Uniswap', symbol: 'uni', image: 'https://assets.coingecko.com/coins/images/12504/large/uniswap-uni.png', current_price: 7.25, price_change_percentage_24h: -2.40, address: COIN_ADDRESS_MAP['uniswap'] },
  { id: 'litecoin', name: 'Litecoin', symbol: 'ltc', image: 'https://assets.coingecko.com/coins/images/2/large/litecoin.png', current_price: 76.80, price_change_percentage_24h: 0.50, address: COIN_ADDRESS_MAP['litecoin'] },
  { id: 'pepe', name: 'Pepe', symbol: 'pepe', image: 'https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg', current_price: 0.00001140, price_change_percentage_24h: 11.20, address: COIN_ADDRESS_MAP['pepe'] },
  { id: 'the-open-network', name: 'Toncoin', symbol: 'ton', image: 'https://assets.coingecko.com/coins/images/17980/large/ton_token.png', current_price: 7.15, price_change_percentage_24h: 3.80, address: COIN_ADDRESS_MAP['the-open-network'] },
  { id: 'stellar', name: 'Stellar', symbol: 'xlm', image: 'https://assets.coingecko.com/coins/images/100/large/stellar.png', current_price: 0.1085, price_change_percentage_24h: -0.22, address: COIN_ADDRESS_MAP['stellar'] },
  { id: 'sui', name: 'Sui', symbol: 'sui', image: 'https://assets.coingecko.com/coins/images/26375/large/sui_logo.png', current_price: 1.15, price_change_percentage_24h: 8.45, address: COIN_ADDRESS_MAP['sui'] },
  { id: 'aptos', name: 'Aptos', symbol: 'apt', image: 'https://assets.coingecko.com/coins/images/26455/large/aptos_logo.png', current_price: 8.40, price_change_percentage_24h: 1.85, address: COIN_ADDRESS_MAP['aptos'] }
];

export function SurchiLiveTicker({ onSelectCoin, themeMode = 'dark' }: SurchiLiveTickerProps) {
  const [items, setItems] = useState<TickerItem[]>(INITIAL_COINS);

  const fetchTickerData = async () => {
    try {
      // 1. Fetch native SURCHI token data from DexScreener
      let nativePrice = 0.0215;
      let nativeChange = 3.42;
      try {
        let response;
        let data;
        try {
          response = await fetch('/api/proxy/dexscreener/search?q=SURCHI');
          const contentType = response?.headers.get("content-type") || "";
          if (response.ok && contentType.includes("application/json")) {
            data = await response.json();
          } else {
            throw new Error('Fallback direct');
          }
        } catch {
          const directRes = await fetch('https://api.dexscreener.com/latest/dex/search?q=SURCHI');
          if (directRes.ok) {
            data = await directRes.json();
          }
        }

        if (data && data.pairs && data.pairs.length > 0) {
          const filtered = data.pairs.filter((p: any) => p.baseToken?.symbol?.toUpperCase() === 'SURCHI');
          if (filtered.length > 0) {
            filtered.sort((a: any, b: any) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0));
            const bestPair = filtered[0];
            nativePrice = parseFloat(bestPair.priceUsd || '0.0215');
            nativeChange = parseFloat(bestPair.priceChange?.h24 || '3.42');
          }
        }
      } catch (err) {
        console.warn('Ticker proxy / direct SURCHI fetch failed, using baseline:', err);
      }

      // 2. Fetch top 20 coins by market cap from CoinGecko
      let fetchedCoins: TickerItem[] = [];
      try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            fetchedCoins = data.map((coin: any) => ({
              id: coin.id,
              name: coin.name,
              symbol: coin.symbol.toUpperCase(),
              image: coin.image,
              current_price: coin.current_price,
              price_change_percentage_24h: coin.price_change_percentage_24h || 0,
              address: COIN_ADDRESS_MAP[coin.id] || ''
            }));
          }
        } else {
          throw new Error(`CoinGecko returned status ${response.status}`);
        }
      } catch (cgErr) {
        console.warn('CoinGecko API is rate-limited or offline, using robust ticker fallback:', cgErr);
        // Fallback to updating only the native SURCHI price in the initial list
        const updatedInitial = INITIAL_COINS.map(coin => {
          if (coin.isNative) {
            return { ...coin, current_price: nativePrice, price_change_percentage_24h: nativeChange };
          }
          return coin;
        });
        setItems(updatedInitial);
        return;
      }

      // If we got CoinGecko data, construct the final ordered list
      if (fetchedCoins.length > 0) {
        const surchiTokenItem: TickerItem = {
          id: 'surchi',
          name: 'SURCHI',
          symbol: 'SURCHI',
          image: 'https://raw.githubusercontent.com/surchiecosystem/brand-assets/main/logo.png',
          current_price: nativePrice,
          price_change_percentage_24h: nativeChange,
          isNative: true,
          address: COIN_ADDRESS_MAP['surchi']
        };
        setItems([surchiTokenItem, ...fetchedCoins]);
      }
    } catch (globalErr) {
      console.warn('Silent live ticker update failure:', globalErr);
    }
  };

  useEffect(() => {
    fetchTickerData();
    const interval = setInterval(fetchTickerData, 60000); // refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  // Duplicate items array to make the infinite horizontal animation perfectly seamless
  const duplicatedItems = [...items, ...items];

  return (
    <div className={`w-full relative overflow-hidden select-none flex h-11 items-center border-t border-b transition-all duration-300 ${
      themeMode === 'light' 
        ? 'bg-white border-gray-200 shadow-2xs text-gray-800' 
        : 'bg-[#030308]/60 border-cyber-border text-slate-300'
    }`}>
      {/* 
        DEVELOPER ACCENT NOTE:
        Speed is reduced further by 5%.
        Our previous duration was 50s.
        50 * 1.05 = 52.5s.
        Using 53s to achieve precisely 5% slower scroll speed.
      */}
      <style>{`
        @keyframes tickerMarquee {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        .animate-ticker {
          display: flex;
          width: max-content;
          animation: tickerMarquee 56s linear infinite;
        }
      `}</style>
      
      <div className="animate-ticker py-1">
        {duplicatedItems.map((item, index) => {
          const isUp = item.price_change_percentage_24h >= 0;
          const rank = (index % items.length) + 1;
          const displayPrice = item.isNative ? '0.000' : formatAbbreviatedPrice(item.current_price);
          const displayChange = item.isNative ? '0.00' : Math.abs(item.price_change_percentage_24h).toFixed(2);
          
          return (
            <div 
              key={`${item.id}-${index}`} 
              onClick={() => {
                if (onSelectCoin && item.address) {
                  onSelectCoin(item.address, {
                    name: item.name,
                    symbol: item.symbol?.toUpperCase(),
                    address: item.address,
                    priceUsd: item.current_price,
                    priceChange24h: item.price_change_percentage_24h,
                    logo: item.image,
                    chainId: item.id === 'solana' ? 'solana' : 'ethereum'
                  });
                }
              }}
              className="flex items-center gap-3 px-4 shrink-0 border-r border-gray-100/10 cursor-pointer hover:opacity-80 transition-all select-none"
              title={`Click to analyze ${item.name}`}
            >
              <div 
                className={`flex items-center gap-2 py-1 px-2.5 rounded-full transition-all ${
                  themeMode === 'light' ? 'text-gray-800' : 'text-slate-300'
                }`}
              >
                {/* Sequentially dynamic coin ranking numbers */}
                <span className={`text-[10px] font-mono select-none px-1 rounded bg-slate-500/10 ${
                  themeMode === 'light' ? 'text-slate-600' : 'text-slate-400'
                }`}>
                  #{rank}
                </span>

                {/* Logo with safe image error handling */}
                <div className="w-4.5 h-4.5 rounded-full overflow-hidden flex items-center justify-center shrink-0 bg-gray-100 border border-gray-200/20 relative">
                  <img 
                    src={item.image} 
                    alt={item.symbol} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      if (e.currentTarget.nextElementSibling) {
                        e.currentTarget.nextElementSibling.classList.remove('hidden');
                      }
                    }}
                  />
                  <div className="hidden absolute inset-0 flex items-center justify-center text-[7px] text-gray-500 font-black tracking-tight leading-none bg-purple-50">
                    {item.symbol.slice(0, 2)}
                  </div>
                </div>

                {/* Token Symbol/Name */}
                <span className="text-[11.5px] tracking-tight uppercase font-extrabold font-sans flex items-center gap-1">
                  {item.symbol}
                  {item.isNative && (
                    <span className={`text-[8px] px-1 py-0.25 rounded ${
                      themeMode === 'light' ? 'bg-slate-100 text-slate-600' : 'bg-slate-800 text-slate-400'
                    }`}>
                      NATIVE
                    </span>
                  )}
                </span>

                {/* Live Value */}
                <span className="text-[11.5px] font-mono font-medium">
                  ${displayPrice}
                </span>

                {/* Percentage Change indicator */}
                <span 
                  className={`inline-flex items-center font-mono font-black text-[10px] ${
                    item.isNative 
                      ? (themeMode === 'light' ? 'text-slate-500' : 'text-slate-400')
                      : isUp ? 'text-emerald-500' : 'text-rose-500'
                  }`}
                >
                  {item.isNative ? '➖' : (isUp ? '🔼' : '🔽')}{displayChange}%
                </span>
              </div>

              {/* Ticker Separator | (unless it's native token or standard separator format) */}
              <span className={`font-light text-[11px] font-mono leading-none select-none ${themeMode === 'light' ? 'text-gray-300' : 'text-slate-800'}`}>|</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
