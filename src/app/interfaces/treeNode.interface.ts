import { FlatNode } from './flatNode.interface';

export interface TreeNode extends FlatNode {
  children: TreeNode[];
}
