//________________________________
// AirRotationSlot::SlotInput.js
// 2026-01-26
//
class SlotInput
{
	constructor(name)
	{
		this.name = name;
		this.m = 0.0015;
		this.Rd = 0.5;
		this.Rvt = 0.1;
		this.OmegaWall = 0;
		this.OmegaDisk = (3000 * Math.PI / 30).toFixed(3);
		this.Omega0 = 0.5 *(this.OmegaDisk + this.OmegaWall);
		this.P1 = 3e5;
		this.T1 = 293;
		this.nz = 0.01;
		this.Mode = 0; // режим расчет с переменной уголовой скорость
		this.Ncalc = 200;
		this.PPS_law_wall = 2;
		this.PPS_law_disk = 2;
		this.PPS_degree_m_wall = 7;
		this.PPS_degree_m_disk = 7;
		this.ComboboxValues = [
			{ name: "PPS_law_wall", defval: 1, values: TypesBoundryLayerLaw }
			, { name: "PPS_law_disk", defval: 1, values: TypesBoundryLayerLaw }

		];

	}
}

class SlotOutput {
	constructor() {
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
		this.CMd = 0;
		this.CP = 0;
		this.A = 0;
		this.dR = 0;
		this.i_max = -1;
		this.LastError = "";
	}
}