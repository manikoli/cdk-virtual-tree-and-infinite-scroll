// tree.service.ts

import { Injectable } from '@angular/core';
import { Observable, delay, of } from 'rxjs';

export interface TreeNode {
  name: string;
  children?: TreeNode[];
}

@Injectable({
  providedIn: 'root',
})
export class TreeService {
  getElements(node: any, size: number, index: number): Observable<any[]> {
    console.log(index);
    const data: any = [];
    const isLoadMoreNode = node.id.includes('_load');

    for (let i = 0; i < size; i++) {
      let id = Math.round(Math.random() * 100000).toString();
      let name = index++ as unknown as string;
      let expandable = Math.random() > 0.5;
      let level = isLoadMoreNode ? node.level : node.level + 1;
      let parentId = isLoadMoreNode ? node.parentId : node.id;
      let numOfChildren = expandable ? 30 : undefined;
      let page = node.page + 1;
      let currentlyLoaded = expandable ? 0 : undefined;
      data.push({
        id,
        name,
        expandable,
        level,
        parentId,
        numOfChildren,
        page,
        lastViewedTimestamp: new Date(),
        currentlyLoaded,
      });
    }

    if (node.currentlyLoaded + size < node.numOfChildren) {
      data.push({
        id:
          Math.round(Math.random() * 100000).toString() +
          '_load' +
          `_${isLoadMoreNode ? node.id.split('_')[2] : node.name}`,
        name: 'Load more',
        expandable: false,
        level: isLoadMoreNode ? node.level : node.level + 1,
        parentId: isLoadMoreNode ? node.parentId : node.id,
        page: node.page + 1,
        numOfChildren: node.numOfChildren,
        currentlyLoaded: node.currentlyLoaded + size,
        lastViewedTimestamp: new Date(),
      });
    }

    // Using of to create an observable that emits the data
    const observable = of(data);

    // Adding a delay of 1000 milliseconds (1 second) using the delay operator
    return observable.pipe(delay(2000));
  }
}
