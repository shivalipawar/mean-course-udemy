import { Component} from '@angular/core';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { PostService } from '../posts.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';

@Component({
  selector : 'app-post-create',
  templateUrl :'./post-create.component.html',
  styleUrls :['./post-create.component.css']
})
export class PostCreateComponent{
  enteredTitle = "";
  enteredContent = "";
  isLoading=false;
  imagePreview = null;
  form : FormGroup ;
  private mode = 'create'
  private postId :string;
  post: Post;

  constructor(public postService: PostService, public route:ActivatedRoute){}

ngOnInit(){

  this.form = new FormGroup({
    'title': new FormControl(null,{validators:[Validators.required, Validators.minLength(3)]}),
    'content' : new FormControl(null,Validators.required),
    'image': new FormControl(null,{validators:[Validators.required], asyncValidators : [mimeType]})
  })

  this.route.paramMap.subscribe((paramMap : ParamMap)=>{
    console.log("ParamMap "+JSON.stringify(paramMap))
    if(paramMap.has('postId')){
      this.mode = 'edit;'
      this.postId = paramMap.get('postId');
      this.isLoading = true;
      this.postService.getPost(this.postId).subscribe(postData =>{
        this.isLoading = false;
        console.log("Post for given id is "+JSON.stringify(postData));
        this.post = {id : postData._id, title : postData.title , content :postData.content };
        this.form.setValue({
          title : this.post.title,
          content : this.post.content
        })
      })
    }
    else{
      this.mode = 'create'
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
  onSavePost(){
    //this.postValue =this.enteredValue;
    if(!this.form.valid) return;

    this.isLoading = true;  //Here we dont explicitly set it to false as navigates and later initialize this component Loading to false.
    if(this.mode === 'create'){
      this.postService.addPosts(this.form.value.title,this.form.value.content);
    }
    else{
      this.postService.updatePosts(this.postId,this.form.value.title,this.form.value.content);
    }
    this.form.reset();
  }

  onImagePicked(event : Event){
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image:file});       //This is used to update on a single control of the form
    this.form.get('image').updateValueAndValidity();

    const reader = new FileReader();
    //Below method is async so we have used a callback.
    reader.onload = () =>{
      this.imagePreview = reader.result;
      console.log("imagePreview ",this.imagePreview);
    }
    reader.readAsDataURL(file);
  }
  
}
