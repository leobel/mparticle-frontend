import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsDetailsComponent } from './notifications-details.component';
import { HttpClient } from '@angular/common/http';
import { AnomaliesService } from 'src/app/services/anomalies.service';
import { Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { Anomaly, AnomalyTypeEnum } from 'src/app/models/anomaly.model';

describe('NotificationsDetailsComponent', () => {
  let component: NotificationsDetailsComponent;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpClient', ['get', 'post']);
    TestBed.configureTestingModule({
      declarations: [NotificationsDetailsComponent],
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
    const fixture = TestBed.createComponent(NotificationsDetailsComponent);
    const app = fixture.componentInstance;

    // expect
    expect(app).toBeTruthy();
  });

  it('shold navigate to existing notification', async () => {
    // arrange
    const item: Anomaly = {
      id: 1,
      type: AnomalyTypeEnum.moderate,
      title: "Title 1",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
    };
    httpClientSpy.get.and.returnValue(of(item));

    // act
    const compiled = await navigateTo(item.id);

    //assert
    expect(TestBed.inject(Router).url).toEqual(`/notifications/${item.id}`);
    expect(compiled.querySelector('h3')?.textContent).toContain(item.title);
    expect(compiled.querySelector('p')?.textContent).toContain(item.description);
  });

  it('shold navigate back to home page', async () => {
    // arrange
    const id = 999;
    httpClientSpy.get.and.returnValue(throwError(() => new Error('missing item')));
    // act
    await navigateTo(id);

    //assert
    expect(TestBed.inject(Router).url).toEqual('/');
  });
   
  async function navigateTo(id: number) {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl(`/notifications/${id}`, NotificationsDetailsComponent);
    harness.detectChanges();
    return harness.routeNativeElement!;
  }

});
