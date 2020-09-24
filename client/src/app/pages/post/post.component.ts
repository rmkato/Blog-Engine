import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  postId: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.postId = this.route.snapshot.params[''];
    console.log(this.postId);
  }

}