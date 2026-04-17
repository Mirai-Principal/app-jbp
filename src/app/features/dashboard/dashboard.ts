import { Component, computed, signal } from '@angular/core';
import { DashboardLista } from './components/dashboard-lista/dashboard-lista';
import { Header } from "../../shared/header/header";
import { MatCard, MatCardContent } from "@angular/material/card";

@Component({
  selector: 'app-dashboard',
  imports: [DashboardLista, Header, MatCard, MatCardContent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {


}