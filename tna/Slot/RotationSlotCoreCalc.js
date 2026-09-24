// -----------------------------------------------------------
// RotationSlotCoreCalc.js
// 2025-09-24

//import { RotationSlotInput } from "./RotationSlotInput.js";
//import { RotationSlotOutput } from "./RotationSlotOutput.js";
//import { BoundryLayer } from "./BoundryLayer.js";
//import { RotationChamberData } from "./RotationChamberData.js";

class RotationSlot extends RootObject {
    constructor(_input) {
        super();

        this.input = _input; 
        this.output = new RotationSlotOutput();

        this.g_iparams = null;// UI input 
        this.outparams = null;// UI output table


        this.name = _input.name;
        this.dR = 0.0;
        this.dZ = 0.0;
        this.dL = 0.0;
        this.dAlfa = 0.0;
        this.m_F1 = 0.0; 
        this.m_Rmax = 0;
        this.m_dn0 = 0.0;
        this.m_Pwd = 0.0;
        this.AngularSpeedCalculationsType = 0; 
        this.m_tppsWall = null;
        this.m_tppsDisk = null;
        this.Data = null;
        this.Errors = [];
        this.LastError = "";
        this.indexError = 0;
        this.i_max = -1;
    }
    //_______________________________________________________________________________________
    GetCoreData() {
        return this.Data;
    }
    Calculate() {

        this.ResetError();

        this.Data = [];

        let i = 0;
        for (i = 0; i < this.Nradius; i++) {
            this.Data[i] = new RotationChamberData();
        }

        //_______________________________________________
        // ----initialization ---------------------------
        this.mergedPPS = this.input.mergedPPS;
        this.IsCumberFlow = this.input.IsCumberFlow;
        this.AngularSpeedCalculationsType = this.input.AngularSpeedCalculationsType;
        this.FlowType = this.input.FlowType; 
        this.BtV0 = this.input.BtV0;
        this.Nradius = this.input.Nradius;
        this.Ncircle = this.input.Ncircle;
        this.ro = this.input.ro;
        this.mu = this.input.mu;
        this.n01 = this.input.n01;
        this.n02 = this.input.n02;
        this.R1 = this.input.R1;
        this.R2 = this.input.R2;
        this.m = this.input.m;
        this.P1 = this.input.P1;
        this.Wd = this.input.Wd;
        this.Ww = this.input.Ww;
        this.Bt1 = this.input.Bt1;
        this.Z = this.input.Z;
        this.TypesPPS = this.input.TypesPPS;

        //this.m_tppsWall = new BoundryLayer(1, 7);
        //this.m_tppsDisk = new BoundryLayer(1, 7);
        switch (this.TypesPPS)
        {
            default: return null;
            case 1://"Линейный Куэтта"
                this.m_tppsWall=new BoundryLayer(3, 1);
                break;
            case 2://"Ламинарный степенной"
                this.m_tppsWall = new BoundryLayer(1, 2);
                break;
            case 3://"Ламинарный градиентный" 
                this.m_tppsWall = new BoundryLayer(2, 2);
                break;
            case 4://"Турбулентный степенной"
                this.m_tppsWall = new BoundryLayer(1, 7);
                break;
            case 5://"Турбулентный градиентный"
                this.m_tppsWall = new BoundryLayer(2, 7);
                break;
        }
        this.m_tppsDisk = this.m_tppsWall;

        //-------------------------------------------------------------------
        this.A = 0;
        this.Mw = 0;
        this.Md = 0;
        this.Nmd = 0;
        this.Nmw = 0;
        this.Re_d = 0;
        this.ReuDisk = 0;
        this.ReuWall = 0;
        this.ReWall = 0;
        this.ReDisk = 0;
        this.Be = 0;
        this.Re_d = 0;
        this.Cw = 0;
        this.ReuWall = 0;
        this.ReWall = 0;
        this.ReuDisk = 0;
        this.ReDisk = 0;
        this.Bt_mid = 0;
        this.Bt_mid = 0;
        this.dP = 0;
        this.P2 = 0;
        this.W2 = 0;
        this.Vr2 = 0;
        this.U2 = 0;
        this.CMd = 0;
        this.CMw = 0;
        this.CP = 0;
        this.Gdlt_mid = 0;
        //-------------------------------------------------------------------

        this.nu = this.mu / this.ro;

        this.m_Rmax = Math.max(this.R2, this.R1);

        this.toCenter = this.R1 < this.R2 ? 1 : -1;
        this.V = this.m / this.ro;
        this.m_F1 = 2 * Math.PI * this.R1 * this.n01;
        this.toCenter = this.R1 < this.R2 ? 1 : -1;
        this.Vr1 = this.toCenter * this.V / this.m_F1;

        this.u1 = this.R1 * this.Bt1 * this.Wd;
        this.W1 = this.u1 / this.R1;
        this.G = this.n01 / this.m_Rmax;
        this.Re_d = this.ro * this.Wd * this.m_Rmax * this.m_Rmax / this.mu;
        this.Cw = this.m / (this.mu * this.m_Rmax);
        this.LambdaTurb = this.Cw / Math.pow(this.Re_d, 4.0 / 5.0);
        this.m_Pwd = 0.5 * this.ro * this.m_Rmax * this.m_Rmax * this.Wd * this.Wd;

        this.Lsplit = Math.sqrt((this.R2 - this.R1) * (this.R2 - this.R1) + (this.Z) * (this.Z));
        this.drl = Math.abs(this.R2 - this.R1) / this.Lsplit;

        this.Be = Math.acos(this.drl);

        this.m_dn0 = (this.n02 - this.n01) / this.Nradius;

        this.dR = (this.R2 - this.R1) / this.Nradius;
        this.dZ = this.Z / this.Nradius;
        this.dL = this.Lsplit / this.Nradius;



        this.Data[0] = new RotationChamberData();
        this.Data[0].n0 = this.n01;
        this.Data[0].R = this.R1;
        this.Data[0].u = this.u1;
        this.Data[0].p = this.P1;
        this.Data[0].n0_ = this.Data[0].n0;
        this.Data[0].l = 0.0;
        //this.Data[0].Vc = VolumeVelocity(this.V, this.Data[0].n0, this.Data[0].R, this.Be);
        this.CalcVolumeSpeed(this.Data[0]);


        ///------CORE CALC -----------------------------


        var dot = this.Data;
        for (i = 0; i < this.Nradius; i++) {
            let resAnyNaN = null;

            this.OnCompleteCalculation(Math.round(i * 1.0 / this.Nradius, 2));

            dot[i].i = i;
            dot[i].l = this.dL * i;
            dot[i].n0 = this.n01 + this.m_dn0 * i;
            dot[i].n0_ = dot[i].n0;
            dot[i].R = this.R(dot[i].l);
            dot[i].l_ = dot[i].l / this.Lsplit;
            dot[i].r_ = (dot[i].R - this.R1) / (this.R2 - this.R1);
            dot[i].R_ = dot[i].R / this.m_Rmax;
            dot[i].LambdaX = this.CalcLambdaX(dot[i].R, this.m_Rmax);
            dot[i].Bt = dot[i].w / this.Wd;
            dot[i].BtX = this.CalcBtX(dot[i].w);

            this.CalcVolumeSpeed(dot[i]);

            dot[i].w = dot[i].u / dot[i].R;
            dot[i].Vc = MyMath.LengthVector(dot[i].Vr, dot[i].Vz);
            dot[i].cw = MyMath.LengthVector(dot[i].duw, dot[i].Vc);
            dot[i].cd = MyMath.LengthVector(dot[i].dud, dot[i].Vc);
            //dot[i].Angle_C_U = Math.acos(dot[i].u / dot[i].cw);
            //dot[i].Angle_C_V = Math.acos(dot[i].Vr / dot[i].cw) * (dot[i].u < 0 ? -1 : 1); 


            resAnyNaN = Checks.AnyNaN(dot[i]);
            if (resAnyNaN != null) {
                this.FireCalcError("RotationSlot::Calculate{1}", resAnyNaN);
                this.i_max = i;
                return false;
            }

            if (this.FlowType == 1) {
                var ok = this.CalcFrictions(dot[i]);
                if (!ok) { this.FireCalcError("RotationSlot::Calculate","CalcFrictions is FAILED",false); return false; }

                if (this.IsCumberFlow == 1) {
                    dot[i].n0_ = dot[i].n0 - (dot[i].TDW + dot[i].TDD);

                    if (dot[i].n0_ <= 0) {
                        this.FireCalcError("RotationSlot::Calculate", "Нормальный зазор n0 <= 0 при R = " + dot[i].R + ", l = " + dot[i].l + " !", false);
                        return false;
                    }
                    this.CalcVolumeSpeed(dot[i]);
                }
            }
            if (i == 0)
                this.Cvr0 = dot[i].R * dot[i].Vr; // константа радиальной скорости, см. монография, стр.140

            dot[i].Gdlt = (dot[i].DW + dot[i].DD) / dot[i].n0;
            this.Gdlt_mid += dot[i].Gdlt / this.Nradius;

            if (this.FlowType == 1) {
                dot[i].dWL = (dot[i].FrAlfaW - dot[i].FrAlfaD) /
                    (this.ro * dot[i].Vr * dot[i].n0_ * (dot[i].R + 0.5 * dot[i].n0_ * Math.sin(this.Be))
                    );
            }
            // Вестник САА, 2001.pdf
            dot[i].dWR = -dot[i].w * (1 / dot[i].R + 1 / (dot[i].R + 0.5 * dot[i].n0_ * Math.sin(this.Be)));
            dot[i].dW = dot[i].dWL * this.dL * (this.dR > 0 ? 1 : -1) + dot[i].dWR * this.dR;

            if (this.AngularSpeedCalculationsType == 1)
            {
                dot[i].dW = 0;
            }

            dot[i].dU = dot[i].w * this.dR + dot[i].R * dot[i].dW;
            dot[i].dUR = dot[i].dU / this.dR;
            dot[i].dUA = 0;

            //this.ThrowIf(!this.IsValid(dot[i].dW), "dot[i].dW is NAN");
            //this.ThrowIf(!this.IsValid(dot[i].dU), "dot[i].dW is NAN");

            //this.ThrowIf(!this.IsValid(dot[i].FrRadialD), "dot[i].FrRadialD is NAN");
            //this.ThrowIf(!this.IsValid(dot[i].FrRadialW), "dot[i].FrRadialW is NAN");
            //this.ThrowIf(!this.IsValid(dot[i].FrAxialD), "dot[i].FrAxialD is NAN");
            //this.ThrowIf(!this.IsValid(dot[i].FrAxialW), "dot[i].FrAxialW is NAN");
            resAnyNaN = Checks.AnyNaN(dot[i]);
            if (resAnyNaN != null) {
                this.FireCalcError("RotationSlot::Calculate{2}", resAnyNaN);
                this.i_max = i;
                return false;
            }

            dot[i].dPRT = 0;
            dot[i].dPZT = 0;

            if (this.FlowType == 1) {
                dot[i].dPRT = (dot[i].FrRadialD - dot[i].FrRadialW) / dot[i].n0_;
                dot[i].dPZT = (dot[i].FrAxialD - dot[i].FrAxialW) / dot[i].n0_;
            }
            else {
                dot[i].dPRT = 0;
                dot[i].dPZT = 0;
            }

            dot[i].dPRU = this.ro * dot[i].w * dot[i].w / dot[i].R *
                (
                    dot[i].R * dot[i].R
                    + dot[i].R * dot[i].n0_ * Math.sin(this.Be)
                    + dot[i].n0_ * dot[i].n0_ * Math.sin(this.Be) * Math.sin(this.Be) / 3
                );
            dot[i].dPRV = this.ro * dot[i].Vr * dot[i].Vr * Math.cos(this.Be) * Math.cos(this.Be) * 2 / (2 * dot[i].R + dot[i].n0_ * Math.sin(this.Be));
            dot[i].dPZV = this.ro * dot[i].Vz * dot[i].Vz * Math.sin(this.Be) * Math.sin(this.Be) / dot[i].R;


            //this.ThrowIf(!this.IsValid(dot[i].dPRU), "dot[i].dPRU is NAN");
            //this.ThrowIf(!this.IsValid(dot[i].dPRV), "dot[i].dPRV is NAN");
            //this.ThrowIf(!this.IsValid(dot[i].dPRT), "dot[i].dPRT is NAN");
            //this.ThrowIf(!this.IsValid(dot[i].dPZV), "dot[i].dPZV is NAN");
            //this.ThrowIf(!this.IsValid(dot[i].dPZT), "dot[i].dPZT is NAN");

            resAnyNaN = Checks.AnyNaN(dot[i]);
            if (resAnyNaN != null) {
                this.FireCalcError("RotationSlot::Calculate{3}", resAnyNaN);
                this.i_max = i;
                return false;
            }

            dot[i].dPR = dot[i].dPRU + dot[i].dPRV + dot[i].dPRT;
            dot[i].dPZ = dot[i].dPZV + dot[i].dPZT;
            dot[i].dA = Math.abs(2 * Math.PI * dot[i].R * this.dR * dot[i].p);
            dot[i].dMw = dot[i].FrAlfaW * 2 * Math.PI * dot[i].R * dot[i].R * Math.abs(this.dR);
            dot[i].dMd = dot[i].FrAlfaD * 2 * Math.PI * dot[i].R * dot[i].R * Math.abs(this.dR);
            dot[i].ReuWall = Math.abs(dot[i].duw) * dot[i].R / this.nu;
            dot[i].ReWall = dot[i].cw * dot[i].R / this.nu;
            dot[i].ReuDisk = Math.abs(dot[i].dud) * dot[i].R / this.nu;
            dot[i].ReDisk = dot[i].cd * dot[i].R / this.nu;

            this.Mw = this.Mw + dot[i].dMw;
            this.Md = this.Md + dot[i].dMd;
            this.Nmw = this.Nmw + dot[i].dMw * this.Ww;
            this.Nmd = this.Nmd + dot[i].dMd * this.Wd;
            this.A = this.A + dot[i].dA;

            if (i < this.Nradius - 1) {
                if (this.Data[i + 1] == null)
                    this.Data[i + 1] = new RotationChamberData();
                this.Data[i + 1].u = this.Data[i].u + this.Data[i].dU;
                this.Data[i + 1].p = this.Data[i].p + (this.Data[i].dPR) * this.dR + (this.Data[i].dPZ) * this.dZ;
            }

            resAnyNaN = Checks.AnyNaN(dot[i]);
            if (resAnyNaN != null) {
                this.FireCalcError("RotationSlot::Calculate{4}", resAnyNaN);
                this.i_max = i;
                return false;
            }
        }//for i

        this.i_max = i;
        ///------RES CALC -----------------------------
        this.CalcFinalResults();

        return true;
    }
    //_______________________________________________________________________________________
    CalcBtX(w) {
        return w / (this.Wd * this.BtV0);
    }
    //_______________________________________________________________________________________
    ThrowIf(doThrow, mes) {
        if (doThrow)
            throw new Error(mes);
    }
    //_______________________________________________________________________________________
    OnCompleteCalculation(percent) {

    }
    //_______________________________________________________________________________________
    R(_l) {
        let tmp;

        if (this.R1 > this.R2) tmp = this.R1 - _l * Math.cos(this.Be);
        else
            tmp = this.R1 + _l * Math.cos(this.Be);

        this.ThrowIf(tmp <= 0, "R >>> Ri <= 0!");

        return tmp;
    }

    //_______________________________________________________________________________________
    VolumeVelocity(_V, _n, _r, _Betta) {
        let f = Math.PI * _n * (2 * _r + _n * Math.sin(_Betta));
        return _V * (this.dR > 0 ? 1 : -1) / f;
    }
    //_______________________________________________________________________________________
    CalcVolumeSpeed(dot) {
        var _Vc = this.VolumeVelocity(this.V, dot.n0_, dot.R, this.Be);
        dot.Vr = _Vc * Math.cos(this.Be);
        dot.Vz = _Vc * Math.sin(this.Be);
        return true;
    }
    //_______________________________________________________________________________________
    CalcLambdaX(r, Rmax) {
        return this.LambdaTurb * Math.pow(r / Rmax, -13.0 / 5.0);
    }

    //_______________________________________________________________________________________
    CalcFinalResults() {

        this.ThrowIf(this.Data == null, "this.Data= NULL");

        this.ReuWall = 0;
        this.ReWall = 0;
        this.ReuDisk = 0;
        this.ReDisk = 0;
        this.Bt_mid = 0;
        var dot0 = this.Data[0];
        var dotF = this.Data[this.Nradius - 1];
        let i = 0;
        for (i = 0; i < this.Nradius; i++) {
            var dot = this.Data[i];
            this.ReuWall += dot.ReuWall;
            this.ReWall += dot.ReWall;

            this.ReuDisk += dot.ReuDisk;
            this.ReDisk += dot.ReDisk;

            this.Bt_mid += dot.Bt;

            dot.Cpr1 = (dot.p - dot0.p) / this.m_Pwd;
            dot.Cpr2 = (dot.p - dotF.p) / this.m_Pwd;
        }
        this.ReuWall = this.ReuWall / this.Nradius;
        this.ReWall = this.ReWall / this.Nradius;
        this.ReuDisk = this.ReuDisk / this.Nradius;
        this.ReDisk = this.ReDisk / this.Nradius;

        this.Bt_mid = this.Bt_mid / this.Nradius;

        this.Bt2 = dotF.BtX;

        this.dP = dotF.p - this.P1;
        this.P2 = dotF.p;
        this.W2 = dotF.w;
        this.Vr2 = dotF.Vr;
        this.U2 = dotF.u;

        if (this.Wd > 0)
            this.CMd = 4 * this.Md / (this.ro * this.Wd * this.Wd * Math.pow(this.m_Rmax, 5));
        if (this.Ww > 0)
            this.CMw = 4 * this.Mw / (this.ro * this.Ww * this.Ww * Math.pow(this.m_Rmax, 5));

        this.CP = (this.P2 - this.P1) / this.m_Pwd;

        if (this.output == null)
            this.output = new RotationSlotOutput();

        this.output.A = this.A;
        this.output.Mw = this.Mw;
        this.output.Md = this.Md;
        this.output.Nmd = this.Nmd;
        this.output.Nmw = this.Nmw;
        this.output.Re_d = this.Re_d;
        this.output.ReuDisk = this.ReuDisk;
        this.output.ReuWall = this.ReuWall;
        this.output.ReWall = this.ReWall;
        this.output.ReDisk = this.ReDisk;
        this.output.Be = this.Be;
        this.output.Re_d = this.Re_d;
        this.output.Cw = this.Cw;
        this.output.LambdaTurb = this.LambdaTurb;
        this.output.Lsplit = this.Lsplit;
        this.output.ReuWall = this.ReuWall;
        this.output.ReWall = this.ReWall;
        this.output.ReuDisk = this.ReuDisk;
        this.output.ReDisk = this.ReDisk;
        this.output.Bt_mid = this.Bt_mid;
        this.output.dP = this.dP;
        this.output.P2 = this.P2;
        this.output.W2 = this.W2;
        this.output.Vr2 = this.Vr2;
        this.output.U2 = this.U2;
        this.output.CMd = this.CMd;
        this.output.CMw = this.CMw;
        this.output.CP = this.CP;
        this.output.Gdlt_mid = this.Gdlt_mid;
        return true;
    }

    //IsValid(val) {
    //    return typeof val === 'number' && Number.isFinite(val) && !Number.isNaN(val);
    //}
    IsValid(val) {
        return typeof val === 'number' && Number.isFinite(val) && !Number.isNaN(val) && val != undefined && val != null;
    }


    CalcTPI(dt, tppsWall, tppsDisk) {
        if (dt == null) { this.FireCalcError("RotationSlot::CalcTPI", "dt is INVALID! ", false); return false; };
        if (tppsWall == null) { this.FireCalcError("RotationSlot::CalcTPI", "tppsWall is INVALID! ", false); return false; };
        if (tppsDisk == null) { this.FireCalcError("RotationSlot::CalcTPI", "tppsDisk is INVALID! ", false); return false; };

        if (dt.R <= 0) { this.FireCalcError("RotationSlot::CalcTPI", "R <= 0!", false); return false; }

        if (!this.IsValid(dt.w)) { this.FireCalcError("RotationSlot::CalcTPI", "СТОП: d_ij.w = NaN :: "+ dt, false); return false; }

        //относительная скорость на стенке
        dt.duw = (this.Ww - dt.w) * (dt.R + dt.n0 * Math.sin(this.Be));
        //относительная скорость на диске
        dt.dud = (this.Wd - dt.w) * dt.R;
        dt.ReuWall = Math.abs(dt.duw) * dt.R / this.nu;
        dt.ReWall = dt.cw * dt.R / this.nu;
        dt.ReuDisk = Math.abs(dt.dud) * dt.R / this.nu;
        dt.ReDisk = dt.cd * dt.R / this.nu;

        var kw = dt.duw > 0 ? tppsWall.E : tppsWall.OMEGA;// для диска:для стенки
        var kd = dt.dud > 0 ? tppsDisk.E : tppsDisk.OMEGA;// для диска:для стенки

        let TPIuW = 0, TPIuD = 0, TPIv = 0;

        TPIuW = kw * Math.pow((Math.abs(dt.duw) / this.nu), (-0.2)) * Math.pow(dt.R, (0.8));
        TPIuD = kd * Math.pow((Math.abs(dt.dud) / this.nu), (-0.2)) * Math.pow(dt.R, (0.8));
        TPIv = 0.036 * Math.pow((Math.abs(dt.Vc) / this.nu), (-0.2)) * Math.pow(Math.abs(dt.l), (0.8));
        var qw = dt.duw * dt.duw + dt.Vc * dt.Vc;
        var qd = dt.dud * dt.dud + dt.Vc * dt.Vc;

        dt.TPIw = TPIuW * dt.duw * dt.duw / qw + TPIv * dt.Vc * dt.Vc / qw;
        dt.TPId = TPIuD * dt.dud * dt.dud / qd + TPIv * dt.Vc * dt.Vc / qd;

        dt.TDW = tppsWall.H * dt.TPIw;
        dt.TDD = tppsDisk.H * dt.TPId;

        dt.DW = dt.TPIw * tppsWall.N;
        dt.DD = dt.TPId * tppsDisk.N;

        let resAnyNaN = Checks.AnyNaN(dt);
        if (resAnyNaN != null) {
            this.FireCalcError("RotationSlot::CalcTPI", resAnyNaN);
            this.i_max = i;
            return false;
        }

        //условие вытиснения сливщ. погран.слоев (вставка см. выше)
        if (this.mergedPPS * 1.0 == 1.0) {
            // учет по толщине ПС
            var n0x = dt.DD + dt.DW;
            if (n0x >= dt.n0) {
                var cd = dt.DD / dt.DW;
                dt.DW = dt.n0 / (cd + 1);
                dt.DD = dt.DW * cd;
                var tstD = dt.n0 - dt.DW;

                dt.TPIw = dt.DW / tppsWall.N;
                dt.TPId = dt.DD / tppsDisk.N;
                dt.TDD = dt.TPId * tppsDisk.H;
                dt.TDW = dt.TPIw * tppsWall.H;

            }
        }
        return true;
    }
    CalcFrictions(ij) {
        if (ij == null) { this.FireCalcError("ij == null", false); return false; }
        if (this.m_tppsWall == null) { this.FireCalcError("RotationSlot::CalcTPI", "m_tppsWall == null", false); return false; }
        if (this.m_tppsDisk == null) { this.FireCalcError("RotationSlot::CalcTPI", "m_tppsDisk == null", false); return false; }

        ij.FrAlfaW = 0;
        ij.FrAlfaD = 0;
        ij.FruRadialW = 0;
        ij.FruRadialD = 0;
        ij.FrvRadialW = 0;
        ij.FrvRadialD = 0;
        ij.FrAxialW = 0;
        ij.FrAxialD = 0;
        
        let ok = this.CalcTPI(ij, this.m_tppsWall, this.m_tppsDisk);
        if (!ok) return false;

        //this.ThrowIf(!this.IsValid(ij.ReWall), "ij.ReWall is NAN");
        //this.ThrowIf(!this.IsValid(ij.ReDisk), "ij.ReDisk is NAN");

        //this.ThrowIf(!this.IsValid(ij.FrAlfaW), "ij.FrAlfaW is NAN");
        //this.ThrowIf(!this.IsValid(ij.FrAlfaD), "ij.FrAlfaD is NAN");

        //this.ThrowIf(!this.IsValid(this.m_tppsWall.Ee), "tppsWall.Ee is NAN");
        //this.ThrowIf(!this.IsValid(this.m_tppsWall.Eg), "tppsWall.Eg is NAN");
        //this.ThrowIf(!this.IsValid(this.m_tppsDisk.Ee), "tppsDisk.Ee is NAN");
        //this.ThrowIf(!this.IsValid(this.m_tppsDisk.Eg), "tppsDisk.Eg is NAN");

        ij.FrAlfaW = this.Friction(this.m_tppsWall, ij.duw, ij.TPIw, ij.ReWall) * (ij.duw > 0 ? 1 : -1);/*знак проставлен*/
        ij.FrAlfaD = this.Friction(this.m_tppsDisk, ij.dud, ij.TPId, ij.ReDisk) * (ij.dud > 0 ? 1 : -1);/*знак проставлен*/

        ij.FruRadialW = Math.abs(ij.FrAlfaW) * (ij.duw > 0 ? this.m_tppsWall.Ee : this.m_tppsWall.Eomega);
        ij.FruRadialD = Math.abs(ij.FrAlfaD) * (ij.dud > 0 ? this.m_tppsDisk.Ee : this.m_tppsDisk.Eomega);

        ij.FrvRadialW = this.Friction(this.m_tppsWall, ij.Vr, ij.TPIw, ij.ReWall) * (this.dR > 0 ? -1 : 1); /*знак проставлен*/
        ij.FrvRadialD = this.Friction(this.m_tppsDisk, ij.Vr, ij.TPId, ij.ReDisk) * (this.dR > 0 ? -1 : 1); /*знак проставлен*/

        ij.FrRadialW = ij.FruRadialW + ij.FrvRadialW;
        ij.FrRadialD = ij.FruRadialD + ij.FrvRadialD; 

        //this.ThrowIf(!this.IsValid(ij.FruRadialW), "ij.FruRadialW is NAN");
        //this.ThrowIf(!this.IsValid(ij.FruRadialD), "ij.FruRadialD is NAN");
        //this.ThrowIf(!this.IsValid(ij.FrvRadialW), "ij.FrvRadialW is NAN");
        //this.ThrowIf(!this.IsValid(ij.FrvRadialD), "ij.FrvRadialD is NAN");

        //this.ThrowIf(!this.IsValid(ij.FrRadialD), "ij.FrRadialD is NAN");
        //this.ThrowIf(!this.IsValid(ij.FrRadialW), "ij.FrRadialW is NAN");
        //this.ThrowIf(!this.IsValid(ij.FrAxialD), "ij.FrAxialD is NAN");
        //this.ThrowIf(!this.IsValid(ij.FrAxialW), "ij.FrAxialW is NAN");

        let resAnyNaN = Checks.AnyNaN(ij);
        if (resAnyNaN != null) {
            this.FireCalcError("RotationSlot::CalcFrictions", resAnyNaN);
            this.i_max = i;
            return false;
        }

        if (ij.Vz == 0 || this.dZ == 0) {
            ij.FrAxialW = 0;
            ij.FrAxialD = 0;
        }
        else {
            //осевые напряжения трения на стенке
            ij.FrAxialW = this.Friction(m_tppsWall, ij.Vz, ij.TPIw, ij.ReWall) * (this.dZ > 0 ? -1 : 1);/*знак проставлен*/
            //осевые напряжения трения на диске
            ij.FrAxialD = this.Friction(m_tppsDisk, ij.Vz, ij.TPId, ij.ReDisk) * (this.dZ > 0 ? -1 : 1);/*знак проставлен*/
        }

        return true;
    }
    //------------------------------------------------------------------------------------------------------------------------------------------------
    Friction(tpps, _u, tpi, Re) {
        return this.Tr1(tpps, _u, this.nu, tpi, Re) * this.ro * _u * _u;
    }
    //------------------------------------------------------------------------------------------------------------------------------------------------
    Tr1(tpps, u, nu, TPI, Re) {

        if (Re > 1e4) {
            var TPS = tpps.N * TPI;// толщина погранслоя будет

            var v1 = Math.abs(u) * TPS / nu;
            var v2 = 0.0225 * Math.pow(v1, -0.25);
            return v2;//[Шлихтинг Г. Теория пограничного слоя. - М: Наука, 1969, стр.593 (1974,стр.542)]
        }//else TypeFlow.laminar:
        //return 0.267 * nu /( Math.abs(u) * TPI);// [?]
        return 0.332 * Math.sqrt(nu / (Math.abs(u) * TPI));//[Шлихтинг Г. Теория пограничного слоя. - М: Наука,1969, стр.132 (1974, стр.136)]
    }
    //------------------------------------------------------------------------------------------------------------------------------------------------
}


//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------
