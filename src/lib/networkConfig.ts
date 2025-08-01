import { NetworkConfig } from "@/types";

export const DEFAULT_NETWORK_CONFIG: NetworkConfig = {
  loadBalancerIP: "34.31.43.150",
  customHeaders: {
    "module-id": "knowledge-base",
    "app-id": "knowledge-base-chat-bot-v1",
  },
};

export function getNetworkConfig(): NetworkConfig {
  const savedConfig = localStorage.getItem("network-config");
  return savedConfig
    ? { ...DEFAULT_NETWORK_CONFIG, ...JSON.parse(savedConfig) }
    : DEFAULT_NETWORK_CONFIG;
}