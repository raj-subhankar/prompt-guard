import React from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, MoreVertical, Trash2 } from "lucide-react";
import { PromptItem } from "./PromptItem";
import type { Prompt } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { cn } from "@/lib/utils";

interface PromptCategoryProps {
  category: string;
  prompts: Prompt[];
  isOpen: boolean;
  onToggle: () => void;
  selectedPrompts: Set<string>;
  onTogglePromptSelection: (id: string) => void;
  onEditPrompt: (prompt: Prompt) => void;
  onDeletePrompt: (id: string) => void;
  isExecutionDisabled: boolean;
  isProcessing: boolean;
  onSendPrompt: (content: string) => void;
  onDeleteCategory: () => void;
}

export function PromptCategory({
  category,
  prompts,
  isOpen,
  onToggle,
  selectedPrompts,
  onTogglePromptSelection,
  onEditPrompt,
  onDeletePrompt,
  isExecutionDisabled,
  isProcessing,
  onSendPrompt,
  onDeleteCategory,
}: PromptCategoryProps) {
  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <div className="group flex items-center rounded-lg hover:bg-muted/50 transition-colors">
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="flex-1 justify-start p-2 h-auto text-left hover:bg-transparent"
          >
            <div className="flex items-center gap-2">
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <span className="font-medium">{category}</span>
            </div>
            <Badge variant="secondary">{prompts.length}</Badge>
          </Button>
        </CollapsibleTrigger>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-9 w-9 p-0 scale-95 opacity-0 transition-all duration-200 hover:bg-transparent",
                "group-hover:scale-100 group-hover:opacity-100",
                "group-focus-within:scale-100 group-focus-within:opacity-100",
                "data-[state=open]:scale-100 data-[state=open]:opacity-100"
              )}
              disabled={isProcessing}
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onSelect={(e) => e.preventDefault()}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Delete Category</span>
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete "{category}"?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the category and all{" "}
                    {prompts.length} prompts within it. This action cannot be
                    undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onDeleteCategory}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <CollapsibleContent className="py-2 space-y-2">
        {prompts.map((prompt) => (
          <PromptItem
            key={prompt.id}
            prompt={prompt}
            isSelected={selectedPrompts.has(prompt.id)}
            onToggleSelection={onTogglePromptSelection}
            onEdit={onEditPrompt}
            onDelete={onDeletePrompt}
            isExecutionDisabled={isExecutionDisabled}
            isProcessing={isProcessing}
            onSendPrompt={onSendPrompt}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
