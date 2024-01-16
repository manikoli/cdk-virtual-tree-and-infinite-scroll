import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { FlatNode } from '../interfaces/flatNode.interface';

@Injectable({
  providedIn: 'root',
})
export class TempFakeApiService {
  constructor() {}

  returnNodes(nodeUid: string | null, treeType: string) {
    const nodes: FlatNode[] = [
      {
        uid: '1',
        name: 'Folder 1',
        createDateTimeUTC: new Date().toDateString(),
        lastModifiedByMe: 'User A',
        lastModifiedByOthers: 'User B',
        ownerUid: 'User C',
        parentNodeUid: nodeUid,
        color: 'blue',
        icon: 'folder-icon',
        nodeType: 'Folder',
        level: '',
      },
      {
        uid: '2',
        name: 'Document 1',
        createDateTimeUTC: new Date().toDateString(),
        lastModifiedByMe: 'User D',
        lastModifiedByOthers: 'User E',
        ownerUid: 'User F',
        parentNodeUid: nodeUid,
        color: 'green',
        icon: 'document-icon',
        nodeType: 'Document',
        level: '',
      },
      {
        uid: '3',
        name: 'Folder 2',
        createDateTimeUTC: new Date().toDateString(),
        lastModifiedByMe: 'User G',
        lastModifiedByOthers: 'User H',
        ownerUid: 'User I',
        parentNodeUid: nodeUid,
        color: 'red',
        icon: 'folder-icon',
        nodeType: 'Folder',
        level: '',
      },
      {
        uid: '4',
        name: 'Document 2',
        createDateTimeUTC: new Date().toDateString(),
        lastModifiedByMe: 'User J',
        lastModifiedByOthers: 'User K',
        ownerUid: 'User L',
        parentNodeUid: nodeUid,
        color: 'yellow',
        icon: 'image-icon',
        nodeType: 'Document',
        level: '',
      },
    ];
    const treeNodes = nodes.map((node) => ({ ...node, children: [] }));
    return of(treeNodes);
  }
}
