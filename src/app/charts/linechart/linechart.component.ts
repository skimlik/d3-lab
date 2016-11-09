import { Component, OnInit, Input } from '@angular/core';

@Component({
  templateUrl: './linechart.component.html',
  styleUrls: ['./linechart.component.scss']
})
export class LinechartComponent implements OnInit {
  private text: string = '';
  public ngOnInit() { }

  @Input() set innerText(value: string) {
    this.text = value;
  }
}
