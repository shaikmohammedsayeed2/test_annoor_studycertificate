import { TestBed } from '@angular/core/testing';
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
