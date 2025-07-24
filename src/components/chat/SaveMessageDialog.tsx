import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BookmarkPlus } from 'lucide-react';

interface SaveMessageDialogProps {
  content: string;
  categories: string[];
  onSave: (title: string, content: string, category: string) => void;
  disabled?: boolean;
}

export const SaveMessageDialog = React.memo<SaveMessageDialogProps>(({ content, categories, onSave, disabled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [useNewCategory, setUseNewCategory] = useState(false);

  const handleSave = useCallback(() => {
    if (!title.trim()) return;
    
    const category = useNewCategory && newCategory.trim() 
      ? newCategory.trim() 
      : selectedCategory || 'My Prompts';
    
    onSave(title.trim(), content, category);
    
    // Reset form
    setTitle('');
    setSelectedCategory('');
    setNewCategory('');
    setUseNewCategory(false);
    setIsOpen(false);
  }, [title, useNewCategory, newCategory, selectedCategory, onSave, content]);

  const handleOpenChange = useCallback((open: boolean) => {
    if (open) {
      // Auto-generate title from first 50 characters
      const autoTitle = content.length > 50 
        ? content.substring(0, 50).trim() + '...'
        : content;
      setTitle(autoTitle);
      setSelectedCategory(categories[0] || '');
    }
    setIsOpen(open);
  }, [content, categories]);

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategory(value);
  }, []);

  const handleNewCategoryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setNewCategory(e.target.value);
  }, []);

  const handleUseExistingCategory = useCallback(() => {
    setUseNewCategory(false);
  }, []);

  const handleUseNewCategory = useCallback(() => {
    setUseNewCategory(true);
  }, []);

  const handleCancel = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          disabled={disabled}
          title="Save to prompt library"
          aria-label="Save message to prompt library"
        >
          <BookmarkPlus className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Save Message to Library</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="prompt-title">Title</Label>
            <Input
              id="prompt-title"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter prompt title..."
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prompt-content">Content</Label>
            <Textarea
              id="prompt-content"
              value={content}
              readOnly
              className="w-full min-h-[100px] resize-none bg-muted"
              aria-label="Message content"
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <div className="space-y-2">
              {categories.length > 0 && (
                <>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="existing-category"
                      checked={!useNewCategory}
                      onChange={handleUseExistingCategory}
                    />
                    <Label htmlFor="existing-category" className="text-sm">Use existing category</Label>
                  </div>
                  {!useNewCategory && (
                    <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category..." />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </>
              )}
              
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="new-category"
                  checked={useNewCategory}
                  onChange={handleUseNewCategory}
                />
                <Label htmlFor="new-category" className="text-sm">Create new category</Label>
              </div>
              
              {useNewCategory && (
                <Input
                  value={newCategory}
                  onChange={handleNewCategoryChange}
                  placeholder="Enter new category name..."
                />
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!title.trim() || (!selectedCategory && !newCategory.trim() && useNewCategory)}
            >
              Save to Library
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
});

SaveMessageDialog.displayName = "SaveMessageDialog";