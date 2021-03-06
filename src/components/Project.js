import React, { Component } from 'react';
import Portal from 'react-portal';

import ReactBootstrapSlider from 'react-bootstrap-slider';
import '../../node_modules/bootstrap-slider/dist/css/bootstrap-slider.min.css';

import _ from 'lodash';
import classNames from 'classnames';

import {tick} from '../App';
import TeamDialog from './TeamDialog';
import StatsBar from './StatsBar';
import ProjectName from './ProjectName';

import {skills_names, skills, technologies} from '../data/knowledge';


class Project extends Component {
    constructor(props) {
        super(props);

        this.manage = this.manage.bind(this);
        this.manageAll = this.manageAll.bind(this);
        this.changeTechnology = this.changeTechnology.bind(this);
        this.finish = this.finish.bind(this);
        this.fix = this.fix.bind(this);
        this.open = this.open.bind(this);
        this.pause = this.pause.bind(this);
        this.unpause = this.unpause.bind(this);
        this.close = this.close.bind(this);
    }

    componentDidMount() {
        if (!this.props.project.briefing) {
            this.props.project.briefing = true;
            this.refs.manage.openPortal();
        }
    }

    manage(event) {
        this.props.data.helpers.modifyRelation(event.target.id, this.props.project.id, event.target.checked);
    }

    manageAll(event) {
        this.props.data.helpers.modifyRelation(null, this.props.project.id, event.target.checked);
    }

    changeTechnology(event) {
        this.props.data.helpers.changeTechnology(event.target.id, this.props.project.id, event.target.checked);
    }

    open() {
        this.props.data.helpers.openProject(this.props.project.id);
    }
    pause() {
        this.props.data.helpers.pauseProject(this.props.project.id);
    }
    unpause() {
        this.props.data.helpers.unpauseProject(this.props.project.id);
    }

    close() {
        this.props.data.helpers.closeProject(this.props.project.id);
    }

    fix() {
        this.props.data.helpers.fixProject(this.props.project.id);
    }

    finish() {
        this.props.data.helpers.finishProject(this.props.project.id);
    }

    render() {
        const data = this.props.data;
        const project = this.props.project;

        const stats_data = _.mapValues(skills, (stat, key) => {
            return {name: key, // _.capitalize(key[0]),
                val:
                    <span>
                        <span className="text-warning">{project.needs[key]}</span>
                        {project.errors[key] > 0 ? <span className="text-danger">+{project.errors[key]}</span> : ''}
                        /<span>{project.needs_max[key]}</span>
                    </span>
            };
        });

        const manage_button = <button className="btn flex-element">Manage</button>;

        let label = (id, text) => { return <span key={id}> <label className="label-default">{text}</label> </span>; };

        let team_ids = {};
        _.keys(data.relations).forEach((worker_id) => {
            let worker_projects = data.relations[worker_id];
            _.keys(worker_projects).forEach((project_id) => {
                let relation = worker_projects[project_id];
                if (relation && project_id === project.id) {
                    team_ids[worker_id] = true;
                }
            })
        });
        let team = [];
        data.workers.forEach((worker) => {
            if (worker.id in team_ids) { team.push(worker); }
        });
        const team_label = team.map((worker) => { return label(worker.id, worker.name); });

        let tech = [];
        if (project.id in data.projects_technologies) {
            Object.keys(data.projects_technologies[project.id]).forEach((tech_name) => {
                if (data.projects_technologies[project.id][tech_name]) {
                    tech.push(tech_name);
                }
            });
        }
        const tech_label = tech.map((tech_name) => { return label(tech_name, technologies[tech_name].acronym); });

        const start_pause_button =
            <span>
                {/*{project.stage}*/}
                {(project.stage === 'paused')
                    ? <button className="btn btn-success" onClick={this.unpause}>Start</button> : ''}
                {(project.stage === 'ready')
                    ? <button className="btn btn-success" onClick={this.open}>Start</button> : ''}
                {project.stage === 'open'
                    ? <button className="btn btn-warning" onClick={this.pause}>Pause</button> : ''}
            </span>;

        const reject_button = <button className="btn btn-danger" onClick={() => {
            if (confirm("Reject project "+project.name+'? (penalty: '+project.penalty+')')) {
                this.close();
            } }}>Reject</button>;

        return (
            <div className="well well-sm fat">
                <div className="flex-container-row">
                    <label className="flex-element"> <ProjectName project={project} /> </label>
                    <label className="flex-element"> Reward: {project.reward}$ </label>
                    {(project.penalty > 0 ? <label className="flex-element"> Penalty: {project.penalty}$ </label> : ' ')}
                    <div>
                        {start_pause_button}
                        {reject_button}
                        <Portal ref="manage" closeOnEsc openByClickOn={manage_button}>
                            <TeamDialog>
                                <h4 className="flex-container-row">
                                    <label className="flex-element"> <ProjectName project={project} /> </label>
                                    <label className="flex-element">
                                        Reward: {project.reward}$
                                        {(project.penalty > 0 ? <label className="flex-element"> Penalty: {project.penalty}$ </label> : ' ')}
                                    </label>
                                    <div className="flex-element"> <label> {start_pause_button} {reject_button} </label> </div>
                                </h4>
                                <div className="row">
                                    <div className="col-md-8">
                                        <div>
                                            {project.deadline > 0 ? <div key="deadline" className="row">
                                                <div className="col-md-2">Deadline</div>
                                                <div className="col-md-10 progress">
                                                    <div className={classNames('progress-bar', (project.deadline / project.deadline_max < 0.1 ? 'progress-bar-danger' : 'progress-bar-warning'))} role="progressbar"
                                                         style={{width: (100-(project.deadline / project.deadline_max * 100))+'%'}}>
                                                        <label>{project.deadline_max - project.deadline} hours</label>
                                                    </div>
                                                    <div className="progress-bar progress-bar-success" role="progressbar"
                                                         style={{width: (project.deadline / project.deadline_max * 100)+'%'}}>
                                                        <label>{project.deadline} hours</label>
                                                    </div>
                                                </div>
                                            </div> : ''}
                                            <div className="flex-container-row">
                                                <div className="flex-element"> Iteration: {project.iteration} </div>
                                                <div className="flex-element"> Tasks: {project.tasksQuantity()}/{project.planedTasksQuantity()} </div>
                                                <div className="flex-element"> Bugs: <label className="text-danger">{project.bugsQuantity()}</label></div>
                                                <div className="flex-element"> Complexity: {project.complexity} </div>
                                            </div>

                                            <div>
                                                {project.type === 'draft' && project.stage === 'ready'
                                                    ? skills_names.map((skill) => {
                                                       return <div key={skill} className="row">
                                                           <div className="col-md-2">{skill}</div>
                                                           <div className="col-md-10 ">
                                                           <ReactBootstrapSlider
                                                               scale='logarithmic'
                                                               value={project.needs_max[skill]}
                                                               change={(e) => { project.needs[skill] = e.target.value; project.needs_max[skill] = e.target.value; }}
                                                               step={1}
                                                               max={100000}
                                                               min={0}/>
                                                           </div>
                                                       </div>;
                                                    }) : ''}
                                            </div>
                                            <div>
                                                {project.type === 'draft' && project.stage === 'ready'
                                                    ? ''
                                                    : skills_names.map((skill) => {
                                                        let need = project.needs[skill];
                                                        let errors = project.errors[skill];
                                                        let needs_max = project.needs_max[skill];//+errors;
                                                        let max_skill = _.maxBy(_.keys(project.needs_max), function (skill) {
                                                            return Math.max(project.needs_max[skill], project.needs[skill]) + project.errors[skill];
                                                        });

                                                        let max = Math.max(project.needs_max[max_skill], project.needs[max_skill]) + project.errors[max_skill];
                                                        let diff = needs_max - need;
                                                        let tasks = need / max * 100;
                                                        let bugs = errors / max * 100;
                                                        let done = diff / max * 100;

                                                        return <div key={skill} className="row">
                                                            <div className="col-md-2">{skill}</div>
                                                            <div className="col-md-10 progress">
                                                                <div className="progress-bar progress-bar-warning"
                                                                     role="progressbar"
                                                                     style={{width: tasks + '%'}}>
                                                                    {need ? <label>{need} tasks</label> : ''}
                                                                </div>
                                                                <div className="progress-bar progress-bar-danger"
                                                                     role="progressbar"
                                                                     style={{width: bugs + '%'}}>
                                                                    {errors ? <label>{errors} bugs</label> : ''}
                                                                </div>
                                                                <div className="progress-bar progress-bar-success"
                                                                     role="progressbar"
                                                                     style={{width: done + '%'}}>
                                                                    {(diff) ? <label>{diff} done</label> : ''}
                                                                </div>
                                                            </div>
                                                        </div>;
                                                    })
                                                }
                                            </div>

                                            {data.helpers.getTechnology(project.id, 'refactoring') ? <div key="refactoring" className="row">
                                                <div className="col-md-2">Refactoring</div>
                                                <div className="col-md-10 progress">
                                                    <div className="progress-bar progress-bar-warning" role="progressbar"
                                                         style={{width: (project.complexity / project.complexity_max * 100)+'%'}}>
                                                        <label>{project.complexity} complexity</label>
                                                    </div>
                                                    <div className="progress-bar progress-bar-success" role="progressbar"
                                                         style={{width: (100-(project.complexity / project.complexity_max * 100))+'%'}}>
                                                        {(project.complexity_max - project.complexity > 0) ?
                                                            <label>{project.complexity_max - project.complexity} refactored</label> : ''}
                                                    </div>
                                                </div>
                                            </div> : ''}

                                            {project.tests > 0 ? <div key="tests" className="row">
                                                <div className="col-md-2">Tests</div>
                                                <div className="col-md-10 progress">
                                                    <div className="progress-bar progress-bar-warning" role="progressbar"
                                                         style={{width: (100-(project.tests / project.planedTasksQuantity() * 100))+'%'}}>
                                                        <label>{project.planedTasksQuantity()-project.tests} tasks</label>
                                                    </div>
                                                    <div className="progress-bar progress-bar-success" role="progressbar"
                                                         style={{width: (project.tests / project.planedTasksQuantity() * 100)+'%'}}>
                                                        {(project.tests) ?<label>{project.tests} done</label> : ''}
                                                    </div>
                                                </div>
                                            </div> : ''}

                                        </div>
                                        <div className="panel panel-success">
                                            <div>
                                                {this.props.data.workers.map((worker) => {
                                                    const stats_data = _.mapValues(worker.stats, (val, skill) => {
                                                        return {name: skill,
                                                            val: <div key={worker.id + project.id} className="checkbox-inline">
                                                                <label style={{width: '100%'}}>
                                                                    <input
                                                                        type="checkbox"
                                                                        id={worker.id || ''}
                                                                        checked={data.helpers.getRelation(worker.id, project.id, skill)}
                                                                        onChange={(event) => {
                                                                            data.helpers.modifyRelation(event.target.id, project.id, event.target.checked, skill);
                                                                        }}/>
                                                                    {(worker.stats[skill] + worker.expirience[skill]/100).toFixed(2)}
                                                                </label>
                                                            </div>};
                                                    });
                                                    return <div key={worker.id + project.id}>
                                                            <div>{worker.name}</div>
                                                            <StatsBar stats={stats_data} data={this.props.data} />
                                                    </div>
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="panel panel-success slim-left">
                                            <div className="col slim-left">
                                                {data.projects_known_technologies.map(
                                                    (technology, i) => <div key={technology} className="row-md-1">
                                                        <div className="checkbox slim-margin">
                                                            <label>
                                                                <h5 className="text-center slim">
                                                                    <input
                                                                        type="checkbox"
                                                                        id={technology}
                                                                        checked={data.helpers.getTechnology(project.id, technology)}
                                                                        onChange={this.changeTechnology}/>
                                                                    {technologies[technology].name}
                                                                </h5>
                                                                <p className="small slim">{technologies[technology].description}</p>
                                                            </label>
                                                        </div>
                                                    </div>
                                                )}
                                                {(tick > (24*30*3)) ? Object.keys(technologies).map(
                                                    (technology, i) => <div key={technology} className="row-md-1">
                                                        <div className="checkbox slim-margin small">
                                                            {!data.projects_known_technologies.includes(technology)
                                                                ? <label>
                                                                <h5 className="text-center slim">
                                                                    <button
                                                                        className={technologies[technology].price <= data.money ? "btn btn-success btn-xs" : "btn btn-default btn-xs disabled"}
                                                                        onClick={() => { if (technologies[technology].price <= data.money) data.helpers.unlockTechnology(technology); }}
                                                                    >
                                                                        Unlock {technologies[technology].price}$
                                                                    </button>
                                                                    {technologies[technology].name}
                                                                </h5>
                                                                <p className="small slim">{technologies[technology].description}</p>
                                                            </label> : ''}
                                                        </div>
                                                    </div>
                                                ) : ''}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </TeamDialog>
                        </Portal>
                    </div>
                </div>

                {project.deadline > 0 ?
                    <div className="progress slim">
                        <div className={classNames('progress-bar', (project.deadline / project.deadline_max < 0.1 ? 'progress-bar-danger' : 'progress-bar-warning'))} role="progressbar"
                             style={{width: (100-(project.deadline / project.deadline_max * 100))+'%'}}>
                            <label>{project.deadline_max - project.deadline} gone</label>
                        </div>
                        <div className="progress-bar progress-bar-success" role="progressbar"
                             style={{width: (project.deadline / project.deadline_max * 100)+'%'}}>
                            <label>{project.deadline} to deadline</label>
                        </div>
                    </div> : ''}

                {(() => {
                    let errors = project.bugsQuantity();
                    let need = project.tasksQuantity();
                    var max = Math.max(project.planedTasksQuantity(), project.tasksQuantity());
                    let diff = max - need;

                    let sum = max + errors;

                    let tasks = need / sum * 100;
                    let bugs = errors / sum * 100;
                    let done = (diff / sum * 100)-0.1;

                    return <div className="progress slim">
                        <div className="progress-bar progress-bar-warning" role="progressbar"
                             style={{width: tasks+'%'}}>
                            {need ? <label>{need} tasks</label> : ''}
                        </div>
                        <div className="progress-bar progress-bar-danger" role="progressbar"
                             style={{width: bugs+'%'}}>
                            {errors ? <label>{errors} bugs</label> : ''}
                        </div>
                        <div className="progress-bar progress-bar-success" role="progressbar"
                             style={{width: done+'%'}}>
                            {(diff) ? <label>{diff} done</label> : ''}
                        </div>
                    </div>;
                })()}

                <StatsBar stats={stats_data} data={this.props.data} />

                <div className="flex-container-row slim">
                    <div className="flex-element"> Tasks: {project.tasksQuantity()}/{project.planedTasksQuantity()} </div>
                    <div className="flex-element"> Bugs: <label className="text-danger">{project.bugsQuantity()}</label> </div>
                    <div className="flex-element"> Complexity: {project.complexity} </div>
                    <div className="flex-element"> Iteration: {project.iteration} </div>
                </div>

                <div className="small slim">
                    <p className="small slim">Team: {team_label}</p>
                    {tech.length ? <p className="small slim">Tech: {tech_label}</p> : ''}
                </div>
            </div>
        );
    }
}

export default Project;
