import { CometChatTheme, CometChatThemeService, CometChatUIKit, fontHelper } from '@cometchat/chat-uikit-angular';
import { Component, OnInit } from '@angular/core';

import { AvatarStyle } from '@cometchat/uikit-elements';
import { CometChat } from '@cometchat/chat-sdk-javascript';
import { Router } from '@angular/router';
import { users } from '../../sampleApp/sampledata';

@Component({
  standalone: false,
  selector: 'cometchat-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public theme = new CometChatTheme({})
  public avatarStyle: AvatarStyle = {
    height: "32px",
    width: "32px",
    backgroundColor: "white",
    borderRadius: "24px"
  }
  public uid: string = "";
  public error: string = ""
  public usersArray: any[] = [];
  public buttonImage: string = "assets/button-opc.png";
  public backgroundImage: string = "assets/Image-518@1x.png";
  public inProgress: boolean = false;
  constructor(private router: Router, private themeService: CometChatThemeService) {
  }
  ngOnInit(): void {
    this.checkUserLogIn()
    this.setAvatarStyle()
    this.fetchDefaultUsers()
  }

  async fetchDefaultUsers() {
    try {
      const response = await fetch(
        "https://assets.cometchat.io/sampleapp/sampledata.json"
      );
      const data = await response.json();
      this.usersArray = data.users;
    } catch (error) {
      console.log(
        "fetching default users failed, using fallback data",
        error
      );
      this.usersArray = users.users;
    }
  }
  checkUserLogIn() {
    CometChat.getLoggedinUser().then(
      (user) => {
        if (!user) {
          return;
        }
        else {
          this.router.navigate(['/home'])

        }
      }, error => {
        console.log("Some Error Occured", { error });
      }
    );


  }
  setAvatarStyle() {
    let defaultStyle: AvatarStyle = new AvatarStyle({
      borderRadius: "24px",
      width: "36px",
      height: "36px",
      border: "none",
      backgroundColor: this.themeService.theme.palette.getAccent700(),
      nameTextColor: this.themeService.theme.palette.getAccent900(),
      backgroundSize: "cover",
      nameTextFont: fontHelper(this.themeService.theme.typography.subtitle1),
      outerViewBorderSpacing: "",
    })
    this.avatarStyle = { ...defaultStyle, ...this.avatarStyle }
  }
  loginToDashboard(user: string) {
    this.error = ""
    if (user && user != ' ') {
      this.inProgress = true
      var UID = user
      CometChat.getLoggedinUser().then(
        (user) => {
          if (!user) {

            CometChatUIKit.login({ uid: UID }).then(
              user => {

                this.inProgress = false
                console.log("Login Successful:", { user });
                this.router.navigate(['/home']);
              }, error => {
                this.inProgress = false
                this.error = error.message
              }
            )
              .catch((error: CometChat.CometChatException) => {
                this.inProgress = false
                console.log(error)
              })
          }
          else {
            this.inProgress = false
            this.router.navigate(['/home']);
          }
        }, error => {
          this.inProgress = false
          this.error = error.message

        }
      ).catch((err: any) => {
        this.inProgress = false
        console.log(err)

      })

    }
    else {
      this.inProgress = false
      this.error = "UID is required to login"
    }


  }
  signup() {
    this.router.navigate(['/signup']);

  }
  consoleError(event: any) {
    this.error = ""
  }
  styles: any = {
    loginWrapperStyle: () => {
      return {
        background: this.themeService.theme.palette.getAccent100()
      }
    },
    headerTitleStyle: () => {
      return {
        font: fontHelper(this.themeService.theme.typography.name),
        color: this.themeService.theme.palette.getAccent("light")
      }
    },
    headerSectionStyle: () => {
      return {
        borderBottom: `1px solid ${this.themeService.theme.palette.getAccent100()}`

      }
    },
    headerSubtitleStyle: () => {
      return {
        font: fontHelper(this.themeService.theme.typography.subtitle2),
        color: this.themeService.theme.palette.getAccent400("light")
      }
    },
    titleStyle: () => {
      return {
        font: fontHelper(this.themeService.theme.typography.heading),
        color: this.themeService.theme.palette.getAccent("light")
      }
    },
    borderStyle: () => {
      return {
        borderBottom: `1px solid ${this.themeService.theme.palette.getAccent100()}`

      }
    },
    subtitleStyle: () => {
      return {
        font: fontHelper(this.themeService.theme.typography.subtitle2),
        color: this.themeService.theme.palette.getAccent600()
      }
    },
    containerStyle: () => {
      return {
        background: this.themeService.theme.palette.getBackground(),
        boxShadow: `${this.themeService.theme.palette.getAccent400()} 0px 0px 5px`
      }
    },
    usernameStyle: () => {
      return {
        font: fontHelper(this.themeService.theme.typography.name),
        color: this.themeService.theme.palette.getAccent()
      }
    },
    errorTextStyle: () => {
      return {
        font: fontHelper(this.themeService.theme.typography.subtitle2),
        color: this.themeService.theme.palette.getError()


      }
    },
    useruidStyle: () => {
      return {
        font: fontHelper(this.themeService.theme.typography.subtitle2),
        color: this.themeService.theme.palette.getAccent600()
      }
    },
    userDetailsStyle: () => {
      return {
        background: this.themeService.theme.palette.getAccent100(),
        backgroundImage: `url(${this.buttonImage})`
      }
    },
    loginMessageStyle: () => {
      return {
        font: fontHelper(this.themeService.theme.typography.subtitle2),
        color: this.themeService.theme.palette.getAccent600()

      }
    },
    inputStyle: () => {
      return {
        font: fontHelper(this.themeService.theme.typography.subtitle2),
        color: this.themeService.theme.palette.getAccent600(),
        border: `1px solid ${this.themeService.theme.palette.getAccent100()}`,

      }
    },
    footerStyle: () => {
      return {
        font: fontHelper(this.themeService.theme.typography.subtitle2),
        color: this.themeService.theme.palette.getAccent500(),
        background: this.themeService.theme.palette.getAccent100()

      }
    },
    buttonStyle: () => {
      return {
        font: fontHelper(this.themeService.theme.typography.subtitle1),
        color: this.themeService.theme.palette.getAccent("dark"),
        backgroundColor: this.themeService.theme.palette.getPrimary(),
        backgroundImage: `url(${this.buttonImage})`

      }
    },
    signupButtonStyle: () => {
      return {
        font: fontHelper(this.themeService.theme.typography.title2),
        color: this.themeService.theme.palette.getAccent600(),
        backgroundColor: "transparent",
        border: `1px solid ${this.themeService.theme.palette.getAccent100()}`,
        borderRadius: "4px"

      }
    },
    sectionImageStyle: () => {
      return {
        background: `url(${this.backgroundImage}) center center no-repeat`,
        backgroundSize: "contain"



      }
    },
  }
}
