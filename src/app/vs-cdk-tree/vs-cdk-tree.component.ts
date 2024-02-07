import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ArrayDataSource } from '@angular/cdk/collections';
import { FlatTreeControl, CdkTreeModule } from '@angular/cdk/tree';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { TreeService } from '../tree.service';

let TREE_DATA: ExampleFlatNode[] = [
  {
    id: '0',
    parentId: null,
    name: 'Fruit',
    expandable: true,
    level: 0,
    page: 1,
    currentlyLoaded: 0,
    lastViewedTimestamp: new Date(),
  },
  {
    id: '1',
    parentId: null,
    name: 'Vegetables',
    expandable: true,
    level: 0,
    page: 1,
    currentlyLoaded: 0,
    lastViewedTimestamp: new Date(),
  },
];

/** Flat node with expandable and level information */
interface ExampleFlatNode {
  id: string;
  parentId: string | null;
  expandable: boolean;
  name: string;
  level: number;
  page: number;
  currentlyLoaded: number;
  lastViewedTimestamp: Date;
  isExpanded?: boolean;
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

  renderableData!: ExampleFlatNode[];
  visibleData!: ExampleFlatNode[];

  start = 0;
  end!: number;

  generateFlatTreeList(size: number): ExampleFlatNode[] {
    const flatTreeList: ExampleFlatNode[] = [];

    for (let i = 0; i < size; i++) {
      const node: ExampleFlatNode = {
        id: `id_${i}`,
        parentId: i > 0 ? `id_${Math.floor(Math.random() * i)}` : null,
        expandable: Math.random() > 0.5,
        name: String(i),
        level: Math.floor(Math.random() * 10), // Adjust the range as per your requirement
        page: Math.floor(Math.random() * 100),
        currentlyLoaded: Math.floor(Math.random() * 100),
        lastViewedTimestamp: new Date(),
      };

      flatTreeList.push(node);
    }

    return flatTreeList;
  }

  // Generate a large array with 100 elements

  ngOnInit() {
    const largeArray = this.generateFlatTreeList(100);
    console.log(largeArray);

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
        // TREE_DATA[i].numOfChildren = Math.round(Math.random() * 100);
        TREE_DATA[i].numOfChildren = 100;
      }
    }

    this.calculateMaxNodesNumber();
    this.updateVisibleItems();
  }

  findOldestViewedGroup(array: ExampleFlatNode[]) {
    if (array.length === 0) {
      return null;
    }

    const oldestNode = array.reduce((oldest, current) => {
      return current.lastViewedTimestamp < oldest.lastViewedTimestamp &&
        !current.id.includes('_load') &&
        !oldest.id.includes('_load')
        ? current
        : oldest;
    }, array[0]);

    return TREE_DATA.filter(
      (n) => !(n.parentId === oldestNode.id && n.page === oldestNode.page)
    );
  }

  updateVisibleItems() {
    this.renderableData = TREE_DATA.filter((item) => this.shouldRender(item));
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
    //This will be 0 because from the very start there will be no preloaded children
    node.currentlyLoaded =
      node.currentlyLoaded ?? this.getCurrentNumberOfChildren(id);

    let size =
      node.currentlyLoaded + this.maxNumberOfItems > numOfChildren
        ? numOfChildren - node.currentlyLoaded
        : this.maxNumberOfItems;

    // if (this.flag) {
    this.flag = false;
    const startPosition = TREE_DATA.findIndex((e) => e.id === id);
    if (startPosition !== -1) {
      this.treeService
        .getElements(node, size, startPosition)
        .subscribe((res) => {
          if (numOfChildren > (node.currentlyLoaded || 0)) {
            if (node.id?.includes('_load')) {
              console.log(node);
              const loadIndex = TREE_DATA.findIndex((n) => n.id === node.id);
              if (loadIndex !== -1) {
                TREE_DATA.splice(loadIndex, 1, ...res);
              }
            } else {
              const index = TREE_DATA.findIndex(
                (obj, i) =>
                  i >= startPosition &&
                  obj['level'] === level &&
                  obj['id'] !== id
              );
              if (index !== -1) {
                TREE_DATA.splice(index, 0, ...res);
              } else {
                TREE_DATA.push(...res);
              }
            }

            node.currentlyLoaded = size + (node.currentlyLoaded || 0);

            this.flag = true;
            this.updateVisibleItems();
          }
        });
    }
    // }
  }

  ngAfterViewChecked() {
    this.loadMore();
    console.log(TREE_DATA.length);
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    this.virtualScroll.renderedRangeStream.subscribe((range) => {
      this.start = range.start;
      this.end = range.end;
      this.loadMore();
      this.removeOldChunk();
    });
  }

  /* 
    First we check if the group in current viewport is connected with group that 
    we want to remove. For that we need first element of viewport group level and check
    it agains every element in group to remove
    0
      1
        2
        .
        .
        .
          15
  
    We need to check if 0, 1 or 2 are "closed" in the level-array.
  */
  isDescendant(
    visibleNodeIndex: number,
    oldestNodeIndex: number,
    oldestNodes: ExampleFlatNode[]
  ) {
    let isDescendant = false;
    oldestNodes.forEach((node) => {
      for (let i = visibleNodeIndex; i <= oldestNodeIndex; i--) {
        if (TREE_DATA[i].level === node.level) {
          isDescendant = true;
        }
      }
    });
    return isDescendant;
  }

  removeOldChunk() {
    if (TREE_DATA.length > 10000) {
      let canRemove = false;
      const oldestNodes = this.findOldestViewedGroup(TREE_DATA);

      if (oldestNodes) {
        const visibleNodeIndex = TREE_DATA.findIndex(
          (n) => n.id === this.visibleData[0].id
        );
        const oldestNodeIndex = TREE_DATA.findIndex(
          (n) => n.id === oldestNodes[0].id
        );

        if (oldestNodeIndex < visibleNodeIndex) {
          const isDescendant = this.isDescendant(
            visibleNodeIndex,
            oldestNodeIndex,
            oldestNodes
          );

          if (isDescendant) {
            // Purge next candidates
          } else {
            canRemove = true;
          }
        }

        if (canRemove) {
          const startIndex = TREE_DATA.findIndex(
            (n) => n.id === oldestNodes[0].id
          );
          const endIndex = TREE_DATA.findIndex(
            (n) => n.id === oldestNodes[oldestNodes.length - 1].id
          );

          for (let i = startIndex; i <= endIndex; i++) {
            TREE_DATA.splice(i, 1);
          }

          const parentNode = TREE_DATA.find(
            (n) => n.id === oldestNodes[0].parentId
          );

          TREE_DATA.splice(startIndex, 0, {
            id: Math.round(Math.random() * 100000).toString() + '_load',
            name: 'Load more',
            expandable: false,
            level: oldestNodes[0].level,
            parentId: oldestNodes[0].parentId,
            page: oldestNodes[0].page,
            lastViewedTimestamp: oldestNodes[0].lastViewedTimestamp,
            currentlyLoaded: parentNode?.currentlyLoaded || -1,
          });
        }
      }

      //   if (oldestNodes && oldestNode?.expandable) {
      //     const pageIndex = TREE_DATA.find(
      //       (n) => n.parentId === oldestNode.id
      //     )?.page;

      //     const indexToAdd = TREE_DATA.findIndex(
      //       (n) => n.parentId === oldestNode.id && n.page === pageIndex
      //     );

      //     const nodesToRemove = TREE_DATA.filter(
      //       (n) => n.parentId === oldestNode.id && n.page === pageIndex
      //     );

      //     if (nodesToRemove) {
      //       const startIndex = TREE_DATA.findIndex(
      //         (n) => n.id === nodesToRemove[0].id
      //       );
      //       const endIndex = TREE_DATA.findIndex(
      //         (n) => n.id === nodesToRemove[nodesToRemove.length - 1].id
      //       );

      //       for (let i = startIndex; i <= endIndex; i++) {
      //         TREE_DATA.splice(i, 1);
      //       }
      //     }

      //     TREE_DATA = TREE_DATA.filter(
      //       (n) => !(n.parentId === oldestNode.id && n.page === pageIndex)
      //     );

      //     if (oldestNode && oldestNode?.id) {
      //       oldestNode.currentlyLoaded = this.getCurrentNumberOfChildren(
      //         oldestNode?.id
      //       );
      //     }

      //     TREE_DATA.splice(indexToAdd, 0, {
      //       id:
      //         Math.round(Math.random() * 100000).toString() +
      //         '_load_' +
      //         oldestNode.name,
      //       name: 'Load more',
      //       expandable: false,
      //       level: oldestNode.level + 1,
      //       parentId: oldestNode.id,
      //       page: pageIndex,
      //       lastViewedTimestamp: new Date(),
      //       currentlyLoaded: oldestNode.currentlyLoaded,
      //       numOfChildren: oldestNode.numOfChildren,
      //     });

      //     this.updateVisibleItems();
      //   } else {
      //     if (oldestNode) {
      //       TREE_DATA = TREE_DATA.filter(
      //         (n) =>
      //           !(
      //             n.parentId === oldestNode.parentId &&
      //             n.page === oldestNode?.page
      //           )
      //       );
      //     }
      //   }
    }
  }

  loadMore() {
    const loadNodes = this.visibleData.filter((n) => n.id?.includes('_load'));

    loadNodes.forEach((node) => {
      this.addNodes(node);
    });

    this.updateVisibleItems();
  }

  render() {
    this.visibleData = this.renderableData.slice(this.start, this.end);
    this.visibleData.forEach((node) => {
      node.lastViewedTimestamp = new Date();
    });

    this.dataSource = new ArrayDataSource(this.visibleData);
  }
}
