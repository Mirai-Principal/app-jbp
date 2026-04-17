import { Component, signal } from '@angular/core';
import { Header } from "../../shared/header/header";
import { LoaderPage } from "../../shared/loader-page/loader-page";

@Component({
  selector: 'app-dashboard',
  imports: [Header, LoaderPage],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  isLoading = signal(false);

  constructor() {
    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
    }, 2000);
  }
}
