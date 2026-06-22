import { useReadContract } from "wagmi";
import { formatUnits } from "viem";
import {
  ERC20_ABI,
  THAI_CONTRACT_ADDRESS,
  THAI_DECIMALS,
  THAI_MIN_HOLDING,
} from "@/lib/thai";
import { base } from "wagmi/chains";

export const useThaiBalance = (address?: `0x${string}`) => {
  const { data, isLoading, isError, refetch } = useReadContract({
    address: THAI_CONTRACT_ADDRESS,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: base.id,
    query: {
      enabled: Boolean(address),
      refetchInterval: 30_000,
    },
  });

  const raw = (data as bigint | undefined) ?? 0n;
  const whole = raw / 10n ** BigInt(THAI_DECIMALS);
  const formatted = Number(formatUnits(raw, THAI_DECIMALS));
  const hasAccess = whole >= THAI_MIN_HOLDING;

  return {
    raw,
    whole,
    formatted,
    hasAccess,
    isLoading,
    isError,
    refetch,
  };
};