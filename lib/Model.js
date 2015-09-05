
exports = module.exports = Model;

function Model() {
	var skills = this.skills,
		skillName,
		skill;

	this.skills = {};

	for(skillName in skills) {
		skill = new skills[skillName];

		if(skill.auras) {
			skill.auras = skill.auras.slice()
									 .map(function(auraName) {
			 	var aura = this.auras[auraName],
			 		auraInfos = {},
			 		info;

		 		for(info in aura.prototype) {
		 			if(aura.prototype.hasOwnProperty(info)) {
		 				auraInfos[info] = aura.prototype[info];
		 			}
		 		}
		 		
				return auraInfos;
			}, this);
		}

		this.skills[skillName] = skill;
	}
}