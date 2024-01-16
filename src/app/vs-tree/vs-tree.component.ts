// app.component.ts

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  MatTreeFlatDataSource,
  MatTreeFlattener,
} from '@angular/material/tree';
import { FlatTreeControl } from '@angular/cdk/tree';
import { TreeNode, TreeService } from '../tree.service';

interface FlatTreeNode {
  expandable: boolean;
  name: string;
  level: number;
}

@Component({
  selector: 'vs-tree',
  template: `
    <cdk-virtual-scroll-viewport itemSize="48" class="example-viewport">
      <mat-tree [dataSource]="dataSource" [treeControl]="treeControl">
        <mat-tree-node
          *matTreeNodeDef="let node"
          [style.marginLeft.px]="node.level * 16"
        >
          <div class="node-item">
            <button mat-icon-button disabled></button>
            {{ node.name }}
          </div>
        </mat-tree-node>

        <mat-tree-node
          *matTreeNodeDef="let node; when: hasChild"
          [style.marginLeft.px]="node.level * 16"
        >
          <div class="node-item">
            <button
              mat-icon-button
              [attr.aria-label]="'toggle ' + node.name"
              matTreeNodeToggle
            >
              <mat-icon class="mat-icon-rtl-mirror">
                {{
                  treeControl.isExpanded(node) ? 'expand_more' : 'chevron_right'
                }}
              </mat-icon>
            </button>
            {{ node.name }}
          </div>
        </mat-tree-node>
      </mat-tree>
    </cdk-virtual-scroll-viewport>
  `,
  styles: [
    `
      .example-viewport {
        height: 200px;
      }

      .node-item {
        display: flex;
        align-items: center;
      }
    `,
  ],
})
export class VsTreeComponent implements OnInit {
  treeFlattener: MatTreeFlattener<TreeNode, FlatTreeNode>;
  treeControl: FlatTreeControl<FlatTreeNode>;
  dataSource: MatTreeFlatDataSource<TreeNode, FlatTreeNode>;

  constructor(
    private treeService: TreeService,
    private cdRef: ChangeDetectorRef
  ) {
    this.treeFlattener = new MatTreeFlattener(
      this.transformer,
      (node) => node.level,
      (node) => node.expandable,
      (node) => node.children
    );

    this.treeControl = new FlatTreeControl<FlatTreeNode>(
      (node) => node.level,
      (node) => node.expandable
    );

    this.dataSource = new MatTreeFlatDataSource(
      this.treeControl,
      this.treeFlattener
    );
  }

  ngOnInit(): void {
    const treeData = this.treeService.getTreeData();
    const flattenedTree = this.treeFlattener.flattenNodes(treeData);

    this.dataSource.data = flattenedTree;

    // Trigger change detection to ensure virtual scrolling works properly
    this.cdRef.detectChanges();
  }

  hasChild = (_: number, node: FlatTreeNode) => node.expandable;

  private transformer = (node: TreeNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      level: level,
    };
  };
}
