//import App from '../App';

import _ from 'lodash';

import {skills} from '../data/knowledge';

var projects_generated = 0;

class ProjectModel {
    constructor(name, type, reward, start_needs, complexity = 0) {
        this.id = _.uniqueId('project');
        this.name = name;
        this.type = type;
        this.reward = reward;
        this.needs = JSON.parse(JSON.stringify(start_needs));
        this.errors = JSON.parse(JSON.stringify(skills));
        this.needs_max = JSON.parse(JSON.stringify(start_needs));
        this.complexity = complexity;
        this.iteration = 1;
        this.tests = 0;
    }

    applyWork(work, rad = false) {
        var learned = [];

        Object.keys(work).forEach((stat) => {
            if (this.needs[stat] > 0 && work[stat] > 0) {
                learned.push(stat);

                let cont = _.random(0, (this.complexity / (work[stat] + this.iteration) ));
                let pro = _.random(1, this.needs[stat]) + _.random(1, this.errors[stat]);

            //    console.log(cont, pro);

                if (cont < pro) {
                    this.complexity += (rad ? 4 : 1);
                    this.needs[stat] -= Math.min(this.needs[stat], (work[stat] * (rad ? 2 : 1)));
                }
                else {
                    if (this.runTests()) {
                        console.log('Test prevent errors');
                    }
                    else {
                        this.errors[stat]++;
                    }
                }
            }
        });

        return learned;
    }

    /***
     * Take a chance to not to add error
     */
    runTests() {
        let chance = this.tests / this.planedTasksQuantity() * 100;
        return _.random(1, 100) < chance;
    }

    tasksQuantity() {
        return _.sum(_.values(this.needs));
    }

    planedTasksQuantity() {
        return _.sum(_.values(this.needs_max));
    }

    isFinished() {
        return (this.tasksQuantity() === 0);
    }

    bugsQuantity() {
        return _.sum(_.values(this.errors));
    }

    isFixed() {
        return (this.bugsQuantity() === 0);
    }

    isNeed(roles) {
        let needed = false;
        //console.log(roles, this.needs);
        Object.keys(this.needs).forEach((skill) => {
            if (this.needs[skill] > 0 && roles[skill]) {
                needed = true;
            }
        });
        return needed;
    }

    fix() {
        this.iteration++;
        this.needs = JSON.parse(JSON.stringify(this.errors));
        this.errors = JSON.parse(JSON.stringify(skills));
        //this.complexity -= (_.sum(_.values(this.needs)));
    }

    static generate(quality=1) {
        projects_generated++;
        let stats = {program: this.genStat(quality), design: this.genStat(quality), admin: this.genStat(quality), manage: this.genStat(quality)};

        return new ProjectModel(
            this.genName(),
            'project',
            Math.ceil(_.sum(_.values(stats)) * 5 * Math.sqrt(Math.sqrt(quality))),
            stats
        );
    }

    static genName() {
        var first_names = ['Browser', 'Desktop', 'Mobile', 'Embedded', 'Enterprise'];
        var second_names = ['Game', 'System', 'Environment', 'Site', 'Application'];
        return _.sample(first_names) + ' ' + _.sample(second_names);
    }

    static genStat(quality) {
        let hired = 1;
        return Math.floor(
            (_.random(1, 10) +
            (_.random(1, quality) * _.random(1, hired)) +
            (_.random(1, quality) * _.random(1, Math.sqrt(projects_generated+1)))));
    }

}

export default ProjectModel;