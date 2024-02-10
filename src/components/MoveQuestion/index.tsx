import React, { useState } from 'react';
import { Checkbox } from '@mantine/core';

export default function MoveQuestion({ otherCategories }) {
  const [categoryToMove, setCategoryToMove] = useState('');

  return (
    <Checkbox.Group value={[categoryToMove]} orientation="vertical" onChange={(val) => setCategoryToMove(val[1])}>
      {otherCategories.map((category, idx) => (
        <Checkbox value={idx.toString()} label={category.categoryName} key={idx} radius="xl" tabIndex={-1} />
      ))}
    </Checkbox.Group>
  );
}
