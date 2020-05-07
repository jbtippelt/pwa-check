import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { async } from '@angular/core/testing';

export class TestStep {
  constructor(
    public title: string,
    public fun: any,
    public inProgress: boolean = false,
    public done: boolean = false,
    public error: boolean = false,
    public description?: string,
    public result?: string,
  ) {}

  async run() {
    console.log("start step", this.title)
    this.inProgress = true
    this.result = await this.fun()
    this.finish()
  }

  finish(){
    console.log("finish step", this.title)
    this.inProgress = false
    this.done = true
  }
}


@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {

  testSteps: TestStep[] = []

  constructor(private cdr: ChangeDetectorRef, private firestore: AngularFirestore, private messaging: AngularFireMessaging) {}

  fcmToken: string = null
  permissionGranted:boolean = null

  ngOnInit() {
    this.testSteps.push(new TestStep("Check Notification Capability", () => this.isNotificationCapable()))
    this.testSteps.push(new TestStep("Request Permission", () => this.requestPermission()))
    this.testSteps.push(new TestStep("Get Firebase Messaging Token", () => this.getToken))
    // this.testSteps.push(new TestStep("Send local Notification from Webapp", () => {console.log("0")}))
    // this.testSteps.push(new TestStep("Send local Notification from Service Worker", () => {console.log("0")}))
    // this.testSteps.push(new TestStep("Send push Notification", () => {console.log("0")}))
  }

  onStartTestClick() {
    this.startTest()
  }

  startTest() {
    this.testSteps.forEach(async (step) =>{
      await step.run()
    })
  }

  isNotificationCapable(){
    if(("Notification" in window)){
      return "Your browser is capable of handling notifications."
    } else {
      return "Error: Your browser is not capable of handling notifications."
    }
  }

  async requestPermission() {
    const result = await this.messaging.requestPermission.toPromise().then(
      (resolve) => { return "Successfully permission granted." },
      (reject) => { return "Error: Permission is blocked."}
    );
    return result;
  }

  async getToken() {
    const res = await this.messaging.getToken.toPromise().then(
      (resolve) => { return "Firebase Messaging Token generated:" },
      (reject) => { return "Error: Firebase Messaging Token could not be generated."}
    );
    console.log(res);
    return res;
  }

  onPublishLocalNotification() {
    var notification = new Notification("This is a local Notification published directly by the webapp!");
  }

}
