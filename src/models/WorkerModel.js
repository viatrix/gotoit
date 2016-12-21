
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

        this.temper = {
            earliness: _.random(0, 3), variability: _.random(0, 3)
        };

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
            console.log("standing " + this.standing + " means " + (1 + (this.standing/(12*4*7*8*Math.PI))));
            return Math.floor((this.statsSum() + _.max(_.values(this.stats))) * (1 + (this.standing/(12*4*7*8*Math.PI))));
        }
    }

    isWorkingTime(time) {
        let variability = _.random(-this.temper.variability, this.temper.variability);
        let mod = variability + this.temper.earliness;

        let is_working_time = (
            time.hour >= 9 + mod &&
            time.hour <= 17 + mod &&
            (time.day < 5 || _.random(1, (12-(this.temper.variability*2))) === 1) && // variability guys work on weekends more often
            (_.random(1, 10 - this.temper.variability) !==1) // variability guys eblanyat more often
        ) ? true : false;

        console.log('Worker '+this.name+' '+(is_working_time ? 'work' : 'rest')+' on hour '+time.hour+' with temper '+
            this.temper.earliness+' '+this.temper.variability);

        return is_working_time;
    }

    getResources(worker_roles, focus_on=null, micromanagement) {
        let r = (stat) => { return _.random(1, this.stats[stat]); };
        let resource = 0;
        
        this.standing++;
        //var resources = {};
     //   let stat = focus_on ? focus_on : _.sample(_.keys(_.pickBy(worker_roles, _.identity)));
        let stat = focus_on ? focus_on : _.sample(worker_roles);
        //if (!(stat in resources)) resources[stat] = 0;

        if (micromanagement) {
            let dices = [r(stat), r(stat), r(stat)];
            dices.sort((a,b) => { return a - b; });
            resource = dices[1];
        }
        else {
            resource = r(stat);
        }

        let ret = {};
        ret[stat] = resource;
        return ret;

        //resources[stat] += micromanagement ?
        //    Math.max(r(stat), Math.min(r(stat), r(stat))) :
        //    r(stat);
        //    console.log(resources);
        //return resources;
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