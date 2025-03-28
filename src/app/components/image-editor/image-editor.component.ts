import { Component, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-image-editor',
  standalone: true,
  imports: [],
  templateUrl: './image-editor.component.html',
  styleUrl: './image-editor.component.scss'
})
export class ImageEditorComponent implements AfterViewInit{
  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;
  image = new Image();

  cropWidth = 0;
  cropHeight = 0;
  startX = 0;
  startY = 0;
  isDragging = false;
  lastMouseX = 0;
  lastMouseY = 0;
  zoomFactor = 1;

  ngAfterViewInit() {
    this.ctx = this.canvas.nativeElement.getContext('2d')!;
    this.updateCropSize();
  }

  @HostListener('window:resize')
  updateCropSize() {
    this.cropWidth = window.innerWidth * 0.27;
    this.cropHeight = this.cropWidth; // Mantener cuadrado
  }

  loadImage(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.image.src = reader.result as string;
      this.image.onload = () => {
        const canvas = this.canvas.nativeElement;
        canvas.width = this.image.width;
        canvas.height = this.image.height;
        this.ctx.drawImage(this.image, 0, 0);
        
        // Centrar el frame de recorte
        this.startX = (canvas.width - this.cropWidth) / 2;
        this.startY = (canvas.height - this.cropHeight) / 2;

        // Dibujar el área de recorte
        this.drawCropFrame();
      };
    };
    reader.readAsDataURL(file);
  }

  drawCropFrame() {
    this.ctx.drawImage(this.image, 0, 0);

    // Dibujar el rectángulo de recorte
    this.ctx.strokeStyle = 'red';
    this.ctx.lineWidth = 3;
    this.ctx.strokeRect(this.startX, this.startY, this.cropWidth * this.zoomFactor, this.cropHeight * this.zoomFactor);
  }

  startDragging(event: MouseEvent) {
    this.isDragging = true;
    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;
  }

  dragFrame(event: MouseEvent) {
    if (!this.isDragging) return;

    const dx = event.clientX - this.lastMouseX;
    const dy = event.clientY - this.lastMouseY;

    this.startX += dx;
    this.startY += dy;

    this.lastMouseX = event.clientX;
    this.lastMouseY = event.clientY;

    this.drawCropFrame();
  }

  stopDragging() {
    this.isDragging = false;
  }

  zoomFrame(event: WheelEvent) {
    event.preventDefault();

    const zoomChange = event.deltaY > 0 ? -0.05 : 0.05;
    this.zoomFactor = Math.max(0.5, Math.min(2, this.zoomFactor + zoomChange));

    this.drawCropFrame();
  }

  cropImage() {
    const cropW = this.cropWidth * this.zoomFactor;
    const cropH = this.cropHeight * this.zoomFactor;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = cropW;
    tempCanvas.height = cropH;
    const tempCtx = tempCanvas.getContext('2d')!;
    
    tempCtx.drawImage(
      this.canvas.nativeElement,
      this.startX,
      this.startY,
      cropW,
      cropH,
      0,
      0,
      cropW,
      cropH
    );

    const croppedImage = tempCanvas.toDataURL('image/png');

    // Descargar la imagen recortada
    const link = document.createElement('a');
    link.href = croppedImage;
    link.download = 'cropped-image.png';
    link.click();
  }
}
