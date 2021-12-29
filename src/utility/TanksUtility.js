function validateTankRegister(tank) {
    let errorMessage = null;

    if(!tank.tankId.replace(" ", "") 
       || !tank.WtrLvlMin 
       || !tank.WtrLvlMax 
       || !tank.OxygenPercentageMin
       || !tank.OxygenPercentageMax
       || !tank.PhMin
       || !tank.PhMax) {
        errorMessage = "Error: All fields must be filled";
    }
    else if(parseFloat(tank.WtrLvlMin) > parseFloat(tank.WtrLvlMax)) {
        errorMessage = "Error: Water Level Min Value cannot be greater than Max Value";
    } //if minimum value is grater than max value
    else if(parseFloat(tank.OxygenPercentageMin) > parseFloat(tank.OxygenPercentageMax)) {
        errorMessage = "Error: Oxygen Percentage Min Value cannot be greater than Max Value";
    }
    else if(parseFloat(tank.PhMin) > parseFloat(tank.PhMax)) {
        errorMessage = "Error: PH Min Value cannot be greater than Max Value";
    }

    return errorMessage;
}
/*
 tankId: "",
        WtrLvlMin: null,
        WtrLvlMax: null,
        OxygenPercentageMin: null,
        OxygenPercentageMax: null,
        PhMin: null,
        PhMax: null
*/

export {
    validateTankRegister
};