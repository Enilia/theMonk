var isOpoOpoForm = AuraCount(self, "OpoOpoForm", self) || AuraCount(self, "PerfectBalance", self);
var isRaptorForm = AuraCount(self, "RaptorForm", self) || AuraCount(self, "PerfectBalance", self);
var isCoeurlForm = AuraCount(self, "CoeurlForm", self) || AuraCount(self, "PerfectBalance", self);

if(AuraCount(self, "GreasedLigthning", self) < 3) {
	if(!AuraCount(self, "PerfectBalance", self) && IsReady("PerfectBalance"))
		return "PerfectBalance";
}

if(IsOffGCD() && AuraCount(self, "GreasedLigthning", self) === 3) {

	if(IsReady("InternalRelease") && AuraTimeRemaining(target, "DemolishDOT", self) < 15)
		return "InternalRelease";

	if(IsReady("BloodForBlood"))
		return "BloodForBlood";

	if(IsReady("SteelPeak"))
		return "SteelPeak";

	if(IsReady("HowlingFist"))
		return "HowlingFist";

}

if(AuraCount(self, "PerfectBalance", self))
	if(AuraCount(self, "GreasedLigthning", self) < 3)
		return "SnapPunchFlank";
	else
		if(AuraTimeRemaining(self, "TwinSnakes", self) < 4)
			return "TwinSnakesFlank";
		else 
			if(AuraTimeRemaining(target, "DemolishDOT", self) < 4)
				return "DemolishRear";
			else 
				return "SnapPunchFlank";


if(!AuraCount(target, "TouchOfDeathDOT", self)
	&& (AuraCount(self, "BloodForBlood", self) || AuraCount(self, "InternalRelease", self))
)
	return "TouchOfDeath";

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

if(isOpoOpoForm)
	if(AuraTimeRemaining(target, "DragonKick", self) < 4)
		return "DragonKickFlank";
	else
		return "BootshineRear";

return "Bootshine";