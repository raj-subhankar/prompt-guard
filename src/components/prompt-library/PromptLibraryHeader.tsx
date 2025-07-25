import React, { ChangeEvent, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
} from "@/components/ui/alert-dialog";
import {
  Search,
  Settings,
  RotateCcw,
  Play,
  Download,
  Upload,
  AlertTriangle,
} from "lucide-react";
import { AddPromptDialog } from "./AddPromptDialog";

interface PromptLibraryHeaderProps {
  promptsCount: number;
  categoriesCount: number;
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  selectedCount: number;
  onRunSelected: () => void;
  onClearSelection: () => void;
  onAddNewPrompt: (title: string, content: string, category: string) => void;
  onResetToDefault: () => void;
  categories: string[];
  isExecutionDisabled: boolean;
  isProcessing: boolean;
  onExport: () => void;
  onImport: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function PromptLibraryHeader({
  promptsCount,
  categoriesCount,
  searchTerm,
  onSearchTermChange,
  selectedCount,
  onRunSelected,
  onClearSelection,
  onAddNewPrompt,
  onResetToDefault,
  categories,
  isExecutionDisabled,
  isProcessing,
  onExport,
  onImport,
}: PromptLibraryHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex-shrink-0 p-4 border-b border-border/50 bg-muted/30">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".json"
        onChange={onImport}
      />

      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold leading-tight">
            Prompt Library
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {promptsCount} prompts in {categoriesCount} categories
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" disabled={isProcessing}>
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onExport} disabled={isProcessing}>
              <Download className="mr-2 h-4 w-4" />
              <span>Export Library</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
            >
              <Upload className="mr-2 h-4 w-4" />
              <span>Import Library</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                  className="text-destructive focus:text-destructive"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset to Default
                </DropdownMenuItem>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will delete all custom prompts and restore the
                    defaults. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={onResetToDefault}
                    className="bg-destructive hover:bg-destructive/90"
                  >
                    Reset
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex gap-2 mb-2 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-9"
            disabled={isProcessing}
          />
        </div>
        <AddPromptDialog
          categories={categories}
          onAddPrompt={onAddNewPrompt}
          disabled={isProcessing}
        />
      </div>

      {selectedCount > 0 && (
        <div className="p-2 mt-2 space-y-2 bg-primary/10 rounded-lg border border-primary/20">
          <Button
            onClick={onRunSelected}
            disabled={isExecutionDisabled}
            className="w-full"
          >
            <Play className="w-4 h-4 mr-2" />
            {isProcessing ? "Running..." : `Run ${selectedCount} Selected`}
          </Button>
          {isExecutionDisabled && (
            <div className="flex items-center gap-2 p-2 text-xs text-destructive">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              <span>Add API key to run prompts.</span>
            </div>
          )}
          <div className="flex items-center justify-between px-2">
            <span className="text-xs font-medium text-primary">
              {selectedCount} selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearSelection}
              className="h-auto px-2 py-1 text-xs text-primary hover:bg-primary/20 hover:text-primary"
            >
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
