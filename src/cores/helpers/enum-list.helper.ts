const EnumListHelper = (enumObj: any) => {
  return Object.entries(enumObj)
    .splice(Object.keys(enumObj).length / 2)
    .map((value) => {
      return {
        id: value[1],
        name: EnumKeyReadebleHelper(enumObj, value[1]),
      };
    });
};

const EnumArrayHelper = (enumObj: any) => {
  return Object.entries(enumObj)
    .splice(Object.keys(enumObj).length / 2)
    .map((value) => {
      return value[1];
    });
};

const EnumKeyReadebleHelper = (enumObj: any, value: any) => {
  return Object.keys(enumObj)
    [Object.values(enumObj).indexOf(value)].replace(/_/g, ' ')
    .toLocaleUpperCase();
};

export { EnumListHelper, EnumArrayHelper, EnumKeyReadebleHelper };
