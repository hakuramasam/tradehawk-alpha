const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const GOLD = '\x1b[38;5;220m';
const BLUE = '\x1b[38;5;39m';

const LOGO = `
 ████████╗██████╗  █████╗ ██████╗ ███████╗
 ╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██╔════╝
    ██║   ██████╔╝███████║██║  ██║█████╗
    ██║   ██╔══██╗██╔══██║██║  ██║██╔══╝
    ██║   ██║  ██║██║  ██║██████╔╝███████╗
    ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚═════╝ ╚══════╝
 ██╗  ██╗ █████╗ ██╗    ██╗██╗  ██╗
 ██║  ██║██╔══██╗██║    ██║██║ ██╔╝
 ███████║███████║██║ █╗ ██║█████╔╝
 ██╔══██║██╔══██║██║███╗██║██╔═██╗
 ██║  ██║██║  ██║╚███╔███╔╝██║  ██╗
 ╚═╝  ╚═╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚═╝  ╚═╝
`;

export function printBanner(model: string, version = '0.1.0'): void {
  console.log(GOLD + LOGO + RESET);
  console.log(
    `  ${BOLD}TradeHawk AI${RESET} ${DIM}v${version}${RESET}  ${BLUE}Base mainnet alpha analyst${RESET}`,
  );
  console.log(`  ${DIM}model${RESET}  ${BLUE}${model}${RESET}`);
  console.log(`  ${DIM}Not financial advice. Verify on-chain before trading.${RESET}\n`);
}