import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Anomaly, AnomalyTypeEnum } from 'src/app/models/anomaly.model';
import { AnomaliesService } from 'src/app/services/anomalies.service';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.css']
})
export class NotificationsListComponent implements OnInit, OnDestroy {
  anomalies: Anomaly[];
  subscription!: Subscription | null;

  constructor(
    private anomaliesService: AnomaliesService
  ) { 
    this.anomalies = [];
  }

  ngOnInit(): void {
    this.subscription = this.anomaliesService.getAll()
    .subscribe((anomalies) => {
      this.anomalies = anomalies;
    });
  }

  getIcon(type: AnomalyTypeEnum): string {
    switch (type) {
      case AnomalyTypeEnum.moderate:
          return 'info';
      case AnomalyTypeEnum.important:
        return 'warning';
      case AnomalyTypeEnum.critical:
        return 'bug_report';
    }

  }

  markAllAsRead() {
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
}
