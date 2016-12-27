import React, {Component} from 'react';
import _ from 'lodash';

import Layout from './components/Layout';
import {addMessage, addAction} from './components/ToastNest';
import './App.css';
import WorkerModel from './models/WorkerModel';
import ProjectModel from './models/ProjectModel';
import OfficeModel from './models/OfficeModel';

import {skills_names, technologies} from './data/knowledge';

import app_state from './AppData';

export var tick = 0;

//var agency_generation_counter = 0;
var contract_generation_counter = 0;

export var hired = 1;
export var projects_done = 0;

export var getData = () => { return {}; };

class App extends Component {
    constructor(props) {
        super(props);

        this.brutalSet = this.brutalSet.bind(this);
        this.brutalGet = this.brutalGet.bind(this);
        this.addMoney = this.addMoney.bind(this);

        this.getRelation = this.getRelation.bind(this);
        this.modifyRelation = this.modifyRelation.bind(this);
        this.getRole = this.getRole.bind(this);
        this.changeRole = this.changeRole.bind(this);
        this.hireCandidate = this.hireCandidate.bind(this);
        this.rejectCandidate = this.rejectCandidate.bind(this);
        this.agencySearch = this.agencySearch.bind(this);
        this.hireEmployer = this.hireEmployer.bind(this);
        this.dismissEmployer = this.dismissEmployer.bind(this);
        this.contractSearch = this.contractSearch.bind(this);
        this.rejectOffered = this.rejectOffered.bind(this);
        this.acceptOffered = this.acceptOffered.bind(this);
        this.startOffered = this.startOffered.bind(this);
        this.acceptAndMoveProject = this.acceptAndMoveProject.bind(this);
        this.projectArchiving = this.projectArchiving.bind(this);
        this.finishProject = this.finishProject.bind(this);
        this.fixProject = this.fixProject.bind(this);
        this.startProject = this.startProject.bind(this);
        this.closeProject = this.closeProject.bind(this);
        this.trainingProject = this.trainingProject.bind(this);
        this.draftProject = this.draftProject.bind(this);
        this.unlockTechnology = this.unlockTechnology.bind(this);
        this.getTechnology = this.getTechnology.bind(this);
        this.changeTechnology = this.changeTechnology.bind(this);
        this.upOffice = this.upOffice.bind(this);

        this.howManyEmployers = this.howManyEmployers.bind(this);


        app_state.data.helpers['brutalSet'] = this.brutalSet;
        app_state.data.helpers['brutalGet'] = this.brutalGet;
        app_state.data.helpers['addMoney'] = this.addMoney;

        app_state.data.helpers['modifyRelation'] = this.modifyRelation;
        app_state.data.helpers['getRelation'] = this.getRelation;
        app_state.data.helpers['getRole'] = this.getRole;
        app_state.data.helpers['changeRole'] = this.changeRole;
        app_state.data.helpers['hireCandidate'] = this.hireCandidate;
        app_state.data.helpers['rejectCandidate'] = this.rejectCandidate;
        app_state.data.helpers['agencySearch'] = this.agencySearch;
        app_state.data.helpers['hireEmployer'] = this.hireEmployer;
        app_state.data.helpers['dismissEmployer'] = this.dismissEmployer;
        app_state.data.helpers['contractSearch'] = this.contractSearch;
        app_state.data.helpers['rejectOffered'] = this.rejectOffered;
        app_state.data.helpers['acceptOffered'] = this.acceptOffered;
        app_state.data.helpers['startOffered'] = this.startOffered;
        app_state.data.helpers['acceptAndMoveProject'] = this.acceptAndMoveProject;
        app_state.data.helpers['projectArchiving'] = this.projectArchiving;
        app_state.data.helpers['finishProject'] = this.finishProject;
        app_state.data.helpers['fixProject'] = this.fixProject;
        app_state.data.helpers['startProject'] = this.startProject;
        app_state.data.helpers['closeProject'] = this.closeProject;
        app_state.data.helpers['trainingProject'] = this.trainingProject;
        app_state.data.helpers['draftProject'] = this.draftProject;
        app_state.data.helpers['unlockTechnology'] = this.unlockTechnology;
        app_state.data.helpers['getTechnology'] = this.getTechnology;
        app_state.data.helpers['changeTechnology'] = this.changeTechnology;
        app_state.data.helpers['upOffice'] = this.upOffice;

        this.state = app_state;

        getData = () => {
            return this.state.data;
        };
    }


    brutalGet() {
        return this.state;
    }

    brutalSet(state) {
        this.setState(state);
    }


    getRelation(worker_id, project_id, role = null) {
        if (role !== null) {
            return (
            worker_id in this.state.data.relations &&
            project_id in this.state.data.relations[worker_id] &&
            this.state.data.relations[worker_id][project_id][role]);
        }
        else {
            return (
            worker_id in this.state.data.relations &&
            project_id in this.state.data.relations[worker_id] &&
            this.state.data.relations[worker_id][project_id]);
        }
    }

    modifyRelation(worker_id, project_id, value, role = null) {
      //  console.log(worker_id, project_id, value);
        let data = this.state.data;

        let put = (worker_id, project_id) => {
            if (!(worker_id in data.relations)) data.relations[worker_id] = {};
            if (!(project_id in data.relations[worker_id])) data.relations[worker_id][project_id] = {}; //JSON.parse(JSON.stringify(data.workers_roles[worker_id]));
            if (role) {
                data.relations[worker_id][project_id][role] = value;
            }
            else {
                data.relations[worker_id][project_id] = JSON.parse(JSON.stringify(data.workers_roles[worker_id]));
                //data.relations[worker_id][project_id] = value;
            }
        };

        if (worker_id === null) {
            this.state.data.workers.forEach((worker) => {
                if (worker.accept_default) put(worker.id, project_id);
            });
        } else if (project_id === null) {
            this.state.data.projects.forEach((project) => {
                if (project.accept_default) put(worker_id, project.id);
            });
        } else {
            put(worker_id, project_id);
        }

        this.setState({data: data});
    }

    getRole(worker_id, role) {
        if (worker_id in this.state.data.workers_roles && role in this.state.data.workers_roles[worker_id])
            return this.state.data.workers_roles[worker_id][role];
    }

    changeRole(worker_id, role, value) {
        let data = this.state.data;
        if (!(worker_id in data.workers_roles))  data.workers_roles[worker_id] = {};
        data.workers_roles[worker_id][role] = value;
        this.setState({data: data});
    }

    agencySearch(agency_state, agency_reward) {
        //agency_generation_counter++;
        let data = this.state.data;
        data.money -= agency_reward;
        let worker = WorkerModel.generateAgency(agency_state);
        data.hiring_agency_state = agency_state;
        data.candidates.agency.push(worker);
        this.setState({data: data});
    }

    hireCandidate(id, type) {
        let data = this.state.data;
        this.hireEmployer((_.remove(data.candidates[type], (candidate) => { return (candidate.id === id); }))[0]);
        this.setState({data: data});
    }

    rejectCandidate(id, type) {
        let data = this.state.data;
        _.remove(data.candidates[type], (candidate) => { return (candidate.id === id); });
        this.setState({data: data});
    }

    hireEmployer(worker) {
        hired++;
        let data = this.state.data;
        worker.facts.tick_hired = data.date.tick;
        data.workers.push(worker);
        this.modifyRelation(worker.id, null, true);
        skills_names.forEach((skill) => { this.changeRole(worker.id, skill, true); });
        this.setState({data: data});
    }

    dismissEmployer(id) {
        hired--;
        let data = this.state.data;
        _.remove(data.workers, (worker) => { return (worker.id === id); });
        this.setState({data: data});
    }


    contractSearch() {
        contract_generation_counter++;
        let data = this.state.data;
        data.money -= 1000;
        data.offered_projects.contract.push(ProjectModel.generate(_.random(1, 5 + contract_generation_counter), 3));
        this.setState({data: data});
    }

    rejectOffered(id, type) {
        let data = this.state.data;
        _.remove(data.offered_projects[type], (candidate) => { return (candidate.id === id); });
        this.setState({data: data});
    }

    acceptOffered(id, type) {
        let data = this.state.data;
        let project = (_.remove(data.offered_projects[type], (candidate) => { return (candidate.id === id); }))[0];
        this.acceptAndMoveProject(project);
        addMessage('Accept '+project.name+' project', {timeOut: 5000, extendedTimeOut: 2000}, 'info');
        this.setState({data: data});
    }

    startOffered(id, type) {
        let data = this.state.data;
        let project = (_.remove(data.offered_projects[type], (candidate) => { return (candidate.id === id); }))[0];
        project.briefing = true;
        this.acceptAndMoveProject(project);
        //addMessage('Accept '+project.name+' project', {timeOut: 5000, extendedTimeOut: 2000}, 'info');
        this.startProject(id);
        this.setState({data: data});
    }

    acceptAndMoveProject(project) {
        let data = this.state.data;
        data.projects.push(project);
        Object.keys(data.projects_default_technologies).forEach((technology) => {
            if (data.projects_default_technologies[technology]) {
                this.changeTechnology(technology, project.id, true);
            }
        });
        this.setState({data: data});
        this.modifyRelation(null, project.id, true);
    }

    trainingProject(worker, skill) {
        let data = this.state.data;
        let project = ProjectModel.generateTraining(worker, skill);
        data.projects.push(project);
        Object.keys(data.projects_default_technologies).forEach((technology) => {
            if (data.projects_default_technologies[technology]) {
                this.changeTechnology(technology, project.id, true);
            }
        });
        this.setState({data: data});
        this.modifyRelation(worker.id, project.id, true);
    }

    draftProject() {
        let data = this.state.data;
        let project = ProjectModel.generateDraft();
        data.projects.push(project);
        this.setState({data: data});
        this.modifyRelation(null, project.id, true);
    }

    startProject(id) {
        console.log('App Start Project');
        let data = this.state.data;
        let project = _.find(data.projects, (project) => { return (project.id === id); });
        project.stage = 'open';
        addMessage('Start '+project.name+' project', {timeOut: 5000, extendedTimeOut: 2000}, 'info');
        this.setState({data: data});
    }

    closeProject(id) {
        console.log('App Close Project');
        let data = this.state.data;
        this.projectReporting(id, 'close');
        this.setState({data: data});
    }

    failProject(id) {
        let data = this.state.data;
        console.log('fail');
        this.projectReporting(id, 'fail');
        this.setState({data: data});
    }

    fixProject(id) {
        let data = this.state.data;
        let project = _.find(data.projects, (project) => { return (project.id === id); });
        project.fix();
        addMessage(project.name+' project go to '+project.iteration+' iteration for fixing bugs.', 'error');
        this.setState({data: data});
    }

    finishProject(id) {
        projects_done++;
        let data = this.state.data;
        data.workers.forEach((worker) => { worker.facts.project_finished++; });
        this.addMoney(_.find(data.projects, (project) => { return (project.id === id); }).reward);
        this.projectReporting(id, 'finish');
        this.setState({data: data});
    }

    projectReporting(project_id, stage) {
        let data = this.state.data;
        let project = _.remove(data.projects, (project) => { return (project.id === project_id); })[0];

        addMessage(project.name+' project '+stage, {timeOut: 10000, extendedTimeOut: 5000}, {finish: 'success', fail: 'error', close: 'error'}[stage]);

        if (['fail', 'close'].includes(stage) && project.penalty !== 0) {
            this.chargeMoney(project.penalty);
        }

        if (stage === 'finish') {
            data.simplified_reports.push(project.generateReport(true));
        }

        project.stage = stage;
        data.projects_end_reports.push(project);
        //data.projects_archive_reports.unshift(project);
        this.setState({data: data});
    }

    projectArchiving() {
        let data = this.state.data;
        let projects = data.projects_end_reports.splice(0, 1); //_.remove(data.projects, (project) => { return (project.id === project_id); })[0];
        let project = projects[0]; //_.remove(data.projects, (project) => { return (project.id === project_id); })[0];

        //addMessage(project.name+' project '+stage, {timeOut: 10000, extendedTimeOut: 5000}, {finish: 'success', fail: 'error', close: 'error'}[stage]);

        //data.projects_end_reports.unshift(project);
        data.projects_archive_reports.unshift(project);
        console.log('archiving', data.projects_end_reports, data.projects_archive_reports, projects, project);
        this.setState({data: data});
    }

    unlockTechnology(technology) {
        let data = this.state.data;
        data.money -= technologies[technology].price;
        data.projects_known_technologies.push(technology);
        this.setState({data: data});
    }

    getTechnology(project_id, technology) {
        return (
        project_id in this.state.data.projects_technologies &&
        technology in this.state.data.projects_technologies[project_id] &&
        this.state.data.projects_technologies[project_id][technology]);
    }

    changeTechnology(technology, project_id, value) {
        let data = this.state.data;
        if (!(project_id in data.projects_technologies)) data.projects_technologies[project_id] = {};
        data.projects_technologies[project_id][technology] = value;
        data.projects_default_technologies[technology] = value;
        this.setState({data: data});
    }


    addMoney(quantity) {
        let data = this.state.data;
        data.money += quantity;
        addAction('Income to your wallet: '+quantity+'$', {timeOut: 5000, extendedTimeOut: 1000}, 'success');
        this.setState({data: data});
    }

    chargeMoney(quantity) {
        if (quantity <= 0) {
            console.log('fix chargeMoney(0)');
            return false;
        }
        let data = this.state.data;
        data.money -= quantity;
        addAction('Charge from your wallet: '+quantity+'$', {timeOut: 1500, extendedTimeOut: 500}, 'warning');
        this.setState({data: data});
    }

    upOffice(new_size) {
        let data = this.state.data;
        data.office = new OfficeModel(new_size);
        addAction('You rent new Office. Month price: '+data.office.price+'$', {timeOut: 10000, extendedTimeOut: 2000}, 'success');
        this.setState({data: data});
    }

    howManyEmployers() {
        return this.state.data.workers.length;
    }

    componentWillMount(){
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            250
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }


    tick() {
        const data = this.state.data;

        this.nextDay();

        this.rollTurn();

        this.work(); // now we can work on weekends and at night

        data.projects.forEach((project) => {
            if (project.stage !== 'open' && project.stage !== 'paused') return false;

            if (project.tasksQuantity() === 0 && project.bugsQuantity() === 0) {
                this.finishProject(project.id);
                return;
            }
            project.deadline--;
            if (project.deadline <= 0 && project.type !== 'draft') {
                this.failProject(project.id);
                return;
            }
            if (project.tasksQuantity() === 0 && project.bugsQuantity() !== 0) {
                this.fixProject(project.id);
                return;
            }
        });
    }

    rollTurn() {
        const data = this.state.data;

        if (_.random(1, 24 * (25 - Math.min(10, Math.sqrt(projects_done*0.1)))) === 1 && data.candidates.resumes.length < 5) {
            let worker = WorkerModel.generate(_.random(2, 5));
            data.candidates.resumes.push(worker);
            addAction('New resume: ' + worker.name);
        }
        if (_.random(1, 24*7*8) === 1 && data.candidates.resumes.length > 0) {
            _.remove(data.candidates.resumes, (candidate) => { return (candidate.id === data.candidates.resumes[0].id); });
        }

        if (( _.random(1, (24*7*4*12)/(1+(projects_done*0.1))) === 1 && data.candidates.resumes.length < 5)) {
            let experience = _.random(10, 20);
            let worker = WorkerModel.generate(experience);
            worker.standing += experience * 12 * _.random(5, 10+experience);
            data.candidates.resumes.push(worker);
            let max_skill = _.maxBy(Object.keys(worker.stats), function (o) { return worker.stats[o]; });
            addAction('Excellent '+max_skill+' ninja '+worker.name+' looking for a job');
        }


        if (_.random(1, 24*2) === 1 && data.offered_projects.freelance.length < 5) {
            data.offered_projects.freelance.push(ProjectModel.generate(_.random(1, 3), _.random(1, 2)));
            addAction('New freelance job!', {timeOut: 3000, extendedTimeOut: 1000});
        }
        if (_.random(1, 24*7) === 1 && data.offered_projects.freelance.length > 0) {
            _.remove(data.offered_projects.freelance, (candidate) => { return (candidate.id === data.offered_projects.freelance[0].id); });
        }

        if (_.random(1, 24*((7*4*8)/(1+projects_done*0.1))) === 1 && data.offered_projects.freelance.length < 5) {
            data.offered_projects.freelance.push(ProjectModel.generate(_.random(15, 30 + Math.sqrt(projects_done)), 4));
            addAction('New big deal!', {timeOut: 5000, extendedTimeOut: 3000});
        }

        let tick = data.date.tick;
        switch (tick) {
            case 1:
                addAction('Hi there! In this corner of the screen will appear the important messages.', {timeOut: 10000, extendedTimeOut: 2000}, 'success');
                break;
            case 5:
                addAction('But first of all choose the origin and formation of your character.', {timeOut: 10000, extendedTimeOut: 2000}, 'success');
                break;
            case 10:
                addAction('Then find your first project.', {timeOut: 15000, extendedTimeOut: 2000}, 'success');
                break;
            default:
                break;
        }

        this.setState({data: data});
    }

    nextDay() {
        let data = this.state.data;
        let time = data.date;
        const date = data.date;

        var real_date = new Date();
        var game_date = new Date();
        game_date.setDate(real_date.getDate()+(date.tick/24));

        time.tick++;
        tick = time.tick;
        //time.hour++;
        time.hour = game_date.getHours();

        if (time.hour === 0) {
            console.log('A new day');
            //time.hour = 1;
            data.workers.forEach((worker) => {
               // console.log('worker '+worker.id+' morale '+worker.morale);
                if (worker.morale < 100 && _.random(1, 7)) worker.morale++;
            });
        }

        if (time.date !== 1 && game_date.getDate() === 1) {
            // first day
            if (data.office.size > 1) {
                this.chargeMoney(data.office.price);
            }
        }
        time.date = game_date.getDate();
        time.day = game_date.getUTCDay();

        if (
            time.hour >= 10 &&
            time.hour <= 18 &&
            time.day !== 6 &&
            time.day !== 0
        ) {
            time.is_working_time = true;
        }
        else {
            time.is_working_time = false;
        }

        data.date = time;
        this.setState({data: data});
    }

    work() {
        const data = this.state.data;

        // Pair
        let team_sizes = {};
        _.keys(data.relations).forEach((worker_id) => {
            let worker_projects = data.relations[worker_id];
            _.keys(worker_projects).forEach((project_id) => {
                if (worker_projects[project_id]) {
                    team_sizes[project_id] = team_sizes[project_id] ? team_sizes[project_id] + 1 : 1;
                }
            })
        });
       // console.log(team_sizes);  HERE PROBLEMS - maybe need another way store
        
        data.workers.forEach((worker) => {
            // vacation
            if (!worker.to_vacation && !worker.in_vacation && worker.stamina <= 0) {
                worker.to_vacation = true;
                worker.to_vacation_ticker = 24 * 7 * 2; // 2 weeks
                addAction(worker.name+' leaves on vacation in two weeks', {timeOut: 10000, extendedTimeOut: 5000}, 'error');
            }
            if (worker.to_vacation) {
                worker.to_vacation_ticker--;
                if (worker.to_vacation_ticker <= 0) {
                    worker.to_vacation = false;
                    worker.in_vacation = true;
                    let long =  _.random(1, 3);
                    worker.in_vacation_ticker = 24 * 7 * long; // 1-3 weeks
                    addAction(worker.name+' leaves on vacation '+long+' weeks long', {timeOut: 15000, extendedTimeOut: 8000}, 'error');
                }
            }
            if (worker.in_vacation) {
                //console.log('worker in vacation');
                worker.in_vacation_ticker--;
                if (worker.in_vacation_ticker === 0) {
                    worker.in_vacation = false;
                    worker.stamina = 1000;
                    addAction(worker.name+' come back from vacation', {timeOut: 5000, extendedTimeOut: 3000}, 'success');
                }
                return false;
            }
            if (_.random(1, 10) === 1) {
                worker.drainStamina();
            }


            let is_working_time = worker.isWorkingTime(data.date);

            if (!worker.is_player && (data.money - worker.getSalary()) < 0) return false;

            let skip_work = false;
/*
            //let worker_roles = this.getRelation(worker.id, pr); //[];
            let worker_roles = [];
            skills_names.forEach((role) => {
                if (this.getRole(worker.id, role)) {
                    worker_roles.push(role);
                } });

            // looking worker projects
            let worker_projects = data.projects.filter((project) => {
                return (this.getRelation(worker.id, project.id) &&
                    project.isNeed(worker_roles) &&
                    project.stage === 'open');
            });
            */

            let worker_projects = data.projects.filter((project) => {
                return (project.isNeed(this.getRelation(worker.id, project.id)) && project.stage === 'open');
            });
       //     console.log(worker_projects);
            // work on one of projects
            if (worker_projects.length > 0) {
                let project = _.sample(worker_projects);
                let worker_roles = this.getRelation(worker.id, project.id);

                let focus_on = (this.getTechnology(project.id, 'agile'))
                    ? _.maxBy(Object.keys(project.getNeeds(worker_roles)), function (o) { return project.needs[o]; })
                    : _.sample(Object.keys(project.getNeeds(worker_roles)));

            //    console.log('# '+focus_on);

                let supporter = false;

                let rad = this.getTechnology(project.id, 'rad');
                let micromanagement = this.getTechnology(project.id, 'micromanagement');
                let creativity = this.getTechnology(project.id, 'creativity');
                let overtime = this.getTechnology(project.id, 'overtime');

                // Overtime
                if (!is_working_time) {
                    if (overtime) {
                        if (worker.morale > 0) {
                            if (_.random(1, 4) === 1) {
                                addMessage(worker.name+' overtime!');
                            //    console.log('overtime on '+worker.morale);
                                worker.morale--;
                            }
                            else {
                                //console.log('worker choose rest');
                                return false;
                            }
                        }
                        else {
                            //console.log('worker morale too low');
                            return false;
                        }
                    }
                    else{
                        //console.log('not working time');
                        return false;
                    }
                }

                // get Salary
                if (!worker.is_player) {
                    let salary = worker.getSalary();
                    this.chargeMoney(salary);
                    worker.facts.money_earned += salary;
                    project.facts.money_spent += salary;
                }
                worker.drainStamina();

                // Pet Projects on Fridays
                if (creativity && data.date.day === 5 && is_working_time) {
                    console.log('creativity day');
                    supporter = true;
                }
                // Pair. 1 - worker, 2 - supporter
                if (!supporter && this.getTechnology(project.id, 'pair') &&
                    team_sizes[project.id] > 1 && _.random(1, 2) === 2) {
                    supporter = true;
                    //worker.addExperience(project.applyWork(worker.getResources(worker_roles, focus_on), worker, rad, supporter));
                    console.log('supporter');
                    //return 'supporter';
                }

                // TDD
                if (!supporter && this.getTechnology(project.id, 'tdd') && project.tests < project.planedTasksQuantity() &&
                    ((project.tests / project.planedTasksQuantity()) < (project.tasksQuantity() / project.planedTasksQuantity()))  &&
                    _.random(1, 3) === 1)
                {
                    console.log('writing tests!');
                    let tests = Math.min(project.planedTasksQuantity() - project.tests, worker.getSideResource());
                    worker.facts.tests_wrote += tests;
                    project.facts.tests_wrote += tests;
                    project.tests += tests;
                    addMessage(worker.name+' wrote '+tests+' test!', {}, 'success');
                    skip_work = true;
                }

                // Refactoring
                if (!supporter && this.getTechnology(project.id, 'refactoring') && project.complexity > 0 &&
                    project.complexity < (project.tasksQuantity() + project.bugsQuantity()) && ((
                            _.random(1, project.complexity) >
                            _.random((project.size-1.5) * Math.sqrt(project.complexity), project.planedTasksQuantity()))
                        )
                    )
                {
                    console.log('refactoring!');
                    let refactoring = Math.min(project.complexity, worker.getSideResource());
                    worker.facts.refactored += refactoring;
                    project.facts.refactored += refactoring;
                    project.complexity -= refactoring;
                    addMessage(worker.name+' refactored '+refactoring+' complexity!', {}, 'success');
                    skip_work = true;
                }

                // Work
                if (!skip_work) {
                    worker.addExperience(
                        project.applyWork(
                            worker.getResources(worker_roles, focus_on, micromanagement),
                        worker, rad, creativity, supporter));
                }
            }
            else {
              //  console.log('worker have not projects');
                //worker.goRest();
            }
        });
    }

    render() {
        return (
            <Layout data={this.state.data}/>
        );
    }
}

export default App;
