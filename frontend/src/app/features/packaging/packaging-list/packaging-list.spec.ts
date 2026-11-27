import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagingList } from './packaging-list';

describe('PackagingList', () => {
  let component: PackagingList;
  let fixture: ComponentFixture<PackagingList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackagingList],
    }).compileComponents();

    fixture = TestBed.createComponent(PackagingList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
