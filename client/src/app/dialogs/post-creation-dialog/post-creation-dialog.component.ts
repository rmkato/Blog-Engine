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
  tag: string;
  postTags: Array<string>;

  constructor(
    public dialogRef: MatDialogRef<PostCreationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.postTitle = '';
    this.postBody = '';
    this.tag = '';
    this.postTags = [];
  }

  ngOnInit() {
  }

  addTag() {
    if (this.tag != '' && !this.postTags.includes(this.tag)) {
      this.postTags.push(this.tag);      
    }
    this.tag = '';
  }

  removeTag(tag) {
    this.postTags = this.postTags.filter(function(t) {return t !== tag });
  }
  
  createPost() {
    $.post('http://localhost:4000/post/create', {
      title: this.postTitle,
      content: this.postBody,
      tags: this.postTags,
      date: new Date().toLocaleString(),
      user: this.data.username,
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
