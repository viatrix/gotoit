
import _ from 'lodash';

import bulkStyler from '../services/bulkStyler';
import {skills} from '../data/knowledge';

class WorkerModel {
    constructor(name, stats, is_player = false) {
        this.id = is_player ? 'player' : _.uniqueId('worker');
        this.name = name;
        this.stats = stats;
        this.is_player = is_player;
        this.expirience = JSON.parse(JSON.stringify(skills));
        this.standing = 0;
        this.morale = 0;
        this.accept_default = true;

        this.facts = {
            project_finished: 0,
            tick_hired: 0, money_earned: 0,
            tasks_done: 0, bugs_passed: 0,
            refactored: 0, tests_wrote: 0};
    }

    statsSum() {
        return _.sum(_.values(this.stats));
    }

    getSalary() {
        if (this.is_player) {
            return 0;
        }
        else {
            //console.log("standing " + this.standing + " means " + (1 + (this.standing/(12*4*7*8*Math.PI))));
            return Math.floor((this.statsSum() + _.max(_.values(this.stats))) * (1 + (this.standing/(12*4*7*8*Math.PI))));
        }
    }


    getResources(worker_roles, focus_on=null, micromanagement) {
        this.standing++;
        var resources = {};
        let stat = focus_on ? focus_on : _.sample(_.keys(_.pickBy(worker_roles, _.identity)));
        if (!(stat in resources)) resources[stat] = 0;

        if (micromanagement) {
            let dices = [_.random(1, this.stats[stat]), _.random(1, this.stats[stat]), _.random(1, this.stats[stat])];
            dices.sort((a,b) => { return a - b; });
            resources[stat] += dices[1];
        }
        else {
            resources[stat] += _.random(1, this.stats[stat]);
        }

        resources[stat] += micromanagement ?
            Math.max(_.random(1, this.stats[stat]), Math.min(_.random(1, this.stats[stat]), _.random(1, this.stats[stat]))) :
            _.random(1, this.stats[stat]);
        //    console.log(resources);
        return resources;
    }

    getSideResource() {
        this.standing++;
        let s = this.statsSum()/_.values(this.stats).length;
        return Math.floor(_.random(1, s*2));
    }

    addExperience(learned, creativity = false) {
        learned.forEach((stat) => {
            this.expirience[stat] += Math.ceil(10 * (creativity ? 1.25 : 1) / (this.stats[stat]));
            if (this.expirience[stat] >= 100) {
                console.log('stat rise');
                this.expirience[stat] -= 100;
                this.stats[stat]++;
            }
        });
    }

    static generate(quality=1) {
        let stats_bulk = {design: this.genStat(quality), manage: this.genStat(quality), program: this.genStat(quality), admin: this.genStat(quality)};

        let stats = bulkStyler.speciality(stats_bulk);

        return new WorkerModel(this.genName(), stats);
    }

    static generatePlayer() {
        let name = '';//prompt('Type your name', this.genName());

        return new WorkerModel(
            name,
            _.mapValues(skills, (value, key) => { return 1; }), // {design: 1, manage: 1, program: 1, admin: 1},
            true
        );
    }

    static genName() {
        var first_names = ['Jack', 'Kristofer', 'Mike', 'Micheal', 'Marlena', 'Loris', 'Breana', 'Gregorio', 'Freddy', 'Devin', 'Nicol', 'Alex', 'Peter'];
        var second_names = ['Smith', 'Eisenhauer', 'Kirschbaum', 'Larose', 'Alvarado', 'Christon', 'Jaynes', 'Mcmillian', 'Radcliffe', 'Engelhard', 'Prambpharatha'];
        return _.sample(first_names) + ' ' + _.sample(second_names);
    }

    static genStat(quality) {
        return _.random(1, quality);
    }

}

export default WorkerModel;