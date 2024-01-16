import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, Injectable, ViewChild, AfterViewInit } from '@angular/core';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import {
  BehaviorSubject,
  Observable,
  debounceTime,
  fromEvent,
  of as observableOf,
} from 'rxjs';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

/**
 * File node data with nested structure.
 * Each node has a filename, and a type or a list of children.
 */
export class FileNode {
  children!: FileNode[];
  filename!: string;
  isExpanded?: boolean;
  isDisplayed?: boolean;
  type?: string;
  parentNodeUid?: string | null;
  uid?: string | null;
}

/** Flat node with expandable and level information */
export class FileFlatNode {
  constructor(
    public uid: string,
    public expandable: boolean,
    public filename: string,
    public level: number,
    public type: any,
    public children: FileNode[]
  ) {}
}

/**
 * The file structure tree data in string. The data could be parsed into a Json object
 */
export interface FileFlatNode {
  filename: string;
  uid: string;
  parentNodeUid: any;
  type: any;
  isExpanded: boolean;
  isDisplayed: boolean;
}

const virtualSource = [
  {
    filename: 'Applications (1)',
    uid: '0',
    isDisplayed: true,
    parentNodeUid: null,
  },
  {
    filename: 'Calendar',
    type: 'app',
    uid: '1',
    parentNodeUid: '0',
  },
  {
    filename: 'Chrome',
    type: 'app',
    uid: '2',
    parentNodeUid: '0',
  },
  {
    filename: 'Webstorm',
    type: 'app',
    uid: '3',
    parentNodeUid: '0',
  },
  {
    filename: 'Documents (2)',
    uid: '4',
    isDisplayed: true,
    parentNodeUid: null,
  },
  {
    filename: 'angular',
    uid: '5',
    parentNodeUid: '4',
  },
  {
    filename: 'src',
    uid: '6',
    parentNodeUid: '5',
  },
  {
    filename: 'compiler',
    type: 'ts',
    uid: '7',
    parentNodeUid: '6',
  },
  {
    filename: 'core',
    type: 'ts',
    uid: '8',
    parentNodeUid: '6',
  },
  {
    filename: 'material2 (3)',
    uid: '9',
    isDisplayed: true,
    parentNodeUid: null,
  },
  {
    filename: 'src',
    uid: '10',
    parentNodeUid: '9',
  },
  {
    filename: 'button',
    type: 'ts',
    uid: '11',
    parentNodeUid: '10',
  },
  {
    filename: 'checkbox',
    type: 'ts',
    uid: '12',
    parentNodeUid: '10',
  },
  {
    filename: 'input',
    type: 'ts',
    uid: '13',
    parentNodeUid: '10',
  },
  {
    filename: 'Downloads (4)',
    uid: '14',
    isDisplayed: true,
    parentNodeUid: null,
  },
  {
    filename: 'October',
    type: 'pdf',
    uid: '15',
    parentNodeUid: '14',
  },
  {
    filename: 'November',
    type: 'pdf',
    uid: '16',
    parentNodeUid: '14',
  },
  {
    filename: 'Tutorial',
    type: 'html',
    uid: '17',
    parentNodeUid: '14',
  },
  {
    filename: 'Pictures (5)',
    uid: '18',
    isDisplayed: true,
    parentNodeUid: null,
  },
  {
    filename: 'Photo Booth Library',
    uid: '19',
    parentNodeUid: '18',
  },
  {
    filename: 'Contents',
    uid: '20',
    parentNodeUid: '19',
  },
  {
    filename: 'Pictures',
    uid: '21',
    parentNodeUid: '19',
  },
  {
    filename: 'Sun',
    type: 'png',
    uid: '22',
    parentNodeUid: '21',
  },
  {
    filename: 'Woods',
    type: 'jpg',
    uid: '23',
    parentNodeUid: '21',
  },
] as FileFlatNode[];

/**
 * @title Tree with flat nodes
 */
@Component({
  selector: 'tree',
  templateUrl: 'tree.component.html',
  styleUrls: ['tree.component.scss'],
})
export class TreeComponent implements AfterViewInit {
  treeControl: FlatTreeControl<FileFlatNode>;
  treeFlattener: MatTreeFlattener<FileNode, FileFlatNode>;
  dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;

  fullSource = [...virtualSource].map((item) => {
    return {
      filename: item.filename,
      uid: item.uid,
      parentNodeUid: item.parentNodeUid,
      type: item.type,
      isExpanded: item.isExpanded,
      isDisplayed: item.isDisplayed,
    } as FileFlatNode;
  });
  @ViewChild(CdkVirtualScrollViewport) virtualScroll!: CdkVirtualScrollViewport;

  vSo = this.fullSource;

  rangeStart = 0;
  rangeEnd = 10;

  constructor() {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      this._getLevel,
      this._isExpandable,
      this._getChildren
    );
    this.treeControl = new FlatTreeControl<FileFlatNode>(
      this._getLevel,
      this._isExpandable
    );
    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );

    this.vSo = this.fullSource.filter(
      (node) => node.isExpanded || node.parentNodeUid === null
    );

    for (let i = 24; i < 100; i++) {
      this.fullSource.push({
        filename: 'Sun' + i,
        type: null,
        uid: i.toString(),
        parentNodeUid: (i - 4).toString(),
        expandable: false,
        level: 0,
        children: [],
        isExpanded: false,
        isDisplayed: false,
      });
    }

    this.dataSource.data = this.buildTree(this.fullSource, null);
  }

  transformer = (node: FileNode, level: number) => {
    return new FileFlatNode(
      node.uid || '',
      !!node.children,
      node.filename,
      level,
      node.type,
      node.children
    );
  };

  private _getLevel = (node: FileFlatNode) => node.level;

  private _isExpandable = (node: FileFlatNode) => node.expandable;

  private _getChildren = (node: FileNode): Observable<FileNode[]> =>
    observableOf(node.children);

  hasChild = (_: number, _nodeData: FileFlatNode) => _nodeData.expandable;

  expanded: any[] = [];
  currentIndex!: number;

  fun(event: FileNode) {
    const node = this.treeControl.dataNodes.find(
      (n) => n.uid === event?.uid || ''
    );

    if (node) {
      const element = this.fullSource.find((item) => item.uid === event?.uid);
      const nodeExpanded = this.treeControl.isExpanded(node);

      if (element) {
        element.isExpanded = nodeExpanded;
      }

      if (nodeExpanded) {
        this.expanded.push({ uid: event.uid, isExpanded: element?.isExpanded });
      } else {
        this.expanded = this.expanded.filter((node) => node.uid !== event.uid);
      }

      this.toggleChildren(event, nodeExpanded);
      this.updateTree(0, 10);

      const index = this.vSo.findIndex((item) => item.uid === event.uid);
      // this.virtualScroll.scrollToIndex(index);
    }
    console.log(this.vSo);
  }

  updateTree(loadPrevious?: number, loadMoreItems?: number) {
    this.dataSource.data = this.arrayToTree(loadPrevious, loadMoreItems);
    this.expandNodes();
  }

  expandNodes() {
    this.expanded.forEach((item) => {
      const nodeToExpand = this.treeControl.dataNodes.find(
        (n) => n.uid === item.uid
      );

      if (nodeToExpand) {
        this.treeControl.expand(nodeToExpand);
      }
    });
  }

  arrayToTree(loadPrevious?: number, loadMoreItems?: number) {
    let array = this.fullSource.filter((node) => node.isDisplayed);
    // const start =
    //   this.rangeStart - (loadPrevious || 0) < 0
    //     ? 0
    //     : this.rangeStart - (loadPrevious || 0);
    // const end =
    //   this.rangeEnd + (loadMoreItems || 0) > this.fullSource.length - 1
    //     ? this.fullSource.length - 1
    //     : this.rangeEnd + (loadMoreItems || 0);

    const start =
      this.currentIndex - (loadPrevious || 0) < 0
        ? 0
        : this.currentIndex - (loadPrevious || 0);
    const end =
      this.currentIndex + (loadMoreItems || 0) > this.fullSource.length - 1
        ? this.fullSource.length - 1
        : this.currentIndex + (loadMoreItems || 0);

    console.log(start, end, 'start, end');

    // const start = this.currentIndex + (loadPrevious || 0);
    // const end = this.currentIndex + 10 + (loadMoreItems || 0);
    array = array.slice(start, end);
    this.vSo = array;
    return this.buildTree(array, null);
  }

  toggleChildren(event: FileNode, open: boolean) {
    if (Object.hasOwn(event, 'children')) {
      this.fullSource.forEach((child) => {
        if (child.parentNodeUid === event.uid) {
          child['isDisplayed'] = open;
        }
      });
    }
  }

  buildTree(nodes: FileFlatNode[], parentNodeUid: string | null): FileNode[] {
    return nodes
      .filter((node) => node.parentNodeUid === parentNodeUid)
      .map((node) => ({
        ...node,
        ...(!node?.type
          ? { children: this.buildTree(nodes, node.uid || '') }
          : {}),
      }));
  }

  ngAfterViewInit() {
    this.virtualScroll.renderedRangeStream.subscribe((range) => {
      console.log(range, 'range');
      //   this.rangeStart = range.start;
      //   // this.rangeEnd = range.end;
      //   console.log(this.vSo, 'vSo');
      // this.dataSource.data = this.arrayToTree(range.start, range.end);

      //   // this.dataSource.data = this.fullDatasource.slice(range.start, range.end);
      //   // const array = this.vSo.filter((item) => item.isExpanded);
      //   // const tree = this.buildTree(array.slice(range.start, range.end), null);
      //   // this.dataSource.data = tree;
    });

    this.virtualScroll.scrolledIndexChange.subscribe((index) => {
      this.currentIndex = index;
      this.checkIfScrolledToTop(index);
    });

    fromEvent(this.virtualScroll.elementRef.nativeElement, 'scroll')
      .pipe(debounceTime(200))
      .subscribe(() => this.checkIfScrolledToBottom());
  }

  checkIfScrolledToTop(index: number) {
    if (index === 0) {
      this.updateTree(10, 10);
      // console.log('load more top');
    }
  }

  checkIfScrolledToBottom() {
    let lastScrollTop = 0;
    const element = this.virtualScroll.elementRef.nativeElement;
    element.onscroll = (e) => {
      if (element.scrollTop < lastScrollTop) {
        // upscroll
        return;
      }
      lastScrollTop = element.scrollTop <= 0 ? 0 : element.scrollTop;
      if (element.scrollTop + element.offsetHeight >= element.scrollHeight) {
        this.updateTree(0, 10);
        // console.log('End');
      }
    };
  }
}
