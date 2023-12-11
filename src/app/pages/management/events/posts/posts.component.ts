import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { EventService } from '../../../../@core/services/event/event.service';
import { Post, PostRequest, PostService } from '../../../../@core/services/post/post.service';
import { Observable } from 'rxjs';
import { convertMilliToDate } from '../../../../@core/utils/data-util';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { FileUploadService } from '../../../../../services/file-upload.service';

@Component({
  selector: 'ngx-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent {
  @ViewChild("detailPostDialog", { static: true }) detailPostDialog: TemplateRef<any>;

  @Input() eventId: number;
  selectedPost: Post = null;
  createMode = false;
  editMode = false;
  posts$ = new Observable<Post>();

  // CREATE POST
  title = '';
  body = '';
  file: File = null;
  fileName = '';

  constructor(
    private dialogService: NbDialogService,
    private eventService: EventService,
    private postService: PostService,
    private uploadService: FileUploadService,
    public toastrService: NbToastrService,
  ) {}

  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    this.posts$ = this.eventService.getPostsByEventId(this.eventId) as Observable<Post>;
  }

  getStatusPost(status: number) {
    return 'Public'; // Always public for now
  }

  getCreateTime(milli: number) {
    return convertMilliToDate(milli);
  }

  openDialog(dialog) {
    this.dialogService.open(dialog);
  }

  onFileChange(data) {
    this.file = data.target.files[0];
  }

  createPost() {
    this.uploadService.uploadFile(this.file).subscribe(
      (url) => {
        console.log("File uploaded successfully. URL:", url);
        // Do something with the URL, such as updating the event object
        this.fileName = url;
        const payload: PostRequest = {
          title: this.title,
          body: this.body,
          kudos: 0,
          eventId: this.eventId,
          userRollnumber: 'SE161779',
          image_urls: url,
          status: 0
        }
        this.postService.createPost(payload).subscribe(
          (url) => {
            this.toastrService.show("Post created successfully", "Success", {
              status: "success",
            });
            this.createMode = false;
            this.fetchData();
          },
          (error) => {
            this.toastrService.show(error, "Failed", {
              status: "danger",
            });
          }
        )
      },
      (error) => {
        console.error("File upload failed:", error);
        // Handle error appropriately
      }
    )
  }
}
