import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Member } from 'src/models/member_model';

@Component({
  selector: 'app-member-form-dialog',
  templateUrl: './member-form-dialog.component.html',
  styleUrls: ['./member-form-dialog.component.css']
})
export class MemberFormDialogComponent implements OnInit {
  memberForm: FormGroup;
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MemberFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { member: Member; isEdit: boolean }
  ) {
    this.isEdit = data.isEdit;
    this.memberForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      age: ['', [Validators.required, Validators.min(1), Validators.max(150)]],
      city: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void {
    if (this.isEdit && this.data.member) {
      this.memberForm.patchValue({
        name: this.data.member.name,
        age: this.data.member.age,
        city: this.data.member.city
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.memberForm.valid) {
      this.dialogRef.close(this.memberForm.value);
    }
  }
}
