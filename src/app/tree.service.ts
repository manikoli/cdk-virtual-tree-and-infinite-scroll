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
  getElements(node: any, num: number): Observable<any[]> {
    let iteration = 0;
    const data: any = [];

    for (let i = 0; i < num; i++) {
      iteration++;
      data.push({
        id: (Math.random() * 1000).toString(),
        name: node.name + iteration,
        expandable: false,
        level: node.level + 1,
        parentId: node.id,
      });
    }

    // Using of to create an observable that emits the data
    const observable = of(data);

    // Adding a delay of 1000 milliseconds (1 second) using the delay operator
    return observable.pipe(delay(2000));
  }
}
