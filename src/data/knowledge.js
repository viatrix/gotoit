
export const skills = {design: 0, manage: 0, program: 0, admin: 0};
export const skills_names = Object.keys(skills);

export const roles = {
    design: {name: 'Design', description: 'Design'},
    manage: {name: 'Management', description: 'Management'},
    program: {name: 'Programming', description: 'Programming'},
    admin: {name: 'Administrating', description: "Administrating"}
};

export const technologies = {
    tdd: {name: 'Test Driven Development', acronym: 'TDD', description: 'Developing tests that reduce the probability of errors'},
    agile: {name: 'Agile Software Development', acronym: 'Agile', description: 'Develop priority parts of the application in the first place'},
    rad: {name: 'Rapid Application Development', acronym: 'RAD', description: 'Faster Development at the cost of increasing complexity'},
    refactoring: {name: 'Non-stop refactoring', acronym: 'Ref', description: "The complexity of the code - it's just a task for refactoring"}
};

export const education = {
    read: {name: 'Read a Book', description: 'Develop priority parts of the application in the first place'},
    self: {name: 'Practice', description: 'Developing tests that reduce the probability of errors'},
    lecture: {name: 'Listen Lecture', description: 'Faster Development at the cost of increasing complexity'},
    workshop: {name: 'Go to Workshop', description: "The complexity of the code - it's just a task for refactoring"}
};


export const player_backgrounds = {
    specialist: {name: 'Specialist', money: 2000, text: 'Honed skills in the profession to heights. Besides richer.'},
    comprehensive: {name: 'Comprehensive', money: 0, text: 'Has no weaknesses. But is not the special.'},
    coworker: {name: 'Coworker', money: 1000, text: 'Works with the partner, covering each other.'}
};

export const player_education = {
    autodidact: {name: 'Autodidact', money: 0, text: 'Inspired researcher, looking own way. Eclectic stats.'},
    university: {name: 'University', money: 1000, text: 'Fundamental education according to verified program. Flat stats.'},
    businessman: {name: 'Businessman', money: 3000, text: 'Made a fortune doing business. More money.'}
};

export default {};