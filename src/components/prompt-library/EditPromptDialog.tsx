import { Prompt } from "@/types";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

interface EditPromptDialogProps {
  prompt: Prompt;
  categories: string[];
  onSave: (title: string, content: string, category: string) => void;
  onCancel: () => void;
}

export function EditPromptDialog({
  prompt,
  categories,
  onSave,
  onCancel,
}: EditPromptDialogProps) {
  const [title, setTitle] = useState(prompt.title);
  const [content, setContent] = useState(prompt.content);
  const [category, setCategory] = useState(prompt.category);
  const [newCategory, setNewCategory] = useState("");
  const [useNewCategory, setUseNewCategory] = useState(false);

  const handleSave = () => {
    const finalTitle = title.trim();
    const finalContent = content.trim();
    const finalCategory = useNewCategory ? newCategory.trim() : category;

    if (!finalTitle || !finalContent || !finalCategory) {
      return;
    }

    onSave(finalTitle, finalContent, finalCategory);
  };

  return (
    <Dialog open={true} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Prompt</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter prompt title..."
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Content</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your prompt content..."
              rows={8}
              className="resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="existing-category"
                  checked={!useNewCategory}
                  onChange={() => setUseNewCategory(false)}
                  className="h-4 w-4"
                />
                <label htmlFor="existing-category" className="text-sm">
                  Use existing category
                </label>
              </div>

              {!useNewCategory && (
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 border border-input rounded-md bg-background"
                  disabled={useNewCategory}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              )}

              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="new-category"
                  checked={useNewCategory}
                  onChange={() => setUseNewCategory(true)}
                  className="h-4 w-4"
                />
                <label htmlFor="new-category" className="text-sm">
                  Create new category
                </label>
              </div>

              {useNewCategory && (
                <Input
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter new category name..."
                />
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              !title.trim() ||
              !content.trim() ||
              (!category && !newCategory.trim())
            }
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
