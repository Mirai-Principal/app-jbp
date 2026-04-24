import { Component } from '@angular/core';
import { Header } from "../../../shared/header/header";
import { MatCardHeader, MatCardTitle, MatCardContent, MatCard } from "@angular/material/card";

@Component({
  selector: 'app-historico-facturas',
  imports: [Header, MatCardHeader, MatCardTitle, MatCardContent, MatCard],
  templateUrl: './historico-facturas.html',
  styleUrl: './historico-facturas.scss',
})
export class HistoricoFacturas { }
