
//________________________________
// AirRotationSlot::Factory.js
// 2025-04-18
//

const TypesToStudy = [
    { idtype: 0, name: "< UnSelected >" },
    { idtype: 1, name: "AirSlot" },
    { idtype: 2, name: "RotationSlot" },
    { idtype: 3, name: "TurbinDisk" },
    { idtype: 4, name: "VortexChamber" }
]


class Factory {

    static CreateObject(idTypeToStudy, initdata) {

        switch (idTypeToStudy)
        {
            default: return null;
            case 1:
                return new Slot(initdata);
                break;
            case 2:
                return new RotationSlot(initdata);
                break;
            case 3:
                return new TurbinDisk(initdata);
                break;
            case 4:
                return new VortexChamber(initdata);
                break;                
        }
    }
    static CreateObjectInput(idTypeToStudy, name) {

        switch (idTypeToStudy) {
            default: return null;
            case 1:
                return new SlotInput(name);
                break;
            case 2:
                return new RotationSlotInput(name);
                break;
            case 3:
                return new TurbinDiskInput(name);
                break;
            case 4:
                return new VortexChamberInput(name);
                break;
        }
    }

    static CreateObjectCoreCalc(idTypeToStudy) {

        switch (idTypeToStudy) {
            default: return null;
            case 1:
                return new SlotData();
                break;
            case 2:
                return new RotationChamberData();
                break;
            case 3:
                return new TurbinDisk();
                break;
            case 4:
                return new VortexChamberData();
                break;
        }
    }
}
