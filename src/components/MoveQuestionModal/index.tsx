import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function MoveQuestionModal({
  categories,
  activeCategoryIndex,
  okCallback,
  onClose,
}: {
  categories: any[];
  activeCategoryIndex: number;
  okCallback: (index: number) => void;
  onClose: () => void;
}) {
  const [categoryToMove, setCategoryToMove] = useState(activeCategoryIndex === 0 ? 1 : 0);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move question to category</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">Choose a category to move question to</p>
          <RadioGroup value={`${categoryToMove}`} onValueChange={(val) => setCategoryToMove(parseInt(val))}>
            {categories.map((category, idx) =>
              idx === activeCategoryIndex ? null : (
                <div key={idx} className="flex items-center space-x-2">
                  <RadioGroupItem value={`${idx}`} id={`move-question-category-${idx}`} />
                  <label htmlFor={`move-question-category-${idx}`}>{category.categoryName}</label>
                </div>
              ),
            )}
          </RadioGroup>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" color="dark" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="default" onClick={() => okCallback(categoryToMove)}>
            Move
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
