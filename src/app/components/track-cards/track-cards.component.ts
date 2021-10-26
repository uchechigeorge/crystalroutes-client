import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-track-cards',
  templateUrl: './track-cards.component.html',
  styleUrls: ['./track-cards.component.scss'],
})
export class TrackCardsComponent implements OnInit {

  @Input() details: { key: any, value: any }[] = [];
  @Input() cardId = "";
  @Input() cardTitle = "";
  @Input() editUrl = "";
  @Input() statusColor = "medium";
  @Input() statusText = "Pending";
  @Input() editBtnText = "Edit";
  @Input() deleteBtnText = "Delete";
  @Output() deleteAction = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {}

  deleteRecord(e) {
    this.deleteAction.emit(e);
  }
}
