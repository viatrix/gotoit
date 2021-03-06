//import App from '../App';

import _ from 'lodash';

import bulkStyler from '../services/bulkStyler';

import {chatMessage} from "../components/Chat";


import {skills, project_kinds, project_platforms, project_sizes} from '../data/knowledge';
import {hired, projects_done} from '../App';

export var projects_generated = 0;
export function flush() { projects_generated = 0; };

class ProjectModel {
    constructor(name, type, kind, platform, reward, penalty, start_needs, size, deadline, complexity = 0) {
        this.stage = 'ready';

        this.id = _.uniqueId('project');
        this.name = name;
        this.type = type; //  project, training, hackathon, draft
        this.kind = kind;
        this.platform = platform;
        this.reward = reward;
        this.penalty = penalty;
        this.needs = JSON.parse(JSON.stringify(start_needs));
        this.errors = JSON.parse(JSON.stringify(skills));
        this.needs_max = JSON.parse(JSON.stringify(start_needs));
        this.needs_original = JSON.parse(JSON.stringify(start_needs));
        this.deadline = deadline;
        this.deadline_max = deadline;
        this.complexity = complexity;
        this.complexity_max = complexity;
        this.iteration = 1;
        this.size = size;
        this.tests = 0;

        this.is_storyline = false;
        this.lore = null;
        this.briefing = false;
        this.accept_default = (this.type !== 'training') ? true : false;

        this.stored_wisdom = JSON.parse(JSON.stringify(skills));
        this.supporter = null;

        this.facts = {
            money_spent: 0,
            tasks_done: 0, bugs_passed: 0,
            refactored: 0, tests_wrote: 0, cuted_cost: 0, retrospected: 0};
    }

    generateReport(is_player = true) {
        return {
            id: this.id, name: this.getName(), is_player: is_player, type: this.type,
            platform: this.platform, kind: this.kind, stage: this.stage,
            design: this.needs_max.design, manage: this.needs_max.manage, program: this.needs_max.program, admin: this.needs_max.admin,
            total: this.totalScore()
        }
    }

    applyWork(work, worker, rad = false, creativity = false, pair = false, overtimed = false) {
        var learned = JSON.parse(JSON.stringify(skills));

        Object.keys(work).forEach((stat) => {
            if (this.needs[stat] > 0 && work[stat] > 0) {
                var support = ((this.supporter && this.supporter.id !== worker.id) ? this.supporter.stats[stat] : 0);
                let all_work = _.random(1, (work[stat] + support + (rad ? worker.getSideResource() : 0))) + this.stored_wisdom[stat];
                let complexity_penalty = Math.max(0, Math.floor(Math.sqrt(Math.max(0, this.complexity - _.random(0, this.errors[stat])))) - Math.pow(this.iteration, 2) + 1);
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
                    this.stored_wisdom[stat] = 0;
                    this.complexity += (rad ? 4 : 1);
                    this.complexity_max += (rad ? 4 : 1);
                    if (this.is_supported) this.is_supported = false;
                }

                const formName = () => {
                    return worker.name
                        + (overtimed ? ' in overtime' : '')
                        + (support ? ' with support of ' + this.supporter.name : '');
                };

                if (bugs > 0) {
                    this.stored_wisdom[stat] += bugs;
                    let prevented = this.runTests(bugs);
                    if (prevented) {
                        chatMessage(formName(), ' does '+tasks+' tasks and creates '+bugs+' bugs in '+stat+', but tests prevent '+prevented+' of them', 'warning');
                        bugs -= prevented;
                        tasks += prevented;
                        tasks = Math.min(this.needs[stat], tasks);
                    }
                    else {
                        chatMessage(formName(), ' does '+tasks+' tasks and creates '+bugs+' bugs in '+stat, 'warning');
                    }
                }
                else {
                    chatMessage(formName(), ' does '+tasks+' '+stat+' tasks', 'info');
                }

                if (support) this.supporter = null;

                if (this.type === 'training') {
                    worker.facts.training_tasks_done += tasks;
                } else if (this.type === 'hackathon') {
                    worker.facts.training_tasks_done += (tasks * 2);
                }
                worker.facts.tasks_done += tasks;
                this.facts.tasks_done += tasks;
                this.needs[stat] -= tasks;

                worker.facts.bugs_passed += bugs;
                this.facts.bugs_passed += bugs;
                this.errors[stat] += bugs;

                let learn = tasks + (bugs * 2);
                learned[stat] +=
                    (learn) *
                    (pair ? 2 : 1) *
                    (creativity ? 1.5 : 1) *
                    (this.type === 'training' ? 2 : 1) *
                    (this.type === 'hackathon' ? 4 : 1);
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

    originalyTasksQuantity() {
        return _.sum(_.values(this.needs_original));
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
        //console.log("gen quality="+quality+", size="+size);
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
            let pairs = _.toPairs(stats_bulk);
            let sk = pairs.sort(function(a, b) {
                return b[1] - a[1];
            });
            sk = _.keys(_.fromPairs(sk));
            for (let i = 0; i < size; i++) {
                stats[sk[i]] = stats_bulk[sk[i]];
            }
        }
        else {
            stats = stats_bulk;
        }

        let s = _.values(stats);
        let reward = this.genReward(s, size);
        let penalty = (this.genPenaltyDole(size) * reward).toFixed(0);
        let deadline = this.genDeadline(s, size);

        return new ProjectModel(this.genName(), 'project', kind, platform, reward, penalty, stats, size, deadline);
    }

    static genReward(s, size) {
        return 2000 + Math.ceil((_.max(s) + _.sum(s)) * 5 * size);
    }

    static genPenaltyDole(size) {
        return [0, 0, 0, 0.5, 1, 0][size];
    }

    static genDeadline(s, size) {
        return 48 +  // constant for anti-weekend effect on small projects
            Math.floor((((_.max(s) + _.sum(s)) * 3) / (size)));
    }



    static generateTraining(worker, skill=null) {
        let level = Math.floor((worker.statsSum()/4*0.5) + (worker.stats[skill]*2));

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

    static generateHackathon(hackathons_generated) {
        let kind = _.sample(_.keys(project_kinds));
        let platform = _.sample(_.keys(project_platforms));

        let stats = _.mapValues(skills, () => {
            return _.random(0, 100 * hackathons_generated);
        });
        stats = JSON.parse(JSON.stringify(stats));

        let reward = hackathons_generated * 10000;
        let penalty = 0;
        let deadline = 24 * 5;
        let complexity = hackathons_generated * 5;
        return new ProjectModel(this.genName(), 'hackathon', kind, platform, reward, penalty, stats, 6, deadline, complexity);
    }

    static generateAgency(agency_state) {
        const size = agency_state.size;

        //console.log(agency_state);
        let stats = _.mapValues(skills, (value, skill) => {
            let stat = _.random(agency_state.min_stats[skill], agency_state.max_stats[skill]);
            //console.log(skill, stat);
            return stat;
        });
        //console.log(stats);

        let kind = _.sample(_.keys(project_kinds));
        let platform = _.sample(_.keys(project_platforms));
        stats = JSON.parse(JSON.stringify(stats));
        let s = _.values(stats);
        let reward = this.genReward(s, size);
        let penalty = (this.genPenaltyDole(size) * reward).toFixed(0);
        let deadline = this.genDeadline(s, size);
        return new ProjectModel(this.genName(), 'project', kind, platform, reward, penalty, stats, size, deadline);
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
        //console.log(projects_generated);
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
