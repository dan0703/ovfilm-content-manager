import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../config/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('login', () => {
    it('should store token in localStorage on successful login', () => {
      const mockResponse = { access_token: 'mock-jwt-token' };

      service.login('admin@ovfilm.com', 'password').subscribe((response) => {
        expect(response.access_token).toBe('mock-jwt-token');
        expect(localStorage.getItem('ovfilm_jwt')).toBe('mock-jwt-token');
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email: 'admin@ovfilm.com', password: 'password' });
      req.flush(mockResponse);
    });
  });

  describe('logout', () => {
    it('should remove token from localStorage', () => {
      localStorage.setItem('ovfilm_jwt', 'some-token');
      service.logout();
      expect(localStorage.getItem('ovfilm_jwt')).toBeNull();
    });
  });

  describe('getToken', () => {
    it('should return token from localStorage', () => {
      localStorage.setItem('ovfilm_jwt', 'stored-token');
      expect(service.getToken()).toBe('stored-token');
    });

    it('should return null when no token exists', () => {
      expect(service.getToken()).toBeNull();
    });
  });

  describe('isLoggedIn', () => {
    it('should return true for valid non-expired token', () => {
      const futureExp = Math.floor(Date.now() / 1000) + 3600;
      const payload = btoa(JSON.stringify({ sub: 'admin', exp: futureExp }));
      const fakeToken = `header.${payload}.signature`;
      localStorage.setItem('ovfilm_jwt', fakeToken);

      expect(service.isLoggedIn()).toBeTrue();
    });

    it('should return false when no token exists', () => {
      expect(service.isLoggedIn()).toBeFalse();
    });

    it('should return false for expired token', () => {
      const pastExp = Math.floor(Date.now() / 1000) - 3600;
      const payload = btoa(JSON.stringify({ sub: 'admin', exp: pastExp }));
      const fakeToken = `header.${payload}.signature`;
      localStorage.setItem('ovfilm_jwt', fakeToken);

      expect(service.isLoggedIn()).toBeFalse();
    });

    it('should return false for invalid token format', () => {
      localStorage.setItem('ovfilm_jwt', 'not-a-valid-jwt');
      expect(service.isLoggedIn()).toBeFalse();
    });
  });
});
