import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-loader-page',
  imports: [CommonModule, MatProgressSpinnerModule, MatIconModule],
  templateUrl: './loader-page.html',
  styleUrl: './loader-page.scss',
})
export class LoaderPage {
  @Input() message: string = 'Cargando...';
  @Input() showLogo: boolean = true;
  @Input() backgroundColor: string = 'rgba(255, 255, 255, 0.95)';
  @Input() spinnerColor: string = 'primary';
}
