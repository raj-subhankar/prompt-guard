import { NetworkConfig } from "@/types";

export const DEFAULT_NETWORK_CONFIG: NetworkConfig = {
  loadBalancerIP: "34.63.185.148",
  customHeaders: {
    "module-id": "SETTLEMENT",
    "OpsInterfaceOriginalURL": "https://agentops-dev-648180604668.us-central1.run.app/opsInterface",
  },
};

export function getNetworkConfig(): NetworkConfig {
  const savedConfig = localStorage.getItem("network-config");
  return savedConfig
    ? { ...DEFAULT_NETWORK_CONFIG, ...JSON.parse(savedConfig) }
    : DEFAULT_NETWORK_CONFIG;
}