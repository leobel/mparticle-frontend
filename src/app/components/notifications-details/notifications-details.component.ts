import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Anomaly } from 'src/app/models/anomaly.model';
import { AnomaliesService } from 'src/app/services/anomalies.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-notifications-details',
  templateUrl: './notifications-details.component.html',
  styleUrls: ['./notifications-details.component.css']
})
export class NotificationsDetailsComponent implements OnInit {
  anomaly$!: Observable<Anomaly | undefined>;
  orgId: number;

  constructor(
    private acitveRoute: ActivatedRoute,
    private anomaliesService: AnomaliesService
  ) {
    this.orgId = environment.orgId;
  }

  ngOnInit() {
    this.anomaly$ = this.acitveRoute.paramMap.pipe(
      switchMap(params => {
        const id = Number(params.get('id'));
        return this.anomaliesService.get(this.orgId, id);
      }));
  }
}
