
export const skills = {design: 0, manage: 0, program: 0, admin: 0};
export const skills_names = Object.keys(skills);


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


export const technologies = {
    tdd: {name: 'Test Driven Development', acronym: 'TDD', description: 'Developing tests that reduce the probability of errors.'},
    refactoring: {name: 'Non-stop refactoring', acronym: 'Ref', description: "The complexity of the code - it's just a task for refactoring."},
    pair: {name: 'Pair Programming', acronym: 'Pair', description: 'Working in tandem allows us to solve complex problems.'},
    rad: {name: 'Rapid Development', acronym: 'RAD', description: 'Faster Development at the cost of increasing complexity.'},

    overtime: {name: 'Overtime Work', acronym: 'Over', description: 'Overtime help to finish project on time, but exhausted team.'},
    creativity: {name: 'Creativity on Fridays', acronym: 'Free', description: "Fridays devoted to pet projects which boosting experience."},
    agile: {name: 'Agile Development', acronym: 'Agile', description: 'Focus on priority, cut out unnecessary, lighter the project.'},
    micromanagement: {name: 'Micromanagement', acronym: 'Micro', description: 'Solid control over the objectives is averaging performance.'}
};


export const education = {
    training: {name: 'Training Project', hide: false, description: ''},
    hackathon: {name: 'Hackathon', hide: true, description: ''},
    university: {name: 'University', hide: true, description: ''},
    workshop: {name: 'Workshop', hide: true, description: ''}
};


export const player_backgrounds = {
    specialist: {name: 'Specialist', money: 5000, text: 'Honed skills in the profession to heights.'},
    comprehensive: {name: 'Comprehensive', money: 1000, text: 'Has no weaknesses. But is not the special.'},
    coworker: {name: 'Coworker', money: 5000, text: 'Works with the partner, covering each other.'}
};

export const player_education = {
    autodidact: {name: 'Autodidact', money: 1000, text: 'Inspired researcher, looking own way. Eclectic stats.'},
    university: {name: 'University', money: 5000, text: 'Fundamental education according to verified program. Flat stats.'},
    businessman: {name: 'Businessman', money: 10000, text: 'Made a fortune doing business. Has a money.'}
};


export const offices = {
    1: {space: 1, price: 0,     name: 'Home', text: ''},
    2: {space: 4, price: 500,   name: 'Small Office', text: ''},
    3: {space: 7, price: 2500,  name: 'Medium Office', text: ''},
    4: {space: 10, price: 10000, name: 'Big office', text: ''}
};

export default {};