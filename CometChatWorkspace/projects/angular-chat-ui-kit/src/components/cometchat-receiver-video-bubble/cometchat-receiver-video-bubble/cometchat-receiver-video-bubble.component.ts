import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "cometchat-receiver-video-bubble",
  templateUrl: "./cometchat-receiver-video-bubble.component.html",
  styleUrls: ["./cometchat-receiver-video-bubble.component.css"],
})
export class CometchatReceiverVideoBubbleComponent implements OnInit {
  @Input() MessageDetails = null;
  @Input() showToolTip = true;
  @Input() showReplyCount = true;
  @Output() actionGenerated: EventEmitter<any> = new EventEmitter();

  //Sets the User Avatar if group
  avatar = null;
  //Sets Username of Avatar
  name: string = null;

  videoUrl: string;

  //if group then only show avatar
  avatarIfGroup: boolean = false;

  message = Object.assign({}, this.MessageDetails, { messageFrom: "receiver" });

  constructor() {}

  ngOnInit() {
    /**
     *  If Group then displays Avatar And Name
     */
    if (this.MessageDetails.receiverType === "group") {
      this.avatarIfGroup = true;
      if (!this.MessageDetails.sender.avatar) {
        const uid = this.MessageDetails.sender.getUid();
        const char = this.MessageDetails.sender.getName().charAt(0);

        //  this.MessageDetails.sender.setAvatar(SvgAvatar.getAvatar(uid,char))
      }
      this.name = this.MessageDetails.sender.name;
      this.avatar = this.MessageDetails.sender.avatar;
    }
    this.getUrl();
  }

  /**
   * Gets the url of video to be displayed
   */
  getUrl() {
    this.videoUrl = this.MessageDetails.data.url;
  }

  /**
   * Handles all the actions emitted by the child components that make the current component
   * @param Event action
   */
  actionHandler(action) {
    this.actionGenerated.emit(action);
  }
}
