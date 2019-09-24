import { Component , OnInit, OnDestroy} from '@angular/core';
import { PostService } from '../posts.service';
import { Subscription } from 'rxjs';
import { Post } from '../post.model';
import { PageEvent } from '@angular/material';
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
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1,2,5,10];

  constructor(public postService :PostService){
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage,this.currentPage);
    this.posSub = this.postService.
    getPostUpdateListener().subscribe((postData:{posts: Post[],postCount: number})=>{
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.posts;
      console.log("Posts are ....."+JSON.stringify(this.posts));
    })
  }

  pageChanged(event :PageEvent){
    console.log(JSON.stringify(event));
    this.isLoading = true;
    this.currentPage = event.pageIndex + 1 ;
    this.postsPerPage = event.pageSize;
    this.postService.getPosts(this.postsPerPage,this.currentPage);
  }

  onDelete(postId:string){
      this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  ngOnDestroy(): void {
    this.posSub.unsubscribe();
  }
}
