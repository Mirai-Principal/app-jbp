import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-error',
  imports: [RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './error.html',
  styleUrl: './error.scss',
})
export class Error {

  goBack(): void {
    window.history.back();
  }
}
