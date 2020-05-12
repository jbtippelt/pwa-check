import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NotificationTestService, TestStep } from '../services/notification-test/notification-test.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {

  testSteps: TestStep[] = []

  constructor(private cdr: ChangeDetectorRef, private notificationTests: NotificationTestService) {}

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
