import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { NotificationsListComponent } from './notifications-list.component';
import { AnomaliesService } from 'src/app/services/anomalies.service';
import { HttpClient } from '@angular/common/http';

import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Anomaly, AnomalyTypeEnum } from 'src/app/models/anomaly.model';
import { delay, of, throwError } from 'rxjs';
import { AppComponent } from 'src/app/app.component';
import { SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { NotificationsDetailsComponent } from '../notifications-details/notifications-details.component';
import { ErrorComponent } from '../error/error.component';
import { MatIconModule } from '@angular/material/icon';
import { LoadingComponent } from '../loading/loading.component';

describe('NotificationsListComponent', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    TestBed.configureTestingModule({
      imports: [
        MatIconModule,
        MatListModule,
        MatBadgeModule,
        MatCheckboxModule,
        MatDividerModule,
        MatProgressSpinnerModule
      ],
      declarations: [
        NotificationsListComponent,
        NotificationsDetailsComponent,
        ErrorComponent,
        LoadingComponent
      ],
      providers: [
        provideRouter([
          {
            path: 'notifications/:id',
            component: NotificationsDetailsComponent
          }
        ]),
        AnomaliesService,
        { provide: HttpClient, useValue: spy }
      ]
    });
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
  });

  it('should create', () => {
    // arrange
    const fixture = TestBed.createComponent(NotificationsListComponent);
    const app = fixture.componentInstance;

    // expect
    expect(app).toBeTruthy();
  });

  it('should show empty notification list', () => {
    // arrange
    const fixture = TestBed.createComponent(NotificationsListComponent);
    const compiled = fixture.nativeElement as HTMLElement;
    httpClientSpy.get.and.returnValue(of([]));
    const changes: { [property: string]: SimpleChange } = {
      'opened': new SimpleChange(false, true, false)
    }

    //act
    fixture.componentInstance.ngOnChanges(changes);
    fixture.detectChanges();

    //expect
    expect(fixture.componentInstance.anomalies.length).toBe(0);
    expect(compiled.querySelectorAll('mat-list mat-list-item').length).toBe(0);
  });

  it('should show notification list with items', () => {
    // arrange
    const fixture = TestBed.createComponent(NotificationsListComponent);
    const compiled = fixture.nativeElement as HTMLElement;
    const items: Anomaly[] = [
      {
        id: 1,
        type: AnomalyTypeEnum.moderate,
        title: "Title 1",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      },
      {
        id: 2,
        type: AnomalyTypeEnum.important,
        title: "Title 2",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        isRead: true
      },
      {
        id: 3,
        type: AnomalyTypeEnum.critical,
        title: "Title 3",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      },
    ];
    httpClientSpy.get.and.returnValue(of(items));
    const changes: { [property: string]: SimpleChange } = {
      'opened': new SimpleChange(false, true, false)
    }

    //act
    fixture.componentInstance.ngOnChanges(changes);
    fixture.detectChanges();

    //expect
    expect(fixture.componentInstance.anomalies.length).toBe(items.length);
    expect(compiled.querySelectorAll('mat-list mat-list-item').length).toBe(items.length);
  });

  it('should hide notification list', () => {
    // arrange
    const fixture = TestBed.createComponent(NotificationsListComponent);
    const compiled = fixture.nativeElement as HTMLElement;
    const items: Anomaly[] = [
      {
        id: 1,
        type: AnomalyTypeEnum.moderate,
        title: "Title 1",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      },
      {
        id: 2,
        type: AnomalyTypeEnum.important,
        title: "Title 2",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        isRead: true
      },
      {
        id: 3,
        type: AnomalyTypeEnum.critical,
        title: "Title 3",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      },
    ];
    httpClientSpy.get.and.returnValue(of(items));
    const changes: { [property: string]: SimpleChange } = {
      'opened': new SimpleChange(true, false, false)
    }

    //act
    fixture.componentInstance.ngOnChanges(changes);
    fixture.detectChanges();

    //expect
    expect(fixture.componentInstance.anomalies.length).toBe(0);
    expect(compiled.querySelectorAll('mat-list mat-list-item').length).toBe(0);
  });

  it('should mark notification all as read', () => {
    // arrange
    const fixture = TestBed.createComponent(NotificationsListComponent);
    const compiled = fixture.nativeElement as HTMLElement;
    let items: Anomaly[] = [
      {
        id: 1,
        type: AnomalyTypeEnum.moderate,
        title: "Title 1",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      },
      {
        id: 2,
        type: AnomalyTypeEnum.important,
        title: "Title 2",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        isRead: true
      },
      {
        id: 3,
        type: AnomalyTypeEnum.critical,
        title: "Title 3",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      },
    ];
    httpClientSpy.get.and.returnValue(of(items));
    httpClientSpy.post.and.returnValue(of([]));
    const changes: { [property: string]: SimpleChange } = {
      'opened': new SimpleChange(false, true, false)
    }
    const component = fixture.componentInstance;


    //act
    component.ngOnChanges(changes);
    fixture.detectChanges();

    httpClientSpy.get.and.returnValue(of([]));
    const markAllAsRead = fixture.debugElement.query(By.css('.anomalies-header a'));
    markAllAsRead.triggerEventHandler('click', null);
    fixture.detectChanges();

    //expect
    expect(component.anomalies.length).toBe(0);
    expect(compiled.querySelectorAll('mat-list mat-list-item').length).toBe(0);
  });

  it('should mark notification as read (no clicked)', () => {
    // arrange
    const fixture = TestBed.createComponent(NotificationsListComponent);
    const compiled = fixture.nativeElement as HTMLElement;
    let items: Anomaly[] = [
      {
        id: 1,
        type: AnomalyTypeEnum.moderate,
        title: "Title 1",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      },
      {
        id: 2,
        type: AnomalyTypeEnum.important,
        title: "Title 2",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        isRead: true
      },
      {
        id: 3,
        type: AnomalyTypeEnum.critical,
        title: "Title 3",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      },
    ];
    httpClientSpy.get.and.returnValue(of(items));
    httpClientSpy.post.and.returnValue(of([]));
    const changes: { [property: string]: SimpleChange } = {
      'opened': new SimpleChange(false, true, false)
    }
    const component = fixture.componentInstance;


    //act
    component.ngOnChanges(changes);
    fixture.detectChanges();

    httpClientSpy.get.and.returnValue(of(items.slice(1)));
    const myCheckBox = fixture.debugElement.query(By.css('mat-list-item:first-child mat-checkbox'));
    myCheckBox.triggerEventHandler('click', { stopPropagation: () => {}});
    fixture.detectChanges();

    //expect
    expect(component.anomalies.length).toBe(items.length - 1);
    expect(compiled.querySelectorAll('mat-list mat-list-item').length).toBe(items.length - 1);
  });

  it('should mark notification as read (clicked)', async () => {
    // arrange
    const fixture = TestBed.createComponent(NotificationsListComponent);
    const compiled = fixture.nativeElement as HTMLElement;
    let items: Anomaly[] = [
      {
        id: 1,
        type: AnomalyTypeEnum.moderate,
        title: "Title 1",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      },
      {
        id: 2,
        type: AnomalyTypeEnum.important,
        title: "Title 2",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        isRead: true
      },
      {
        id: 3,
        type: AnomalyTypeEnum.critical,
        title: "Title 3",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      },
    ];
    const id = items[0].id;
    httpClientSpy.get.and.returnValue(of(items));
    httpClientSpy.post.and.returnValue(of([]));
    const changes: { [property: string]: SimpleChange } = {
      'opened': new SimpleChange(false, true, false)
    }
    const component = fixture.componentInstance;


    //act
    component.ngOnChanges(changes);
    fixture.detectChanges();

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`/notifications/${id}`, NotificationsDetailsComponent);

    httpClientSpy.get.and.returnValue(of(items.slice(1)));
    const item = fixture.debugElement.query(By.css('mat-list-item:first-child'));
    item.triggerEventHandler('click', null);
    fixture.detectChanges();

    //expect
    expect(TestBed.inject(Router).url).toEqual(`/notifications/${id}`);
    expect(component.anomalies.length).toBe(items.length - 1);
    expect(compiled.querySelectorAll('mat-list mat-list-item').length).toBe(items.length - 1);
  });

  it('should show error notifications', () => {
    // arrange
    const fixture = TestBed.createComponent(NotificationsListComponent);
    const compiled = fixture.nativeElement as HTMLElement;
    const component = fixture.componentInstance;

    httpClientSpy.get.and.returnValue(throwError(() => new Error('request fails')));
    const changes: { [property: string]: SimpleChange } = {
      'opened': new SimpleChange(false, true, false)
    }

    //act
    fixture.componentInstance.ngOnChanges(changes);
    fixture.detectChanges();

    //expect
    expect(component.error).toBe(true);
    expect(compiled.querySelector('app-error')).toBeTruthy();

  });

  it('should show loading notifications', () => {
    // arrange
    const fixture = TestBed.createComponent(NotificationsListComponent);
    const compiled = fixture.nativeElement as HTMLElement;
    const component = fixture.componentInstance;

    httpClientSpy.get.and.returnValue(of([]).pipe(
      delay(3000)
    ));
    const changes: { [property: string]: SimpleChange } = {
      'opened': new SimpleChange(false, true, false)
    }

    //act
    fixture.componentInstance.ngOnChanges(changes);
    fixture.detectChanges();

    //expect
    expect(component.loading).toBe(true);
    expect(component.error).toBe(false);
    expect(compiled.querySelector('app-loading')).toBeTruthy();

  })

});
