import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from 'src/models/member_model';
import { MemberService } from 'src/services/member.service';

@Component({
  selector: 'app-member-form',
  templateUrl: './member-form.component.html',
  styleUrls: ['./member-form.component.css']
})
export class MemberFormComponent implements OnInit {
  form!: FormGroup;
  isEdit: boolean = false;
  memberId: number | null = null;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private memberService: MemberService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      age: new FormControl('', [Validators.required, Validators.min(1), Validators.max(150)]),
      city: new FormControl('', [Validators.required, Validators.minLength(2)])
    });

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.memberId = params['id'];
        this.loadMember(params['id']);
      } else {
        this.isEdit = false;
        this.memberId = null;
      }
    });
  }

  loadMember(id: number): void {
    this.isLoading = true;
    this.memberService.getMemberById(id).subscribe(
      (member: Member) => {
        this.form.patchValue({
          name: member.name,
          age: member.age,
          city: member.city
        });
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading member:', error);
        this.isLoading = false;
        this.router.navigate(['/members']);
      }
    );
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formData = this.form.value;

      if (this.isEdit && this.memberId) {
        this.memberService.updateMember(this.memberId, formData).subscribe(
          () => {
            this.router.navigate(['/members']);
          },
          (error) => {
            console.error('Error updating member:', error);
          }
        );
      } else {
        this.memberService.createMember(formData).subscribe(
          () => {
            this.router.navigate(['/members']);
          },
          (error) => {
            console.error('Error creating member:', error);
          }
        );
      }
    }
  }

  onCancel(): void {
    this.router.navigate(['/members']);
  }
}
