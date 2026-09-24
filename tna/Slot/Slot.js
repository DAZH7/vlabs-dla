//------------------------------------------------------------
// AirRotationSlot::Slot.js
// 2025-01-26
//

//------------------------------------------------------------
//import SlotData from "SlotData.js";
//import SlotInput from "SlotInput.js";
//import BoundryLayer from "BoundryLayer.js";

class Slot extends RootObject {
	constructor(input) {
		super();

		if (input == null) return;

		this.g_iparams = null;// UI input 
		this.outparams = null;// UI output table
		this.ID = -1;

		this.Data = [];
		this.i_max = -1;
		//constants
		this.Rg = 287;
		this.Mode = 0; // режим расчет с переменной уголовой скорость
		this.name = input.name;
		this.m = 0.0015;
		this.Rd = 0.5;
		this.Rvt = 0.05;
		this.OmegaWall = 0;
		this.OmegaDisk = 3000 * Math.PI / 30;
		this.Omega0 = 0.5 * this.OmegaDisk;
		this.P1 = 1e5;
		this.T1 = 293;
		this.nz = 0.01;
		this.Ncalc = 100;
		this.Data = null;
		this.output = new SlotOutput();
		this.input = input;

		this.C_TPSd_per_TPSw = 1.1;
		this.PPS_law_wall = 2;
		this.PPS_law_disk = 2;
		this.PPS_degree_m_wall = 7;
		this.PPS_degree_m_disk = 7;

		this.mu = 0;
		this.nu = 0;
		this.ro = 0;
		this.Pr = 0;
		this.CW = 0;
		this.Gd = 0;
		this.LambdaTurb = 0;
		this.ReuWall = 0;
		this.ReWall = 0;
		this.ReuDisk = 0;
		this.ReDisk = 0;
		this.lgReuWall = 0;
		this.lgReWall = 0;
		this.lgReuDisk = 0;
		this.lgReDisk = 0;
		this.Bt_mid = 0;
		this.Bt2 = 0;
		this.dP = 0;
		this.P2 = 0;
		this.W2 = 0;
		this.Vr2 = 0;
		this.U2 = 0;
		this.Intlp2 = 0;
		this.C2 = 0;
		this.T2 = 0;
		this.Md = 0;
		this.Mw = 0;
		this.Nw = 0;
		this.Nd = 0;
		this.Nalfa = 0;
		this.Nv = 0;
		this.N = 0;
		this.A = 0;
		this.CMd = 0;
		this.CP = 0;
		this.A = 0;
		this.dR = 0;
		this.i_max = -1;
		this.LastError = "";

	}
	//_______________________________________________________________________________________
	GetCoreData() {
		return this.Data;
	}
	//_______________________________________________________________________________________
	GetCoreDataParamNames() {

		let obj = new SlotData();
		let res = new List();
		var keys = Object.keys(obj);
		for (var key in keys) {
			res.Add(obj[key]);
		}
		return res.items;
	}

	//_______________________________________________________________________________________
	Calculate() {
		this.i_max = -1;
		this.Data = [];
		this.R1 = this.Rd;
		this.R2 = this.Rvt;
		this.dR = (this.R2 - this.R1) / this.Ncalc;
		this.m_Rmax = Math.max(this.Rd, this.Rvt);
		this.m_tppsWall = new BoundryLayer(this.PPS_law_wall, this.PPS_degree_m_wall);
		this.m_tppsDisk = new BoundryLayer(this.PPS_law_disk, this.PPS_degree_m_disk);

		this.Data[0] = new SlotData();
		let l0 = this.Data[0];
		l0.R = this.Rd;
		l0.p = this.P1;
		l0.T = this.T1;
		l0.Omega = this.Omega0;
		l0.U = l0.R * l0.Omega;
		l0.mu = 1.717e-5 * Math.pow(l0.T / 273, 0.683);
		l0.ro = l0.p / (this.Rg * l0.T);
		l0.nu = l0.mu / l0.ro;
		l0.Cp = 995.6 + 0.093 * (l0.T - 273);
		l0.F = 2 * Math.PI * l0.R;

		l0.nz_ = this.nz;

		let sign_Vr = this.dR / Math.abs(this.dR);

		l0.Vr = sign_Vr * this.m / (l0.ro * l0.F * l0.nz_);
		l0.C = Math.sqrt(l0.U * l0.U + l0.Vr * l0.Vr);
		l0.Intlp = l0.Cp * l0.T + 0.5 * l0.C * l0.C;

		this.m_Pwd = 0.5 * l0.ro * this.m_Rmax * this.m_Rmax * l0.Omega * l0.Omega;
		this.Re_d = l0.ro * l0.Omega * this.m_Rmax * this.m_Rmax / l0.mu;
        this.Cw = this.m / (l0.mu * this.m_Rmax);
        this.LambdaTurb = this.Cw / Math.pow(this.Re_d, 4.0 / 5.0);

		this.Md = 0;
		this.Mw = 0;
		this.Nw = 0;
		this.Nd = 0;
		this.Nalfa = 0;
		this.Nv = 0;
		this.N = 0;
		this.A = 0;

		let i = 0;
		for (i = 0; i < this.Ncalc; i++) 
		{
			if (this.Data[i] == null)
				this.Data[i] = new SlotData();
			let li = this.Data[i];
			li.i = i;
			li.R = this.Rd + i * this.dR; // ��� ��� dR < 0!
			li.R_unitless = li.R / this.Rd; 
			li.F = 2 * Math.PI * li.R;
			li.Ud = li.R * this.OmegaDisk;
			li.Uw = li.R * this.OmegaWall;
			li.CP = (li.p - this.P1) / this.m_Pwd;	
			li.Md = 0;
			li.Mw = 0;
			li.Nw = 0;
			li.Nd = 0;
			li.Nalfa = 0;
			li.Nv = 0;
			li.N = 0;
			li.A = 0;

			if (i > 0)
			{
				li.ro = li.p / (this.Rg * this.Data[i - 1].T);
				li.Cp = this.Data[i - 1].Cp;
			}
			else
				li.ro = li.p / (this.Rg * li.T);

			li.nz_ = this.nz;

			let dlu = li.Ud - li.U;
			let wlu = li.Uw - li.U;

			for (let it = 0; it < 2; it++)// try calc TPS + Vr
			{

				li.Vr = sign_Vr * this.m / (li.ro * li.F * li.nz_);
				li.C = Math.sqrt(li.U * li.U + li.Vr * li.Vr);
				
				li.T = (li.Intlp - 0.5 * li.C * li.C) / li.Cp;
				//li.T = this.Data[0].T; 

				if (li.T < 0 || !Checks.IsValid(li.T)) {
					this.FireCalcError("Slot::Calculate", "T < 0 ");
					this.i_max = i;
					return;
				}
				li.mu = 1.717e-5 * Math.pow(li.T / 273, 0.683);
				li.ro = li.p / (this.Rg * li.T);
				li.nu = li.mu / li.ro;
				li.Cp = 995.6 + 0.093 * (li.T - 273);
				li.Lambda = 2.44e-2 * Math.pow(li.T / 273, 0.82);
				li.Pr = li.mu * li.Cp / li.Lambda;

				
				li.TPSw = this.nz / (this.C_TPSd_per_TPSw + 1);
				li.TPSd = li.TPSw * this.C_TPSd_per_TPSw;

				li.TPId = li.TPSd * this.m_tppsDisk.kTPIperTPS;
				li.TPIw = li.TPSw * this.m_tppsWall.kTPIperTPS;;
				li.TPId_ = 0.366 * Math.pow(li.nu / Math.abs(dlu), 0.2) * Math.pow(li.R, 0.8);
				li.TPIw_ = 0.322 * Math.pow(li.nu / Math.abs(wlu), 0.2) * Math.pow(li.R, 0.8);
				li.TVd = this.m_tppsDisk.kTVperTPS * li.TPSd;
				li.TVw = this.m_tppsWall.kTVperTPS * li.TPSw;
				li.nz_ = this.nz - (li.TVw + li.TVd);

				if (!Checks.IsValid(li.nz_)) {
					this.FireCalcError("Slot::Calculate", "nz_ is INVALID!");
					this.i_max = i;
					return;
				}
				if (li.nz_ < 0) {
					this.FireCalcError("Slot::Calculate", "nz_ < 0 at i = " + li.i);
					this.i_max = i;
					return;
				}
				li.Vr = sign_Vr * this.m / (li.ro * li.F * li.nz_);
			}//it

			if(li.Ud!=0)
				li.Bt = li.U / li.Ud;
			
			if(li.Uw!=0)
				li.Bt_wall = li.U / li.Uw;
			
			li.Omega = li.U/li.R;

			let resAnyNaN = Checks.AnyNaN(li);
			if (resAnyNaN != null) {
				this.FireCalcError("Slot::Calculate", resAnyNaN);
				this.i_max = i;
				return;
			}
			li.sign_TauAlfaD = dlu / Math.abs(dlu);
			li.sign_TauAlfaW = wlu / Math.abs(wlu);

			li.Tau0AlfaD = li.sign_TauAlfaD * 0.01256 * li.ro * dlu * dlu * Math.pow(Math.abs(dlu) * li.TPId / li.nu, -0.25);
			li.Tau0AlfaW = li.sign_TauAlfaW * 0.01256 * li.ro * wlu * wlu * Math.pow(Math.abs(wlu) * li.TPIw / li.nu, -0.25);
			li.eps_w = 1.69;
			li.eps_d = 0.415;
			li.TauRAlfD = li.eps_d * li.Tau0AlfaD;
			li.TauRAlfW = li.eps_w * li.Tau0AlfaW;
			li.TauRvD = 0.01256 * li.ro * li.Vr * li.Vr * Math.pow(Math.abs(li.Vr) * li.TPId / li.nu, -0.25);
			li.TauRvW = 0.01256 * li.ro * li.Vr * li.Vr * Math.pow(Math.abs(li.Vr) * li.TPIw / li.nu, -0.25);

			li.dUdR1 = - li.U / li.R;
			li.dUdR2 = + (li.Tau0AlfaW + li.Tau0AlfaD) / (li.ro * this.nz * li.Vr);
			li.dUdR = li.dUdR1 + li.dUdR2;
			li.dU = li.dUdR * this.dR;

			if (this.Mode == 1) {
				li.dU = 0;
			}
			else if (this.Mode == 2) {
				li.dU = this.OmegaDisk0 * this.dR;
			}

			li.εw = li.eps_w;
			li.εd = li.eps_d;
			li.λf = li.Lambda;
			li.β_disk = li.Bt;
			li.β_wall = li.Bt_wall;
			li.μf = li.nu * li.ro;
			li.νf = li.nu;
			li.ρf = li.ro;
			//li.ξ = 0;
			// li.φ = 0;
			// li.ϕ = 0;
			li.τ0αw = li.Tau0AlfaW;
			li.τ0αd = li.Tau0AlfaD;
			li.τ0rw = li.TauRAlfW + li.TauRvW;
			li.τ0rd = li.TauRAlfD + li.TauRvD;
			li.ω = li.Omega;
	

			li.dPdR1 = li.ro * (li.Vr * li.Vr + li.U * li.U) / li.R;
			li.dPdR2 = (li.TauRAlfD - li.TauRAlfW - li.TauRvD - li.TauRvW) / this.nz;
			li.dPdR = li.dPdR1 + li.dPdR2;
			li.dP = li.dPdR * this.dR;

			li.dMw = 2 * Math.PI * li.R * li.R * Math.abs(this.dR) * Math.abs(li.Tau0AlfaW);
			li.dMd = 2 * Math.PI * li.R * li.R * Math.abs(this.dR) * Math.abs(li.Tau0AlfaD);

			li.dNw = li.dMw * Math.abs(wlu) / li.R;
			li.dNd = li.dMd * Math.abs(dlu) / li.R;
			li.dNalfa = li.dNd + li.dNw;
			li.dNv = (Math.abs(li.TauRAlfD) + Math.abs(li.TauRAlfW) + Math.abs(li.TauRvD) + Math.abs(li.TauRvW)) * Math.PI * li.R * Math.abs(li.Vr) * Math.abs(this.dR);
			li.dN = li.dNv + li.dNalfa;
			li.dIntpl = li.dN / this.m;
			li.dA = Math.abs(2 * Math.PI * li.R * this.dR * li.p);
			li.ReuWall = Math.abs(wlu) * li.R / li.nu;
			li.ReWall = MyMath.LengthVector(li.Vr,wlu) * li.R / li.nu;
			li.ReuDisk = Math.abs(dlu) * li.R / li.nu;
			li.ReDisk = MyMath.LengthVector(li.Vr,dlu) * li.R / li.nu;

			li.Cw = this.m / (li.mu * li.R);
			li.LambdaTurbDisk = li.Cw / Math.pow(li.ReuDisk, 4.0 / 5.0);
			li.LambdaTurbWall = li.Cw / Math.pow(li.ReuWall, 4.0 / 5.0);
			li.λ_turb_Disk = li.LambdaTurbDisk;
			li.λ_turb_Wall = li.LambdaTurbWall;

			this.Md += li.dMd;
			this.Mw += li.dMw;
			this.Nw += li.dNw;
			this.Nd += li.dNd;
			this.Nalfa += li.dNalfa;
			this.Nv += li.dNv;
			this.N += li.dN;
			this.A += li.dA;

			li.Mw = this.Mw;
			li.Md = this.Md;
			li.Nw = this.Nw;
			li.Nd = this.Nd;
			li.Nalfa = this.Nalfa;
			li.Nv = this.Nv;
			li.N = this.N;
			li.A = this.A;

			resAnyNaN = Checks.AnyNaN(li);
			if (resAnyNaN != null) {
				this.FireCalcError("Slot::Calculate", resAnyNaN);
				this.i_max = i;
				return;
			}

			if ((i + 1) < this.Ncalc) {
				if (this.Data[i + 1] == null)
					this.Data[i + 1] = new SlotData();

				this.Data[i + 1].U = li.U + li.dU;
				this.Data[i + 1].p = li.p + li.dP;
				this.Data[i + 1].Intlp = li.Intlp + li.dIntpl;
			}
		}
		this.i_max = i;

		this.CalcFinalResults();
		this.CreateOutput();

		return;
	}
	//_______________________________________________________________________________________
	CalcFinalResults() {

		if (this.Data == null) {
			this.FireCalcError("Slot::CalcFinalResults", "this.Data= NULL");
			return;
		}

		this.ReuWall = 0;
		this.ReWall = 0;
		this.ReuDisk = 0;
		this.ReDisk = 0;
		this.Bt_mid = 0;
		var dot0 = this.Data[0];
		var dotF = this.Data[this.Ncalc - 1];

		this.mu = dotF.mu;
		this.nu = dotF.nu;
		this.ro = dotF.ro;
		this.Pr = dotF.Pr;


		let i = 0;
		for (i = 0; i < this.Ncalc; i++) {
			var dot = this.Data[i];
			this.ReuWall += dot.ReuWall;
			this.ReWall += dot.ReWall;

			this.ReuDisk += dot.ReuDisk;
			this.ReDisk += dot.ReDisk;

			this.Bt_mid += dot.Bt;

			dot.Cpr1 = (dot.p - dot0.p) / this.m_Pwd;
			dot.Cpr2 = (dot.p - dotF.p) / this.m_Pwd;
		}
		this.ReuWall = this.ReuWall / this.Ncalc;
		this.ReWall = this.ReWall / this.Ncalc;
		this.ReuDisk = this.ReuDisk / this.Ncalc;
		this.ReDisk = this.ReDisk / this.Ncalc;

		this.lgReuWall = Math.log10(this.ReuWall);
		this.lgReWall = Math.log10(this.ReWall);
		this.lgReuDisk = Math.log10(this.ReuDisk);
		this.lgReDisk = Math.log10(this.ReDisk );

		this.Bt_mid = this.Bt_mid / this.Ncalc;
		this.Bt2 = dotF.Bt;
		this.dP = dotF.p - this.P1;
		this.P2 = dotF.p;
		this.W2 = dotF.U/dotF.R;
		this.Vr2 = dotF.Vr;
		this.U2 = dotF.U;
		this.Intlp2 = dotF.Intlp;
		this.C2 = dotF.C;
		this.T2 = dotF.T;

		this.CW = this.m / (this.mu * this.m_Rmax);
		this.Gd = this.nz / this.m_Rmax;
		this.LambdaTurb = this.CW / Math.pow(this.ReDisk, 4.0 / 5.0);;

		if (this.OmegaDisk > 0)
			this.CMd = 4 * this.Md / (dot0.ro * this.OmegaDisk * this.OmegaDisk * Math.pow(this.m_Rmax, 5));// шлихтинг, 1974, (5.55) 

		this.CP = (this.P2 - this.P1) / this.m_Pwd;
	}
	//_______________________________________________________________________________________
	CreateOutput() {
		this.output = new SlotOutput();

		let obj = this.output;

		var keys = Object.keys(obj);
		for (var key in keys) {
			this.output[keys[key]] = this[keys[key]];
		}
	}
}
