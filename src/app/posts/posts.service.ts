import { Injectable } from '@angular/core';
import {Subject, Observable} from 'rxjs';
import { HttpClient } from "@angular/common/http";
import {map} from 'rxjs/operators';
import { Post } from './post.model';
import { Router } from '@angular/router';

@Injectable({providedIn : 'root'})    //Lets us create only one instance of service throughout the app and same instance is used across
export class PostService{
    private posts : Post[] =[];
    private postsUpdate = new Subject<Post[]>();

    constructor(private http:HttpClient, private router:Router){}

    // isnt giving correct value as init this array is empty n later adding posts doesnt update this.
    getPosts(){
        // return [...this.posts];     //Creates true copy of instead of the refrence type.
        // Here we are transforming our post by getting _id and having id at client end and
        // map does perform required operation n returns new array.
      this.http.get< { message:string, posts:any}>('http://localhost:3000/api/posts')
      .pipe(map((postData)=>{
        return postData.posts.map(post =>{
          return{
            title :post.title,
            content :post.content,
            id: post._id
          }
        })
      }))
      .subscribe((transformedPost)=>{
        this.posts = transformedPost;
        console.log("Posts are "+JSON.stringify(this.posts));
        console.log("Post message is "+transformedPost.message);
        this.postsUpdate.next([...this.posts]);
      },
      (err)=>{
        console.log("Error occured while getting data"+err);
      })
    }

    getPostUpdateListener() :Observable<any>{
        return this.postsUpdate.asObservable();
    }

    getPost(id:string){
      //return {...this.posts.find(p => p.id === id)};
      return this.http.get<{_id:string , title :string, content :string}>('http://localhost:3000/api/posts/'+id);
    }

    addPosts(title:string,content:string){
        const post : Post = {id:"null", title:title, content:content};
        this.http.post<{message:string , postId:string }>('http://localhost:3000/api/posts',post)
        .subscribe((resData)=>{
          const id = resData.postId;
          post.id = id;
          this.posts.push(post);
          this.postsUpdate.next([...this.posts]);
          this.router.navigate(["/"]);
        },
        (err)=>{
          console.log("Error occured while posting data"+JSON.stringify(err));
        })
    }

    updatePosts(id:string , title:string, content:string){
      const post :Post = { id:id, title:title, content:content};
      console.log("Post to be updated is "+JSON.stringify(post));
      this.http.put("http://localhost:3000/api/posts/"+id,post)
      .subscribe(res => {
        console.log(JSON.stringify(res));
        const updatePosts = [...this.posts];      //Create copy of posts
        const oldIndex = updatePosts.findIndex(p => p.id === post.id);
        updatePosts[oldIndex] = post;
        this.posts = updatePosts;             //This is immutable way of updating the posts.
        this.postsUpdate.next([...this.posts]);
        this.router.navigate(["/"]);
      });
    }

    deletePost(postId:any){
      this.http.delete('http://localhost:3000/api/posts/'+postId)
      .subscribe(()=>{
        //console.log("Deleted");
        const updatedPost = this.posts.filter(post => post.id !== postId);
        this.posts = updatedPost;
        this.postsUpdate.next([...this.posts]);
      })
    }
}
