import { ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common'
import * as converter from 'number-to-words';


import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-root',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Default,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [DatePipe]
})
export class AppComponent {
  selectedDate=''
  test = false
  hasSubmitted = false
  formError = ''
  pdfError = ''
  isGenerating = false
  myDate:any = new Date();
  constructor(private datePipe: DatePipe){
  }  
  aadhaar = ''
  penId = ''
  Class = '6th'
  Duration = '2022-23'
  StudentName = 'Shaik Mohammed Sayeed';
  FatherName = 'Shaik Irshad'
  date=this.datePipe.transform(this.myDate, 'dd-MM-yyyy');
  Date_Birth='21/10/2011';
  AdmissionNumber = 4001;
  Date_Numbers = 'TWO ONE, ONE ZERO, TWO ZERO ONE ONE'
  @ViewChild('invoice') invoiceElement!: ElementRef;
  @ViewChild('preview') previewElement!: ElementRef;
  public async generatePDF(): Promise<void> {
    if (!this.hasSubmitted || this.isGenerating) return;
    this.isGenerating = true;
    this.pdfError = '';
    try {
      const canvas = await html2canvas(this.invoiceElement.nativeElement, { scale: 3 });
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const scale = Math.min((pageWidth - 20) / canvas.width, (pageHeight - 20) / canvas.height);
      const width = canvas.width * scale;
      const height = canvas.height * scale;
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', (pageWidth - width) / 2, 10, width, height);
      pdf.save(this.StudentName + '.pdf');
    } catch {
      this.pdfError = 'Could not generate the certificate. Please try again.';
    } finally {
      this.isGenerating = false;
    }
  }
  onClickSubmit(result:any) {
  const parts = /^(\d{2})[/-](\d{2})[/-](\d{4})$/.exec(result.DOB || '');
  const birthDate = parts ? new Date(`${parts[3]}-${parts[2]}-${parts[1]}T00:00:00`) : null;
  if (!parts || !birthDate || birthDate.getDate() !== +parts[1] || birthDate.getMonth() + 1 !== +parts[2] || birthDate.getFullYear() !== +parts[3]) {
    this.formError = 'Enter a valid DOB as DD/MM/YYYY (for example, 21/10/2011).';
    return;
  }
  this.formError = '';
  this.pdfError = '';
  this.Class = result.Class
  this.Duration = result.Duration
  this.StudentName = result.StudentName;
  this.FatherName = result.FatherName
  this.date=this.datePipe.transform(new Date(), 'dd-MM-yyyy');
  this.Date_Birth=result.DOB;
  this.AdmissionNumber = result.Admission;
  this.Date_Numbers =  this.number_string(this.Date_Birth)
  if(result.DateofIssue!=''){
    this.date = result.DateofIssue
  }
  this.penId = result.penId || ''
  this.aadhaar = result.aadhaar || ''
  this.hasSubmitted = true;
  setTimeout(() => {
    this.previewElement.nativeElement.focus({ preventScroll: true });
    this.previewElement.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
 }
 number_string(x:string){
 var final_result = ''
  var y: number = +x;
  let number_words= ''
//dd
y = +x[0]
number_words = converter.toWords(y)
final_result = final_result.concat(number_words,' ')
y = +x[1]
number_words = converter.toWords(y)
final_result = final_result.concat(number_words,', ')
//mm
y = +x[3]
number_words = converter.toWords(y)
final_result = final_result.concat(number_words,' ')
y = +x[4]
number_words = converter.toWords(y)
final_result = final_result.concat(number_words,', ')
//yyyy
y = +x[6]
number_words = converter.toWords(y)
final_result = final_result.concat(number_words,' ')
y = +x[7]
number_words = converter.toWords(y)
final_result = final_result.concat(number_words,' ')
y = +x[8]
number_words = converter.toWords(y)
final_result = final_result.concat(number_words,' ')
y = +x[9]
number_words = converter.toWords(y)
final_result = final_result.concat(number_words)

return final_result;
 }
 onyearClassSubmit(year:any){
  console.log(year.birthyear)
 }
}
