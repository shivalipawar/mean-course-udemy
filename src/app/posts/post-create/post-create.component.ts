import { Component } from '@angular/core';

@Component({
  selector : 'app-post-create',
  templateUrl :'./post-create.component.html',
  styleUrls :['./post-create.component.css']
})
export class PostCreateComponent{
postValue='NO CONTENT';
enteredValue='';

/*Method with click event n marker variable way */
  // onAddPost(postInput:HTMLTextAreaElement){
  //   console.dir(postInput); //As with console.log we cant se inside of text area obj this will help us;
  //   this.postValue =postInput.value;
  //   alert("Post Created");
  // }
  onAddPost(){
    this.postValue =this.enteredValue;
  }
}
