import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent {

  canGoBack: boolean;

  constructor(private router: Router,
              private location: Location,) {
    this.canGoBack = !!(this.router.getCurrentNavigation()?.previousNavigation);
  }

  goBack(): void {
    if (this.canGoBack) {
      this.location.back();
    }
  }

}
