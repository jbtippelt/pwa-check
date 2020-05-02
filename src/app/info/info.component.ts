import { Component, OnInit } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatTableDataSource } from '@angular/material/table';


export class ItemModel {
  constructor(public key: string, public value: string) {}
}

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.css']
})
export class InfoComponent implements OnInit {

  browserInfoData: ItemModel[] = [];
  browserInfoSource: MatTableDataSource<ItemModel>;
  pwaCapabilityData: ItemModel[] = [];
  pwaCapabilitySource: MatTableDataSource<ItemModel>;
  displayedColumns: string[] = ['key', 'value'];


  constructor(private deviceService: DeviceDetectorService) { }

  ngOnInit() {
    this.parseUserAgent()
    this.gatherPWACapabilitys()
    console.log(this.browserInfoData)
    this.browserInfoSource = new MatTableDataSource<ItemModel>(this.browserInfoData)
    console.log(this.pwaCapabilityData)
    this.pwaCapabilitySource = new MatTableDataSource<ItemModel>(this.pwaCapabilityData)
  }

  private parseUserAgent() {
    var deviceType = "n/a"
    if(this.deviceService.isDesktop){
      deviceType = "Desktop"
    } else if(this.deviceService.isMobile){
      deviceType = "Mobile"
    } else if(this.deviceService.isTablet){
      deviceType = "Tablet"
    }

    this.browserInfoData.push(new ItemModel("Device Type", deviceType));
    this.browserInfoData.push(new ItemModel("Browser", this.deviceService.browser));
    this.browserInfoData.push(new ItemModel("Browser Version", this.deviceService.browser_version));
    this.browserInfoData.push(new ItemModel("OS", this.deviceService.os));
    this.browserInfoData.push(new ItemModel("OS Version", this.deviceService.os_version));
    this.browserInfoData.push(new ItemModel("Device", this.deviceService.device));
    this.browserInfoData.push(new ItemModel("User Agent", this.deviceService.userAgent));
  }

  private gatherPWACapabilitys() {
    let serviceWorkerSupported = 'serviceWorker' in navigator;
	  let cacheSupported = 'caches' in window;
	  let pushSupported = 'serviceWorker' in navigator && 'PushManager' in window;
	  let bgSyncSupported = 'serviceWorker' in navigator && 'SyncManager' in window;
	//  this.periodicSyncSupported = 'serviceWorker' in navigator && typeof navigator.serviceWorker.getRegistrations.prototype.periodicSync !== 'undefined';
	  let indexedDbSupported = 'indexedDB' in window;
	  let storageSupported = 'storage' in navigator && 'StorageManager' in window;
	  let persistentStorageSupported = 'storage' in navigator && 'persist' in navigator.storage;
	  let fileApiSupported = ('File' in window && 'FileReader' in window && 'FileList' in window && 'Blob' in window);
	  let btSupported = 'bluetooth' in navigator;
	  let mediaDevicesSupported = 'mediaDevices' in navigator;
	  let geoSupported = "geolocation" in navigator;
    
    this.pwaCapabilityData.push(new ItemModel("Service Worker", serviceWorkerSupported? 'supported': 'not supported'));
    this.pwaCapabilityData.push(new ItemModel("Cache", cacheSupported? 'supported': 'not supported'));
    this.pwaCapabilityData.push(new ItemModel("Push", pushSupported? 'supported': 'not supported'));
    this.pwaCapabilityData.push(new ItemModel("Background Sync", bgSyncSupported? 'supported': 'not supported'));
    this.pwaCapabilityData.push(new ItemModel("IndexedDB", indexedDbSupported? 'supported': 'not supported'));
    this.pwaCapabilityData.push(new ItemModel("Storage", storageSupported? 'supported': 'not supported'));
    this.pwaCapabilityData.push(new ItemModel("Persistant Storage", persistentStorageSupported? 'supported': 'not supported'));
    this.pwaCapabilityData.push(new ItemModel("File API", fileApiSupported? 'supported': 'not supported'));
    this.pwaCapabilityData.push(new ItemModel("Bluetooth", btSupported? 'supported': 'not supported'));
    this.pwaCapabilityData.push(new ItemModel("Media Devices", mediaDevicesSupported? 'supported': 'not supported'));
    this.pwaCapabilityData.push(new ItemModel("Geolocation", geoSupported? 'supported': 'not supported'));
  }

}
