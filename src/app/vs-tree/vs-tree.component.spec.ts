import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VsTreeComponent } from './vs-tree.component';

describe('VsTreeComponent', () => {
  let component: VsTreeComponent;
  let fixture: ComponentFixture<VsTreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VsTreeComponent]
    });
    fixture = TestBed.createComponent(VsTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
