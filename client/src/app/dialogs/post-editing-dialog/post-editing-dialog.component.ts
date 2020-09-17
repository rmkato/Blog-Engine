import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as $ from 'jquery'; 

@Component({
  selector: 'app-post-editing-dialog',
  templateUrl: './post-editing-dialog.component.html',
  styleUrls: ['./post-editing-dialog.component.scss']
})
export class PostEditingDialogComponent implements OnInit {
  postID: string;
  postTitle: string;
  postBody: string;

  constructor(
    public dialogRef: MatDialogRef<PostEditingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
  }

  ngOnInit() {
    this.postTitle = this.data.title;
    this.postBody = this.data.content;
  }

  updatePost() {
    $.post('http://localhost:4000/post/update', {
      id: this.data.id,
      title: this.postTitle,
      content: this.postBody,
    })
    .done(() => {
      this.dialogRef.close();
      alert("Post updated");
    })
    .fail((res) => {
      this.dialogRef.close();
      alert("Post update failed: " + res.responseJSON.message);
    })
  }

  cancel() {
    this.dialogRef.close();
  }

}
