var isOpoOpoForm = AuraCount(self, "OpoOpoForm", self) || AuraCount(self, "PerfectBalance", self);
var isRaptorForm = AuraCount(self, "RaptorForm", self) || AuraCount(self, "PerfectBalance", self);
var isCoeurlForm = AuraCount(self, "CoeurlForm", self) || AuraCount(self, "PerfectBalance", self);

if(!AuraCount(target, "TouchOfDeathDOT", self))
	return "TouchOfDeath";

if(IsOffGCD()) {

	if(IsReady("InternalRelease"))
		return "InternalRelease";

	if(IsReady("BloodForBlood"))
		return "BloodForBlood";

	if(IsReady("SteelPeak"))
		return "SteelPeak";

	if(IsReady("HowlingFist"))
		return "HowlingFist";

}

if(isOpoOpoForm)
	if(AuraTimeRemaining(target, "DragonKick", self) < 4)
		return "DragonKickFlank";
	else
		return "BootshineRear";

if(isRaptorForm)
	if(AuraTimeRemaining(self, "TwinSnakes", self) < 4)
		return "TwinSnakesFlank";
	else
		return "TrueStrikeRear";

if(isCoeurlForm) {
	if(AuraTimeRemaining(target, "DemolishDOT", self) < 4)
		return "DemolishRear";
	else
		return "SnapPunchFlank";
}

return "Bootshine";