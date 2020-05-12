import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { AngularFireDatabase } from '@angular/fire/database';

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

export class PushNotification {

  constructor(public token: string, public title: string, public body: string) {}

  get() {
    return { to: this.token, notification: { title: this.title, body: this.body} }
  }
}

const NOTIFICATION_TEST_STEPS = (nt: NotificationTestService):TestStep[] => {
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
      () => nt.isServiceWorkerCapable()
    ),
    new TestStep(
      "Request Permission",
      "Error: Notification Permission is blocked.",
      "Permission granted successfully.",
      () => nt.requestPermission()
    ),
    new TestStep(
      "Publish Local Notification",
      "Error: Could not publish local notification.",
      "Successfully published local notification.",
      () => nt.publishLocalNotification()
    ),
    new TestStep(
      "Check Service Worker Registration",
      "Error: The service worker registration is not ready.",
      "The service worker registration is ready.",
      () => nt.isServiceWorkerReady()
    ),
    new TestStep(
      "Check Service Worker Availability",
      "Error: The service worker is not available.",
      "The service worker registration is available.",
      () => nt.isServiceWorkerAvailable()
    ),
    new TestStep(
      "Get Firebase Messaging Token",
      "Error: Firebase Messaging Token could not been fetched.",
      "Successfully fetched Firebase Messaging Token.",
      () => nt.getToken()
    ),
    // new TestStep(
    //   "Publish Local Notification from Service Worker",
    //   "Error: Local Notification could not been received in the service worker.",
    //   "Successfully received locals notification in service worker.",
    //   () => nt.publishLocalNotification()
    // ),
    new TestStep(
      "Publish Push Notification from Service Worker",
      "Error: Push Notification could not been received by the service worker.",
      "Successfully received and published push notification by service worker.",
      () => nt.publishPushNotification()
    )
  ]
}

@Injectable({
  providedIn: 'root'
})
export class NotificationTestService {

  public testSteps: TestStep[] = []
  private notifications: Notification[] = []

  private sw: ServiceWorkerRegistration
  private fcmToken

  constructor(private database: AngularFireDatabase, private afMessaging: AngularFireMessaging) {
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

  public isServiceWorkerCapable(){
    return new Promise((resolve, reject) => {
      'serviceWorker' in navigator ? resolve() : reject()
    })
  }

  public isServiceWorkerReady() {
    return navigator.serviceWorker.ready
  }

  public isServiceWorkerAvailable(){
    return new Promise(async (resolve, reject) => {
      this.sw = await navigator.serviceWorker.getRegistration()
      this.sw ? resolve() : reject()
    })
  }

  public requestPermission() {
    return new Promise(async (resolve, reject) => {
      let result = await Notification.requestPermission()
      result === "denied" ? reject() : resolve()
    })
  }

  public getToken() {
    return new Promise(async (resolve, reject) => {
      if(this.sw) {
        let messaging = await this.afMessaging.messaging.toPromise()
        try{
          messaging.useServiceWorker(this.sw)
        } catch(e) {
          console.log("Firebase already uses current service worker. Everything ok.")
        }
        this.fcmToken = await messaging.getToken()
        this.fcmToken ? resolve(this.fcmToken) : reject
      } else {
        reject()
      }
    })
  }

  public publishLocalNotification() {
    return new Promise((resolve, reject) => {
      if (Notification.permission === "granted") {
        let notification = new Notification("This is a local Notification published directly by the webapp!");
        this.notifications.push(notification)
        resolve()
      } else {
        reject()
      }
    })
  }

  public publishPushNotification() {
    let object = {
      sent: false,
      timestamp: Date.now()
    }
    return this.database.database.ref(`/push-tokens/${this.fcmToken}`).set(object)
    // TODO
  }
}
