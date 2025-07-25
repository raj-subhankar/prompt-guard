import { ScrollArea } from "@/components/ui/scroll-area";
import { usePromptLibrary } from "@/hooks/usePromptLibrary";
import { PromptLibraryHeader } from "./PromptLibraryHeader";
import { PromptCategory } from "./PromptCategory";
import { BookOpen } from "lucide-react";
import { EditPromptDialog } from "./EditPromptDialog";

interface PromptLibraryProps {
  handleSendMessage: (content: string) => Promise<void>;
  chatIsLoading: boolean;
  canUseModel: boolean;
}

export function PromptLibrary({
  handleSendMessage,
  chatIsLoading,
  canUseModel,
}: PromptLibraryProps) {
  const {
    prompts,
    promptsByCategory,
    categories,
    searchTerm,
    setSearchTerm,
    selectedPrompts,
    setSelectedPrompts,
    openCategories,
    toggleCategory,
    editingPrompt,
    setEditingPrompt,
    addNewPrompt,
    editPrompt,
    deletePrompt,
    togglePromptSelection,
    resetToDefault,
    isProcessing,
    handleRunSelected,
    exportPrompts,
    handleUploadPrompts,
    deleteCategory,
  } = usePromptLibrary({ handleSendMessage });

  // Disabled state for actions that require the AI model
  const isExecutionDisabled = chatIsLoading || isProcessing || !canUseModel;

  return (
    <div className="flex flex-col h-full bg-background">
      <PromptLibraryHeader
        promptsCount={prompts.length}
        categoriesCount={categories.length}
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        selectedCount={selectedPrompts.size}
        onRunSelected={handleRunSelected}
        onClearSelection={() => setSelectedPrompts(new Set())}
        onAddNewPrompt={addNewPrompt}
        onResetToDefault={resetToDefault}
        categories={categories}
        isExecutionDisabled={isExecutionDisabled}
        isProcessing={isProcessing}
        onExport={exportPrompts}
        onImport={handleUploadPrompts}
      />

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {Object.keys(promptsByCategory).length > 0 ? (
            Object.entries(promptsByCategory).map(
              ([category, promptsInCategory]) => (
                <PromptCategory
                  key={category}
                  category={category}
                  prompts={promptsInCategory}
                  isOpen={openCategories.has(category)}
                  onToggle={() => toggleCategory(category)}
                  selectedPrompts={selectedPrompts}
                  onTogglePromptSelection={togglePromptSelection}
                  onEditPrompt={setEditingPrompt}
                  onDeletePrompt={deletePrompt}
                  isExecutionDisabled={isExecutionDisabled}
                  isProcessing={isProcessing}
                  onSendPrompt={handleSendMessage}
                  onDeleteCategory={() => deleteCategory(category)}
                />
              )
            )
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">No Prompts Found</p>
              <p className="text-xs">Try adjusting your search term.</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {editingPrompt && (
        <EditPromptDialog
          prompt={editingPrompt}
          categories={categories}
          onSave={(title, content, category) =>
            editPrompt(editingPrompt.id, title, content, category)
          }
          onCancel={() => setEditingPrompt(null)}
        />
      )}
    </div>
  );
}
