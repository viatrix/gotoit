
import _ from 'lodash';

import {skills} from '../data/knowledge';

class WorkerModel {
    constructor(name, stats, is_player = false) {
        this.id = is_player ? 'player' : _.uniqueId('worker');
        this.name = name;
        this.stats = stats;
        this.is_player = is_player;
        this.expirience = JSON.parse(JSON.stringify(skills));
        this.standing = 0;
        this.accept_default = true;
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


    getResources(worker_roles, focus_on=null) {
        this.standing++;
        var resources = {};
        let stat = focus_on ? focus_on : _.sample(_.keys(_.pickBy(worker_roles, _.identity)));
        if (!(stat in resources)) resources[stat] = 0;
        resources[stat] += _.random(1, this.stats[stat]);
        //    console.log(resources);
        return resources;
    }

    getSideResource() {
        this.standing++;
        let s = this.statsSum()/_.values(this.stats).length;
        return Math.floor(_.random(1, s) + _.random(1, s));
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
        let stats_bulk = {design: this.genStat(quality), manage: this.genStat(quality), program: this.genStat(quality), admin: this.genStat(quality)};

        let speciality = ['none', 'specialist', 'dualist'][_.random(0, 2)];

        let order = Object.keys(stats_bulk).sort(function(a,b){return stats_bulk[b]-stats_bulk[a]});

        switch (speciality) {
            case 'none':
                console.log('none');
                break;
            case 'specialist':
                console.log('specialist');
                stats_bulk[order[0]] *= 2;
                stats_bulk[order[1]] *= 0.7;
                stats_bulk[order[2]] *= 0.5;
                stats_bulk[order[3]] *= 0.3;
                break;
            case 'dualist':
                console.log('dualist');
                stats_bulk[order[0]] *= 1.5;
                stats_bulk[order[1]] *= 1.7;
                stats_bulk[order[2]] *= 0.3;
                stats_bulk[order[3]] *= 0.5;
                break;
            default:
                console.log('error case: ' + speciality);
        }
        
        let stats = _.mapValues(stats_bulk, function(stat) { return Math.ceil(stat); });

        return new WorkerModel(this.genName(), stats);
    }

    static generatePlayer() {
        let name = prompt('Type your name', this.genName());

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