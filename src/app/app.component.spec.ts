import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotificationsListComponent } from './components/notifications-list/notifications-list.component';
import { NotificationsDetailsComponent } from './components/notifications-details/notifications-details.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ErrorComponent } from './components/error/error.component';
import { AnomaliesService } from './services/anomalies.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Anomaly, AnomalyTypeEnum } from './models/anomaly.model';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  
  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        MatSidenavModule,
        MatListModule,
        MatBadgeModule,
        MatCheckboxModule,
        MatDividerModule,
        MatProgressSpinnerModule
      ],
      declarations: [
        AppComponent,
        NotificationsListComponent,
        NotificationsDetailsComponent,
        LoadingComponent,
        ErrorComponent
      ],
      providers: [
        AnomaliesService,
        { provide: HttpClient, useValue: spy }
      ]
    });
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
  }
  );

  it('should create the app', () => {
    // arrange
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    // expect
    expect(app).toBeTruthy();
  });

  it(`should have as title 'ui-coding-test'`, () => {
    // arrange
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;

    // expect
    expect(app.title).toEqual('ui-coding-test');
  });

  it('should render toolbox with notification icon', () => {
    //arrange
    const fixture = TestBed.createComponent(AppComponent);

    //act 
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    // expect
    expect(compiled.querySelector('mat-toolbar mat-icon')?.textContent).toContain('notifications_active');
  });

  it('should render side-nav initially closed', () => {
    // arrange
    const fixture = TestBed.createComponent(AppComponent);
    const sidenav = fixture.debugElement.query(By.css('mat-sidenav')).componentInstance as MatSidenav;

    //act
    fixture.detectChanges();

    //expect
    expect(sidenav.opened).toBe(false);
  });

  it('should show side-nav when click on toolbox notification icon', () => {
    // arrange
    const fixture = TestBed.createComponent(AppComponent);
    httpClientSpy.get.and.returnValue(of([]));
    const sidenav = fixture.debugElement.query(By.css('mat-sidenav')).componentInstance as MatSidenav;

    //act
    fixture.detectChanges();
    fixture.debugElement.nativeElement.querySelector('mat-toolbar button')?.click();
    fixture.detectChanges()

    //expect
    expect(sidenav.opened).toBe(true);
  });

  it('should toggle side-nav when click on toolbox notification icon', () => {
    // arrange
    const fixture = TestBed.createComponent(AppComponent);
    httpClientSpy.get.and.returnValue(of([]));
    const sidenav = fixture.debugElement.query(By.css('mat-sidenav')).componentInstance as MatSidenav;

    //act
    fixture.detectChanges();
    const button = fixture.debugElement.nativeElement.querySelector('mat-toolbar button')
    button.click();
    fixture.detectChanges();
    button.click();
    fixture.detectChanges();

    //expect
    expect(sidenav.opened).toBe(false);
  });

  it('should hide side-nav when click outside', () => {
    // arrange
    const fixture = TestBed.createComponent(AppComponent);
    httpClientSpy.get.and.returnValue(of([]));
    const sidenav = fixture.debugElement.query(By.css('mat-sidenav')).componentInstance as MatSidenav;

    //act
    fixture.detectChanges();
    fixture.debugElement.nativeElement.querySelector('mat-toolbar button')?.click();
    fixture.detectChanges();
    const backdrop = fixture.debugElement.query(By.css('div.mat-drawer-backdrop'));
    backdrop.triggerEventHandler('click', null);
    fixture.detectChanges();

    //expect
    expect(sidenav.opened).toBe(false);
  });

  it('should show empty notification list', () => {
    // arrange
    const fixture = TestBed.createComponent(AppComponent);
    httpClientSpy.get.and.returnValue(of([]));

    //act
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    fixture.debugElement.nativeElement.querySelector('mat-toolbar button')?.click();
    fixture.detectChanges()

    //expect
    expect(compiled.querySelectorAll('mat-list mat-list-item').length).toBe(0);
  });

  it('should show notification list with items', () => {
    // arrange
    const fixture = TestBed.createComponent(AppComponent);
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

    //act
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    fixture.debugElement.nativeElement.querySelector('mat-toolbar button')?.click();
    fixture.detectChanges()

    //expect
    expect(compiled.querySelectorAll('mat-list mat-list-item').length).toBe(items.length);
  });
});
