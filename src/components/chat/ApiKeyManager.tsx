import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Key, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ApiKeys {
  openai?: string;
  anthropic?: string;
}

interface ApiKeyManagerProps {
  apiKeys: ApiKeys;
  onApiKeysChange: (keys: ApiKeys) => void;
}

export function ApiKeyManager({ apiKeys, onApiKeysChange }: ApiKeyManagerProps) {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [tempKeys, setTempKeys] = useState<ApiKeys>(apiKeys);
  const { toast } = useToast();

  const handleSave = () => {
    onApiKeysChange(tempKeys);
    toast({
      title: "API Keys Updated",
      description: "Your API keys have been saved securely in your browser.",
    });
  };

  const toggleVisibility = (provider: string) => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const removeKey = (provider: keyof ApiKeys) => {
    const newKeys = { ...tempKeys };
    delete newKeys[provider];
    setTempKeys(newKeys);
  };

  const hasChanges = JSON.stringify(tempKeys) !== JSON.stringify(apiKeys);

  return (
    <Card className="bg-secondary/30 border-border">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Key className="h-5 w-5 text-primary" />
          <CardTitle>API Keys</CardTitle>
        </div>
        <CardDescription>
          Store your API keys securely in your browser. They won't be sent anywhere except to the respective AI providers.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="openai-key" className="flex items-center gap-2">
                OpenAI API Key
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                  openai
                </Badge>
              </Label>
              {tempKeys.openai && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeKey('openai')}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="relative">
              <Input
                id="openai-key"
                type={showKeys.openai ? "text" : "password"}
                value={tempKeys.openai || ''}
                onChange={(e) => setTempKeys(prev => ({ ...prev, openai: e.target.value }))}
                placeholder="sk-..."
                className="pr-10 bg-secondary/50"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => toggleVisibility('openai')}
              >
                {showKeys.openai ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="anthropic-key" className="flex items-center gap-2">
                Anthropic API Key
                <Badge variant="outline" className="bg-orange-500/10 text-orange-500 border-orange-500/20">
                  anthropic
                </Badge>
              </Label>
              {tempKeys.anthropic && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeKey('anthropic')}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="relative">
              <Input
                id="anthropic-key"
                type={showKeys.anthropic ? "text" : "password"}
                value={tempKeys.anthropic || ''}
                onChange={(e) => setTempKeys(prev => ({ ...prev, anthropic: e.target.value }))}
                placeholder="sk-ant-..."
                className="pr-10 bg-secondary/50"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => toggleVisibility('anthropic')}
              >
                {showKeys.anthropic ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>

        {hasChanges && (
          <Button onClick={handleSave} className="w-full bg-gradient-primary hover:opacity-90">
            Save API Keys
          </Button>
        )}
      </CardContent>
    </Card>
  );
}