import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as $ from 'jquery';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  postId: string;
  postTitle: string;
  postContent: string;
  postDate: string;
  postUser: string;
  postTags: Array<string>;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.postId = this.route.snapshot.params['id'];
    this.retrievePost();
  }

  retrievePost() {
    $.post('http://localhost:4000/post/retrieveOne', {'id': this.postId})
      .done((res) => {
        this.postTitle = res.title;
        this.postContent = res.content;
        this.postDate = res.date;
        this.postUser = res.user;
        this.postTags = res.tags;
      })
      .fail((res) => {
        console.log("post retrieval failed:", res);
      })
  }

}