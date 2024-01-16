// virtual-scroll.directive.ts

import {
  Directive,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Directive({
  selector: '[appVirtualScroll]',
})
export class VirtualScrollDirective implements OnChanges {
  @Input() set appVirtualScrollItems(items: any[]) {
    this.viewport.checkViewportSize();
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private viewport: CdkVirtualScrollViewport
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['appVirtualScrollItems']) {
      this.viewport.checkViewportSize();
    }
  }
}
