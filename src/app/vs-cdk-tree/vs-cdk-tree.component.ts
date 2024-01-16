import { Component, ViewChild } from '@angular/core';
import { ArrayDataSource } from '@angular/cdk/collections';
import { FlatTreeControl, CdkTreeModule } from '@angular/cdk/tree';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

const TREE_DATA: ExampleFlatNode[] = [
  {
    name: 'Fruit',
    expandable: true,
    level: 0,
  },
  {
    name: 'Apple',
    expandable: false,
    level: 1,
  },
  {
    name: 'Banana',
    expandable: false,
    level: 1,
  },
  {
    name: 'Fruit loops',
    expandable: false,
    level: 1,
  },
  {
    name: 'Apple1',
    expandable: false,
    level: 1,
  },
  {
    name: 'Banana1',
    expandable: false,
    level: 1,
  },
  {
    name: 'Fruit loops1',
    expandable: false,
    level: 1,
  },
  {
    name: 'Vegetables',
    expandable: true,
    level: 0,
  },
  {
    name: 'Green',
    expandable: true,
    level: 1,
    parentId: '0',
  },
  {
    name: 'Broccoli',
    expandable: false,
    level: 2,
  },
  {
    name: 'Brussels sprouts',
    expandable: false,
    level: 2,
  },
  {
    name: 'Orange',
    expandable: true,
    level: 2,
  },
  {
    name: 'Pumpkins',
    expandable: false,
    level: 3,
  },
  {
    name: 'Carrots',
    expandable: false,
    level: 3,
  },
  {
    name: 'Paradajz',
    expandable: true,
    level: 2,
  },
  {
    name: 'Kecap',
    expandable: false,
    level: 3,
  },
  {
    name: 'Majonez',
    expandable: false,
    level: 3,
  },
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  expandable: boolean;
  name: string;
  level: number;
  isExpanded?: boolean;
  isVisible?: boolean;
  id?: string;
  parentId?: string;
}

/**
 * @title Tree with flat nodes
 */
@Component({
  selector: 'app-vs-cdk-tree',
  templateUrl: 'vs-cdk-tree.component.html',
  styleUrls: ['vs-cdk-tree.component.scss'],
})
export class VsCdkTreeComponent {
  treeControl = new FlatTreeControl<ExampleFlatNode>(
    (node) => node.level,
    (node) => node.expandable
  );

  dataSource = new ArrayDataSource(TREE_DATA);

  hasChild = (_: number, node: ExampleFlatNode) => node.expandable;

  @ViewChild(CdkVirtualScrollViewport) virtualScroll!: CdkVirtualScrollViewport;

  visibleData!: ExampleFlatNode[];
  start = 0;
  end = 10;

  ngOnInit() {
    for (let i = 0; i < TREE_DATA.length; i++) {
      if (TREE_DATA[i].level === 0) {
        TREE_DATA[i].isVisible = true;
      }
      TREE_DATA[i].id = i.toString();
      if (i - 1 >= 0) {
        TREE_DATA[i].parentId = TREE_DATA[i - 1].expandable
          ? (TREE_DATA[i].parentId = TREE_DATA[i - 1].id)
          : (TREE_DATA[i].parentId = TREE_DATA[i - 1].parentId);
      }
      if (TREE_DATA[i].level === 0) {
        TREE_DATA[i].parentId = '';
      }
    }

    this.updateVisibleItems();
  }

  updateVisibleItems() {
    this.visibleData = TREE_DATA.filter((item) => this.shouldRender(item));
    this.render();
  }

  getParentNode(node: ExampleFlatNode) {
    const nodeIndex = TREE_DATA.indexOf(node);

    for (let i = nodeIndex - 1; i >= 0; i--) {
      if (TREE_DATA[i].level === node.level - 1) {
        return TREE_DATA[i];
      }
    }

    return null;
  }

  shouldRender(node: ExampleFlatNode) {
    let parent = this.getParentNode(node);
    while (parent) {
      if (!parent.isExpanded) {
        return false;
      }
      parent = this.getParentNode(parent);
    }
    return true;
  }

  ngAfterViewInit() {
    this.virtualScroll.renderedRangeStream.subscribe((range) => {
      this.start = range.start;
      this.end = range.end;
      this.updateVisibleItems();
    });
  }

  render() {
    const a = this.visibleData.slice(this.start, this.end);
    this.dataSource = new ArrayDataSource(a);
  }
}
