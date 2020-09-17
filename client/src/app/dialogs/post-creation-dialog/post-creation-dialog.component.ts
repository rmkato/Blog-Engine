import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import * as $ from 'jquery'; 

@Component({
  selector: 'app-post-creation-dialog',
  templateUrl: './post-creation-dialog.component.html',
  styleUrls: ['./post-creation-dialog.component.scss']
})
export class PostCreationDialogComponent implements OnInit {
  postTitle: string;
  postBody: string;

  constructor(
    public dialogRef: MatDialogRef<PostCreationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.postTitle = '';
    this.postBody = '';
  }

  ngOnInit() {
  }
  
  createPost() {
    $.post('http://localhost:4000/post/create', {
      title: this.postTitle,
      content: this.postBody,
      date: new Date().toISOString().slice(0,10),
      user: this.data.email
    })
    .done(() => {
      alert("Post created");
      this.dialogRef.close();
    })
    .fail((res) => {
      alert("Post creation failed: " + res.responseJSON.message);
      this.dialogRef.close();
    })
  }

  cancel() {
    this.dialogRef.close();
  }

}
