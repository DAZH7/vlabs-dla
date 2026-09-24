// -----------------------------------
// TurbinDisk.js
// 2025-04-29


class TurbinDiskInput {

    constructor(name) {
		this.name = name;
		this.m = 0.0005;
		this.Rd = 0.5;
		this.Rvt = 0.1;
		this.Omega = (3000 * Math.PI / 30).toFixed(3);
		this.Fi1 = 0.5;
		this.P1 = 3e5;
		this.T1 = 293;
		this.nz = 0.01;
		this.hl = 0.01; // высота лопатки
		this.bt = 0.05; // ширина решетки
		this.ModeDiskSlot = 1;
		this.ModeBladeSlot = 2;
    }
}
class TurbinDiskOutput {

	constructor(name) {
		this.LastError = "";

		this.ReuDisk = 0;
		this.ReDisk = 0;

		this.lgReuDisk = 0;
		this.lgReDisk = 0;

		this.CW = 0;
		this.Gd = 0;
		this.LambdaTurb = 0;

		this.Md = 0;
		this.CMd = 0;

		this.Md_DiskSlot = 0;
		this.Md_BladeSlot = 0;
		this.CMd_DiskSlot = 0;
		this.CMd_BladeSlot = 0;

		this.Md_endface = 0;
		this.CMd_endface = 0;
	}
}
class TurbinDisk extends RootObject {
    constructor(input)
	{
		super();

		this.input = input;
		this.name = input.name;
		this.m = 0.0005;
		this.Rd = 0.5;
		this.Rvt = 0.1;
		this.Omega = (3000 * Math.PI / 30).toFixed(3);
		this.Fi1 = 0.5;
		this.P1 = 3e5;
		this.T1 = 293;
		this.nz = 0.01;
		this.hl = 0.01; // высота лопатки
		this.bt = 0.05; // ширина решетки
		this.ModeDiskSlot = 1;
		this.ModeBladeSlot = 2;

		this.output = new TurbinDiskOutput();


		this.ReuDisk = 0;
		this.ReDisk = 0;


		this.lgReuDisk = 0;
		this.lgReDisk = 0;

		this.CW = 0;
		this.Gd = 0;
		this.LambdaTurb = 0;

		this.Md = 0;
		this.CMd = 0;

		this.DiskSlot = null;
		this.BladeSlot = null;
	}
	//_______________________________________________________________________________________
	GetCoreData() {
		//return this.Data;
		return null;
	}
	//_______________________________________________________________________________________
	GetCoreDataParamNames() {

		return null;
	//	let obj = new SlotData();
	//	let res = new List();
	//	var keys = Object.keys(obj);
	//	for (var key in keys) {
	//		res.Add(obj[key]);
	//	}
	//	return res.items;
	}
	//_______________________________________________________________________________________


	//_______________________________________________________________________________________
	Calculate() {

		this.ResetError();
		let inputSlot1 = new SlotInput("TurbinDisk DiskSlot Input");
		let inputSlot2 = new SlotInput("TurbinDisk BladeSlot Input");

		this.DiskSlot = new Slot(inputSlot1);
		this.BladeSlot = new Slot(inputSlot2);

		this.DiskSlot.Mode = this.ModeDiskSlot;
		this.BladeSlot.Mode = this.ModeBladeSlot;

		this.DiskSlot.m = this.m;
		this.DiskSlot.Rd = this.Rd;
		this.DiskSlot.Rvt = this.Rvt;
		this.DiskSlot.Omega = this.Omega;
		this.DiskSlot.Fi1 = this.Fi1;
		this.DiskSlot.P1 = this.P1;
		this.DiskSlot.T1 = this.T1;
		this.DiskSlot.nz = this.nz;

		this.BladeSlot.m = this.m;
		this.BladeSlot.Rd = this.Rd;
		this.BladeSlot.Rvt = this.Rd + this.hl;
		this.BladeSlot.Omega = this.Omega;
		this.BladeSlot.Fi1 = this.Fi1;
		this.BladeSlot.P1 = this.P1;
		this.BladeSlot.T1 = this.T1;
		this.BladeSlot.nz = this.nz;

		this.DiskSlot.Calculate();
		this.BladeSlot.Calculate();

		let errs1 = this.DiskSlot.GetLastErrors();
		if (errs1 != null && errs1 !="")
			this.FireCalcError("DiskSlot",errs1);

		let errs2 = this.BladeSlot.GetLastErrors();
		if (errs2 != null && errs2 != "")
			this.FireCalcError("BladeSlot",errs2);

		if (this.LastError != null && this.LastError != "") {
			return;
		}

		// -----------
		// output 
		this.Md_DiskSlot = this.DiskSlot.Md * 2;
		this.Md_BladeSlot = this.BladeSlot.Md * 2;
		this.CMd_DiskSlot = this.DiskSlot.CMd * 2;
		this.CMd_BladeSlot = this.BladeSlot.CMd * 2;

		let lastdot = this.BladeSlot.Data[this.BladeSlot.Ncalc-1];
		this.Md_endface = lastdot.Tau0AlfaD * 2 * Math.PI * lastdot.R * lastdot.R * this.bt;
		this.CMd_endface = 4 * this.Md_endface / (lastdot.ro * this.Omega * this.Omega * Math.pow(this.DiskSlot.m_Rmax, 5)); // шлихтинг, 1974, (5.55) 

		this.Md = this.Md_DiskSlot + this.Md_BladeSlot + this.Md_endface;
		this.CMd = this.CMd_DiskSlot + this.CMd_BladeSlot + this.CMd_endface;

		this.ReuDisk = this.DiskSlot.ReuDisk ;
		this.ReDisk = this.DiskSlot.ReDisk;

		this.lgReuDisk = this.DiskSlot.lgReuDisk ;
		this.lgReDisk = this.DiskSlot.lgReDisk;

		this.CW = this.DiskSlot.CW ;
		this.Gd = this.DiskSlot.Gd;
		this.LambdaTurb = this.DiskSlot.LambdaTurb;


		let resAnyNaN = Checks.AnyNaN(this);
		if (resAnyNaN != null) {
			this.FireCalcError("TurbinDisk::Calculate", resAnyNaN);
			return;
		}
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