import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostEditingDialogComponent } from './post-editing-dialog.component';

describe('PostEditingDialogComponent', () => {
  let component: PostEditingDialogComponent;
  let fixture: ComponentFixture<PostEditingDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostEditingDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostEditingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
