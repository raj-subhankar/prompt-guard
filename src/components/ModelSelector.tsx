import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AI_MODELS } from "@/lib/constants";
import { AIModel } from "@/types";

interface ModelSelectorProps {
  selectedModel: AIModel;
  onModelChange: (model: AIModel) => void;
}

export function ModelSelector({
  selectedModel,
  onModelChange,
}: ModelSelectorProps) {
  return (
    <Select
      value={selectedModel.id}
      onValueChange={(id) =>
        onModelChange(AI_MODELS.find((model) => model.id === id)!)
      }
    >
      <SelectTrigger className="w-48 bg-secondary/50 border-border">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {AI_MODELS.map((model) => (
          <SelectItem key={model.id} value={model.id}>
            {model.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
