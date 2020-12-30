import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  HostListener,
} from "@angular/core";
import * as enums from "../../utils/enums";
@Component({
  selector: "sender-image-bubble",
  templateUrl: "./sender-image-bubble.component.html",
  styleUrls: ["./sender-image-bubble.component.css"],
})
export class SenderImageBubbleComponent implements OnInit {
  @Input() MessageDetails = null;
  @Input() showToolTip = true;
  @Input() showReplyCount = true;
  @Output() actionGenerated: EventEmitter<any> = new EventEmitter();
  innerWidth;
  checkScreenSize: boolean = false;

  timer = null;
  messageFrom = "sender";
  imageLoader: boolean = false;

  messageAssign = Object.assign({}, this.MessageDetails, {
    messageFrom: this.messageFrom,
  });

  message = this.messageAssign;
  imageUrl = "";
  fullScreenView = false;

  constructor() {}

  ngOnInit() {
    this.onResize();

    this.setImage();
  }

  /**
   * Checks when window size is changed in realtime
   */
  @HostListener("window:resize", [])
  onResize() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth >= "320" && this.innerWidth <= "767") {
      console.log("sender image bubble size less");
      this.checkScreenSize = true;
    } else {
      if (this.checkScreenSize === true) {
        console.log("sender image bubble size");

        this.setImage();
      }
      this.checkScreenSize = false;
    }
  }

  /**
   * Checks if thumnail-generation extension is present And then Sets the image
   *
   */
  setImage() {
    this.imageLoader = true;
    if (this.MessageDetails.hasOwnProperty("metadata")) {
      const metadata = this.MessageDetails.metadata;
      const injectedObject = metadata["@injected"];
      if (injectedObject && injectedObject.hasOwnProperty("extensions")) {
        const extensionsObject = injectedObject["extensions"];
        if (
          extensionsObject &&
          extensionsObject.hasOwnProperty("thumbnail-generation")
        ) {
          const thumbnailGenerationObject =
            extensionsObject["thumbnail-generation"];
          const imageToShow = this.chooseImage(thumbnailGenerationObject);
          let img = new Image();
          img.src = imageToShow;
          img.onload = () => {
            this.imageLoader = false;
            this.imageUrl = img.src;
            URL.revokeObjectURL(img.src);
          };
        }
      }
    } else {
      this.setMessageImageUrl();
    }
  }

  /**
   * Sets image url ie. medium or small-size image
   * @param
   */
  chooseImage(thumbnailGenerationObject) {
    const smallUrl = thumbnailGenerationObject["url_small"];
    const mediumUrl = thumbnailGenerationObject["url_medium"];

    const mq = window.matchMedia("(min-width:360px) and (max-width: 767px)");

    let imageToShow = mediumUrl;
    if (mq.matches) {
      imageToShow = smallUrl;
    }

    return imageToShow;
  }

  /**
   * If thumnail-generation extension is not present
   * @param
   */
  setMessageImageUrl() {
    let img = new Image();
    img.src = this.MessageDetails.data.url;
    img.onload = () => {
      this.imageLoader = false;
      this.imageUrl = img.src;
      // console.log("src ",img.src);
    };
  }

  /**
   * Emits action to open image in full-screen view
   *
   */
  open() {
    this.actionGenerated.emit({
      type: enums.VIEW_ACTUAL_IMAGE,
      payLoad: { ...this.message, ...this.MessageDetails },
    });
  }
  /**
   * Handles all the actions emitted by the child components that make the current component
   * @param Event action
   */
  actionHandler(action) {
    console.log("receiver Message Bubble --> action generation is ", action);
    this.actionGenerated.emit(action);
  }
}
