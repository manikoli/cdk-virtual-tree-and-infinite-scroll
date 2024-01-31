import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ArrayDataSource } from '@angular/cdk/collections';
import { FlatTreeControl, CdkTreeModule } from '@angular/cdk/tree';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { TreeService } from '../tree.service';
import { debounceTime } from 'rxjs';

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
  numOfChildren?: number;
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

  constructor(
    private treeService: TreeService,
    private cdr: ChangeDetectorRef
  ) {}

  visibleData!: ExampleFlatNode[];

  start = 0;
  end!: number;

  ngOnInit() {
    for (let i = 0; i < TREE_DATA.length; i++) {
      TREE_DATA[i].id = i.toString();
      if (i - 1 >= 0) {
        TREE_DATA[i].parentId = TREE_DATA[i - 1].expandable
          ? (TREE_DATA[i].parentId = TREE_DATA[i - 1].id)
          : (TREE_DATA[i].parentId = TREE_DATA[i - 1].parentId);
      }
      if (TREE_DATA[i].level === 0) {
        TREE_DATA[i].parentId = '';
      }
      if (TREE_DATA[i].expandable) {
        TREE_DATA[i].numOfChildren = 30;
      }
    }

    this.calculateMaxNodesNumber();
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

  getCurrentNumberOfChildren(id: string) {
    return TREE_DATA.filter((item: ExampleFlatNode) => item.parentId === id)
      .length;
  }

  maxNumberOfItems = 0;

  calculateMaxNodesNumber() {
    let height = screen.height;
    // 50 BEING FIXED HEIGHT OF NODE
    this.maxNumberOfItems = Math.round(height / 50);
    this.end = this.maxNumberOfItems;
  }

  flag = true;

  addNodes(node: ExampleFlatNode) {
    if (!node || !node.numOfChildren || !node.id) {
      return;
    }

    const { numOfChildren, id, level } = node;
    const currentChildren = this.getCurrentNumberOfChildren(id);

    let newItems =
      currentChildren + this.maxNumberOfItems > numOfChildren
        ? numOfChildren - currentChildren
        : this.maxNumberOfItems;

    if (currentChildren === numOfChildren) {
      this.flag = false;
    }

    if (this.flag) {
      this.flag = false;
      this.treeService.getElements(node, newItems).subscribe((res) => {
        if (numOfChildren > currentChildren) {
          const startPosition = TREE_DATA.findIndex((e) => e.id === id);

          const index = TREE_DATA.findIndex(
            (obj, i) =>
              i >= startPosition && obj['level'] === level && obj['id'] !== id
          );

          if (index !== -1) {
            TREE_DATA.splice(index, 0, ...res);
          } else {
            TREE_DATA.push(...res);
          }

          this.updateVisibleItems();
          this.flag = true;
        }
      });
    }
  }

  ngAfterViewChecked() {
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    this.virtualScroll.renderedRangeStream.subscribe((range) => {
      this.start = range.start;
      this.end = range.end;
      const deepestNode = this.getDeepestScrollingNode();

      if (deepestNode) {
        this.addNodes(deepestNode);
      }

      this.updateVisibleItems();
    });
  }

  getDeepestScrollingNode(): ExampleFlatNode | undefined {
    let firstDeepestNode = this.visibleData.reduce((maxObj, currentObj) => {
      return currentObj.level > maxObj.level ? currentObj : maxObj;
    }, this.visibleData[0]);

    if (!firstDeepestNode.expandable) {
      const deepestParent = TREE_DATA.find(
        (n) => n.id === firstDeepestNode.parentId
      );

      if (deepestParent && this.treeControl.isExpanded(deepestParent)) {
        firstDeepestNode = deepestParent;
        console.log('here?');
      }
    } else {
      if (!this.treeControl.isExpanded(firstDeepestNode)) {
        return undefined;
      }
    }

    return firstDeepestNode;
  }

  render() {
    const a = this.visibleData.slice(this.start, this.end);
    this.dataSource = new ArrayDataSource(a);
  }
}
