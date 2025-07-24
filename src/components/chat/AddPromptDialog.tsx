import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

// Fixed tags reference error

interface AddPromptDialogProps {
  categories: string[];
  onAddPrompt: (title: string, content: string, category: string) => void;
  disabled?: boolean;
  defaultCategory?: string;
}

export function AddPromptDialog({ categories, onAddPrompt, disabled, defaultCategory }: AddPromptDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(defaultCategory || '');
  const [newCategory, setNewCategory] = useState('');
  const [useNewCategory, setUseNewCategory] = useState(false);

  // If there's only one category (defaultCategory), pre-select it and hide category selection
  const isFixedCategory = categories.length === 1 && defaultCategory;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) return;
    
    const finalCategory = useNewCategory ? newCategory.trim() : category;
    if (!finalCategory) return;
    
    onAddPrompt(title.trim(), content.trim(), finalCategory);
    
    // Reset form
    setTitle('');
    setContent('');
    if (!isFixedCategory) {
      setCategory(defaultCategory || '');
    }
    setNewCategory('');
    setUseNewCategory(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add New Prompt
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Prompt</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter prompt title"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter the prompt content"
              className="min-h-20"
              required
            />
          </div>
          
          {!isFixedCategory && (
            <div>
              <Label>Category</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="existing-category"
                    name="category-type"
                    checked={!useNewCategory}
                    onChange={() => setUseNewCategory(false)}
                  />
                  <Label htmlFor="existing-category" className="text-sm font-normal">
                    Use existing category
                  </Label>
                </div>
                
                {!useNewCategory && (
                  <Select value={category} onValueChange={setCategory} required={!useNewCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="new-category"
                    name="category-type"
                    checked={useNewCategory}
                    onChange={() => setUseNewCategory(true)}
                  />
                  <Label htmlFor="new-category" className="text-sm font-normal">
                    Create new category
                  </Label>
                </div>
                
                {useNewCategory && (
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter new category name"
                    required={useNewCategory}
                  />
                )}
              </div>
            </div>
          )}

          {isFixedCategory && (
            <div>
              <Label>Category</Label>
              <div className="p-2 bg-muted rounded-md text-sm">
                Adding to: <strong>{defaultCategory}</strong>
              </div>
            </div>
          )}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!title.trim() || !content.trim() || (!isFixedCategory && !category && !newCategory.trim())}
            >
              Add Prompt
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}