
///////////////////////////////////////////////////////
// RotationSlot::RotationSlotInput
// 2025-10-11   

const TypesYesNo = [
    { idtype: 0, name: "No / Нет" },
    { idtype: 1, name: "Yes / Да" }
]
const TypesPPS = [
    { idtype: 0, name: "< UnSelected >" },
    { idtype: 1, name: "Линейный Куэтта" },
    { idtype: 2, name: "Ламинарный степенной" },
    { idtype: 3, name: "Ламинарный градиентный" },
    { idtype: 4, name: "Турбулентный степенной" },
    { idtype: 5, name: "Турбулентный градиентный" },
]

const TypesAngularSpeedCalculations = [
    { idtype: 0, name: "Расчет уголовой скорости ядра потока" },
    { idtype: 1, name: "Постоянная уголовая скорость ядра потока" }
]
class RotationSlotInput
{
    constructor(_name)
    {
        this.ID = -1;
        this.name = _name;
        this.mergedPPS = 1;
        this.IsCumberFlow = 1;//Учитывать вытеснение в пограничных слоях
        this.AngularSpeedCalculationsType = 0;  
        this.FlowType = 1; // вязкое

        this.BtV0 = 0.426;
        this.Nradius = 400;
        this.Ncircle = 400;

        //------------------------------------
        // ВОДА эксперимент

        // Карминский В.Д., Техническая термодинамика и теплопередача М,2005.djvu
        this.ro = 998.23;// при t = 20C
        this.mu = 0.001004;// при t = 20C            

        this.n01 = 0.001;
        this.n02 = 0.001;

        this.R1 = 0.03;
        this.R2 = 0.005;

        this.m = 0.757;
        this.P1 = 1e6;
        this.Wd = 733;
        this.Ww = 0;
        this.Bt1 = 0.1;// ????????????????????????????????????????????
        this.Z = 0;// 0.02;
        this.TypesPPS = 4;

        this.ComboboxValues = [
            {name:"TypesPPS", defval:4, values:TypesPPS},
            {name:"IsCumberFlow", defval:1, values:TypesYesNo},
            {name:"mergedPPS", defval:1, values:TypesYesNo},
            {name:"AngularSpeedCalculationsType", defval:this.AngularSpeedCalculationsType, values:TypesAngularSpeedCalculations},
        ];
    }
}
