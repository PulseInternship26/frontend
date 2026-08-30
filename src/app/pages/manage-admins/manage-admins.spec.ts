import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { ManageAdmins } from './manage-admins';

describe('ManageAdmins', () => {
  let component: ManageAdmins;
  let fixture: ComponentFixture<ManageAdmins>;
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageAdmins],
      providers: [provideRouter([]), provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageAdmins);
    component = fixture.componentInstance;
    http = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
    http.expectOne('/api/admins').flush([]);
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render admins returned by the API', async () => {
    component.loadAdmins();
    http.expectOne('/api/admins').flush([
      { id: 1, email: 'admin@example.com', phone: '+201001234567', role: 'ADMIN' },
    ]);
    await fixture.whenStable();

    expect(fixture.nativeElement.textContent).toContain('admin@example.com');
  });
});
