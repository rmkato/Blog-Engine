import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostCreationDialogComponent } from './post-creation-dialog.component';

describe('PostCreationDialogComponent', () => {
  let component: PostCreationDialogComponent;
  let fixture: ComponentFixture<PostCreationDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostCreationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostCreationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
