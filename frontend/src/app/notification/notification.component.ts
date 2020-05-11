import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';

export class TestStep {
  constructor(
    public title: string,
    private onErrorMessage: string,
    private onSuccessMessage: string,
    public fun: () => Promise<any>,
    public inProgress: boolean = false,
    public done: boolean = false,
    public error: boolean = false,
    public description?: string,
    public result?: string,
  ) {}

  async run() {
    console.log("start step", this.title)
    this.inProgress = true
    await this.fun().then((val) => {
      this.result = val;
    }).catch((err) => {
      this.error = true
      this.result = err
    }).finally(() => {
      this.finish()
    })
  }

  finish(){
    console.log("finish step", this.title)
    this.inProgress = false
    this.done = true
  }
}

const NOTIFICATION_TEST_STEPS = (nt: NotificationTest):TestStep[] => {
  return [
    new TestStep(
      "Check Notification Capability",
      "Error: Your browser is not capable of handling notifications.",
      "Your browser is capable of handling notifications.",
      () => nt.isNotificationCapable()
    ),
    new TestStep(
      "Check Service Worker Capability",
      "Error: Your browser does not support service worker.",
      "Your browser supports service worker.",
      () => nt.isNotificationCapable()
    ),
    new TestStep(
      "Request Permission",
      "Error: Notification Permission is blocked.",
      "Permission granted successfully.",
      () => nt.requestPermission()
    ),
    new TestStep(
      "Get Firebase Messaging Token",
      "Error: Firebase Messaging Token could not been fetched.",
      "Successfully fetched Firebase Messaging Token.",
      () => nt.getToken()
    ),
    new TestStep(
      "Publish Local Notification",
      "Error: Could not publish local notification.",
      "Successfully published local notification.",
      () => nt.publishLocalNotification()
    ),
    // new TestStep(
    //   "Publish Local Notification from Service Worker",
    //   "Error: Local Notification could not been received in the service worker.",
    //   "Successfully received locals notification in service worker.",
    //   () => nt.publishLocalNotification()
    // )
  ]
}

class NotificationTest {

  public testSteps: TestStep[] = []
  private notifications: Notification[] = []

  constructor(private messaging: AngularFireMessaging) {
    this.testSteps = NOTIFICATION_TEST_STEPS(this)
  }

  async startTest() {
    console.log("start test")
    await this.testSteps.reduce((previousStep, nextStep) => {
      return previousStep.then(_ => nextStep.run())
    }, Promise.resolve());
  }

  resetTest() {
    this.testSteps = NOTIFICATION_TEST_STEPS(this)
    this.notifications.forEach((notification) => {
      notification.close()
    })
  }

  public isNotificationCapable(){
    return new Promise((resolve, reject) => {
      "Notification" in window ? resolve() : reject()
    })
  }

  public requestPermission() {
    return this.messaging.requestPermission.toPromise()
  }

  public getToken() {
    return this.messaging.getToken.toPromise()
  }

  public publishLocalNotification() {
    return new Promise((resolve, reject) => {
        let notification = new Notification("This is a local Notification published directly by the webapp!");
        this.notifications.push(notification)
        resolve()
      }
    )
  }
}

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {

  notificationTests: NotificationTest;
  testSteps: TestStep[] = []

  constructor(private cdr: ChangeDetectorRef, private firestore: AngularFirestore, private messaging: AngularFireMessaging) {
    this.notificationTests = new NotificationTest(messaging);
  }

  ngOnInit() {
    this.onResetTestClick()
  }

  onStartTestClick() {
    this.notificationTests.startTest()
  }
  
  onResetTestClick() {
    this.notificationTests.resetTest()
    this.testSteps = this.notificationTests.testSteps

  }

}
