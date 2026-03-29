import { TestBed } from '@angular/core/testing';
import { HomeService } from './home.service';
import { environment } from '../config/environment';

describe('HomeService', () => {
  let service: HomeService;
  let fetchSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HomeService],
    });
    service = TestBed.inject(HomeService);
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
    if (fetchSpy) {
      fetchSpy.and.callThrough();
    }
  });

  describe('getAboutUs', () => {
    it('should call GET /aboutUs with language parameter', async () => {
      const mockData = {
        LANGUAGE: 'EN',
        HEADER: 'About',
        TITLE: 'OVFilm',
        DESCRIPTION: 'Wedding films',
        IMG_URL_1: 'uploads/about-us/img1.webp',
        IMG_URL_2: 'uploads/about-us/img2.webp',
        IMG_URL_3: 'uploads/about-us/img3.webp',
      };

      fetchSpy = spyOn(window, 'fetch').and.resolveTo(
        new Response(JSON.stringify(mockData), { status: 200 }),
      );

      await service.getAboutUs('EN');

      expect(fetchSpy).toHaveBeenCalledWith(
        `${environment.apiUrl}/aboutUs?LANGUAGE=EN`,
      );
    });

    it('should prepend API URL to image paths in response', async () => {
      const mockData = {
        LANGUAGE: 'EN',
        HEADER: 'About',
        TITLE: 'OVFilm',
        DESCRIPTION: 'Wedding films',
        IMG_URL_1: 'uploads/about-us/img1.webp',
        IMG_URL_2: 'uploads/about-us/img2.webp',
        IMG_URL_3: undefined,
      };

      fetchSpy = spyOn(window, 'fetch').and.resolveTo(
        new Response(JSON.stringify(mockData), { status: 200 }),
      );

      const result = await service.getAboutUs('EN');

      expect(result?.IMG_URL_1).toBe(`${environment.apiUrl}/uploads/about-us/img1.webp`);
      expect(result?.IMG_URL_2).toBe(`${environment.apiUrl}/uploads/about-us/img2.webp`);
    });

    it('should not prepend URL to paths that already start with http', async () => {
      const mockData = {
        LANGUAGE: 'EN',
        HEADER: 'About',
        TITLE: 'OVFilm',
        DESCRIPTION: 'Wedding films',
        IMG_URL_1: 'https://example.com/image.webp',
        IMG_URL_2: undefined,
        IMG_URL_3: undefined,
      };

      fetchSpy = spyOn(window, 'fetch').and.resolveTo(
        new Response(JSON.stringify(mockData), { status: 200 }),
      );

      const result = await service.getAboutUs('EN');

      expect(result?.IMG_URL_1).toBe('https://example.com/image.webp');
    });

    it('should return undefined on fetch error', async () => {
      fetchSpy = spyOn(window, 'fetch').and.resolveTo(
        new Response(null, { status: 500, statusText: 'Internal Server Error' }),
      );

      const result = await service.getAboutUs('EN');

      expect(result).toBeUndefined();
    });
  });

  describe('addAboutUs', () => {
    it('should call POST /admin/aboutUs with auth header', async () => {
      localStorage.setItem('ovfilm_jwt', 'test-token');
      const mockResponse = { LANGUAGE: 'EN', TITLE: 'OVFilm' };

      fetchSpy = spyOn(window, 'fetch').and.resolveTo(
        new Response(JSON.stringify(mockResponse), { status: 201 }),
      );

      const formData = new FormData();
      formData.append('LANGUAGE', 'EN');
      formData.append('TITLE', 'OVFilm');

      await service.addAboutUs(formData);

      expect(fetchSpy).toHaveBeenCalledWith(
        `${environment.apiUrl}/admin/aboutUs`,
        jasmine.objectContaining({
          method: 'POST',
          headers: { Authorization: 'Bearer test-token' },
          body: formData,
        }),
      );
    });

    it('should throw on non-ok response', async () => {
      localStorage.setItem('ovfilm_jwt', 'test-token');

      fetchSpy = spyOn(window, 'fetch').and.resolveTo(
        new Response(JSON.stringify({ error: 'Bad Request' }), { status: 400 }),
      );

      const formData = new FormData();

      await expectAsync(service.addAboutUs(formData)).toBeRejected();
    });
  });
});
