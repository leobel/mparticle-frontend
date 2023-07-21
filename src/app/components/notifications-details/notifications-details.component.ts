import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
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
    private router: Router,
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
      }),
      catchError(err => {
        this.router.navigateByUrl('/');
        return of();
      })
    );
  }
}
