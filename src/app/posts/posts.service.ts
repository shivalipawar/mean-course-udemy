// import { Injectable } from '@angular/core';
// import {Subject, Observable} from 'rxjs';
// import { HttpClient } from "@angular/common/http";
// import {map} from 'rxjs/operators';
// import { Post } from './post.model';
// import { Router } from '@angular/router';

// @Injectable({providedIn : 'root'})    //Lets us create only one instance of service throughout the app and same instance is used across
// export class PostService{
//     private posts : Post[] =[];
//     private postsUpdate = new Subject<Post[]>();

//     constructor(private http:HttpClient, private router:Router){}

//     // isnt giving correct value as init this array is empty n later adding posts doesnt update this.
//     getPosts(postPerPage : number, currentPage : number){
//         // return [...this.posts];     //Creates true copy of instead of the refrence type.
//         // Here we are transforming our post by getting _id and having id at client end and
//         // map does perform required operation n returns new array.
//       const queryParams = `?pagesize=${postPerPage}&page=${currentPage}`;

//       this.http.get< { message:string, posts:any}>('http://localhost:3000/api/posts'+queryParams)
//       .pipe(map((postData)=>{
//         return postData.posts.map(post =>{
//           return{
//             title :post.title,
//             content :post.content,
//             id: post._id
//           }
//         })
//       }))
//       .subscribe((transformedPost)=>{
//         this.posts = transformedPost;
//         console.log("Posts are "+JSON.stringify(this.posts));
//         console.log("Post message is "+transformedPost.message);
//         this.postsUpdate.next([...this.posts]);
//       },
//       (err)=>{
//         console.log("Error occured while getting data"+err);
//       })
//     }

//     getPostUpdateListener() :Observable<any>{
//         return this.postsUpdate.asObservable();
//     }

//     getPost(id:string){
//       //return {...this.posts.find(p => p.id === id)};
//       return this.http.get<{_id:string , title :string, content :string}>('http://localhost:3000/api/posts/'+id);
//     }

//     addPosts(title:string,content:string,image:File){
//         const postData = new FormData();
//         postData.append("title",title);
//         postData.append("content",content);
//         postData.append("image",image, title);

//         this.http.post<{message:string , post:Post }>('http://localhost:3000/api/posts',postData)
//         .subscribe((resData)=>{
//           const post : Post = {id:resData.post.id, title:title, content:content,imagePath:title};
//           post.id = post.id;
//           this.posts.push(post);
//           this.postsUpdate.next([...this.posts]);
//           this.router.navigate(["/"]);
//         },
//         (err)=>{
//           console.log("Error occured while posting data"+JSON.stringify(err));
//         })
//     }

//     updatePosts(id:string , title:string, content:string,image:File | string){
//       let postData;
//       if(typeof(image) === 'object'){
//         postData = new FormData();
//         postData.append("title",title);
//         postData.append("content",content);
//         postData.append("image",image, title);

//       }else{
//           postData ={
//           id:id,
//           title :title,
//           content :content,
//           imagePath : image
//         }
//       }
//       this.http.put("http://localhost:3000/api/posts/"+id,postData)
//       .subscribe(res => {
//         console.log(JSON.stringify(res));
//         const updatePosts = [...this.posts];      //Create copy of posts
//         const oldIndex = updatePosts.findIndex(p => p.id === id);
//         const post : Post ={
//           id:id,
//           title :title,
//           content :content,
//           imagePath : ""
//         }
//         updatePosts[oldIndex] = post;
//         this.posts = updatePosts;             //This is immutable way of updating the posts.
//         this.postsUpdate.next([...this.posts]);
//         this.router.navigate(["/"]);
//       });
//     }

//     deletePost(postId:any){
//       this.http.delete('http://localhost:3000/api/posts/'+postId)
//       .subscribe(()=>{
//         //console.log("Deleted");
//         const updatedPost = this.posts.filter(post => post.id !== postId);
//         this.posts = updatedPost;
//         this.postsUpdate.next([...this.posts]);
//       })
//     }
// }


import { Injectable } from '@angular/core';
import {Subject, Observable} from 'rxjs';
import { HttpClient } from "@angular/common/http";
import {map} from 'rxjs/operators';
import { Post } from './post.model';
import { Router } from '@angular/router';

@Injectable({providedIn : 'root'})    //Lets us create only one instance of service throughout the app and same instance is used across
export class PostService{
    private posts : Post[] =[];
    private postsUpdate = new Subject<{ posts: Post[]; postCount: number }>();

    constructor(private http:HttpClient, private router:Router){}

    // isnt giving correct value as init this array is empty n later adding posts doesnt update this.
    getPosts(postsPerPage: number, currentPage: number) {
      const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
      this.http
        .get<{ message: string; posts: any; maxPosts: number }>(
          "http://localhost:3000/api/posts" + queryParams
        )
        .pipe(
          map(postData => {
            return {
              posts: postData.posts.map(post => {
                return {
                  title: post.title,
                  content: post.content,
                  id: post._id,
                  imagePath: post.imagePath
                };
              }),
              maxPosts: postData.maxPosts
            };
          })
        )
        .subscribe(transformedPostData => {
          this.posts = transformedPostData.posts;
          console.log("Recieved posts are "+JSON.stringify(this.posts));
          this.postsUpdate.next({
            posts: [...this.posts],
            postCount: transformedPostData.maxPosts
          });
        });
    }

    getPostUpdateListener() :Observable<any>{
        return this.postsUpdate.asObservable();
    }

    getPost(id:string){
      //return {...this.posts.find(p => p.id === id)};
      return this.http.get<{
      _id:string , 
      title :string, 
      content :string,
      imagePath :string
      }>('http://localhost:3000/api/posts/'+id);
    }

    addPosts(title:string,content:string,image:File){
        const postData = new FormData();
        postData.append("title",title);
        postData.append("content",content);
        postData.append("image",image, title);

        this.http
        .post<{message:string , post:Post }>
        ('http://localhost:3000/api/posts',postData)
        .subscribe((resData)=>{
          this.router.navigate(["/"]);
        },
        (err)=>{
          console.log("Error occured while posting data"+JSON.stringify(err));
        })
    }

    updatePosts(id:string , title:string, content:string,image:File | string){
      let postData: Post | FormData;
      if(typeof(image) === 'object'){
        postData = new FormData();
        postData.append("id", id);
        postData.append("title",title);
        postData.append("content",content);
        postData.append("image",image, title);

      }else{
          postData ={
          id:id,
          title :title,
          content :content,
          imagePath : image
        }
      }
      this.http.put("http://localhost:3000/api/posts/"+id,postData)
      .subscribe(res => {
        this.router.navigate(["/"]);
      });
    }

    deletePost(postId:any){
      return this.http.delete('http://localhost:3000/api/posts/'+postId);
    }
}
