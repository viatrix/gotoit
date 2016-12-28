//import App from '../App';

import _ from 'lodash';

import bulkStyler from '../services/bulkStyler';

import {addMessage} from '../components/ToastNest';

import {skills, project_kinds, project_platforms, project_sizes} from '../data/knowledge';
import {hired, projects_done} from '../App';

var projects_generated = 0;

class ProjectModel {
    constructor(name, type, kind, platform, reward, penalty, start_needs, size, deadline, complexity = 0) {
        this.stage = 'ready';

        this.id = _.uniqueId('project');
        this.name = name;
        this.type = type; //  project, training, draft
        this.kind = kind;
        this.platform = platform;
        this.reward = reward;
        this.penalty = penalty;
        this.needs = JSON.parse(JSON.stringify(start_needs));
        this.errors = JSON.parse(JSON.stringify(skills));
        this.stored_wisdom = JSON.parse(JSON.stringify(skills));
        this.needs_max = JSON.parse(JSON.stringify(start_needs));
        this.deadline = deadline;
        this.deadline_max = deadline;
        this.complexity = complexity;
        this.iteration = 1;
        this.size = size;
        this.size_name = ['Training', 'Tiny', 'Small', 'Medium', 'Big', 'Custom'][size];
        this.tests = 0;

        this.briefing = false;
        this.accept_default = (this.type !== 'training') ? true : false;

        this.facts = {
            money_spent: 0,
            tasks_done: 0, bugs_passed: 0,
            refactored: 0, tests_wrote: 0};
    }
    
    generateReport(is_player = true) {
        return {
            id: this.id, name: this.getName(), is_player: is_player,
            platform: this.platform, kind: this.kind,
            design: this.needs_max.design, manage: this.needs_max.manage, program: this.needs_max.program, admin: this.needs_max.admin,
            total: this.totalScore()
        }
    }

    applyWork(work, worker, rad = false, creativity = false, supporter = false) {
        var learned = JSON.parse(JSON.stringify(skills));

        Object.keys(work).forEach((stat) => {
            if (this.needs[stat] > 0 && work[stat] > 0) {

                if (supporter) {
                    this.stored_wisdom[stat] += work[stat];
                    console.log('support '+stat+' '+work[stat]);
                    //console.log(this.stored_wisdom);
                    return 'supporter';
                }


                let all_work = _.random(1, work[stat]) + this.stored_wisdom[stat];
                let complexity_penalty = Math.max(0, Math.floor(Math.sqrt(Math.max(0, this.complexity - _.random(0, this.errors[stat])))) - this.iteration + 1);
                let bugs = 0;
                let tasks = 0;
                if (complexity_penalty > all_work) {
                    bugs = all_work;
                }
                else {
                    tasks = all_work - complexity_penalty;
                    bugs = complexity_penalty;
                }




                if (tasks > 0) {
                    tasks = Math.min(this.needs[stat], tasks);
                    if (this.type === 'training') {
                        worker.facts.training_tasks_done += tasks;
                    }
                    worker.facts.tasks_done += tasks;
                    this.facts.tasks_done += tasks;
                    this.needs[stat] -= tasks;
                    this.stored_wisdom[stat] = 0;
                    addMessage(worker.name+' solve '+tasks+' '+stat+' tasks', {}, 'info');
                }

                if (bugs > 0) {
                    this.stored_wisdom[stat] += work[stat];
                    let prevented = this.runTests(bugs);
                    if (prevented) {
                        addMessage(worker.name+' do '+bugs+' errors in '+stat+', but test prevent '+prevented+' of them', {}, 'warning');
                        //console.log('Test prevent errors');
                        worker.facts.bugs_passed += bugs-prevented;
                        this.facts.bugs_passed += bugs-prevented;
                        this.errors[stat] += bugs-prevented;
                    }
                    else {
                        addMessage(worker.name+' do '+bugs+' errors in '+stat, {}, 'warning');
                        //console.log('Do errors');
                        worker.facts.bugs_passed += bugs;
                        this.facts.bugs_passed += bugs;
                        this.errors[stat] += bugs;
                    }
                }

                this.complexity += (rad ? 4 : 1);
                let learn = tasks + (bugs * 2);


                /*
                ///
                let pro = all_work;
                let cont = this.complexity;
                let ratio = 10 / this.complexity;
                ///

                let resource = work[stat] - Math.floor(_.random(0, Math.sqrt(this.complexity)-this.iteration));
                let potential = this.stored_wisdom[stat] + resource;

                let cont = _.random(0, (this.complexity * this.size) / this.iteration);
                let pro = Math.pow(this.iteration, 2) + _.random(1, potential) + _.random(1, this.errors[stat]);
            //    console.log(cont, pro);
                if (resource > 0 && cont < pro) {
                    this.complexity += (rad ? 4 : 1);
                    var real_work = Math.min(this.needs[stat], _.random(1, resource + (rad ? worker.getSideResource() : 0)));
                    if (this.type === 'training') {
                        worker.facts.training_tasks_done += real_work;
                    }
                    worker.facts.tasks_done += real_work;
                    this.facts.tasks_done += real_work;
                    this.needs[stat] -= real_work;
                    addMessage(worker.name+' solve '+real_work+' '+stat+' tasks', {}, 'info');
                    console.log(worker.name+' work '+real_work+' ['+resource+'/'+potential+'('+work[stat]+'+'+this.stored_wisdom[stat]+')] in '+stat, {}, 'info');
                    //addMessage('Work '+stat+' '+work[stat]+' where wisdom is '+this.stored_wisdom[stat], {}, 'info');
                 //   console.log('Work '+stat+' '+work[stat]+' where wisdom is '+this.stored_wisdom[stat]);
                    this.stored_wisdom[stat] = 0;
                }
                else {
                    this.stored_wisdom[stat] += work[stat];
                    if (this.runTests()) {
                        addMessage(worker.name+' do errors in '+stat+', but test prevent', {}, 'info');
                        console.log('Test prevent errors');
                    }
                    else {
                        console.log('Do errors');
                        addMessage(worker.name+' do errors in '+stat, {}, 'warning');
                        worker.facts.bugs_passed++;
                        this.facts.bugs_passed++;
                        this.errors[stat]++;
                    }
                }


                let learn = (real_work ? real_work : work[stat]);
                */

                learned[stat] += (learn) * (creativity ? 1.5 : 1) * (this.type === 'training' ? 2 : 1);
                if (isNaN(learned[stat])) {
                    console.log([learn, creativity, this.type].map((e) => e));
                }
            }
            else {
                console.log('That strange case');
                console.log(work);
            }
        });

        return learned;
    }

    /***
     * Take a chance to not to add error
     */
    runTests(bugs = null) {
        const roll = () => {
            let chance = this.tests / this.planedTasksQuantity() * 100;
            return _.random(1, 100) < chance;
        };

        if (bugs === null) {
            return roll();
        }
        else {
            let prevent = 0;
            for (let i=0; i<bugs; i++) {
                if (roll()) prevent++;
            }
            return prevent;
        }
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

    getNeeds(roles) {
        let needed = {};
        //console.log(roles, this.needs);
        Object.keys(this.needs).forEach((skill) => {
            if (this.needs[skill] > 0 && roles[skill]) {
                needed[skill] = roles[skill];
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

    totalScore() {
        return this.planedTasksQuantity();
    }

    static generate(quality=1, size=4, kind=_.sample(_.keys(project_kinds)), platform = _.sample(_.keys(project_platforms))) {
        //    console.log("gen quality="+quality+", size="+size);
        projects_generated++;

        let stats_bulk = {
            program: this.genStat(quality, size),
            design: this.genStat(quality, size),
            admin: this.genStat(quality, size),
            manage: this.genStat(quality, size)
        };

        stats_bulk = bulkStyler.speciality(stats_bulk);
        stats_bulk = bulkStyler.projectKind(stats_bulk, kind);
        stats_bulk = bulkStyler.projectPlatform(stats_bulk, platform);

        let stats = JSON.parse(JSON.stringify(skills));

        if (size !== 4) {
            //let sk = _.shuffle(Object.keys(stats));

            let pairs = _.toPairs(stats_bulk);

            let sk = pairs.sort(function(a, b) {
                return b[1] - a[1];
            });

            sk = _.keys(_.fromPairs(sk));

            for (let i = 0; i < size; i++) {
                stats[sk[i]] = stats_bulk[sk[i]];
            }
           // console.log(stats_bulk, sk, stats);
        }
        else {
            stats = stats_bulk;
        }

        let s = _.values(stats);
        let reward = 1000 + Math.ceil((_.max(s) + _.sum(s)) * 10 * size);
        let penalty = ([0, 0, 0, 0.5, 1][size] * reward).toFixed(0);
        let deadline = 100 +  // constant for anti-weekend effect on small projects
            Math.floor((((_.max(s) + _.sum(s)) * 5) / (1 * size)));

        return new ProjectModel(this.genName(), 'project', kind, platform, reward, penalty, stats, size, deadline);
    }

    static generateTraining(worker, skill=null) {
        let level = Math.floor((worker.statsSum()/4*0.5) + (worker.stats[skill]*3));

        let kind = _.sample(_.keys(project_kinds));
        let platform = _.sample(_.keys(project_platforms));
        let stats = JSON.parse(JSON.stringify(skills));
        stats[skill] = level*2;
        let reward = 0;
        let penalty = 0;
        let deadline = 100 + (level * 10);
        return new ProjectModel(this.genName(), 'training', kind, platform, reward, penalty, stats, 0, deadline);
    }

    static generateDraft() {
        let kind = _.sample(_.keys(project_kinds));
        let platform = _.sample(_.keys(project_platforms));
        let stats = JSON.parse(JSON.stringify(skills));
        let reward = 0;
        let penalty = 0;
        let deadline = 0;
        return new ProjectModel(this.genName(), 'draft', kind, platform, reward, penalty, stats, 0, deadline);
    }

    static genName() {
        var a = ['Ra', 'Rap', 'Ko', 'Si', 'Ne', 'A', 'Q-'];
        var b = ['clo', 'ko', 'lo', 'mo', 'no', 'tor', 'de', 'kon'];
        var c = ['pan', 'tang', 'riko', 'nik', 'ka', 'ia', 'lia', 'ink'];

        var d = ['Art', 'Team', 'Sys', 'Virt', 'Cop'];
        var e = ['tro', 'nik', 'for', 'link', 'your'];
        var f = ['ka', 'dev', 'ops', 'ink', 'dream'];

        return (_.random(0, 1)
            ? _.sample(a)
                + (_.random(0, 1) ? _.sample(b) : _.sample(c) + _.sample(b))
                + (_.random(0, 1) ? _.sample(c) : _.sample(f))
            : _.sample(d)
                + (_.random(0, 1) ? _.sample(e) : _.sample(f) + _.sample(e))
                + (_.random(0, 1) ? _.sample(c) : _.sample(f))
        );
    }

    getName() {
        return project_sizes[this.size].name+' '+this.platform+' '+this.kind+' '+this.name;
    }

    static genStat(quality, size=1) {
        let q = Math.floor(quality * size * 0.1);
        let h = (_.random(0, quality) * (0 + _.random(1, Math.pow(hired, 2))));
        let d = (_.random(0, quality) * (0 + _.random(1, projects_done)));
        let g = (_.random(0, quality) * (0 + _.random(1, Math.floor(Math.sqrt(projects_generated/2)))));
        let r = _.random(1, 10);

        //console.log('gen_stats: q: '+q+' h: '+h+' d: '+d+' g: '+g+' r: '+r);
        return Math.floor( q + h + d + g + r);
    }

}

export default ProjectModel;