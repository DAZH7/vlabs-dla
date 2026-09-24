// AirRotationSlot::SlotData.js
//  2025-05-15
//

class SlotData
{
	constructor()
	{
		this.i = 0;
		this.R = 0;
		this.R_unitless = 0;
		this.mu = 0;
		this.ro = 0;
		this.nu = 0;
		this.Cp = 0;
		this.Lambda = 0;
		this.εw = 0;
		this.εd = 0;
		this.λf = 0;
		this.λ_turb_Disk = 0;
		this.λ_turb_Wall = 0;
		this.ξ = 0;
		this.β_disk = 0;
		this.β_wall = 0;
		this.μf = 0;
		this.νf = 0;
		this.ρf = 0;
		this.φ = 0;
		this.ϕ = 0;
		this.τ0αw = 0;
		this.τ0αd = 0;
		this.τ0rw = 0;
		this.τ0rd = 0;
		this.ω = 0;
		this.Pr = 0;
		this.F = 0;
		this.Ud = 0;
		this.Uw = 0;
		this.U = 0;
		this.Omega = 0;
		this.Bt = 0;
		this.Bt_wall = 0;
		this.C = 0;
		this.T = 0;
		this.Vr = 0;	
		this.p = 0;	
		this.CP = 0;	
		this.Intlp = 0;
		this.TPId = 0;
		this.TPIw = 0;
		this.TPId_ = 0;
		this.TPIw_ = 0;
		this.TPSd = 0;
		this.TPSw = 0;
		this.TVd = 0;
		this.TVw = 0;
		this.sign_TauAlfaD = 0;
		this.Cw = 0;
		this.LambdaTurbDisk = 0;
		this.LambdaTurbWall = 0;
		this.Tau0AlfaD = 0;
		this.Tau0AlfaW = 0;
		this.eps_w = 1.69;
		this.eps_d = 0.415;
		this.TauRAlfD = 0;
		this.TauRAlfW = 0;
		this.TauRvD = 0;
		this.TauRvW = 0;
		
		this.dUdR1 = 0;
		this.dUdR2 = 0;
		this.dUdR = 0;
		this.dU = 0;
		
		this.dPdR1 = 0;
		this.dPdR2 = 0;
		this.dPdR = 0;
		this.dP = 0;

		this.dMw = 0;
		this.dMd = 0;
		this.dNw = 0;
		this.dNd = 0;
		this.dNalfa = 0;
		this.dNv = 0;
		this.dN = 	0;
		this.dIntpl = 0;
		this.dA = 0;
		this.ReuWall = 0;
		this.ReWall = 0;
		this.ReuDisk = 0;
		this.ReDisk = 0;
		this.Mw = 0;
		this.Md = 0;
		this.Nw = 0;
		this.Nd = 0;
		this.Nalfa = 0;
		this.Nv = 0;
		this.N = 0;
		this.Intpl = 0;
		this.A = 0;
	}
	GetValues(paramNamesList)
	{
		let vals = [];
		if(paramNamesList==null) return vals; 

		for (let i = 0; i < paramNamesList.length; i++) 
		{
			vals[i] = this[paramNamesList[i]];
		}
		return vals; 
	}
}