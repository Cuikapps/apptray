import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'cuik-img-upload',
  templateUrl: './img-upload.component.html',
  styleUrls: ['./img-upload.component.scss'],
})
export class ImgUploadComponent implements OnInit {
  constructor(private renderer2: Renderer2) {}

  @ViewChild('img1') img1!: ElementRef<HTMLInputElement>;
  @ViewChild('img2') img2!: ElementRef<HTMLInputElement>;
  @ViewChild('img3') img3!: ElementRef<HTMLInputElement>;
  @ViewChild('img4') img4!: ElementRef<HTMLInputElement>;

  @Output() files: EventEmitter<File[]> = new EventEmitter<File[]>();

  images: File[] = [];

  ngOnInit(): void {}

  inputChange(input: HTMLInputElement) {
    this.renderer2.addClass(input.parentElement, 'selected-file');
  }

  submit() {
    //#region If image sizes are less 1 mb then they are added to images array

    //Images Check 1
    if (
      this.img1.nativeElement.files &&
      this.img1.nativeElement.files.length > 0
    )
      if (this.checkSize(this.img1))
        this.images.push(this.img1.nativeElement.files[0]);
      else {
        alert('Image 1 must be less than 1mb');
        return;
      }
    //Images Check 2
    if (
      this.img2.nativeElement.files &&
      this.img2.nativeElement.files.length > 0
    )
      if (this.checkSize(this.img2))
        this.images.push(this.img2.nativeElement.files[0]);
      else {
        alert('Image 2 must be less than 1mb');
        return;
      }
    //Images Check 3
    if (
      this.img3.nativeElement.files &&
      this.img3.nativeElement.files.length > 0
    )
      if (this.checkSize(this.img3))
        this.images.push(this.img3.nativeElement.files[0]);
      else {
        alert('Image 3 must be less than 1mb');
        return;
      }
    //Images Check 4
    if (
      this.img4.nativeElement.files &&
      this.img4.nativeElement.files.length > 0
    )
      if (this.checkSize(this.img4))
        this.images.push(this.img4.nativeElement.files[0]);
      else {
        alert('Image 4 must be less than 1mb');
        return;
      }
    //#endregion

    if (this.images.length < 1) {
      alert('You must at least have one image');
    } else this.files.emit(this.images);
  }

  checkSize(input: ElementRef<HTMLInputElement>): boolean {
    if (input.nativeElement.files)
      if (input.nativeElement.files[0].size <= 1048569) return true;
      else return false;
    else return false;
  }
}
