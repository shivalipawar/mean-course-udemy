import { Injectable } from '@angular/core';
import {Subject, Observable} from 'rxjs'

@Injectable({providedIn : 'root'})    //Lets us create only one instance of service throughout the app and same instance is used across
export class PostService{
    private posts : Post[] =[];
    private postsUpdate = new Subject<Post[]>();

    //isnt giving correct value as init this array is empty n later adding posts doesnt update this.
    getPosts(){
        return [...this.posts];     //Creates true copy of instead of the refrence type. 
    }

    getPostUpdateListener() :Observable<any>{
        return this.postsUpdate.asObservable();
    }

    addPosts(title,content){
        const post : Post = {title:title, content:content};
        this.posts.push(post);
        this.postsUpdate.next([...this.posts]);
    }
}