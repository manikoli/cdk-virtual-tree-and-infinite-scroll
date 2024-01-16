import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfTreeComponent } from './of-tree.component';

describe('OfTreeComponent', () => {
  let component: OfTreeComponent;
  let fixture: ComponentFixture<OfTreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OfTreeComponent]
    });
    fixture = TestBed.createComponent(OfTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
