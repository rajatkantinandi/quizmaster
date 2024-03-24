import React, { useState } from 'react';
import { Radio, Modal, Group, Button } from '@mantine/core';

export default function MoveQuestionModal({ categories, activeCategoryIndex, okCallback, onClose }) {
  const [categoryToMove, setCategoryToMove] = useState(activeCategoryIndex === 0 ? 1 : 0);

  return (
    <Modal title="Move question" opened onClose={onClose}>
      <Radio.Group
        value={`${categoryToMove}`}
        orientation="vertical"
        onChange={(val) => setCategoryToMove(parseInt(val))}>
        {categories.map((category, idx) =>
          idx === activeCategoryIndex ? (
            <></>
          ) : (
            <Radio value={`${idx}`} label={`${category.categoryName} ${idx}`} key={idx} />
          ),
        )}
      </Radio.Group>
      <Group mt="xl" position="right">
        <Button color="dark" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="filled" onClick={() => okCallback(categoryToMove)}>
          Move
        </Button>
      </Group>
    </Modal>
  );
}
