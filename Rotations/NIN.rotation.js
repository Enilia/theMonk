var hutonTimeRemaining = AuraTimeRemaining(self, "Huton", self),
	hasSuiton = AuraCount(self, "Suiton", self);

if(AuraCount(self, "Mudra", self)) {
	return "Ninjutsu";
}

if(IsOffGCD()) {

	if(IsReady("BloodForBlood"))
		return "BloodForBlood";

	if(IsReady("InternalRelease"))
		return "InternalRelease";

	if(IsReady("Kassatsu") && AuraTimeRemaining(target, "TrickAttack", self))
		return "Kassatsu";

// }

if(CooldownRemaining("Ninjutsu") < 1 && AuraTimeRemaining(target, "DancingEdge", self)) {
	if(hutonTimeRemaining < 20)
		return "Huton";
	else if(IsReady("TrickAttack"))
		return "Suiton";
	else
		return "Raiton";
}

// if(IsOffGCD()) {

	if(hasSuiton && IsReady("TrickAttack")) 
		return "TrickAttack";

	if(IsReady("Mug"))
		return "Mug";

	if(IsReady("Jugulate"))
		return "Jugulate";

}

if(IsReady("ShadowFang") && AuraTimeRemaining(target, "ShadowFangDOT", self) < 9
					     && AuraTimeRemaining(target, "DancingEdge", self))
	return "ShadowFang";

if(IsReady("GustSlash"))
	return "GustSlash";

if(IsReady("DancingEdge") && AuraTimeRemaining(target, "DancingEdge", self) < 9)
	return "DancingEdge";

if(IsReady("AeolianEdge"))
	return "AeolianEdge";

if(IsReady("Mutilate") && AuraTimeRemaining(target, "MutilateDOT", self) < 9
					   && AuraTimeRemaining(target, "ShadowFangDOT", self))
	return "Mutilate";


return "SpinningEdge";