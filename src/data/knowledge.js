
import _ from 'lodash';

export const skills = {design: 0, manage: 0, program: 0, admin: 0};
export const skills_1 = _.mapValues(skills, () => { return 1; });
export const skills_true = _.mapValues(skills, () => { return true; });
export const skills_false = _.mapValues(skills, () => { return false; });
export const skills_names = _.keys(skills);


export const roles = {
    design: {name: 'Design', description: 'Design'},
    manage: {name: 'Management', description: 'Management'},
    program: {name: 'Programming', description: 'Programming'},
    admin: {name: 'Administrating', description: "Administrating"}
};


export const project_platforms = {
    crossplatform: {name: 'Cross-platform'},
    mobile: {name: 'Mobile'},
    browser: {name: 'Browser'},
    desktop: {name: 'Desktop'},
    embedded: {name: 'Embedded'}
};

export const project_kinds = {
    application: {name: 'Application'},
    game: {name: 'Game'},
    service: {name: 'Service'},
    system: {name: 'System'},
    database: {name: 'Database'}
};

export const project_sizes = {
    0: {name: 'Training', alone_name: 'Training', agency_min: 0,  agency_max: 0},
    1: {name: 'Parts for', alone_name: 'Part', agency_min: 1,  agency_max: 500},
    2: {name: 'Module for', alone_name: 'Module', agency_min: 50,  agency_max: 1000},
    3: {name: 'The', alone_name: 'Application', agency_min: 100,  agency_max: 2500},
    4: {name: 'Big', alone_name: 'Big Deal', agency_min: 1000,  agency_max: 10000},
    5: {name: 'Custom', alone_name: 'Custom', agency_min: 0,  agency_max: 0}
};


export const technologies = {
    overtime: {name: 'Overtime Work', acronym: 'Over', price: 5000, description: 'Overtime help to finish project on time, but exhausted team.'},
    creativity: {name: 'Creativity boost', acronym: 'Free', price: 5000, description: "Every fifth working hour given to pet projects which boosting experience."},

    tdd: {name: 'Test Driven Development', acronym: 'TDD', price: 10000, description: 'Developing tests that reduce the probability of errors.'},
    refactoring: {name: 'Non-stop refactoring', acronym: 'Ref', price: 10000, description: "The complexity of the code - it's just a task for refactoring."},

    pair: {name: 'Pair Programming', acronym: 'Pair', price: 25000, description: 'Working in tandem allows us to solve complex problems and sharing experience.'},
    micromanagement: {name: 'Micromanagement', acronym: 'Micro', price: 25000, description: 'Solid control averaging performance and work visiting.'},

    rad: {name: 'Rapid Development', acronym: 'RAD', price: 25000, description: 'Faster Development at the cost of increasing complexity.'},
    agile: {name: 'Agile Development', acronym: 'Agile', price: 25000, description: 'Focus on priority and lower the cost of the project by cut out unnecessary tasks.'}
};


export const education = {
    training: {name: 'Training Project', hide: false, description: ''},
    hackathon: {name: 'Hackathon', hide: true, description: ''},
    university: {name: 'University', hide: true, description: ''},
    workshop: {name: 'Workshop', hide: true, description: ''}
};


export const player_backgrounds = {
  //  autodidact: {name: 'Autodidact', money: 1000, start_tech: ['creativity'], text: 'Inspired researcher, looking own way. Eclectic stats.'},
  //  university: {name: 'Student', money: 5000, start_tech: ['tdd'], text: 'Fundamental education according to verified program. Flat stats.'},
    comprehensive: {name: 'Comprehensive', money: 3000, start_tech: ['rad'], text: 'Has no weaknesses. But is not the special and poor.'},
    specialist: {name: 'Specialist', money: 5000, start_tech: ['agile'], text: 'Honed skills in the profession to heights.'},
    coworker: {name: 'Coworker', money: 10000, start_tech: ['pair'], text: 'Works with the Partner, covering each other.'},
    businessman: {name: 'Businessman', money: 20000, start_tech: ['micromanagement'], text: 'Made a fortune doing business. Has a money.'}
};

export const player_specialities = {
    design: {name: 'Designer', text: 'Design'},
    manage: {name: 'Manager', text: 'Management'},
    program: {name: 'Programmer', text: 'Programming'},
    admin: {name: 'Administrator', text: "Administrating"}
};


export const offices = {
    1: {size: 1, space: 1, price: 0,     name: 'Sweet Home', text: ''},
    2: {size: 2, space: 4, price: 500,   name: 'Garage Startup', text: ''},
    3: {size: 3, space: 7, price: 2500,  name: 'Busy Office', text: ''},
    4: {size: 4, space: 10, price: 10000, name: 'AAA Studio', text: ''}
};

export default {};