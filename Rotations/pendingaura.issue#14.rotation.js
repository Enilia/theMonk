if(IsOffGCD()) {
	if(AuraTimeRemaining(target, "Disembowel", self)) {
		if(IsReady("LegSweep"))
			return "LegSweep";
	}
}

if(IsReady("Disembowel")) {
	return "Disembowel";
}

return "ImpulseDrive";