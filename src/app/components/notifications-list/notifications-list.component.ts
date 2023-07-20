import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChange } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Anomaly, AnomalyTypeEnum } from 'src/app/models/anomaly.model';
import { AnomaliesService } from 'src/app/services/anomalies.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.css']
})
export class NotificationsListComponent implements OnInit, OnDestroy {
  anomalies: Anomaly[];
  subscription!: Subscription | null;
  orgId: number;
  loading = false;
  error = false;

  @Input() opened: boolean = false;
  @Output() readonly onMarkAllAsRead: EventEmitter<void> = new EventEmitter<void>();
  @Output() readonly onMarkAsRead: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    private router: Router,
    private anomaliesService: AnomaliesService
  ) {
    this.anomalies = [];
    this.orgId = environment.orgId;
  }

  ngOnInit(): void {
  }

  private getAllUnread() {
    this.loading = true;
    this.subscription = this.anomaliesService.getAllUnread(this.orgId)
      .subscribe({
        next: (anomalies) => {
          this.anomalies = anomalies;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.error = true;
          this.loading = false;
        }
      });
  }

  ngOnChanges(changes: { [property: string]: SimpleChange }) {
    if (changes['opened']?.currentValue) {
      this.getAllUnread();
    }
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
    this.subscription = this.anomaliesService.markAllAsRead(this.orgId)
      .subscribe({
        next: (anomalies) => {
          this.anomalies = anomalies;
          this.onMarkAllAsRead.next();
        },
        error: (err) => {
          console.error(err);
          this.error = true;
        }
      })
  }

  onSelect(id: number, navigate = true) {
    this.subscription = this.anomaliesService.markAsRead(this.orgId, id)
      .subscribe({
        next: (anomalies) => {
          this.anomalies = anomalies;
          if (navigate) {
            this.router.navigate(
              [
                `/notifications/${id}`
              ]
            );
            this.onMarkAsRead.next(id);
          }
        },
        error: (err) => {
          console.error(err);
          this.error = true;
        },

      })
  }

  onSelectionChange(id: number) {
    this.onSelect(id, false);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = null;
    }
  }
}
