
if(IsOffGCD()) {
	if(IsReady("FullThrust") && IsReady("LifeSurge"))
		return "LifeSurge";

	if(IsReady("InternalRelease"))
		return "InternalRelease";

	if(IsReady("BloodForBlood"))
		return "BloodForBlood";

	if(AuraTimeRemaining(target, "Disembowel", self)) {
		if(IsReady("LegSweep"))
			return "LegSweep";
		
		if(IsReady("PowerSurge"))
			if(IsReady("Jump") || IsReady("SpineshatterDive"))
				return "PowerSurge";

		if(IsReady("Jump"))
			return "Jump";
		if(IsReady("SpineshatterDive"))
			return "SpineshatterDive";
		if(IsReady("DragonfireDive"))
			return "DragonfireDive";
	}
}

if(IsReady("VorpalThrust")) {
	return "VorpalThrust";
}

if(IsReady("FullThrust")) {
	return "FullThrust";
}

if(IsReady("Disembowel")) {
	return "Disembowel";
}

if(IsReady("ChaosThrust")) {
	return "ChaosThrust";
}

if(AuraTimeRemaining(self, "HeavyThrust", self) < 4)
	return "HeavyThrust";

if(AuraTimeRemaining(target, "ChaosThrustDOT", self) < GCD() * 3)
	return "ImpulseDrive";

if(AuraTimeRemaining(target, "PhlebotomizeDOT", self) < 4)
	return "Phlebotomize";

return "TrueThrust";