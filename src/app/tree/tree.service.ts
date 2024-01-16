import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TreeNode } from '../interfaces/treeNode.interface';
import { FlatNode } from '../interfaces/flatNode.interface';
import { TempFakeApiService } from './tempFakeApi.service';

@Injectable()
export class TreeNodeService {
  listOfAllNodes: FlatNode[] = [];

  myDriveNode: TreeNode = {
    uid: '0',
    name: 'My Drive',
    createDateTimeUTC: new Date().toDateString(),
    lastModifiedByMe: '',
    lastModifiedByOthers: '',
    ownerUid: '',
    parentNodeUid: null,
    color: '',
    icon: '',
    nodeType: 'Folder',
    children: [],
    level: '0',
  };

  sharedByNode: TreeNode = {
    uid: '1',
    name: 'Shared By Me',
    createDateTimeUTC: new Date().toDateString(),
    lastModifiedByMe: '',
    lastModifiedByOthers: '',
    ownerUid: '',
    parentNodeUid: null,
    color: '',
    icon: '',
    nodeType: 'Folder',
    children: [],
    level: '0',
  };

  sharedWithNode: TreeNode = {
    uid: '2',
    name: 'Shared With Me',
    createDateTimeUTC: new Date().toDateString(),
    lastModifiedByMe: '',
    lastModifiedByOthers: '',
    ownerUid: '',
    parentNodeUid: null,
    color: '',
    icon: '',
    nodeType: 'Folder',
    children: [],
    level: '0',
  };

  myDriveData = new BehaviorSubject<TreeNode[]>([this.myDriveNode]);
  myDriveData$ = this.myDriveData.asObservable();

  sharedByData = new BehaviorSubject<TreeNode[]>([this.sharedByNode]);
  sharedByData$ = this.sharedByData.asObservable();

  sharedWithData = new BehaviorSubject<TreeNode[]>([this.sharedWithNode]);
  sharedWithData$ = this.sharedWithData.asObservable();
  test = new BehaviorSubject<TreeNode[]>([this.sharedWithNode]);
  test$ = this.test.asObservable();

  constructor(private tempFakeApiService: TempFakeApiService) {
    this.listOfAllNodes.push(this.myDriveNode);
    this.listOfAllNodes.push(this.sharedByNode);
    this.listOfAllNodes.push(this.sharedWithNode);
  }

  // onExpand(nodeUid: string | null, treeType: string) {
  //   this.tempFakeApiService.returnNodes(nodeUid, treeType).subscribe((data) => {
  //     // this.test.next(data);
  //     const currentIndex =
  //       this.listOfAllNodes.filter((e) => e.parentNodeUid === nodeUid).length -
  //       1;
  //     const parentLevel =
  //       this.listOfAllNodes.find((e) => e.uid === nodeUid)?.level || '0';

  //     this.setLevelToNodes(data, parentLevel, currentIndex);

  //     const node = this.listOfAllNodes.find((e) => e.uid === nodeUid);
  //     this.pushNewChildrenToTree(node, parentLevel, data);
  //     this.listOfAllNodes.push(...data);

  //     const tempMyDriveData = this.myDriveData.getValue();
  //     //pronadji element kome treba da se dodaju chidren i dodaj datu u taj children niz
  //     this.myDriveData.next(tempMyDriveData);

  //     console.log(currentIndex, parentLevel, this.listOfAllNodes);
  //   });
  // }

  setLevelToNodes(
    nodes: FlatNode[],
    parentLevel: string,
    currentIndex: number
  ) {
    nodes.forEach((node) => {
      node.level = `${parentLevel}.${++currentIndex}`;
    });
  }

  pushNewChildrenToTree(node: TreeNode, parentLevel: string, data: TreeNode[]) {
    const levels = parentLevel.split('.');
    const parsedLevels = levels.map(Number);

    console.log(node, parentLevel, data, 'eeyyyy');

    if (parsedLevels.length === 1) {
      node.children.push(...data);
      return;
    } else {
      parsedLevels.splice(0, 1);

      let list = node.children[parsedLevels[0]];
      parsedLevels.splice(0, 1);

      if (parsedLevels.length) {
        parsedLevels.forEach((level: number) => {
          list = list.children[level];
        });
      }

      list.children.push(...data);
    }
  }

  getMyDrive() {
    console.log(this.myDriveData.value);
    return this.myDriveData.value;
  }
}
