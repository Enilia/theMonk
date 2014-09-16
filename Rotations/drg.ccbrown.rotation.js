if (IsOffGCD()) {
	
	if (IsReady("InternalRelease"))
		return "InternalRelease";
		
	if (GCD() < 2.4) {
		if (IsReady("BloodForBlood") && (IsReady("ChaosThrust") || IsReady("FullThrust")))
			return "BloodForBlood";
	} else {
		if (IsReady("BloodForBlood") && !(IsReady("FullThrust") && AuraTimeRemaining(target, "ChaosThrustDOT", self) < 15))
			return "BloodForBlood";
	}
		
	if (IsReady("LifeSurge") && IsReady("FullThrust") && AuraTimeRemaining(self, "BloodForBlood", self) > 0.5)
		return "LifeSurge";
	
	if (IsReady("PowerSurge") && AuraTimeRemaining(self, "BloodForBlood", self) > GCD()) {
		if (CooldownRemaining("Jump") < AuraTimeRemaining(self, "BloodForBlood", self) - 2.0)
			return "PowerSurge";
	}
		
	if (IsReady("Jump") && !(IsReady("PowerSurge") && IsReady("BloodForBlood")))
		return "Jump";
	
	if (IsReady("LegSweep"))
		return "LegSweep";
		
	if (IsReady("SpineshatterDive"))
		return "SpineshatterDive";
		
	if (IsReady("DragonfireDive"))
		return "DragonfireDive";
}

if (IsReady("ChaosThrust"))
	return "ChaosThrust";
	
if (IsReady("Disembowel"))
	return "Disembowel";
	
if (IsReady("FullThrust"))
	return "FullThrust";
	
if (IsReady("VorpalThrust"))
	return "VorpalThrust";

if (AuraTimeRemaining(self, "HeavyThrust", self) < 3.0 * GCD())
	return "HeavyThrust";

if (AuraTimeRemaining(target, "ChaosThrustDOT", self) < 3.0 * GCD())
	return "ImpulseDrive";

if (AuraTimeRemaining(target, "PhlebotomizeDOT", self) < 5.0)
	return "Phlebotomize";

return "TrueThrust";
