//import App from '../App';

import _ from 'lodash';

import bulkStyler from '../services/bulkStyler';

import {skills} from '../data/knowledge';
import {hired, projects_done} from '../App';

var projects_generated = 0;

class ProjectModel {
    constructor(name, type, reward, start_needs, size, deadline, complexity = 0) {
        this.stage = 'open';

        this.id = _.uniqueId('project');
        this.name = name;
        this.type = type;
        this.reward = reward;
        this.needs = JSON.parse(JSON.stringify(start_needs));
        this.errors = JSON.parse(JSON.stringify(skills));
        this.needs_max = JSON.parse(JSON.stringify(start_needs));
        this.deadline = deadline;
        this.deadline_max = deadline;
        this.complexity = complexity;
        this.iteration = 1;
        this.size = size;
        this.tests = 0;
        this.accept_default = true;

        this.facts = {
            money_spent: 0,
            tasks_done: 0, bugs_passed: 0,
            refactored: 0, tests_wrote: 0};
    }

    applyWork(work, worker, rad = false) {
        var learned = [];

        Object.keys(work).forEach((stat) => {
            if (this.needs[stat] > 0 && work[stat] > 0) {
                learned.push(stat);

                let cont = _.random(0, (this.complexity * this.size) / this.iteration);
                let pro = work[stat] + _.random(1, this.needs[stat]) + _.random(1, this.errors[stat]);

            //    console.log(cont, pro);

                if (cont < pro) {
                    this.complexity += (rad ? 4 : 1);
                    let real_work = Math.min(this.needs[stat], (work[stat] * (rad ? 2 : 1)));
                    worker.facts.tasks_done += real_work;
                    this.facts.tasks_done += real_work;
                    this.needs[stat] -= real_work;
                }
                else {
                    if (this.runTests()) {
                        console.log('Test prevent errors');
                    }
                    else {
                        worker.facts.bugs_passed++;
                        this.facts.bugs_passed++;
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

    getDeadlineText() {
        return this.deadline + ' hours';
    }

    fix() {
        this.iteration++;
        this.needs = JSON.parse(JSON.stringify(this.errors));
        this.errors = JSON.parse(JSON.stringify(skills));
        //this.complexity -= (_.sum(_.values(this.needs)));
    }

    static generate(quality=1, size=4) {
    //    console.log("gen quality="+quality+", size="+size);
        projects_generated++;

        let stats_bulk = {
            program: this.genStat(quality, size),
            design: this.genStat(quality, size),
            admin: this.genStat(quality, size),
            manage: this.genStat(quality, size)
        };

        stats_bulk = bulkStyler.speciality(stats_bulk);

        let stats = JSON.parse(JSON.stringify(skills));

        if (size !== 4) {
            let sk = _.shuffle(Object.keys(stats));
            for (let i = 0; i < size; i++) {
                stats[sk[i]] = stats_bulk[sk[i]];
            }
        }
        else {
            stats = stats_bulk;
        }

        let s = _.values(stats);
        let reward = Math.pow(10, size+1) +
            Math.ceil((_.max(s) + _.sum(s)) * 5 * Math.sqrt(quality));
        let deadline = Math.floor(
            (Math.pow(100, Math.sqrt(size)) + ((_.max(s) + _.sum(s)) * 5)) / size); //8*5*4*size*Math.sqrt(quality);

        return new ProjectModel(this.genName(size), 'project', reward, stats, size, deadline);
    }

    static genName(size) {
        var size_names = ['Test', 'Tiny', 'Small', 'Medium', 'Big'];
        var first_names = ['Browser', 'Desktop', 'Mobile', 'Embedded', 'Enterprise'];
        var second_names = ['Game', 'System', 'Environment', 'Site', 'Application'];
        return size_names[size] + ' ' + _.sample(first_names) + ' ' + _.sample(second_names);
    }

    static genStat(quality, size=1) {
        return Math.floor(
            Math.pow(10, size-1) +
            (_.random(1, 10) +
            (_.random(1, quality) * _.random(1, hired ? hired : 1)) +
            (_.random(1, quality) * _.random(1, projects_done)) +
            (_.random(1, quality) * _.random(1, Math.sqrt(projects_generated))))
        );
    }

}

export default ProjectModel;