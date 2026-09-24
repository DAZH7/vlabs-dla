 //________________________________
 // VortexChamber.js
 // 2026-01-23   <-----------------

 //================================
"use strict";
//--------------------------

let lines = [];
let linesIndex = 0;
let dataCore = [];
let DataTrend = [];
let indexGlobalColors = 0;
let ir = 0;
let dd = 0;
let acells = new Array();
let iparams = new List();
let outparams = new List();

let tblOutParams;
let SkipDots = 5;
//--------------------------------------------------------------------------------------


const TypesVortexChamberCalcMode = [
	{ idtype: 1, name: "расчет 1" },
	{ idtype: 2, name: "расчет 2" }
]
const TypesVortexChamberIntegrationSchema = [
	{ idtype: 1, name: "Шаг постоянный" }
	,{ idtype: 2, name: "Шаг переменный ступен." }
	,{ idtype: 3, name: "Шаг переменный гиперб." }
]

const mdr = [[0.875, 0.125], [0.75, 0.25], [0.5, 0.5], [0, 1]];
//_____________________________________________________________
//_____________________________________________________________
//_____________________________________________________________
class VortexChamberOutput {
	constructor(name) {
		this.LastError = "";
		this.m = 0;
		this.dP0 = 0;
		this.dP1 = 0;
		this.dP2 = 0;
		this.Mtr = 0;
		this.Rmax = 0;
		this.Cm_tr = 0; 
		this.Re0 = 0;
		this.ro = 0;
		this.Cu0 = 0;
		this.V0 = 0;
		this.Vr0 = 0;
		this.sC0 = 0;
		this.ii0 = 0;
		this.n = 0;
		this.ΔRn = 0;
		this.i_last = 0;
		this.Direction = 0;
		this.δ_0 = 0;
		this.δ2_z00 = 0;
	}
}
//_____________________________________________________________
//_____________________________________________________________
//_____________________________________________________________
class VortexChamberData {
	constructor() {
		this.i = 0;
		this.mu = 0;
		this.nu = 0;
		this.R = 0;
		this.R_ = 0;
		this.dR = 0;
		this.T = 0;
		this.ro = 0;
		this.vr = 0;
		this.c = 0;
		this.u = 0;
		this.p = 0;
		this.Cu = 0;
		this.dCu = 0;
		this.dif_Cu_R = 0;
		this.ii = 0;
		this.dii = 0;
		this.δ2_a = 0;
		this.δ2_z = 0;
		this.δ2_z_ = 0;
		this.dδ2z = 0;
		this.δ2_c = 0;
		this.tv_a_double = 0;
		this.tv_c_double = 0;
		this.τ_0c = 0;
		this.τ_0a = 0;
		this.τ_0A = 0;
		this.τ_0r = 0;
		this.τ_0ra = 0;
		this.dif_dδ2zdR = 0;
		this.dif_p_r = 0;
		this.dp = 0;
		this.dNtr = 0;
		this.alfa = 0;
		this.Ftr = 0;
		this.dMtr = 0;		
	}
	GetValues(paramNamesList) {
		let vals = [];
		if (paramNamesList == null) return vals;

		for (let i = 0; i < paramNamesList.length; i++) {
			vals[i] = this[paramNamesList[i]];
		}
		return vals;
	}
}
//_____________________________________________________________
//_____________________________________________________________
//_____________________________________________________________
class VortexChamberInput {
	constructor(name) {
		this.name = name;
		this.T0 = 293.43;//;//Температура среды,К");						//1
		this.Rg = 287;//Газовая постоянная, Дж/кгК");					//2
		this.Cp = 1005;//теплоемкость, Дж/кгК");						//3
		this.R1 = 0.051;//Радиус входа,м");							//4
		this.R2 = 0.01;//Радиус выхода,м");							//5
		this.m = 0.00403;//Массовый расход, кг/с");					//6
		this.U0 = 88.17;//Cкорость окружная на входе, м/с");			//7
		this.p0 = 101355;//Давление, Па");								//8
		this.nu = 1.5e-5;//Кинемат.вязкость, кв.м/с");					//9
		this.n0z = 0.007;//Нормальный зазор, м");						//10
		this.n = 200;//Количество элементов");						//11
		this.SkipDots = 1;//Отображать каждую точку по порядку No_");	//12
		this.eps = 1.69;//eps");						//13
		this.CalcMode = 2; // Режим расчет dif_dPdR
		this.IntegrationSchema = 1;
		this.PPS_law = 2;
		this.PPS_degree_m = 7;
		this.ComboboxValues = [
			{ name: "CalcMode", defval: 2, values: TypesVortexChamberCalcMode }
			, { name: "IntegrationSchema", defval: 1, values: TypesVortexChamberIntegrationSchema }
			, { name: "PPS_law", defval: 1, values: TypesBoundryLayerLaw }
		];
	}
}
//_____________________________________________________________
//_____________________________________________________________
//_____________________________________________________________
class VortexChamber extends RootObject
{
	constructor(input) {
		super();
		this.input = input;
		this.name = this.input.name;
		this.output = new VortexChamberOutput();

		// есть hdxcode::CopyData(obj, input);

		this.T0 = 0; //this.input.T0;
		this.Rg = 0; //this.input.Rg;
		this.Cp = 0; //this.input.Cp;
		this.R1 = 0; //this.input.R1;
		this.R2 = 0; //this.input.R2;
		this.m = 0; //this.input.m;
		this.U0 = 0; //this.input.U0;
		this.p0 = 0; //this.input.p0;
		this.nu = 0; //this.input.nu;
		this.n0z = 0; //this.input.n0z;
		this.n = 0; //this.input.n;
		this.SkipDots = 0; //this.input.SkipDots;
		this.eps = 0; //this.input.eps;
		this.CalcMode = 0; //this.input.CalcMode; 
		this.IntegrationSchema = 0; //this.input.IntegrationSchema;
		
		this.PPS_law = 2;
		this.PPS_degree_m = 7;

		this.i_last = 0;
		this.ΔRn = 0;
		this.i = 0;
		this.m = 0;
		this.dP0 = 0;
		this.dP1 = 0;
		this.dP2 = 0;
		this.Mtr = 0;
		this.Cm_tr = 0; 
		this.Re0 = 0;
		this.Data = [];
		this.Direction = 0;
		this.δ_0 = 0;
		this.δ2_z00 = 0;

	}
	//_______________________________________________________________________________________
	GetCoreData() {
		return this.Data;
	}
	//_______________________________________________________________________________________
	//_______________________________________________________________________________________
	GetCoreDataParamNames() {

		let obj = new VortexChamberData();
		let res = new List();
		var keys = Object.keys(obj);
		for (var key in keys) {
			res.Add(obj[key]);
		}
		return res.items;
	}
	//_______________________________________________________________________________________
	CreateOutput() {
		this.output = new VortexChamberOutput();

		let obj = this.output;

		var keys = Object.keys(obj);
		for (var key in keys) {
			this.output[keys[key]] = this[keys[key]];
		}
	}
	//--------------------------------
	Calc_Ri(ri_) {
		return ri_ * (this.R2 - this.R1) + this.R1;
	}
	//--------------------------------
	Calc_dR(ri_) {
		if (this.IntegrationSchema == 2) {
			for (let j = 0; j < 4; j++) {
				
				if (ri_ >= mdr[j][0]) // только при уменьшении радиуса ri
					return this.ΔRn * mdr[j][1];
			}
		}
		else if (this.IntegrationSchema == 3) {
			let Ri = this.Calc_Ri(ri_)
			return 0.5 * this.ΔRn * Ri;
			
		}

		return this.ΔRn;
	}
	//--------------------------------
	Calculate() {
		this.ResetError();

		this.ppsBoundryLayer = new BoundryLayer(this.PPS_law, this.PPS_degree_m);

		this.ΔRn = 1.0 * (this.R2 - this.R1) / this.n;
		
		this.Cf_δ2_z = 2.572;
		this.δ_0 = 0.5*this.n0z;
		this.δ2_z00 = this.δ_0 /this.ppsBoundryLayer.N;//0.0493 * Math.pow(this.nu / Math.abs(this.Vr0), 0.2) * Math.pow(Math.abs(this.ΔRn), 0.8);

		this.ro = this.p0 / (this.Rg * this.T0);
		this.Cu0 = this.R1 * this.U0;
		this.Re0 = this.Cu0 / this.nu;
		this.F0 = 2 * Math.PI * this.R1 * (this.n0z - this.Cf_δ2_z * this.δ2_z00);
		this.V0 = this.m / this.ro;
		this.Vr0 = this.V0 / this.F0;
		this.sC0 = this.U0 * this.U0 + this.Vr0 * this.Vr0;
		this.ii0 = this.T0 * this.Cp + 0.5 * this.sC0;

		this.Mtr = 0;

		let sign = this.R1 > this.R2 ? (-1) : 1;
		this.Direction = sign;

		let Cu_pp = 0;
		let p_pp = 0;
		let ii_pp = 0;
		let δ2_z_pp = 0;

		this.Data = [];
		let Ri = this.R1;
		let i = 0;
		//for (let i = 0; i < this.n; i++)
		while(true)
		{

			if (this.Data[i] == null)
				this.Data[i] = new VortexChamberData();

			///------------------------------------------------
			//  !~ see bottom ~!
			//
			//  Ri = li.dR * li.i + this.R1;
			//  Ri = Ri + li.dR;
			//  
			//  !~ see bottom ~!
			///------------------------------------------------

			let li = this.Data[i];
			li.i = i;
			li.R_ = (Ri - this.R1) / (this.R2 - this.R1);
			li.dR = this.Calc_dR(li.R_);
			li.R = Ri;

			li.δ2_z_ = this.δ2_z00;
			if (i == 0) {
				li.T = this.T0;
				li.Cu = this.Cu0;
				li.ii = this.ii0;
				li.p = this.p0;
				li.ro = this.ro;
				if (this.IsNotValid(li.δ2_z)) { this.FireCalcError("VortexChamber", "STOP_8: tpi_z is NaN , i = " + i); return; }
			}
			else {
				li.Cu = Cu_pp;
				li.ii = ii_pp;
				li.p = p_pp;
			}
			if (li.p < 0) {
				this.FireCalcError("VortexChamber", "STOP_1: p < 0 , i = " + i); return;
			}
			if (this.IsNotValid(li.p)) { this.FireCalcError("VortexChamber", "STOP_13: p is NaN , i = " + i); return; }

			if (li.T < 0) {
				this.FireCalcError("VortexChamber", "STOP_2: T < 0 , i = " + i);
				return;
			}

			if (li.ii < 0) {
				this.FireCalcError("VortexChamber", "STOP_3: ii < 0 , i = " + i);
				return;
			}

			// подбор плотности ro и  δ2_z
			for (let iro = 0; iro < 3; iro++) {
				if (iro == 0) {
					li.ro = this.ro;
				}
				li.u = li.Cu / li.R;
				li.n0 = this.n0z - this.Cf_δ2_z * li.δ2_z;
				li.F = 2 * Math.PI * li.R * li.n0;
				li.V = this.m / li.ro;
				li.vr = sign * li.V / li.F;
				li.sC = li.u * li.u + li.vr * li.vr;
				li.c = Math.sqrt(li.sC);

				li.T = (li.ii - 0.5 * li.sC) / this.Cp;
				li.mu = 1.717e-5 * Math.pow(li.T / 273, 0.683);
	
				if (this.IsNotValid(li.T)) { this.FireCalcError("VortexChamber", "STOP_4: T is NaN , i = " + i); return; }

				li.ro = li.p / (this.Rg * li.T);

				if (li.ro < 0) { this.FireCalcError("VortexChamber", "STOP_5: ro < 0 , i = " + i); return; }
				if (this.IsNotValid(li.ro)) { this.FireCalcError("VortexChamber", "STOP_6: ro is NaN , i = " + i); return; }

				li.nu = li.mu / li.ro;

				li.δ2_a = 0.9545 * Math.pow(li.nu / (li.R * Math.abs(li.u)), 0.2) * li.R;
				if (this.IsNotValid(li.δ2_a)) { this.FireCalcError("VortexChamber", "STOP_7: tpi_a is NaN , i = " + i); return; }

			}
			// учет слияния ПС 
			li.tv_a_double = 2 * li.δ2_a * 10.28;
			//if (li.tv_a_double > this.n0z / 2) {
			//	li.tv_a_double = this.n0z;
				
			//}
			li.Re = li.Cu / li.nu;

			li.δ2_c = li.δ2_a * li.u * li.u / li.sC + li.δ2_z * li.vr * li.vr / li.sC;
			li.tv_c_double = 2 * li.δ2_c * 10.28;

			li.τ_0c = 0.0186 * li.ro * li.sC * Math.pow(li.c * li.δ2_c / li.nu, -0.25);
			li.alfa = Math.atan(li.vr / li.u);
			li.τ_0a = li.τ_0c * Math.cos(li.alfa);
			li.τ_0r = li.τ_0c * Math.sin(li.alfa);
			li.τ_0A = 0.0186 * li.ro * li.u * li.u * Math.pow(Math.abs(li.u) * li.δ2_a / li.nu, -0.25);

			// исправить как (4.102)
			li.τ_0ra = this.eps *  li.τ_0A;//li.τ_0a;//

			li.dif_Cu_R = - 2 * li.τ_0a * li.R / (li.ro * li.vr * li.n0);
			li.dCu = li.dif_Cu_R * li.dR;

			let sing_tr = -1 * sign;
			li.dif_p_r = 0;

			if (this.CalcMode == 1)
				li.dif_p_r = li.ro * (li.vr * li.vr + li.u * li.u) / li.R
					- 2 * (li.τ_0r + sing_tr * li.τ_0ra) / (li.n0);

			if (this.CalcMode == 2) {
				//ρ / R(1) * ((Vr) ^ 2 * (1 - { 2.572* R(1) } / { n.0z - 2.572 * δ2.z } * (dδ2zdR)) + (C.u / R(1)) ^ 2) - 2 * { τ.0R + γ * τ0Rα } / { n.0z - 2.572 * δ2.z }
				let dif_p11 = li.vr * li.vr * (1 - 2.572 * li.R * li.dif_dδ2zdR / li.n0);
				let dif_p12 = li.Cu * li.Cu / (li.R * li.R);
				let dif_p2 = - 2 * (li.τ_0r + sing_tr * li.τ_0ra) / li.n0;
				li.dif_p_r = li.ro * (dif_p11 + dif_p12) / li.R + dif_p2;
			}


			li.dp = li.dif_p_r * li.dR;

			li.Ftr = li.τ_0c * 2 * Math.PI * li.R * Math.abs(li.dR);
			li.dMtr = li.Ftr * li.R;
			li.dNtr = li.Ftr * li.c;
			li.dii = li.dNtr / this.m;

			this.Mtr += li.dMtr;

			Cu_pp = li.Cu + li.dCu;
			p_pp = li.p + li.dp;
			ii_pp = li.ii + li.dii;
			δ2_z_pp = li.δ2_z_ + li.dδ2z;

			this.Data[i] = li;

			this.i_last = i;
			if (this.IsNotValid(Cu_pp)) { this.FireCalcError("VortexChamber", "STOP_10: Cu_pp is NaN , i = " + i); return; }
			if (this.IsNotValid(p_pp)) { this.FireCalcError("VortexChamber", "STOP_11: p_pp is NaN , i = " + i); return; }
			if (this.IsNotValid(ii_pp)) { this.FireCalcError("VortexChamber", "STOP_12: ii_pp is NaN , i = " + i); return; }
			if (this.IsNotValid(δ2_z_pp)) { this.FireCalcError("VortexChamber", "STOP_20: dif_dδ2zdR is NaN, i = " + i); return; }
			//if (δ2_z_pp < 0) { this.FireCalcError("VortexChamber", "STOP_21: δ2_z < 0, i = " + i); return; }

			Ri = Ri + li.dR;
			i = i + 1;

			//if (i == 1) continue;
			if (this.ΔRn > 0 && Ri > this.R2) break;
			if (this.ΔRn < 0 && Ri < this.R2) break;

		}//for (let i = 0; i < n; i++)
		this.n = i;

		let p_i = this.Data[this.n - 1].p;
		let dp1 = 0.5 * this.ro * this.sC0;
		let dp2 = 0.5 * this.ro * this.Vr0 * this.Vr0;

		this.dP0 = this.p0 - p_i;
		this.dP1 = this.p0 - p_i + dp1;
		this.dP2 = this.p0 - p_i + dp2;
		this.m = this.m;
		this.Mtr = this.Mtr;
		this.Rmax = Math.max(this.R1, this.R2);
		this.Cm_tr = 2 * this.Mtr / (this.ro * this.Rmax * this.Rmax * this.Rmax * this.U0 * this.U0 / 2);

	}
}


//----------end----------------------

