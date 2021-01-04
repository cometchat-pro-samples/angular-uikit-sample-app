import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import * as enums from "../../utils/enums";
import { STRING_MESSAGES } from "../../utils/messageConstants";

@Component({
  selector: "cometchat-reply-count",
  templateUrl: "./cometchat-reply-count.component.html",
  styleUrls: ["./cometchat-reply-count.component.css"],
})
export class CometchatReplyCountComponent implements OnInit {
  @Input() MessageDetails = null;
  @Output() actionGenerated: EventEmitter<any> = new EventEmitter();

  replies = null;
  reply: string;
  constructor() {}

  ngOnInit() {
    let replyCount = this.getReplyCount();
    if (replyCount === 1) {
      this.reply = replyCount + " " + STRING_MESSAGES.REPLY;
    } else if (replyCount > 1) {
      this.reply = replyCount + " " + STRING_MESSAGES.REPLIES;
    }
  }
  /**
   * get reply count for thread
   */
  getReplyCount() {
    if (this.MessageDetails.hasOwnProperty("replyCount") === false) {
      this.replies = null;
    }

    this.replies = this.MessageDetails.replyCount;
    return this.replies;
  }
  /**
   * Open thread when clicked
   */
  openThreadMessage() {
    this.actionGenerated.emit({
      type: enums.VIEW_MESSAGE_THREAD,
      payLoad: this.MessageDetails,
    });
  }
}
