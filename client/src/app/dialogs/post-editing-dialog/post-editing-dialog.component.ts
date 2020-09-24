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
  tag: string;
  postTags: Array<string>;

  constructor(
    public dialogRef: MatDialogRef<PostEditingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.tag = '';
  }

  ngOnInit() {
    this.postTitle = this.data.title;
    this.postBody = this.data.content;
    this.postTags = this.data.tags;
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

  updatePost() {
    console.log("updating post,", this.postTitle, this.postTags, this.postBody);
    $.post('http://localhost:4000/post/update', {
      id: this.data.id,
      title: this.postTitle,
      tags: this.postTags,
      content: this.postBody,
      date: new Date().toLocaleString()
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
