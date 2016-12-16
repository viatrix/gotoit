
import _ from 'lodash';

import {skills} from '../data/knowledge';

class WorkerModel {
    constructor(name, stats, is_player = false) {
        this.id = is_player ? 'player' : _.uniqueId('worker');
        this.name = name;
        this.stats = stats;
        this.is_player = is_player;
        this.expirience = JSON.parse(JSON.stringify(skills));
    }

    statsSum() {
        return _.sum(_.values(this.stats));
    }

    getSalary() {
        if (this.is_player) {
            return 0;
        }
        else {
            return this.statsSum();
        }
    }


    getResources(worker_roles, focus_on=null) {
        var resources = {};
        let stat = focus_on ? focus_on : _.sample(_.keys(_.pickBy(worker_roles, _.identity)));
        if (!(stat in resources)) resources[stat] = 0;
        resources[stat] += _.random(1, this.stats[stat]);
        //    console.log(resources);
        return resources;
    }

    getSideResource() {
        return _.random(1, this.statsSum()/this.stats.length);
    }

    addExperience(learned) {
        learned.forEach((stat) => {
            this.expirience[stat] += Math.ceil(10 / (this.stats[stat] ? this.stats[stat] : 1));
            if (this.expirience[stat] >= 100) {
                console.log('stat rise');
                this.expirience[stat] -= 100;
                this.stats[stat]++;
            }
        });
    }

    static generate(quality=1) {
        let stats = {program: this.genStat(quality), design: this.genStat(quality), admin: this.genStat(quality), manage: this.genStat(quality)};
        return new WorkerModel(this.genName(), stats);
    }

    static generatePlayer() {
        let name = prompt('Type your name', this.genName());

        return new WorkerModel(
            name,
            {program: 1, design: 1, admin: 1, manage: 1},
            true
        );
    }

    static genName() {
        var first_names = ['Jack', 'Kristofer', 'Mike', 'Micheal', 'Marlena', 'Loris', 'Breana', 'Gregorio', 'Freddy', 'Devin'];
        var second_names = ['Smith', 'Eisenhauer', 'Kirschbaum', 'Larose', 'Alvarado', 'Christon', 'Jaynes', 'Mcmillian', 'Radcliffe', 'Engelhard'];
        return _.sample(first_names) + ' ' + _.sample(second_names);
    }

    static genStat(quality) {
        return _.random(1, quality);
    }

}

export default WorkerModel;