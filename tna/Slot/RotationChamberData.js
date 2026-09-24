///----------------------------
/// RotationSlot::RotationChamberData
 // 2025-04-18   


class RotationChamberData
{
    constructor()
    {
        this.i = 0;
        this.l =0.0;
        this.l_ =0.0;
        this.R = 0.0;
        this.R_ =0.0;
        this.r_ =0.0;
        this.Be =0.0;
        this.Alfa =0.0;
        this.u =0.0;
        this.p =0.0;
        this.Cpr1 =0.0;
        this.Cpr2 =0.0;
        this.n0_ =0.0; // 
        this.dud =0.0;
        this.duw =0.0;
        this.Vr =0.0;
        this.Vz =0.0;
        this.TPIw =0.0;
        this.Ew =0.0;
        this.TPId =0.0;
        this.Ed =0.0;
        this.TDW =0.0;
        this.TDD =0.0;
        this.DW =0.0;
        this.DD =0.0;
        this.CfFrW =0.0;
        this.CfFrD =0.0;
        this.FrAlfaW =0.0;
        this.FrAlfaD =0.0;
        this.FruRadialW =0.0;
        this.FrvRadialW =0.0;
        this.FruRadialD =0.0;
        this.FrvRadialD =0.0;
        this.FrAxialW =0.0;
        this.FrAxialD = 0.0;
        this.w = 0.0; 
        this.Vc = 0.0; 
        this.cw = 0.0; 
        this.cd = 0.0; 
        this.Angle_C_U = 0.0; 
        this.Angle_C_V = 0.0; 
        this.FrRadialW = 0.0; 
        this.FrRadialD = 0.0; 
        this.n0 =0.0;
        this.Gdlt =0.0;
        this.LambdaX =0.0;
        this.Bt =0.0;
        this.BtX =0.0;
        this.ReuWall =0.0;
        this.ReWall =0.0;
        this.ReuDisk =0.0;
        this.ReDisk =0.0;
        this.dA =0.0; // 
        this.dMw =0.0;
        this.dMd =0.0;
        this.dU =0.0;
        this.dW =0.0;
        this.dWL =0.0;
        this.dWR =0.0;// 
        this.dPRU =0.0;
        this.dPRV =0.0;
        this.dPRT =0.0;
        this.dPZV =0.0;
        this.dPZT =0.0;
        this.dUR=0.0;
        this.dUA =0.0;
        this.dVR =0.0;
        this.dPR =0.0;
        this.dPZ = 0.0;

    }
    ToString()
    {
        return "RotationChamberData::ToString()";////"i=${this.i},R={this.R},A={this.Alfa},Cw={this.cw},Ew={this.Ew},TPIw={this.TPIw}";
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