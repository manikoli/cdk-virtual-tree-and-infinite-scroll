// tree.service.ts

import { Injectable } from '@angular/core';

export interface TreeNode {
  name: string;
  children?: TreeNode[];
}

@Injectable({
  providedIn: 'root',
})
export class TreeService {
  getTreeData(): TreeNode[] {
    return [
      {
        name: 'Node 1',
        children: [{ name: 'Node 1.1' }, { name: 'Node 1.2' }],
      },
      {
        name: 'Node 2',
        children: [
          {
            name: 'Node 2.1',
            children: [{ name: 'Node 2.1.1' }, { name: 'Node 2.1.2' }],
          },
          { name: 'Node 2.2' },
        ],
      },
      { name: 'Node 3' },
      { name: 'Node 4' },
      {
        name: 'Node 5',
        children: [
          { name: 'Node 5.1' },
          { name: 'Node 5.2' },
          { name: 'Node 5.3' },
        ],
      },
      { name: 'Node 6' },
      // ... more nodes
    ];
  }
}
