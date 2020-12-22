import { Component, OnInit } from "@angular/core";
import { CometChatManager } from "../../utils/controller";
import * as enums from "../../utils/enums";

@Component({
  selector: "cometchat-user-list-screen",
  templateUrl: "./cometchat-user-list-screen.component.html",
  styleUrls: ["./cometchat-user-list-screen.component.css"],
})
export class CometchatUserListScreenComponent implements OnInit {
  //It can be a user or a group
  curentItem = null;

  // Defines the types of item that was clicked --> that is .. if its a user or a group
  type = null;

  threadMessageView: boolean = false;
  threadMessageParent = null;
  threadMessageItem = null;
  threadMessageType = "";
  composedthreadmessage = null;
  viewDetailScreen: boolean = false;
  // To display image in full screen
  imageView = null;

  //If clicked then only show image in full screen
  fullScreenViewImage: boolean = false;

  constructor() {}

  ngOnInit() {}

  /**
   * Listen to the user emitted by the userList component
   * @param Event user
   */
  userClicked(user) {
    // console.log(`user in parent component  `, user);
    this.curentItem = user;

    //Close Thread And User Detail Screen When Chat Window Is Changed
    // this.closeThreadMessages();
    this.viewDetailScreen = false;

    if (this.curentItem.hasOwnProperty("uid")) {
      this.type = "user";
    } else {
      this.type = "group";
    }

    //console.log("UserListScreen -> Type of User ", this.type);
  }
  /**
   * Handles all the actions emitted by the child components that make the current component
   * @param Event action
   */
  actionHandler(action) {
    //handle Events/Actions generated from MessageHeader , MessageComposer and MessageList Here

    // action.payLoad has the array of messages that is received
    let message = action.payLoad;

    console.log("UserListScreen --> action generation is ", action);

    switch (action.type) {
      case enums.VIEW_MESSAGE_THREAD: {
        this.viewMessageThread(message);
        break;
      }
      case enums.CLOSE_THREAD_CLICKED: {
        this.closeThreadMessages();
        break;
      }
      case enums.VIEW_ACTUAL_IMAGE: {
        this.toggleImageView(action.payLoad);
        break;
      }
      case enums.CLOSE_FULL_SCREEN_IMAGE: {
        this.toggleImageView(null);
        break;
      }
      case enums.VIEW_DETAIL:
      case enums.CLOSE_DETAIL_CLICKED: {
        this.toggleDetailView();
        break;
      }
      case enums.CHANGE_THREAD_PARENT_MESSAGE_REPLY_COUNT: {
        // this.toggleDetailView();

        this.composedthreadmessage = {
          ...this.threadMessageParent,
          replyCount: action.payLoad,
        };

        console.log(
          "UserListScreen --> thread Message Reply count updated ",
          action.payLoad
        );

        break;
      }
      case enums.BLOCK_USER: {
        this.blockUser();
        break;
      }
      case enums.UNBLOCK_USER:
        this.unblockUser();
        break;
    }
  }

  /**
   * Sets All the Intial Conditions for the threaded View of Messages and Opens thread View
   * @param Any parentMessage
   */
  viewMessageThread(parentMessage) {
    //Open Thread Screen
    this.threadMessageView = true;

    //close user ( the person you are chatting with ) Detail screen
    this.viewDetailScreen = false;

    this.threadMessageParent = parentMessage;
    this.threadMessageItem = this.curentItem;
    this.threadMessageType = this.type;
  }

  /**
   * Close the thread window
   * @param Any parentMessage
   */
  closeThreadMessages() {
    //close Thread Screen
    this.threadMessageView = false;
    this.threadMessageParent = null;
    this.threadMessageItem = null;
    this.threadMessageType = null;
  }

  /**
   * Opens the clicked Image in full screen mode
   * @param Any message
   */
  toggleImageView(message) {
    console.log("userlistscreen toggleImageView ", message);
    this.imageView = message;
    this.fullScreenViewImage = !this.fullScreenViewImage;
  }

  /**
   * Opens User Detail Right Side bar
   * @param Any message
   */
  toggleDetailView = () => {
    this.threadMessageView = false;
    this.viewDetailScreen = !this.viewDetailScreen;
  };

  /**
   * When User Block someone
   */
  blockUser() {
    let usersList = [this.curentItem.uid];
    CometChatManager.blockUsers(usersList)
      .then((list) => {
        this.curentItem = { ...this.curentItem, blockedByMe: true };
        console.log("block success");
      })
      .catch((error) => {
        console.log("Blocking user fails with error", error);
      });
  }

  /**
   * When User UnBlock someone
   */
  unblockUser() {
    let usersList = [this.curentItem.uid];
    CometChatManager.unblockUsers(usersList)
      .then((list) => {
        this.curentItem = { ...this.curentItem, blockedByMe: false };
        console.log("unblock success");
      })
      .catch((error) => {
        console.log("unblocking user fails with error", error);
      });
  }
}
