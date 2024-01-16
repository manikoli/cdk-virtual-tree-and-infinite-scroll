import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VsCdkTreeComponent } from './vs-cdk-tree.component';

describe('VsCdkTreeComponent', () => {
  let component: VsCdkTreeComponent;
  let fixture: ComponentFixture<VsCdkTreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VsCdkTreeComponent]
    });
    fixture = TestBed.createComponent(VsCdkTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
