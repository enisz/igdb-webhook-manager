import {
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  SimpleChanges,
  OnInit
} from '@angular/core';

@Directive({
  selector: '[disabledButton]'
})
export class DisabledButtonDirective implements OnInit, OnChanges {
  @Input('disabledButton') isDisabled: boolean = false;

  private color = '';
  private isOutline = false;
  private disabledColor = 'secondary';
  private element: HTMLButtonElement;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) {
    this.element = this.elementRef.nativeElement as HTMLButtonElement;
  }

  ngOnInit(): void {
    const classList = this.element.classList;

    for (let className of classList) {
      const match = className.match(/^btn-(outline-)?(primary|secondary|success|danger|warning|info|light|dark)$/);
      if (match) {
        this.isOutline = !!match[1];
        this.color = match[2];
        break;
      }
    }
    this.updateButtonState();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isDisabled']) {
      this.updateButtonState();
    }
  }
  private updateButtonState(): void {
    if (!this.color) return;
  
    const currentClass = `btn-${this.isOutline ? 'outline-' : ''}${this.color}`;
    const disabledClass = `btn-${this.isOutline ? 'outline-' : ''}${this.disabledColor}`;
  
    this.renderer.setProperty(this.element, 'disabled', this.isDisabled);
    
    if (this.isDisabled) {
      this.renderer.removeClass(this.element, currentClass);
      this.renderer.addClass(this.element, disabledClass);
    } else {
      this.renderer.removeClass(this.element, disabledClass);
      this.renderer.addClass(this.element, currentClass);
    }
  }
}
