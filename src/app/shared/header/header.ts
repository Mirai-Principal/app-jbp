import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  imports: [CommonModule, MatToolbarModule, MatIconModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  @Input() title: string = '';
  @Input() subtitle?: string;
  @Input() icon?: string;
  @Input() color: 'primary' | 'accent' | 'warn' = 'primary';
}
