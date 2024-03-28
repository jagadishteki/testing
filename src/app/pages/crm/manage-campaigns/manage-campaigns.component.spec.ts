import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCampaignsComponent } from './manage-campaigns.component';

describe('ManageCampaignsComponent', () => {
  let component: ManageCampaignsComponent;
  let fixture: ComponentFixture<ManageCampaignsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageCampaignsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ManageCampaignsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
