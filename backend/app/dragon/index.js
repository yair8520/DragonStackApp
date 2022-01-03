const TRAITS = require("../../data/traits.json");

const DEFUALT_PROPERTIES = {
  nickname: "unNamed",
  generationId: undefined,
  dragonId: undefined,
  isPublic: false,
  saleValue: 0,
  sireValue: 0,
  get birthDate() {
    return new Date();
  },

  get randomTraites() {
    const traits = [];
    TRAITS.forEach((TRAIT) => {
      const traitType = TRAIT.type;
      const traitValues = TRAIT.values;
      const traitValue =
        traitValues[Math.floor(Math.random() * traitValues.length)];
      traits.push({ traitType, traitValue });
    });
    return traits;
  },
};

class Dragon {
  //if new with () then we set a defualt object {}
  constructor({
    dragonId,
    birthDate,
    nickname,
    traits,
    generationId,
    isPublic,
    saleValue,
    sireValue,
  } = {}) {
    this.dragonId = dragonId || DEFUALT_PROPERTIES.dragonId;
    this.birthDate = birthDate || DEFUALT_PROPERTIES.birthDate;
    this.nickname = nickname || DEFUALT_PROPERTIES.nickname;
    this.traits = traits || DEFUALT_PROPERTIES.randomTraites;
    this.generationId = generationId || DEFUALT_PROPERTIES.generationId;
    this.isPublic = isPublic || DEFUALT_PROPERTIES.isPublic;
    this.saleValue = saleValue || DEFUALT_PROPERTIES.saleValue;
    this.sireValue = sireValue || DEFUALT_PROPERTIES.sireValue;
  }
}
module.exports = Dragon;
