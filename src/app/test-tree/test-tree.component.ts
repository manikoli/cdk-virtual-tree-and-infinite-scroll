import { FlatTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
  MatTreeModule,
} from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
class FoodNode {
  name!: string;
  // masterData: FoodFlatNode[];
  get children(): FoodNode[] {
    return [{ name: 'gggggg', renderNode: true }] as FoodNode[];
    // find by uid
  }
  renderNode?: boolean;
  // children?: FoodNode[];

  level?: number;

  constructor(name: string, renderNode: boolean) {
    this.name = name;
    this.renderNode = renderNode;
  }
}

const TREE_DATA: FoodNode[] = [
  new FoodNode('Fruit', false),
  new FoodNode('Vegetables', false),
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
}

/**
 * @title Tree with flat nodes
 */
@Component({
  selector: 'test-tree',
  templateUrl: 'test-tree.component.html',
})
export class TestTreeComponent {
  private _transformer = (node: FoodNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level,
    };
  };

  treeControl = new FlatTreeControl<ExampleFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    (node) => node.level,
    (node) => node.expandable,
    (node) => node.children
    // (node) => (node.children ? node.children() : [])
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  source = [
    {
      name: 'Green',
    },
    {
      name: 'Orange',
    },
  ];

  constructor() {
    console.log(TREE_DATA);
    this.dataSource.data = TREE_DATA;
  }

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  fun(node: any) {
    // this.treeControl.options?.
    // this.dataSource.connect(this.source);
    console.log(node);
  }
}
