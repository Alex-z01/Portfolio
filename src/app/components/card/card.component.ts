import { Component, Input } from '@angular/core';
import { Project } from '../cockroach/cockroach-service.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})

export class CardComponent{
  @Input() project: Project | undefined;
}
