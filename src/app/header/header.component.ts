import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LogoComponent } from "@shared/components/logo/logo.component";

@Component({
  selector: 'app-header',
  imports: [RouterModule, LogoComponent],
  templateUrl: './header.component.html',
})
export class HeaderComponent { }
