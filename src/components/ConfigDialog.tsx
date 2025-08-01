import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Plus, Trash2, Eye, EyeOff, Key } from "lucide-react";
import { NetworkConfig, ApiKeys } from "@/types";

const DEFAULT_NETWORK_CONFIG: NetworkConfig = {
  loadBalancerIP: "34.63.185.148",
  customHeaders: {
    "module-id": "SETTLEMENT",
    OpsInterfaceOriginalURL:
      "https://agentops-dev-648180604668.us-central1.run.app/opsInterface",
  },
};

interface ConfigDialogProps {
  apiKeys: ApiKeys;
  onApiKeysChange: (keys: ApiKeys) => void;
}

export function ConfigDialog({ apiKeys, onApiKeysChange }: ConfigDialogProps) {
  const [networkConfig, setNetworkConfig] = useState<NetworkConfig>(
    DEFAULT_NETWORK_CONFIG
  );
  const [openaiKey, setOpenaiKey] = useState(apiKeys.openai || "");
  const [showKey, setShowKey] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const savedConfig = localStorage.getItem("network-config");
    if (savedConfig) {
      setNetworkConfig({
        ...DEFAULT_NETWORK_CONFIG,
        ...JSON.parse(savedConfig),
      });
    }
  }, []);

  useEffect(() => {
    setOpenaiKey(apiKeys.openai || "");
  }, [apiKeys.openai]);

  const handleSaveNetwork = () => {
    localStorage.setItem("network-config", JSON.stringify(networkConfig));
  };

  const handleResetNetwork = () => {
    setNetworkConfig(DEFAULT_NETWORK_CONFIG);
    localStorage.removeItem("network-config");
  };

  const handleSaveApiKeys = () => {
    onApiKeysChange({
      openai: openaiKey || undefined,
    });
  };

  const handleClearApiKeys = () => {
    setOpenaiKey("");
    onApiKeysChange({});
  };

  const handleSaveAll = () => {
    handleSaveNetwork();
    handleSaveApiKeys();
    setOpen(false);
  };

  const addHeader = () => {
    setNetworkConfig({
      ...networkConfig,
      customHeaders: {
        ...networkConfig.customHeaders,
        "": "",
      },
    });
  };

  const updateHeader = (oldKey: string, newKey: string, value: string) => {
    const newHeaders = { ...networkConfig.customHeaders };
    if (oldKey !== newKey && oldKey in newHeaders) {
      delete newHeaders[oldKey];
    }
    newHeaders[newKey] = value;
    setNetworkConfig({ ...networkConfig, customHeaders: newHeaders });
  };

  const removeHeader = (key: string) => {
    const newHeaders = { ...networkConfig.customHeaders };
    delete newHeaders[key];
    setNetworkConfig({ ...networkConfig, customHeaders: newHeaders });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Config</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configuration</DialogTitle>
          <DialogDescription>
            Configure API keys and network settings.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="api-keys" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="network">Network</TabsTrigger>
          </TabsList>

          <TabsContent value="api-keys" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="openai-key" className="flex items-center gap-2">
                <Key className="h-4 w-4" />
                OpenAI API Key
              </Label>
              <div className="relative">
                <Input
                  id="openai-key"
                  type={showKey ? "text" : "password"}
                  placeholder="sk-..."
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowKey(!showKey)}
                >
                  {showKey ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Your API key is stored locally and never sent to our servers.
              </p>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleClearApiKeys} variant="outline">
                Clear API Keys
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="network" className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="loadBalancerIP" className="text-right">
                Load Balancer IP
              </Label>
              <Input
                id="loadBalancerIP"
                value={networkConfig.loadBalancerIP || ""}
                onChange={(e) =>
                  setNetworkConfig({
                    ...networkConfig,
                    loadBalancerIP: e.target.value,
                  })
                }
                className="col-span-3"
                placeholder="34.63.185.148"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Custom Headers</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addHeader}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Header
                </Button>
              </div>

              <div className="space-y-2 max-h-[200px] overflow-y-auto p-2">
                {Object.entries(networkConfig.customHeaders || {}).map(
                  ([key, value], index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        placeholder="Header name"
                        value={key}
                        onChange={(e) =>
                          updateHeader(key, e.target.value, value)
                        }
                        className="flex-1"
                      />
                      <Input
                        placeholder="Header value"
                        value={value}
                        onChange={(e) => updateHeader(key, key, e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeHeader(key)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-4 p-2">
              <Button variant="outline" onClick={handleResetNetwork}>
                Reset Network Defaults
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveAll}>Save All</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
