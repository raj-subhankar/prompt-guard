import { useState, useMemo, useCallback, ChangeEvent } from "react";
import { useToast } from "./useToast";
import useLocalStorage from "./useLocalStorage";
import { DEFAULT_PROMPTS, LOCAL_STORAGE_KEYS } from "@/lib/constants";
import type { Prompt } from "@/types";

interface UsePromptLibraryProps {
  handleSendMessage: (content: string) => Promise<void>;
  onAddPrompt?: (title: string, content: string, category: string) => void;
}

export function usePromptLibrary({
  handleSendMessage,
  onAddPrompt,
}: UsePromptLibraryProps) {
  const { toast } = useToast();
  const [prompts, setPrompts] = useLocalStorage<Prompt[]>(
    LOCAL_STORAGE_KEYS.PROMPT_LIBRARY,
    DEFAULT_PROMPTS
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPrompts, setSelectedPrompts] = useState<Set<string>>(
    new Set()
  );
  const [openCategories, setOpenCategories] = useState<Set<string>>(
    () => new Set(DEFAULT_PROMPTS.map((p) => p.category))
  );
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const categories = useMemo(
    () => Array.from(new Set(prompts.map((p) => p.category))).sort(),
    [prompts]
  );

  const filteredPrompts = useMemo(
    () =>
      prompts.filter(
        (prompt) =>
          prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prompt.content.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [prompts, searchTerm]
  );

  const promptsByCategory = useMemo(
    () =>
      categories.reduce((acc, category) => {
        const categoryPrompts = filteredPrompts.filter(
          (p) => p.category === category
        );
        if (categoryPrompts.length > 0) {
          acc[category] = categoryPrompts;
        }
        return acc;
      }, {} as Record<string, Prompt[]>),
    [categories, filteredPrompts]
  );

  const addNewPrompt = useCallback(
    (title: string, content: string, category: string) => {
      const newPrompt: Prompt = {
        id: `custom-${Date.now()}`,
        title,
        content,
        category,
      };
      setPrompts((prev) => [...prev, newPrompt]);
      setOpenCategories((prev) => new Set(prev).add(category));
      toast({
        title: "Prompt Added",
        description: `Added "${title}" to the library.`,
      });
      onAddPrompt?.(title, content, category);
    },
    [setPrompts, toast, onAddPrompt]
  );

  const saveContentAsPrompt = useCallback(
    (title: string, content: string, category: string) => {
      addNewPrompt(title, content, category);
    },
    [addNewPrompt]
  );

  const editPrompt = useCallback(
    (id: string, newTitle: string, newContent: string, newCategory: string) => {
      setPrompts((prev) =>
        prev.map((p) =>
          p.id === id
            ? {
                ...p,
                id,
                title: newTitle,
                content: newContent,
                category: newCategory,
              }
            : p
        )
      );
      setOpenCategories((prev) => new Set(prev).add(newCategory));
      toast({
        title: "Prompt Updated",
        description: `Updated "${newTitle}" successfully.`,
      });
      setEditingPrompt(null);
    },
    [setPrompts, toast]
  );

  const deletePrompt = useCallback(
    (promptId: string) => {
      const prompt = prompts.find((p) => p.id === promptId);
      setPrompts((prev) => prev.filter((p) => p.id !== promptId));
      setSelectedPrompts((prev) => {
        const newSet = new Set(prev);
        newSet.delete(promptId);
        return newSet;
      });
      toast({
        title: "Prompt Deleted",
        description: `Deleted "${prompt?.title}".`,
      });
    },
    [prompts, setPrompts, toast]
  );

  const deleteCategory = useCallback(
    (categoryName: string) => {
      const categoryPrompts = prompts.filter(
        (p) => p.category === categoryName
      );
      setPrompts((prev) => prev.filter((p) => p.category !== categoryName));
      setSelectedPrompts((prev) => {
        const newSet = new Set(prev);
        categoryPrompts.forEach((p) => newSet.delete(p.id));
        return newSet;
      });
      toast({
        title: "Category Deleted",
        description: `Deleted "${categoryName}" and all ${categoryPrompts.length} prompts in it.`,
      });
    },
    [prompts, setPrompts, toast]
  );

  const togglePromptSelection = useCallback((promptId: string) => {
    setSelectedPrompts((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(promptId)) {
        newSelected.delete(promptId);
      } else {
        newSelected.add(promptId);
      }
      return newSelected;
    });
  }, []);

  const toggleCategory = useCallback((categoryName: string) => {
    setOpenCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(categoryName)) {
        newSet.delete(categoryName);
      } else {
        newSet.add(categoryName);
      }
      return newSet;
    });
  }, []);

  const resetToDefault = useCallback(() => {
    setPrompts(DEFAULT_PROMPTS);
    setSelectedPrompts(new Set());
    setOpenCategories(new Set(DEFAULT_PROMPTS.map((p) => p.category)));
    toast({
      title: "Library Reset",
      description: "Library has been restored to default prompts.",
    });
  }, [setPrompts, toast]);

  const handleUploadPrompts = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (!Array.isArray(data))
          throw new Error("JSON must be an array of prompts.");

        const validPrompts: Prompt[] = data
          .filter((item) => item.title && item.content && item.category)
          .map((item, index) => ({
            ...item,
            id: `uploaded-${Date.now()}-${index}`,
          }));

        if (validPrompts.length === 0)
          throw new Error("No valid prompts found in file.");

        setPrompts((prev) => [...prev, ...validPrompts]);
        toast({
          title: "Prompts Added",
          description: `Added ${validPrompts.length} prompts.`,
        });
      } catch (error) {
        toast({
          title: "Upload Error",
          description:
            error instanceof Error ? error.message : "Invalid file format.",
          variant: "destructive",
        });
      } finally {
        event.target.value = "";
      }
    },
    [setPrompts, toast]
  );

  const exportPrompts = useCallback(() => {
    const dataStr = JSON.stringify(prompts, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `prompt-library-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({
      title: "Library Exported",
      description: "Your prompts have been downloaded.",
    });
  }, [prompts, toast]);

  const handleRunSelected = useCallback(async () => {
    const promptsToRun = prompts.filter((p) => selectedPrompts.has(p.id));
    if (promptsToRun.length === 0) return;

    setIsProcessing(true);
    try {
      for (let i = 0; i < promptsToRun.length; i++) {
        await handleSendMessage(promptsToRun[i].content);
        if (i < promptsToRun.length - 1)
          await new Promise((res) => setTimeout(res, 500));
      }
      toast({
        title: "Prompts Completed",
        description: `Successfully ran ${promptsToRun.length} prompts.`,
      });
    } catch (error) {
      toast({
        title: "Prompt run cancelled",
        description: "An error occurred during execution.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setSelectedPrompts(new Set());
    }
  }, [selectedPrompts, prompts, handleSendMessage, toast]);

  return {
    prompts,
    promptsByCategory,
    categories,
    searchTerm,
    selectedPrompts,
    openCategories,
    editingPrompt,
    isProcessing,
    setSearchTerm,
    setSelectedPrompts,
    setEditingPrompt,
    addNewPrompt,
    editPrompt,
    deletePrompt,
    deleteCategory,
    togglePromptSelection,
    toggleCategory,
    resetToDefault,
    exportPrompts,
    handleUploadPrompts,
    handleRunSelected,
    saveContentAsPrompt,
  };
}
