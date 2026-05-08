import { Component } from '@angular/core';
import { Header } from '../../../shared/header/header';
import { MatCard } from '@angular/material/card';
import { MatCardContent } from '@angular/material/card';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-participantes-puntos',
  standalone: true,
  imports: [
    Header,
    MatCard,
    MatCardContent,
    ReactiveFormsModule,
    MatInputModule
  ],
  templateUrl: './participantes-puntos.html',
  styleUrl: './participantes-puntos.scss'
})
export class ParticipantesPuntos {
  
}
