# Base Chain Activity Mini App

A mini app to track and display user activity metrics on the Base chain.

## Features

- **Transaction Count**: Total transactions for a wallet address
- **NFT Portfolio**: View NFT holdings
- **Active Days/Weeks/Months**: Track user activity over time periods
- **Trading Volume**: Monitor trading activity
- **Real-time Updates**: Live data from Base chain
- **Analytics Dashboard**: Visual representation of metrics

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MetaMask or compatible Web3 wallet

### Installation

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to view the app.

## Documentation

- [Base Documentation](https://www.base.org/build/mini-apps)
- [Ethers.js Documentation](https://docs.ethers.org)
- [Next.js Documentation](https://nextjs.org/docs)

## API Endpoints Used

- Basescan API (for transaction data)
- NFT APIs (for NFT data)
- On-chain queries via RPC

## Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_BASESCAN_API_KEY=your_api_key
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
```

## Project Structure

```
├── pages/              # Next.js pages
├── components/         # React components
├── lib/               # Utility functions
├── hooks/             # Custom React hooks
├── types/             # TypeScript types
├── styles/            # Global styles
└── public/            # Static assets
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License
