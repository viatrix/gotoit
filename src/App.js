import React, {Component} from 'react';
import _ from 'lodash';

import '../node_modules/bootstrap-slider/dist/css/bootstrap-slider.min.css';
import './App.css';

import Layout from './components/Layout';
import {addMessage, addAction, addNotification} from './components/ToastNest';
import {chatMessage} from "./components/Chat";

import WorkerModel from './models/WorkerModel';
import ProjectModel from './models/ProjectModel';
import OfficeModel from './models/OfficeModel';

import Lorer from './services/Lorer';

import {skills_names, technologies, skills_true} from './data/knowledge';

import app_state from './data/AppData';

export var tick = 0;

export var hired = 1;
export var projects_done = 0;

export var getData = () => { return {}; };

class App extends Component {
    constructor(props) {
        super(props);

        this.playGame = this.playGame.bind(this);
        this.pauseGame = this.pauseGame.bind(this);

        this.brutalSet = this.brutalSet.bind(this);
        this.brutalGet = this.brutalGet.bind(this);
        this.checkState = this.checkState.bind(this);

        this.tick = this.tick.bind(this);
        this.addMoney = this.addMoney.bind(this);
        this.chargeMoney = this.chargeMoney.bind(this);

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
        this.openProject = this.openProject.bind(this);
        this.pauseProject = this.pauseProject.bind(this);
        this.unpauseProject = this.unpauseProject.bind(this);
        this.closeProject = this.closeProject.bind(this);
        this.trainingProject = this.trainingProject.bind(this);
        this.draftProject = this.draftProject.bind(this);
        this.unlockTechnology = this.unlockTechnology.bind(this);
        this.getTechnology = this.getTechnology.bind(this);
        this.changeTechnology = this.changeTechnology.bind(this);
        this.upOffice = this.upOffice.bind(this);
        this.downOffice = this.downOffice.bind(this);

        this.howManyEmployers = this.howManyEmployers.bind(this);


        app_state.data.helpers['playGame'] = this.playGame;
        app_state.data.helpers['pauseGame'] = this.pauseGame;

        app_state.data.helpers['brutalSet'] = this.brutalSet;
        app_state.data.helpers['brutalGet'] = this.brutalGet;
        app_state.data.helpers['checkState'] = this.checkState;

        app_state.data.helpers['tick'] = this.tick;
        app_state.data.helpers['addMoney'] = this.addMoney;
        app_state.data.helpers['chargeMoney'] = this.chargeMoney;

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
        app_state.data.helpers['openProject'] = this.openProject;
        app_state.data.helpers['pauseProject'] = this.pauseProject;
        app_state.data.helpers['unpauseProject'] = this.unpauseProject;
        app_state.data.helpers['closeProject'] = this.closeProject;
        app_state.data.helpers['trainingProject'] = this.trainingProject;
        app_state.data.helpers['draftProject'] = this.draftProject;
        app_state.data.helpers['unlockTechnology'] = this.unlockTechnology;
        app_state.data.helpers['getTechnology'] = this.getTechnology;
        app_state.data.helpers['changeTechnology'] = this.changeTechnology;
        app_state.data.helpers['upOffice'] = this.upOffice;
        app_state.data.helpers['downOffice'] = this.downOffice;

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

    checkState() {
        this.setState({data: this.state.data});
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
        if (!(worker_id in data.workers_roles))  data.workers_roles[worker_id] = JSON.parse(JSON.stringify(skills_true));
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
        //data.workers_roles[worker.id] = JSON.parse(JSON.stringify(skills_true));
        skills_names.forEach((skill) => { this.changeRole(worker.id, skill, true); });
        this.modifyRelation(worker.id, null, true);
        this.setState({data: data});
    }

    dismissEmployer(id) {
        hired--;
        let data = this.state.data;
        _.remove(data.workers, (worker) => { return (worker.id === id); });
        this.setState({data: data});
    }

    contractSearch(agency_state, agency_reward) {
        let data = this.state.data;
        this.chargeMoney(agency_reward);
        let project = ProjectModel.generateAgency(agency_state);
        data.sales_agency_state = agency_state;
        data.offered_projects.contract.push(project);
        this.setState({data: data});
    }

    rejectOffered(id, type) { // rejectOffer
        let data = this.state.data;
        _.remove(data.offered_projects[type], (candidate) => { return (candidate.id === id); });
        this.setState({data: data});
    }

    acceptOffered(id, type) {
        let data = this.state.data;
        let project = (_.remove(data.offered_projects[type], (candidate) => { return (candidate.id === id); }))[0];
        this.acceptAndMoveProject(project);
        addMessage('Accepted '+project.name+' project', {timeOut: 5000, extendedTimeOut: 2000}, 'info');
        this.setState({data: data});
    }

    startOffered(id, type) {
        let data = this.state.data;
        let project = (_.remove(data.offered_projects[type], (candidate) => { return (candidate.id === id); }))[0];

        if (!project) {
            console.log('Broker offered project '+id+' '+type);
            return false;
        }

        project.briefing = true;
        this.acceptAndMoveProject(project);
        this.openProject(id);
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
        let project = ProjectModel.generateDraft();
        this.state.data.projects.push(project);
        this.modifyRelation(null, project.id, true);
        this.checkState();
    }

    openProject(id) {
        let project = _.find(this.state.data.projects, (project) => { return (project.id === id); });
        project.stage = 'open';
        addMessage('Started '+project.name+' project', {timeOut: 5000, extendedTimeOut: 2000}, 'info');
        //this.checkState();
    }

    pauseProject(id) {
        let project = _.find(this.state.data.projects, (project) => { return (project.id === id); });
        project.stage = 'paused';
        //this.checkState();
    }

    unpauseProject(id) {
        let project = _.find(this.state.data.projects, (project) => { return (project.id === id); });
        project.stage = 'open';
        //this.checkState();
    }

    closeProject(id) {
        this.projectReporting(id, 'close');
        this.checkState();
    }

    failProject(id) {
        this.projectReporting(id, 'fail');
        this.checkState();
    }

    fixProject(id) {
        let data = this.state.data;
        let project = _.find(data.projects, (project) => { return (project.id === id); });
        project.fix();
        addMessage(project.name+' project enters '+project.iteration+' iteration for fixing bugs.', 'error');
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
        //console.log('archiving', data.projects_end_reports, data.projects_archive_reports, projects, project);
     //  //this.setState({data: data});

        if (project.is_storyline || project.stage !== 'finish' ) return;

        if (project.type === 'training' && !data.achievements.includes('FirstTraining')) {
            data.offered_projects.hot.push(Lorer.afterFirstTraining(project));
            data.achievements.push('FirstTraining')
        }
        if (project.size === 1 && !data.achievements.includes('FirstPart')) {
            data.offered_projects.hot.push(Lorer.afterFirstPart(project));
            data.achievements.push('FirstPart')
        }
        if (project.size === 2 && !data.achievements.includes('FirstModule')) {
            data.offered_projects.hot.push(Lorer.afterFirstModule(project));
            data.achievements.push('FirstModule')
        }
        if (project.size === 3 && !data.achievements.includes('FirstApplication')) {
            data.offered_projects.hot.push(Lorer.afterFirstApplication(project));
            data.achievements.push('FirstApplication')
        }
        if (project.size === 4 && !data.achievements.includes('BigDeal')) {
            data.offered_projects.hot.push(Lorer.afterFirstBigDeal(project));
            data.achievements.push('BigDeal')
        }

        //this.checkState();
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
        addNotification('Income to your wallet: '+quantity+'$', {timeOut: 5000, extendedTimeOut: 1000}, 'success');
        this.setState({data: data});
    }

    chargeMoney(quantity, silent = false) {
        if (quantity <= 0) {
            /***
             * @todo fix chargeMoney(0)
             */
            return false;
        }
        let data = this.state.data;
        data.money -= quantity;
        if (!silent) addNotification('Charge from your wallet: '+quantity+'$', {timeOut: 3000, extendedTimeOut: 2000}, 'warning');
        this.setState({data: data});
    }

    changeOffice(new_size) {
        let data = this.state.data;
        data.office = new OfficeModel(new_size);
        addNotification('You new apartments: '+data.office.name+'. Monthly price: '+data.office.price+'$', {timeOut: 10000, extendedTimeOut: 2000}, 'success');
        this.setState({data: data});
    }

    upOffice() {
        this.changeOffice(this.state.data.office.size + 1);
    }

    downOffice() {
        this.changeOffice(this.state.data.office.size - 1);
    }

    howManyEmployers() {
        return this.state.data.workers.length;
    }

    componentWillMount(){
    }

    componentDidMount() {
        //this.playGame();
    }

    componentWillUnmount() {
        this.pauseGame();
    }

    playGame() {
        const data = this.state.data;
        data.game_paused = false;
        this.timerID = setInterval(
            () => this.tick(true),
            this.state.data.game_speed
        );
        this.setState({data: data});
    }

    pauseGame() {
        const data = this.state.data;
        data.game_paused = true;
        clearInterval(this.timerID);
        this.setState({data: data});
    }


    tick(updating = true) {
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

        if (updating) this.setState({data: data});
    }

    rollTurn() {
        const data = this.state.data;

        switch (tick) {
            case 5:
                addAction('Hi there! Important messages will appear in this corner of the screen.', {timeOut: 15000, extendedTimeOut: 5000, closeButton: false}, 'success');
                break;
            case 24:
                addAction('First of all, choose the origin and formation of your character.', {timeOut: 15000, extendedTimeOut: 5000, closeButton: false}, 'success');
                break;
            case 10:
             //   addAction('Then find your first project.', {timeOut: 15000, extendedTimeOut: 5000}, 'success');
                break;
            default:
                break;
        }


        if (tick < (24 * 7)) {
            return false; // no generation first week
        }

        let probability = Math.min(50, (10 + (projects_done*0.1))) / 24;

        if (data.offered_projects.freelance.length < 5 && _.random(0.0, 100.0) < probability) {
            let quality = Math.ceil(_.random(1, (tick / (24*30)) + (projects_done*0.2)));
            let size =
                (quality < 3) ? 1 : (
                    (quality < 5) ? _.random(1, _.random(1, 2)) : (
                        (quality < 10) ? _.random(1, 2) : (
                            (quality < 15) ? (_.random(0, 1) ? _.random(1, 2) : _.random(1, 3)) : (
                                (quality < 20) ? _.random(1, 3) : (
                                    (quality < 25) ? (_.random(0, 1) ? _.random(1, 3) : _.random(1, 4)) : (
                                        (quality < 30) ? _.random(1, 4) : (
                                            (quality < 35) ? (_.random(0, 1) ? _.random(1, 4) : _.random(2, 4)) : (
                                                (quality < 40) ? _.random(2, 4) : (
                                                    (quality < 45) ? _.random(_.random(2, 4), 4) : (
                                                        (quality < 50) ? _.random(3, 4) : 4
                                                    )
                                                )
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    )
                );

            //console.log('probability: ' + probability.toFixed(2) + ' quality: ' + quality + ' size: ' + size);
            data.offered_projects.freelance.push(ProjectModel.generate(quality, size));
            addAction('New job!', {timeOut: 3000, extendedTimeOut: 1000});
        }
        if (_.random(1, 100) < Math.sqrt(probability)) {
            _.remove(data.candidates.resumes, (candidate) => { return (candidate.id === data.candidates.resumes[0].id); });
        }


        if (Math.floor(_.random(1, 24 * (50 - Math.min(25, projects_done*0.2)))) === 1 && data.candidates.resumes.length < 5) {
            let worker = WorkerModel.generate(_.random(2, 5));
            data.candidates.resumes.push(worker);
            addAction('New resume: ' + worker.name);
        }
        if (_.random(1, 24*7*8) === 1 && data.candidates.resumes.length > 0) {
            _.remove(data.candidates.resumes, (candidate) => { return (candidate.id === data.candidates.resumes[0].id); });
        }

        if (Math.floor(_.random(1, (24*7*4*12)/(1+(projects_done*0.1)))) === 1 && data.candidates.resumes.length < 5) {
            let experience = _.random(10, 20);
            let worker = WorkerModel.generate(experience);
            worker.standing += experience * 12 * _.random(5, 10+experience);
            data.candidates.resumes.push(worker);
            let max_skill = _.maxBy(Object.keys(worker.stats), function (o) { return worker.stats[o]; });
            addAction('Excellent '+max_skill+' ninja '+worker.name+' looking for a job');
        }

/*
        if (Math.floor(_.random(1, (24*2) + (projects_done*0.1))) === 1 && data.offered_projects.freelance.length < 5) {
            data.offered_projects.freelance.push(ProjectModel.generate(_.random(1, 3), _.random(1, 2)));
            addAction('New freelance job!', {timeOut: 3000, extendedTimeOut: 1000});
        }
        if (_.random(1, 24*7) === 1 && data.offered_projects.freelance.length > 0) {
            _.remove(data.offered_projects.freelance, (candidate) => { return (candidate.id === data.offered_projects.freelance[0].id); });
        }

        if (Math.floor(_.random(1, 24*((7*8)/(1+projects_done*0.1)))) === 1 && data.offered_projects.freelance.length < 5) {
            data.offered_projects.freelance.push(ProjectModel.generate(_.random(15, 30 + Math.sqrt(projects_done)), 4));
            addAction('New big deal!', {timeOut: 5000, extendedTimeOut: 3000});
        }
        */


        if (tick < (24 * 30 * 5)) {
            return false; // no additional generation first 5 month
        }

        if (!data.wasRecentlyHackathon && _.random(1, 24*60)) {
            data.wasRecentlyHackathon = true;
            data.offered_projects.hot.push(Lorer.hackathon());
        }



        //this.setState({data: data});
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

                if (!worker.is_player) {
                    let dissatisfaction = Math.floor((10000 - Math.pow(worker.calcEfficiency() + 25, 2)) / 30);
                    let smoothing = 1 + (parseInt(worker.getOverrate(), 10) / 100);
                    let breakpoint = _.random(1, 10000);
                    //console.log(dissatisfaction, worker.calcEfficiency(), Math.floor(Math.pow(worker.calcEfficiency(), 2)), breakpoint);
                    if ((dissatisfaction / smoothing) > breakpoint) {
                        worker.to_leave = true;
                        worker.to_leave_ticker = 24 * 7 * 2; // 2 weeks
                        addNotification(worker.name + ' leaves your company in two weeks', {
                            timeOut: 20000,
                            extendedTimeOut: 10000
                        }, 'error');
                    }
                }
            });
        }

        if (time.date !== 1 && game_date.getDate() === 1) {
            // first day
            if (data.office.size > 1) {
                this.chargeMoney(data.office.price);
            }

            // allow hackathon this month
            data.wasRecentlyHackathon = false;

            //loans
            data.taken_loans.forEach((loan) => {
                this.chargeMoney(Math.floor((loan.money * (1 + (loan.interest/100)))/loan.time));
                loan.timer--;
                data.early_payed_loans++;
            });

            (_.remove(data.taken_loans, (loan) => { return (loan.timer === 0); })).forEach((loan) => {
                data.old_loans.push(loan);
            });
        }
        time.date = game_date.getDate();
        time.day = game_date.getUTCDay();

        time.is_working_time = !!(
            time.hour >= 10 &&
            time.hour <= 18 &&
            time.day !== 6 &&
            time.day !== 0);

        data.date = time;
        //this.setState({data: data});
    }

    work() {
        const data = this.state.data;

        _.shuffle(data.workers).forEach((worker) => {
            // worker quiting
            if (worker.to_leave) {
                if (worker.to_leave_ticker <= 0) {
                    addNotification(worker.name+' resigned from your company', {timeOut: 20000, extendedTimeOut: 10000}, 'error');
                    this.dismissEmployer(worker.id);
                }
                else {
                    worker.to_leave_ticker--;
                }
            }

            // Vacation
            if (!worker.to_vacation && !worker.in_vacation && worker.stamina <= 0) {
                worker.to_vacation = true;
                worker.to_vacation_ticker = 24 * 7 * 2; // 2 weeks
                addNotification(worker.name+' leaves on vacation in two weeks', {timeOut: 10000, extendedTimeOut: 5000}, 'error');
            }
            if (worker.to_vacation) {
                worker.to_vacation_ticker--;
                if (worker.to_vacation_ticker <= 0) {
                    worker.to_vacation = false;
                    worker.in_vacation = true;
                    let long =  _.random(2, 3);
                    worker.in_vacation_ticker = 24 * 7 * long; // 1-3 weeks
                    addNotification(worker.name+' leaves on a '+long+' week vacation now', {timeOut: 15000, extendedTimeOut: 8000}, 'error');
                }
            }
            if (worker.in_vacation) {
                //console.log('worker in vacation');
                worker.in_vacation_ticker--;
                if (worker.in_vacation_ticker === 0) {
                    worker.in_vacation = false;
                    worker.stamina = 1000;
                    addNotification(worker.name+' comes back from vacation', {timeOut: 5000, extendedTimeOut: 3000}, 'success');
                }
                return false;
            }
            if (_.random(1, (1 + parseFloat(worker.getOverrate())).toFixed(0)) === 1) { // additional drain even worker do not work
                worker.drainStamina();
            }

            // if you money end, your guys don't work
            if (!worker.is_player && (data.money - worker.getSalary()) < 0) return false;

            let worker_projects = data.projects.filter((project) => {
                return (project.isNeed(this.getRelation(worker.id, project.id)) && project.stage === 'open');
            });
       //     console.log(worker_projects);
            // work on one of projects
            if (worker_projects.length > 0) {
                let skip_work = false;

                let project = _.sample(worker_projects);
                let worker_roles = this.getRelation(worker.id, project.id);
                let focus_on = (this.getTechnology(project.id, 'agile'))
                    ? _.maxBy(Object.keys(project.getNeeds(worker_roles)), function (o) { return project.needs[o]; })
                    : _.sample(Object.keys(project.getNeeds(worker_roles)));
                let rad = this.getTechnology(project.id, 'rad');
                let micromanagement = this.getTechnology(project.id, 'micromanagement');
                let creativity = this.getTechnology(project.id, 'creativity');
                let overtime = this.getTechnology(project.id, 'overtime');
                let overtimed = false;
                let pair = this.getTechnology(project.id, 'pair');

                const formName = () => {
                    return worker.name + (overtimed ? ' in overtime' : '');
                };

                // Overtime
                let is_working_time = worker.isWorkingTime(data.date, micromanagement);
                if (!is_working_time) {
                    if (overtime) {
                        if (worker.morale > 0) {
                            if (_.random(1, 4) === 1) {
                                overtimed = true;
                                //chatMessage(worker.name, 'I overtime today');
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
                    this.chargeMoney(salary, true);
                    worker.facts.money_earned += salary;
                    project.facts.money_spent += salary;
                }
                worker.drainStamina();
                if (project.type === 'hackathon') { // additional drain on Hackathons
                    worker.drainStamina();
                    worker.drainStamina();
                }


                // Creativity
                if (creativity && is_working_time && (_.random(1, 5) === 1)) {
                    skip_work = true;
                    worker.facts.training_tasks_done += worker.getSideResource();
                    chatMessage(formName(), 'I spent an hour to my pet-project.', 'warning');
                }

                // Agile
                if (!skip_work && this.getTechnology(project.id, 'agile')
                    && (_.min([project.planedTasksQuantity(), project.tasksQuantity()]) > _.random((Math.PI * Math.sqrt(project.originalyTasksQuantity())), project.originalyTasksQuantity()))
                    && _.random(1, 3) === 1)
                {
                    let retrospected = worker.getSideResource();
                    if (retrospected > 0) {
                        var res = _.sample(Object.keys(project.getNeeds(worker_roles)));
                        retrospected = Math.floor(_.min([project.needs[res], Math.sqrt(project.needs_max[res]), retrospected]));

                        let cut = Math.floor(project.reward * (retrospected / (1+project.planedTasksQuantity())));
                        worker.facts.retrospected += retrospected;
                        project.facts.retrospected += retrospected;
                        project.facts.cuted_cost += cut;
                        project.needs[res] -= retrospected;
                        project.needs_max[res] -= retrospected;
                        project.reward -= cut;
                        chatMessage(formName(), 'cut ' + retrospected + ' ' + res + ' tasks and ' + cut + '$', 'success');
                        skip_work = true;
                    }
                }

                // TDD
                if (!skip_work && this.getTechnology(project.id, 'tdd') && project.tests < project.planedTasksQuantity() &&
                    ((project.tests / project.planedTasksQuantity()) < (project.tasksQuantity() / project.planedTasksQuantity()))  &&
                    _.random(1, 3) === 1)
                {
                    //console.log('writing tests!');
                    let tests = Math.min(project.planedTasksQuantity() - project.tests, worker.getRareSideResource());
                    worker.facts.tests_wrote += tests;
                    project.facts.tests_wrote += tests;
                    project.tests += tests;
                    chatMessage(formName(), ' wrote '+tests+' tests!', 'success');
                    skip_work = true;
                }

                // Refactoring
                if (!skip_work && project.complexity > 0 && this.getTechnology(project.id, 'refactoring')) {
                    if (project.complexity < (project.tasksQuantity() + project.bugsQuantity()) && ((
                            _.random(1, project.complexity) >
                            _.random(([0, 0.1, 1, 2, 3, 4][project.size]) * Math.sqrt(project.complexity), Math.sqrt(project.planedTasksQuantity())))
                        )
                    ) {
                        //console.log('refactoring!');
                        let refactoring = Math.min(project.complexity, worker.getRareSideResource());
                        worker.facts.refactored += refactoring;
                        project.facts.refactored += refactoring;
                        project.complexity -= refactoring;
                        chatMessage(formName(), ' refactored ' + refactoring + ' complexity!', 'success');
                        skip_work = true;
                    }
                }

                // Pair.
                if (!skip_work && this.getTechnology(project.id, 'pair') && !project.supporter) {
                    project.supporter = worker;
                    skip_work = true;
                }

                // Work
                if (!skip_work) {
                    worker.addExperience(
                        project.applyWork(
                            worker.getResources(worker_roles, focus_on, micromanagement),
                        worker, rad, creativity, pair, overtimed));
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
