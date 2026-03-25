export const VOLUNTEER_SKILLS_VN = {
    'MedicalSupport': 'Cứu hộ y tế',
    'Medical Rescuer': 'Cứu hộ y tế',
    'DirectRescuer': 'Cứu hộ trực tiếp',
    'Direct Rescuer': 'Cứu hộ trực tiếp',
    'LogisticsSupport': 'Hậu cần',
    'Logistic': 'Hậu cần',
    'BoatOperator': 'Lái canô/thuyền',
    'Boat Operator': 'Lái canô/thuyền'
};

export const translateSkill = (skillName) => {
    return VOLUNTEER_SKILLS_VN[skillName] || skillName;
};
