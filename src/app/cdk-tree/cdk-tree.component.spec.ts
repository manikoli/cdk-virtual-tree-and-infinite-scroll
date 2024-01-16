import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CdkTreeComponent } from './cdk-tree.component';

describe('CdkTreeComponent', () => {
  let component: CdkTreeComponent;
  let fixture: ComponentFixture<CdkTreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CdkTreeComponent]
    });
    fixture = TestBed.createComponent(CdkTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
