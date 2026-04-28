import api from "./api";
import { AgentDashboard, HubDetails, VerificationRequest } from "../@types/agent";

export const agentService = {
  getDashboard: () => 
    api.get<AgentDashboard>("/agent/dashboard"),
    
  getHubDetails: () => 
    api.get<HubDetails>("/agent/hub"),
    
  updateHubLoad: (load: number) => 
    api.put("/agent/hub/load", { currentLoad: load }),
    
  getPendingSubmissions: () => 
    api.get("/agent/submissions/pending"),
    
  verifySubmission: (data: VerificationRequest) => 
    api.post(`/agent/submissions/${data.id}/verify`, data),
    
  rejectSubmission: (id: string, reason: string) => 
    api.post(`/agent/submissions/${id}/reject`, { reason }),
    
  updateLocation: (lat: number, lng: number) => 
    api.put("/agent/location", { lat, lng }),
};
