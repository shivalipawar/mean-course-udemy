import { Injectable } from '@angular/core';
import {Subject, Observable} from 'rxjs';
import { HttpClient } from "@angular/common/http";
import {map} from 'rxjs/operators';
import { Post } from './post.model';

@Injectable({providedIn : 'root'})    //Lets us create only one instance of service throughout the app and same instance is used across
export class PostService{
    private posts : Post[] =[];
    private postsUpdate = new Subject<Post[]>();

    constructor(private http:HttpClient){}

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

    addPosts(title:string,content:string){
        const post : Post = {id:null, title:title, content:content};
        this.http.post<{message:string}>('http://localhost:3000/api/posts',post)
        .subscribe((resData)=>{
          console.log(resData);
          this.posts.push(post);
          this.postsUpdate.next([...this.posts]);
        },
        (err)=>{
          console.log("Error occured while posting data"+err);
        })
    }
}
