import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {
  
  http = inject(HttpClient);
  constructor() { }
  
  getCampaigns() {
    return this.http.get('https://web-api-cu1b.onrender.com/campaigns/')
  }

  addCampaign(data: any) {
    return this.http.post('https://web-api-cu1b.onrender.com/campaigns/', data)
  }

  updateCampaign(campaign: any) {
    return this.http.put('https://web-api-cu1b.onrender.com/campaigns/'+campaign.id, campaign)
  }

  deleteCampaign(campaignId: number) {
    return this.http.delete('https://web-api-cu1b.onrender.com/campaigns/' + campaignId)
  }
}
