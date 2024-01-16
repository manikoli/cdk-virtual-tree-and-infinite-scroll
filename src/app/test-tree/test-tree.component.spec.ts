import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestTreeComponent } from './test-tree.component';

describe('TestTreeComponent', () => {
  let component: TestTreeComponent;
  let fixture: ComponentFixture<TestTreeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestTreeComponent]
    });
    fixture = TestBed.createComponent(TestTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
