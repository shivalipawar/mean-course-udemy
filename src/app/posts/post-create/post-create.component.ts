import { Component} from '@angular/core';
import { NgForm } from '@angular/forms';
import { PostService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';

@Component({
  selector : 'app-post-create',
  templateUrl :'./post-create.component.html',
  styleUrls :['./post-create.component.css']
})
export class PostCreateComponent{
  enteredTitle = "";
  enteredContent = "";
  private mode = 'create'
  private postId :string;
  post: Post;

  constructor(public postService: PostService, public route:ActivatedRoute){}

ngOnInit(){
  this.route.paramMap.subscribe((paramMap : ParamMap)=>{
    if(paramMap.has('postId')){
      this.mode = 'edit;'
      this.postId = paramMap.get('postId');
      this.postService.getPost(this.postId).subscribe(postData =>{
        this.post = {id : postData._id, title : postData.title , content :postData.content };
      })
    }
    else{
      this.mode = 'create;'
      this.postId = null;
    }
  })
}

/*Method with click event n marker variable way */
  // onAddPost(postInput:HTMLTextAreaElement){
  //   console.dir(postInput); //As with console.log we cant se inside of text area obj this will help us;
  //   this.postValue =postInput.value;
  //   alert("Post Created");
  // }
  onSavePost(form:NgForm){
    //this.postValue =this.enteredValue;
    if(!form.valid) return;

    if(this.mode === 'create'){
      this.postService.addPosts(form.value.title,form.value.content);
    }
    else{
      this.postService.updatePosts(this.postId,form.value.title,form.value.content);
    }
    form.resetForm();
  }
  
}
