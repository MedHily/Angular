import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Member } from 'src/models/member_model';
import { MemberService } from 'src/services/member.service';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {
  dataSource: Member[] = [];
  displayedColumns: string[] = ['id', 'name', 'age', 'city', 'actions'];
  isLoading: boolean = false;

  constructor(private ms: MemberService, private router: Router) { }

  ngOnInit() {
    this.loadMembers();
  }

  loadMembers() {
    this.isLoading = true;
    this.ms.getAllMembers().subscribe(
      (resp) => {
        this.dataSource = resp;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading members:', error);
        this.isLoading = false;
      }
    );
  }

  openCreateForm(): void {
    this.router.navigate(['/members/new']);
  }

  openEditForm(member: Member): void {
    this.router.navigate(['/members/edit', member.id]);
  }

  deleteMember(id: number, memberName: string): void {
    if (confirm(`Are you sure you want to delete ${memberName}?`)) {
      this.ms.deleteMember(id).subscribe(
        () => {
          this.loadMembers();
        },
        (error) => {
          console.error('Error deleting member:', error);
          alert('Error deleting member. Please try again.');
        }
      );
    }
  }
}
