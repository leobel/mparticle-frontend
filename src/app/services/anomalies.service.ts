import { Injectable, OnDestroy } from '@angular/core';
import { Observable, map, of, switchMap, throwError } from 'rxjs';
import { Anomaly, AnomalyTypeEnum } from '../models/anomaly.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnomaliesService {
  apiUrl: string = '';

  constructor(
    private httpClient: HttpClient,
  ) {
    this.apiUrl = `${environment.apiUrl}/api/anomaly-service`;

  }

  getAll(orgId: number): Observable<Anomaly[]> {
    return this.httpClient.get<Anomaly[]>(`${this.apiUrl}/${orgId}`);
  }

  get(orgId: number, id: number): Observable<Anomaly | undefined> {
    return this.httpClient.get<Anomaly>(`${this.apiUrl}/${orgId}/details/${id}`);
  }

  getAllUnread(orgId: number): Observable<Anomaly[]> {
    return this.httpClient.get<Anomaly[]>(`${this.apiUrl}/${orgId}/unread`);
  }

  markAllAsRead(orgId: number): Observable<Anomaly[]> {
    return this.httpClient.post<Anomaly[]>(`${this.apiUrl}/${orgId}/mark-read`, {})
      .pipe(
        map(_ => [])
      );
  }

  markAsRead(orgId: number, ids: number[]): Observable<Anomaly[]> {
    const messageIds = ids.join(',');
    return this.httpClient.post<Anomaly[]>(`${this.apiUrl}/${orgId}/mark-read?messageId=${messageIds}`, {})
      .pipe(
        switchMap(_ => this.getAllUnread(orgId))
      );
  }

}
