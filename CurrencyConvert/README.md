# Multi-Currency Converter DApp

This decentralized application (DApp) implements an advanced currency conversion system using Cartesi Rollups technology. It supports conversions between multiple fiat currencies and cryptocurrencies, including USD, EUR, GBP, JPY, CAD, ETH, BTC, and XRP.

## Installation

1. Clone this repository:

2. Install dependencies:
   ```
   npm install
   ```

## Running the DApp

Start the DApp using the Cartesi Rollups environment. Refer to the Cartesi documentation for detailed instructions on how to run a Rollups DApp.

## Interacting with the DApp

### Sending Inputs (Advance Requests)

To convert currency, send a JSON payload with the following structure:

```json
{
  "amount": 100,
  "fromCurrency": "USD",
  "toCurrency": "ETH"
}
```

The DApp will respond with a notice containing the converted amount.

### Supported Currency Pairs

The DApp supports conversions between the following currencies:

- Fiat: USD, EUR, GBP, JPY, CAD
- Crypto: ETH, BTC, XRP

Conversions can be made between any two supported currencies, including crypto-to-fiat, fiat-to-crypto, and crypto-to-crypto pairs.

## Notes

- Exchange rates are predefined and stored within the DApp.
- The DApp automatically handles reverse currency pairs (e.g., USD-EUR and EUR-USD).
- All inputs and outputs are processed as hexadecimal strings and converted to/from UTF-8.
- The DApp uses the `viem` library for hex-string conversions.
- Error handling is implemented for unsupported currency pairs.
- Converted amounts are logged to the console for debugging purposes.
- The current implementation does not update exchange rates dynamically.
- Inspect state functionality is not currently implemented but can be extended in the future.
