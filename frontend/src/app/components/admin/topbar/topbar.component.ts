import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './topbar.component.html'
})
export class TopbarComponent {
  @Input() isExpanded = true;
  @Output() searchEvent = new EventEmitter<string>();
  currentDate: Date = new Date();

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchEvent.emit(input.value);
  }
}
