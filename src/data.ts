import { ModuleConfig } from './types';

export const MODULES: ModuleConfig[] = [
  {
    id: 'token_analyzer',
    name: 'Token Analyzer',
    description: '',
    icon: 'Activity',
    inputs: [
      {
        key: 'token',
        label: 'Token Name, Ticker, or CA',
        type: 'text',
        placeholder: 'e.g., Solana, SOL, or contract address...'
      }
    ],
    buttonText: 'Analyze Token Parameters',
    statusText: 'Analyzing Market Coordinates...',
    accentColor: 'cyan'
  },
  {
    id: 'neural_sentiment_engine',
    name: 'Neural Sentiment Engine',
    description: 'Deconstruct aggregate on-chain sentiment clusters, community fear parameters, and social chatter models to uncover price-shifting catalysts.',
    icon: 'Brain',
    inputs: [
      {
        key: 'token',
        label: 'Target Token / Ticker / Community Asset',
        type: 'text',
        placeholder: 'e.g., SURCHI, SOL, BONK, or community ticker...'
      },
      {
        key: 'sentimentScale',
        label: 'Sentiment Filter Depth',
        type: 'select',
        placeholder: 'Select chatter sample size...',
        options: [
          { label: 'Standard (Top 1,000 Social Elements)', value: 'standard' },
          { label: 'Extended Deep Scan (Top 10,000 Social Nodes)', value: 'heavy' }
        ],
        defaultValue: 'standard'
      }
    ],
    buttonText: 'Compute Neural Sentiment',
    statusText: 'Mapping Cognitive Chatter Channels...',
    accentColor: 'purple'
  },
  {
    id: 'smart_money_tracker',
    name: 'Smart Money Tracker',
    description: 'Execute high-precision wallet tracking on top Whale accounts, development cluster nodes, and venture-tier capital routes.',
    icon: 'Wallet',
    inputs: [
      {
        key: 'wallet',
        label: 'Target Wallet Address or Cluster Name',
        type: 'text',
        placeholder: 'e.g., Whalewallet.sol, 0x123..., or Surchi Dev Core...'
      }
    ],
    buttonText: 'Audit Capital Flow Vectors',
    statusText: 'Deconstructing Capital Trails...',
    accentColor: 'cyan'
  },
  {
    id: 'rug_radar',
    name: 'Rug Radar',
    description: 'Continuous monitoring of smart contract properties, dynamic sell-tax anomalies, LP locks, and creator withdrawal queues.',
    icon: 'Radio',
    inputs: [
      {
        key: 'address',
        label: 'Contract Address (CA) or Token',
        type: 'text',
        placeholder: 'e.g., Provide token contract address to scan...'
      }
    ],
    buttonText: 'Scan for Suspicious Signatures',
    statusText: 'Synchronizing Cybernetic Sentinel Feeds...',
    accentColor: 'green'
  },
  {
    id: 'agent_deployer',
    name: 'Agent Deployer',
    description: 'Structure, test, and host dedicated AI agents, autonomous traders, and sentiment monitoring bots directly on decentralized infrastructure clouds.',
    icon: 'Cpu',
    inputs: [
      {
        key: 'directives',
        label: 'Custom Persona Directives & Trade Constraints',
        type: 'textarea',
        placeholder: 'e.g., Watch BONK liquidity pool. If sentiment score drops below 40%, automatically route 5% LP to USDC reserve bucket...'
      }
    ],
    buttonText: 'Compile & Launch Autonomous Agent',
    statusText: 'Synthesizing Agent Neural Nodes...',
    accentColor: 'purple'
  },
  {
    id: 'smart_auditor',
    name: 'Smart Contract Auditor',
    description: 'Provide any token contract address to perform dynamic deep security checks, honeypot audits, freeze/mint checks, and multi-chain risk diagnostics.',
    icon: 'ShieldAlert',
    inputs: [
      {
        key: 'address',
        label: 'Contract Address (CA)',
        type: 'text',
        placeholder: 'e.g., 0x2170ed0880ac9a755fd29b2688956bd959f933f8 or Solana/Base CA...'
      },
      {
        key: 'chainId',
        label: 'Target Chain Network',
        type: 'select',
        placeholder: 'Select target blockchain network...',
        options: [
          { label: 'Ethereum', value: 'ethereum' },
          { label: 'Solana', value: 'solana' },
          { label: 'BNB Chain', value: 'binance-smart-chain' },
          { label: 'Base', value: 'base' },
          { label: 'Arbitrum One', value: 'arbitrum' },
          { label: 'Polygon', value: 'polygon' },
          { label: 'Avalanche', value: 'avalanche' },
          { label: 'Sui', value: 'sui' },
          { label: 'Tron', value: 'tron' },
          { label: 'Bitcoin (BRC-20/Runes)', value: 'bitcoin' }
        ],
        defaultValue: 'ethereum'
      }
    ],
    buttonText: 'Execute Deep Security Scan',
    statusText: 'Auditing Security Vectors...',
    accentColor: 'purple'
  },
  {
    id: 'rug_detector',
    name: 'Rug Pull Detector',
    description: 'Scan token parameters, liquidity pools, anonymous team markers, and contract safeguards to calculate potential rug hazards.',
    icon: 'Zap',
    inputs: [
      {
        key: 'projectName',
        label: 'Token Name or Project Identity',
        type: 'text',
        placeholder: 'e.g., Surchi, PepeDog, SolGold...'
      }
    ],
    buttonText: 'Scan for Rug Pull Markers',
    statusText: 'Deconstructing Liquidity Maps...',
    accentColor: 'green'
  },
  {
    id: 'wallet_checker',
    name: 'Wallet Risk Checker',
    description: 'Review transacting addresses against security lists, blacklists, high-capital whale flags, and suspicious router approvals.',
    icon: 'SearchCode',
    inputs: [
      {
        key: 'address',
        label: 'Web3 Wallet Address',
        type: 'text',
        placeholder: 'e.g., 0x71C... or Solana Address...'
      }
    ],
    buttonText: 'Audit Wallet History',
    statusText: 'Searching Forensic Databases...',
    accentColor: 'cyan'
  },
  {
    id: 'defi_scanner',
    name: 'DeFi Protocol Scanner',
    description: 'Verify protocol health levels, active TVL trends, developer audit legacy, and centralization vectors.',
    icon: 'Database',
    inputs: [
      {
        key: 'protocolName',
        label: 'DeFi Protocol Name',
        type: 'text',
        placeholder: 'e.g., Uniswap, Aave, Raydium...'
      }
    ],
    buttonText: 'Scan Protocol Health',
    statusText: 'Mapping TVL Aggregations...',
    accentColor: 'green'
  },
  {
    id: 'ad_creator',
    name: 'Ad Creator',
    description: 'Draft conversion copywriting sets complete with distinct blocks for Twitter, Telegram, Reddit, and Discord announcements.',
    icon: 'Megaphone',
    inputs: [
      {
        key: 'projectName',
        label: 'Project Name',
        type: 'text',
        placeholder: 'e.g., Surchi Premium Suite'
      },
      {
        key: 'ticker',
        label: 'Token Ticker',
        type: 'text',
        placeholder: 'e.g., SURCHI'
      },
      {
        key: 'audience',
        label: 'Target Demographic',
        type: 'text',
        placeholder: 'e.g., High-yield farmers, meme traders'
      },
      {
        key: 'tone',
        label: 'Marketing Accent Tone',
        type: 'select',
        placeholder: 'Select branding tone',
        options: [
          { label: '🔥 Extreme Marketing Hype', value: 'hype' },
          { label: '💼 Professional & Technical', value: 'professional' },
          { label: '👥 Community-First', value: 'community' }
        ],
        defaultValue: 'hype'
      }
    ],
    buttonText: 'Generate Ad Copies',
    statusText: 'Crafting Viral Narratives...',
    accentColor: 'purple'
  },
  {
    id: 'airdrop_builder',
    name: 'Airdrop Builder',
    description: 'Structure viral giveaways, verify token supply numbers, participation guide frameworks, lists, and Discord templates.',
    icon: 'Gift',
    inputs: [
      {
        key: 'tokenName',
        label: 'Token Name',
        type: 'text',
        placeholder: 'e.g., Surchi Token'
      },
      {
        key: 'supply',
        label: 'Airdrop Distribution Pool Size',
        type: 'text',
        placeholder: 'e.g., 5,000,000 SURCHI'
      },
      {
        key: 'eligibility',
        label: 'Eligibility Parameters',
        type: 'textarea',
        placeholder: 'e.g., Completed social follows, hold at least 0.5 SOL in transaction balance...'
      },
      {
        key: 'goal',
        label: 'Campaign Objective',
        type: 'text',
        placeholder: 'e.g., Maximize brand mentions, daily transactions...'
      }
    ],
    buttonText: 'Compile Campaign Plan',
    statusText: 'Compiling Community Rules...',
    accentColor: 'green'
  },
  {
    id: 'whitepaper_generator',
    name: 'Whitepaper Generator',
    description: 'Generate structured markdown cryptocurrency whitepapers featuring Executive Summaries, Tokenomics maps, roadmap files, and legal caveats.',
    icon: 'FileText',
    inputs: [
      {
        key: 'projectName',
        label: 'Project Name',
        type: 'text',
        placeholder: 'e.g., Surchi Cryptosphere L2'
      },
      {
        key: 'problem',
        label: 'The Critical Problem Being Solved',
        type: 'textarea',
        placeholder: 'Describe the main user challenge here...'
      },
      {
        key: 'utility',
        label: 'Token Core Utility & Function',
        type: 'text',
        placeholder: 'e.g., Native transaction fees, audit staking tier, Governance'
      },
      {
        key: 'tokenomics',
        label: 'Vesting & Supply Strategy',
        type: 'text',
        placeholder: 'e.g., Buyback burns, 18-month lockup for partners...'
      },
      {
        key: 'team',
        label: 'Core Team & Credentials',
        type: 'text',
        placeholder: 'e.g., Forensics cryptographers and veteran DeFi builders'
      }
    ],
    buttonText: 'Generate Whitepaper Doc',
    statusText: 'Structuring Technical Document...',
    accentColor: 'purple'
  },
  {
    id: 'tokenomics_designer',
    name: 'Tokenomics Designer',
    description: 'Design perfect distribution pools, team lockups, investor cliff vesting schedules, and render dynamic distribution allocations.',
    icon: 'PieChart',
    inputs: [
      {
        key: 'tokenName',
        label: 'Token Name',
        type: 'text',
        placeholder: 'e.g., Surchi Token'
      },
      {
        key: 'totalSupply',
        label: 'Total Fixed Supply',
        type: 'text',
        placeholder: 'e.g., 1,000,000,000'
      },
      {
        key: 'vestingGoals',
        label: 'Vesting Timelines & Goals',
        type: 'textarea',
        placeholder: 'e.g., 12-month cliff for team, 5% released monthly for public pools...'
      }
    ],
    buttonText: 'Design Token Allocation Map',
    statusText: 'Calculating Vesting Constants...',
    accentColor: 'green'
  },
  {
    id: 'launch_planner',
    name: 'ICO / IDO Launch Planner',
    description: 'Build strategic milestone timelines detailing marketing countdowns, exchange seeder setups, and pre-launch engineering rules.',
    icon: 'Calendar',
    inputs: [
      {
        key: 'projectDetails',
        label: 'Project Concept & Launch Goals',
        type: 'textarea',
        placeholder: 'Describe the project niche, technology layer, and desired launch day target scale...'
      }
    ],
    buttonText: 'Design Launch Lifecycle',
    statusText: 'Mapping Launch Timelines...',
    accentColor: 'cyan'
  },
  {
    id: 'smart_contract_generator',
    name: 'Smart Contract Generator',
    description: 'Generate clean, secure Solidity contract sheets with inline comments for ERC-20, NFT (721), staking lockers, and vesting contracts.',
    icon: 'Code',
    inputs: [
      {
        key: 'contractType',
        label: 'Target Contract Protocol Standard',
        type: 'select',
        placeholder: 'Select a template standard',
        options: [
          { label: '🪙 Custom ERC-20 Token', value: 'ERC-20 Token' },
          { label: '🖼️ ERC-721 NFT Contract', value: 'NFT (ERC-721)' },
          { label: '🥩 Staking Yield Locker Pool', value: 'Staking Contract' },
          { label: '🪂 Airdrop Claim Router', value: 'Airdrop Contract' },
          { label: '🔒 Token Vesting & Cliff Locker', value: 'Vesting Contract' }
        ],
        defaultValue: 'ERC-20 Token'
      },
      {
        key: 'name',
        label: 'Token/Contract Name',
        type: 'text',
        placeholder: 'e.g., Surchi Secure Protocol'
      },
      {
        key: 'symbol',
        label: 'Contract Symbol / Ticker',
        type: 'text',
        placeholder: 'e.g., SURCHI'
      },
      {
        key: 'supplyOrLimits',
        label: 'Total Mint Supply Limit',
        type: 'text',
        placeholder: 'e.g., 1,000,000,000'
      },
      {
        key: 'additionalFeatures',
        label: 'Additional Mechanics Requirements',
        type: 'text',
        placeholder: 'e.g., whitelist check, burnable tags, emergency pauses...'
      }
    ],
    buttonText: 'Compile Solidity Code',
    statusText: 'Generating Secure Solidity blocks...',
    accentColor: 'purple'
  },
  {
    id: 'branding_generator',
    name: 'Project Naming & Branding',
    description: 'Analyze keywords and niches to generate 10 futuristic names, 5 ticker patterns, brand slogans, and hex palettes.',
    icon: 'HeartHandshake',
    inputs: [
      {
        key: 'niche',
        label: 'Project Niche',
        type: 'select',
        placeholder: 'Select web3 category',
        options: [
          { label: '🌐 Decentralized Finance (DeFi)', value: 'DeFi' },
          { label: '🖼️ Non-Fungible Tokens (NFT)', value: 'NFT' },
          { label: '🎮 Web3 GameFi Ecosystem', value: 'GameFi' },
          { label: '⚡ Layer 2 Scaling (L2)', value: 'L2 Scaling' },
          { label: '🤖 Autonomous AI-Agents', value: 'AI-Agents' }
        ],
        defaultValue: 'DeFi'
      },
      {
        key: 'vibe',
        label: 'Desired Brand Aesthetic Vibe',
        type: 'select',
        placeholder: 'Select visual vibe',
        options: [
          { label: '🔮 Cyberpunk Futuristic & High-tech', value: 'futuristic' },
          { label: '👥 Friendly & Community-First', value: 'community' },
          { label: '🐸 Degenerate Memecoin', value: 'meme' },
          { label: '👔 Institutional & Corporate Secure', value: 'serious' }
        ],
        defaultValue: 'futuristic'
      },
      {
        key: 'keywords',
        label: 'Branding Focal Keywords (Comma-separated)',
        type: 'text',
        placeholder: 'e.g., quantum, protect, surge, green...'
      }
    ],
    buttonText: 'Build Brand Identity',
    statusText: 'Synthesizing Branding Manifestos...',
    accentColor: 'cyan'
  },
  {
    id: 'tweet_writer',
    name: 'Twitter Thread & Copy Writer',
    description: 'Generate high-conversion tweets, educational threads, and viral scroll-stopping headlines tailored for cryptosphere users.',
    icon: 'MessageSquare',
    inputs: [
      {
        key: 'topic',
        label: 'Post Core Concept / Theme',
        type: 'text',
        placeholder: 'e.g., Explaining the security of multi-sig wallets...'
      },
      {
        key: 'tone',
        label: 'Narrative Tone',
        type: 'select',
        placeholder: 'Select post tone',
        options: [
          { label: '🚀 Extreme Bullish Hype', value: 'bullish' },
          { label: '🎓 Deeply Educational & Clear', value: 'educational' },
          { label: '🐸 Sarcastic Memecoin Style', value: 'meme' },
          { label: '📜 Serious System Engineering', value: 'serious' }
        ],
        defaultValue: 'bullish'
      },
      {
        key: 'audience',
        label: 'Target Demographic',
        type: 'text',
        placeholder: 'e.g., Web3 retail developers, average solidity builders...'
      }
    ],
    buttonText: 'Draft Tweet Sets',
    statusText: 'Optimizing Narrative CTR Metrics...',
    accentColor: 'purple'
  },
  {
    id: 'competitor_analysis',
    name: 'Competitor Analyst',
    description: 'Compare your blockchain idea against top 3 market competitors across features, caps, and unique strengths.',
    icon: 'GitCompare',
    inputs: [
      {
        key: 'projectName',
        label: 'Your Crypto Project Concept',
        type: 'text',
        placeholder: 'e.g., High speed multi-sig flash audit router'
      }
    ],
    buttonText: 'Perform Market Gap Analysis',
    statusText: 'Auditing Competitor Data-Points...',
    accentColor: 'cyan'
  }
];
