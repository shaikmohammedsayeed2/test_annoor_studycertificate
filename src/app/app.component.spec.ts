import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        FormsModule
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should update and focus the preview after form submission', fakeAsync(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    tick();
    const compiled = fixture.nativeElement as HTMLElement;
    const preview = compiled.querySelector('[aria-label="Certificate preview"]') as HTMLElement;
    const scroll = spyOn(preview, 'scrollIntoView');
    const download = compiled.querySelector('button[type="button"]') as HTMLButtonElement;
    expect(download.disabled).toBeTrue();
    for (const [id, value] of Object.entries({
      Admission: '42', StudentName: 'Test Student', FatherName: 'Test Parent',
      Class: '7th', Duration: '2026-27', DOB: '21/10/2011'
    })) {
      const input = compiled.querySelector('#' + id) as HTMLInputElement;
      input.value = value;
      input.dispatchEvent(new Event('input'));
    }
    compiled.querySelector('form')!.dispatchEvent(new Event('submit'));
    tick();
    fixture.detectChanges();

    const certificate = compiled.querySelector('#invoice')!.textContent!;
    expect(certificate).toContain('TEST STUDENT');
    expect(certificate).toContain('TEST PARENT');
    expect(certificate).toContain('7th grade during the academic year 2026-27');
    expect(certificate).toContain('Admission No. 42');
    expect(certificate).toContain('TWO ONE, ONE ZERO, TWO ZERO ONE ONE');
    expect(certificate).not.toContain('GMT');
    expect(download.disabled).toBeFalse();
    expect(scroll).toHaveBeenCalled();
  }));

  it('should reject missing, malformed, and impossible DOBs without changing the preview', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const app = fixture.componentInstance;
    for (const DOB of ['', '1/1/2011', '31/02/2011', '21/13/2011']) {
      app.onClickSubmit({ DOB, StudentName: 'Changed' });
      expect(app.formError).toContain('valid DOB');
      expect(app.hasSubmitted).toBeFalse();
      expect(app.StudentName).toBe('Shaik Mohammed Sayeed');
    }
  });

  it('should show and hide C&A fields and certificate sections with the toggle', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    const toggle = compiled.querySelector('#isCASeen') as HTMLInputElement;

    for (const enabled of [false, true, false, true]) {
      if (toggle.checked !== enabled) {
        toggle.click();
      }
      fixture.detectChanges();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(toggle.checked).toBe(enabled);
      expect(fixture.componentInstance.test).toBe(enabled);
      expect(!!compiled.querySelector('#penId')).toBe(enabled);
      expect(!!compiled.querySelector('#aadhaar')).toBe(enabled);
      const certificate = compiled.querySelector('#invoice') as HTMLElement;
      expect(certificate.textContent?.includes('PEN ID')).toBe(enabled);
      expect(certificate.textContent?.includes('Aadhaar No.')).toBe(enabled);
      if (enabled) {
        const idLines = Array.from(certificate.querySelectorAll('h5'))
          .map(line => line.textContent?.trim());
        expect(idLines.indexOf('PEN ID')).toBe(idLines.indexOf('Aadhaar No.') + 1);
      }
    }
  });
});
