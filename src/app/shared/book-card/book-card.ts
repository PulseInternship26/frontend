import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-book-card',
  imports: [],
  templateUrl: './book-card.html',
  styleUrl: './book-card.css',
})
export class BookCard {
  @Input() id!: number;
  @Input() title: string = '';
  @Input() price: number = 0;
  @Input() imageUrl: string = '';

  @Output() viewDetails = new EventEmitter<number>();

  onViewDetailsClick(): void {
    this.viewDetails.emit(this.id);
  }
}