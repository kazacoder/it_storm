import {Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output} from '@angular/core';
import {MatIconRegistry} from "@angular/material/icon";
import {DomSanitizer} from "@angular/platform-browser";
import {EYE_ICON, EYE_OFF_ICON} from "../../../../assets/images/svg/svg-collection";

@Component({
  selector: 'password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss']
})
export class PasswordInputComponent implements OnInit {
  @Output()
  password_value = new EventEmitter<string>();

  @Input()
  singUp: boolean = false;

  showPassword = false;
  passInputType: 'password' | 'text' = 'password';
  password: string | undefined;
  passPattern: string | RegExp = '';

  constructor(private elementRef: ElementRef,
              private iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIconLiteral('eye', sanitizer.bypassSecurityTrustHtml(EYE_ICON));
    iconRegistry.addSvgIconLiteral('eye-off', sanitizer.bypassSecurityTrustHtml(EYE_OFF_ICON));
  }

  ngOnInit() {
    this.passPattern = this.singUp ?  new RegExp(/^(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/) : '';
  }


  //hide password when click outside password input div (this component)
  @HostListener('window:click', ['$event.target'])
  clickOut(targetElement: HTMLElement) {
    if (targetElement && document.body.contains(targetElement) && !this.elementRef.nativeElement.contains(targetElement)) {
      this.toggleShow(true);
    }
  }

  onInput(): void {
    this.password_value.emit(this.password);
  }

  toggleShow(hide?: boolean) {
    if (hide) {
      this.showPassword = false;
    } else {
      this.showPassword = !this.showPassword;
    }
    this.passInputType = this.showPassword ? 'text' : 'password';
  }
}
