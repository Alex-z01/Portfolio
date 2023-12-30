import { Component, OnInit, Renderer2, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})

export class HeroComponent implements OnInit {
  @ViewChild('expandedLetters', { static: false }) expandedLetters!: ElementRef | undefined;
  @Output() onExpand: EventEmitter<boolean> = new EventEmitter<boolean>();

  expanded = false;
  isDragging = false;
  circleMenus: string[] = [];

  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {
    this.expandedLetters = this.expandedLetters || new ElementRef(null);
    this.renderer.listen(document, 'mouseup', () => this.dragStop());
  }

  dragStart(): void {
    this.isDragging = true;
  }

  dragging(e: MouseEvent): void {
    if (this.expandedLetters && this.isDragging) {
      this.expandedLetters.nativeElement.scrollLeft -= e.movementX;
    }
  }

  dragStop(): void {
    this.isDragging = false;
  }

  handleWheel(e: WheelEvent): void {
    if (this.expandedLetters) {
      e.preventDefault();
      this.expandedLetters.nativeElement.scrollLeft += e.deltaY;
    }
  }

  expand() {
    if(this.expanded) {
        return;
    }

    const closeButton = document.getElementById('close-button');

    if (this.expandedLetters) {
      if (!this.expanded) {

        // Close button period
        if (closeButton) {
          closeButton.classList.add('close-button-reveal');

          setTimeout(() => {
            closeButton!.style.opacity = '1';
            closeButton!.classList.remove('close-button-reveal');
          }, 300);
        }

        this.expandedLetters.nativeElement.classList.remove('hide');
        this.expandedLetters.nativeElement.classList.add('reveal');

        setTimeout(() => {
          this.expandedLetters!.nativeElement.style.width = '830px';
          this.expandedLetters!.nativeElement.classList.remove('reveal');
          this.expanded = true;
          this.onExpand.emit(this.expanded);
        }, 1000);
      }
    }
  }

  close(): void {
    const closeButton = document.getElementById('close-button');

    if (this.expandedLetters && this.expanded) {

      // Close button period
      if (closeButton) {
        closeButton.classList.add('close-button-hide');

        setTimeout(() => {
          closeButton!.style.opacity = '0';
          closeButton!.classList.remove('close-button-hide');
        }, 300);
      }

      this.expandedLetters.nativeElement.classList.remove('reveal');
      this.expandedLetters.nativeElement.classList.add('hide');

      setTimeout(() => {
        this.expandedLetters!.nativeElement.style.width = '0';
        this.expandedLetters!.nativeElement.classList.remove('hide');
        this.expanded = false;
        this.onExpand.emit(this.expanded);
      }, 1000);
    }
  }

  HoverColor(event: MouseEvent, color: string) {
    const firstInitial = document.getElementById('first-initial');
    const secondInitial = document.getElementById('second-initial');

    if(!this.expanded) {
      if(firstInitial && secondInitial) {
        firstInitial.style.color = color;
        secondInitial.style.color = color;
      }
      return;
    }

    const target = event.target as HTMLElement;

    target.style.color = color;
  }
}
