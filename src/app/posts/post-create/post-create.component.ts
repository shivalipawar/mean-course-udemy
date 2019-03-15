import { Component} from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../posts.service';

@Component({
  selector : 'app-post-create',
  templateUrl :'./post-create.component.html',
  styleUrls :['./post-create.component.css']
})
export class PostCreateComponent{
  enteredTitle = "";
  enteredContent = "";

  constructor(public postService: PostService){}

/*Method with click event n marker variable way */
  // onAddPost(postInput:HTMLTextAreaElement){
  //   console.dir(postInput); //As with console.log we cant se inside of text area obj this will help us;
  //   this.postValue =postInput.value;
  //   alert("Post Created");
  // }
  onAddPost(form:NgForm){
    //this.postValue =this.enteredValue;
    if(!form.valid) return;
    this.postService.addPosts(form.value.title,form.value.content);
    form.resetForm();
  }
  
}
