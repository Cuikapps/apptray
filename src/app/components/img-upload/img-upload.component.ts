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
    if (this.img1.nativeElement.files && this.checkSize(this.img1))
      this.images.push(this.img1.nativeElement.files[0]);
    else alert('Image must be less than 1mb');
    if (this.img2.nativeElement.files && this.checkSize(this.img2))
      this.images.push(this.img2.nativeElement.files[0]);
    else alert('Image must be less than 1mb');
    if (this.img3.nativeElement.files && this.checkSize(this.img3))
      this.images.push(this.img3.nativeElement.files[0]);
    else alert('Image must be less than 1mb');
    if (this.img4.nativeElement.files && this.checkSize(this.img4))
      this.images.push(this.img4.nativeElement.files[0]);
    else alert('Image must be less than 1mb');
    //#endregion

    if (this.images.length < 1) {
      alert('You must at least have one image');
    } else this.files.emit(this.images);
  }

  checkSize(input: ElementRef<HTMLInputElement>) {
    if (
      input.nativeElement.files &&
      input.nativeElement.files[0].size / 1024 / 1024 == Math.floor(1)
    )
      return true;
    else return false;
  }
}
