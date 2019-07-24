import {AfterContentInit, Directive, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2} from '@angular/core';
declare var Cleave: any;

@Directive({
  selector: '[appCleaveJS]'
})
export class CleaveJSDirective implements OnInit, AfterContentInit {
  @Input() options: object;
  @Output() CreditCardTypeChanged: EventEmitter<any> = new EventEmitter();
  private readonly element: HTMLInputElement;

  constructor(private elRef: ElementRef, renderer: Renderer2) {
    this.element = elRef.nativeElement;
    if (document.activeElement === this.element) {
      renderer.setStyle(elRef.nativeElement, 'box-shadow', '2px 2px 12px #58A362');
    }
  }
  ngOnInit() {
    setTimeout(() => {
    }, 0);
  }
  ngAfterContentInit() {
    if (this.options) {
      const cleavejs = new Cleave(this.element, this.options);
    }
  }
}
