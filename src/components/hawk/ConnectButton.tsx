import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

export const HawkConnectButton = ({ compact = false }: { compact?: boolean }) => {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: { opacity: 0, pointerEvents: "none", userSelect: "none" },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <Button onClick={openConnectModal} variant="hawk" size={compact ? "sm" : "lg"}>
                    <Wallet /> Connect Wallet
                  </Button>
                );
              }
              if (chain.unsupported) {
                return (
                  <Button onClick={openChainModal} variant="destructive" size={compact ? "sm" : "lg"}>
                    Wrong network
                  </Button>
                );
              }
              return (
                <div className="flex gap-2">
                  <Button onClick={openChainModal} variant="outlineHawk" size="sm">
                    {chain.hasIcon && chain.iconUrl && (
                      <img src={chain.iconUrl} alt={chain.name ?? ""} className="w-4 h-4" />
                    )}
                    {chain.name}
                  </Button>
                  <Button onClick={openAccountModal} variant="hawk" size="sm">
                    {account.displayName}
                    {account.displayBalance ? ` · ${account.displayBalance}` : ""}
                  </Button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};