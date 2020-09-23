import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import * as $ from 'jquery';


@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss']
})
export class FilterDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<FilterDialogComponent>) { }

  ngOnInit() {
  }

  filter() {

  }

  clearFilter() {
    
  }

  cancel() {
    this.dialogRef.close({'loginSuccess': false});
  }
}
