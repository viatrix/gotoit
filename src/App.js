import React, {Component} from 'react';
import _ from 'lodash';

import Layout from './components/Layout';
import './App.css';
import app_state from './AppData';
import WorkerModel from './models/WorkerModel';
import ProjectModel from './models/ProjectModel';
import {skills_names} from './data/knowledge';

var agency_generation_counter = 0;
var contract_generation_counter = 0;

class App extends Component {
    constructor(props) {
        super(props);

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
        this.startOffered = this.startOffered.bind(this);
        this.startProject = this.startProject.bind(this);
        this.finishProject = this.finishProject.bind(this);
        this.fixProject = this.fixProject.bind(this);
        this.closeProject = this.closeProject.bind(this);
        this.getTechnology = this.getTechnology.bind(this);
        this.changeTechnology = this.changeTechnology.bind(this);

        this.howManyEmployers = this.howManyEmployers.bind(this);

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
        app_state.data.helpers['startOffered'] = this.startOffered;
        app_state.data.helpers['startProject'] = this.startProject;
        app_state.data.helpers['finishProject'] = this.finishProject;
        app_state.data.helpers['fixProject'] = this.fixProject;
        app_state.data.helpers['closeProject'] = this.closeProject;
        app_state.data.helpers['getTechnology'] = this.getTechnology;
        app_state.data.helpers['changeTechnology'] = this.changeTechnology;

        this.state = app_state;
    }

    getRelation(worker_id, project_id) {
        return (
        worker_id in this.state.data.relations &&
        project_id in this.state.data.relations[worker_id] &&
        this.state.data.relations[worker_id][project_id]);
    }

    modifyRelation(worker_id, project_id, value) {
        console.log(worker_id, project_id, value);
        let data = this.state.data;

        let put = (worker_id, project_id) => {
            if (!(worker_id in data.relations)) data.relations[worker_id] = {};
            data.relations[worker_id][project_id] = value;
        };

        if (worker_id === null) {
            this.state.data.workers.forEach((worker) => {
                put(worker.id, project_id);
            });
        } else if (project_id === null) {
            this.state.data.projects.forEach((project) => {
                put(worker_id, project.id);
            });
        } else {
            put(worker_id, project_id);
        }

        console.log(data);
        this.setState({data: data});
    }

    getRole(worker_id, role) {
        if (worker_id in this.state.data.workers_roles && role in this.state.data.workers_roles[worker_id])
            return this.state.data.workers_roles[worker_id][role];
    }

    changeRole(worker_id, role, value) {
        console.log(worker_id, role, value);
        let data = this.state.data;
        if (!(worker_id in data.workers_roles))  data.workers_roles[worker_id] = {};
        data.workers_roles[worker_id][role] = value;
        this.setState({data: data});
    }

    agencySearch() {
        agency_generation_counter++;
        let data = this.state.data;
        data.money -= 1000;
        data.candidates.agency.push(WorkerModel.generate(_.random(10, 20) + agency_generation_counter));
        this.setState({data: data});
    }

    hireCandidate(id, type) {
        let data = this.state.data;
        this.hireEmployer((_.remove(data.candidates[type], (candidate) => { return (candidate.id === id); }))[0]);
        this.setState({data: data});

        skills_names.forEach((skill) => { this.changeRole(id, skill, true); });
    }

    rejectCandidate(id, type) {
        let data = this.state.data;
        if (type === 'agency') data.money += 900;
        _.remove(data.candidates[type], (candidate) => { return (candidate.id === id); });
        this.setState({data: data});
    }

    hireEmployer(worker) {
        let data = this.state.data;
        data.workers.push(worker);
        this.modifyRelation(worker.id, null, true);
        this.setState({data: data});
    }

    dismissEmployer(id) {
        let data = this.state.data;
        _.remove(data.workers, (worker) => { return (worker.id === id); });
        this.setState({data: data});
    }


    contractSearch() {
        contract_generation_counter++;
        let data = this.state.data;
        data.money -= 1000;
        data.offered_projects.contract.push(ProjectModel.generate(_.random(10, 20) + contract_generation_counter));
        this.setState({data: data});
    }

    rejectOffered(id, type) {
        let data = this.state.data;
        if (type === 'contract') data.money += 900;
        _.remove(data.offered_projects[type], (candidate) => { return (candidate.id === id); });
        this.setState({data: data});
    }

    startOffered(id, type) {
        let data = this.state.data;
        this.startProject((_.remove(data.offered_projects[type], (candidate) => { return (candidate.id === id); }))[0]);
        this.setState({data: data});
    }

    startProject(project) {
        console.log(project);
        let data = this.state.data;
        data.projects.push(project);
        this.setState({data: data});
        this.modifyRelation(null, project.id, true);
        console.log(data);
    }

    closeProject(id) {
        let data = this.state.data;
        _.remove(data.projects, (project) => { return (project.id === id); });
        this.setState({data: data});
    }

    fixProject(id) {
        let data = this.state.data;
        _.find(data.projects, (project) => { return (project.id === id); }).fix();
        this.setState({data: data});
    }

    finishProject(id) {
        let data = this.state.data;
        this.addMoney(_.find(data.projects, (project) => { return (project.id === id); }).reward);
        _.remove(data.projects, (project) => { return (project.id === id); });
        this.setState({data: data});
    }

    getTechnology(project_id, technology) {
        return (
        project_id in this.state.data.projects_technologies &&
        technology in this.state.data.projects_technologies[project_id] &&
        this.state.data.projects_technologies[project_id][technology]);
    }

    changeTechnology(technology, project_id, value) {
        console.log(technology, project_id, value);
        let data = this.state.data;

        if (!(project_id in data.projects_technologies)) data.projects_technologies[project_id] = {};
        data.projects_technologies[project_id][technology] = value;

        console.log(data);
        this.setState({data: data});
    }


    addMoney(quantity) {
        let data = this.state.data;
        data.money += quantity;
        this.setState({data: data});
    }

    chargeMoney(quantity) {
        let data = this.state.data;
        data.money -= quantity;
        this.setState({data: data});
    }


    howManyEmployers() {
        return this.state.data.workers.length;
    }


    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            200
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }


    tick() {
        this.nextDay();

        this.rollTurn();

        if (this.state.data.date.is_working_time) {
            this.work();
        }
    }

    nextDay() {
        let data = this.state.data;
        let time = data.date;

        time.tick++;
        time.hour++; // ; = time.hour
        if (time.hour > 24) {
            time.hour = 1;
            time.day++;
        }
        if (time.day > 7) {
            time.day = 1;
            time.weak++;
        }
        if (time.weak > 4) {
            time.weak = 1;
            time.month++;
        }
        if (time.month > 12) {
            time.month = 1;
            time.year++;
        }

        if (
            time.hour >= 10 &&
            time.hour <= 18 &&
            time.day <= 5
        ) {
            time.is_working_time = true;
            console.log('time to work');
            this.work();
        }
        else {
            time.is_working_time = false;
        }

        data.date = time;
        this.setState({data: data});
    }

    rollTurn() {
        const data = this.state.data;

        if (_.random(1, 24*7) === 1 && data.candidates.resumes.length < 3) {
            data.candidates.resumes.push(WorkerModel.generate(_.random(3, 5)));
        }
        if (_.random(1, 24*7*2) === 1 && data.candidates.resumes.length > 0) {
            _.remove(data.candidates.resumes, (candidate) => { return (candidate.id === data.candidates.resumes[0].id); });
        }

        if (_.random(1, 24*7*4) === 1 && data.candidates.stars.length < 3) {
            data.candidates.stars.push(WorkerModel.generate(_.random(20, 40)));
        }
        if (_.random(1, 24*7*4) === 1 && data.candidates.stars.length > 0) {
            _.remove(data.candidates.stars, (candidate) => { return (candidate.id === data.candidates.stars[0].id); });
        }

        if (_.random(1, 24*2) === 1 && data.offered_projects.freelance.length < 3) {
            data.offered_projects.freelance.push(ProjectModel.generate(_.random(1, 5)));
        }
        if (_.random(1, 24*5) === 1 && data.offered_projects.freelance.length > 0) {
            _.remove(data.offered_projects.freelance, (candidate) => { return (candidate.id === data.offered_projects.freelance[0].id); });
        }

        if (_.random(1, 24*7) === 1 && data.offered_projects.bigdeal.length < 3) {
            data.offered_projects.bigdeal.push(ProjectModel.generate(_.random(20, 40)));
        }
        if (_.random(1, 24*7) === 1 && data.offered_projects.bigdeal.length > 0) {
            _.remove(data.offered_projects.bigdeal, (candidate) => { return (candidate.id === data.offered_projects.bigdeal[0].id); });
        }

        this.setState({data: data});

    }

    work() {
        const data = this.state.data;
        const tech = data.projects_technologies;
        
        data.workers.forEach((worker) => {
            let skip_work = false;

            let worker_roles = {
                design: this.getRole(worker.id, 'design'),
                manage: this.getRole(worker.id, 'manage'),
                program: this.getRole(worker.id, 'program'),
                admin: this.getRole(worker.id, 'admin')};

            // looking worker projects
            let worker_projects = data.projects.filter((project) => {
                return (
                    worker.id in data.relations &&
                    project.id in data.relations[worker.id] &&
                    data.relations[worker.id][project.id] &&
                    project.isNeed(worker_roles));
            });
            // work on one of projects
            if (worker_projects.length > 0) {
                this.chargeMoney(worker.getSalary());
                let project = _.sample(worker_projects);

                // TDD
                if (project.id in tech && 'tdd' in tech[project.id] && tech[project.id]['tdd'] &&
                        project.tests < project.planedTasksQuantity() && _.random(1, 2) === 1) {
                    console.log('writing tests!');
                    project.tests += Math.min(project.planedTasksQuantity() - project.tests, worker.getSideResource());
                    skip_work = true;
                }

                // Refactoring
                if (project.id in tech &&
                    'refactoring' in tech[project.id] &&
                    tech[project.id]['refactoring'] &&
                    project.complexity &&
                    (_.random(1, project.complexity) > ((project.complexity * 0.66) + 10) ))
                {
                    console.log('refactoring!');
                    project.complexity -= Math.min(project.complexity, worker.getSideResource());
                    skip_work = true;
                }

                // Work
                if (!skip_work) {
                    let focus_on = null;
                    let rad = false;
                    if (project.id in tech &&
                        'agile' in tech[project.id] &&
                        tech[project.id]['agile'])
                    {
                        console.log(project.needs);
                        focus_on = _.maxBy(Object.keys(project.needs), function (o) { return project.needs[o]; });
                    }
                    if (project.id in tech &&
                        'rad' in tech[project.id] &&
                        tech[project.id]['rad'])
                    {
                        console.log(project);
                        rad = true;
                    }
                    worker.addExperience(project.applyWork(worker.getResources(worker_roles, focus_on), rad));
                }

            }
        });

        data.projects.forEach((project) => {
            if (project.tasksQuantity() === 0 && project.bugsQuantity() === 0)
                this.finishProject(project.id);
            if (project.tasksQuantity() === 0 && project.bugsQuantity() !== 0)
                this.fixProject(project.id);
        });
    }

    render() {
        return (
            <Layout data={this.state.data}/>
        );
    }
}

export default App;
