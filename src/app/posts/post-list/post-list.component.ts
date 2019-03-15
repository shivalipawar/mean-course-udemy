import { Component , OnInit, OnDestroy} from '@angular/core';
import { PostService } from '../posts.service';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
@Component({
  selector : 'app-post-list',
  templateUrl :'./post-list.component.html',
  styleUrls :['./post-list.component.css']
})
export class PostListComponent implements OnInit,OnDestroy{


  // posts=[
  //   {title :'First Post', content:"This is first post's content"},
  //   {title :'Second Post', content:"This is second post's content"},
  //   {title :'Third Post', content:"This is third post's content"}
  // ]
  posts: Post[] =[];
  private posSub :Subscription;

  constructor(public postService :PostService){
  }

  ngOnInit(): void {
    this.postService.getPosts();
    this.posSub = this.postService.getPostUpdateListener().subscribe((post: Post[])=>{
      this.posts = post;
    })
  }

  ngOnDestroy(): void {
    this.posSub.unsubscribe();
  }
}
