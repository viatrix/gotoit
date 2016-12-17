import React, { Component } from 'react';
import Portal from 'react-portal';
import _ from 'lodash';

import TeamDialog from './TeamDialog';

import {skills_names, technologies} from '../data/knowledge';


class Project extends Component {
    constructor(props) {
        super(props);
        this.manage = this.manage.bind(this);
        this.manageAll = this.manageAll.bind(this);
        this.changeTechnology = this.changeTechnology.bind(this);
        this.finish = this.finish.bind(this);
        this.fix = this.fix.bind(this);
        this.close = this.close.bind(this);
    }

    componentDidMount() {
        this.refs.manage.openPortal();
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

        const manage_button = <button className="btn">Manage</button>;

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

        let tmp = '';
        if (project.isFinished()) {
            if (project.isFixed()) {
                tmp = <button className="small" onClick={this.finish}>Finish Project</button>;
            }
            else {
                tmp = <button className="small" onClick={this.fix}>Fix Bugs</button>;
            }
        }
        else {
            tmp = <button className="small btn-danger" onClick={this.close}>Reject Project!</button>;
        }
        const finish_button = tmp;


        return (
            <div className="unit_block">
                {project.name} ({project.reward}$)

                <Portal ref="manage" closeOnEsc closeOnOutsideClick openByClickOn={manage_button}>
                    <TeamDialog>
                        <h2>Project Team</h2>
                        <div>
                            Who will work on {project.name} project?
                            <input type="checkbox" onChange={this.manageAll}/>All
                            <ul>
                                {this.props.data.workers.map((worker, i) =>
                                    <li key={worker.id + project.id}>
                                        <input
                                            type="checkbox"
                                            id={worker.id || ''}
                                            checked={data.helpers.getRelation(worker.id, project.id)}
                                            onChange={this.manage}/>
                                        {worker.name}
                                    </li>
                                )}
                            </ul>
                        </div>
                        <h2>Project Technologies</h2>
                        <div>
                            Which technologies should be used on {project.name} project?
                            <ul>
                                {Object.keys(technologies).map((technology, i) =>
                                    <li key={technology}>
                                        <input
                                            type="checkbox"
                                            id={technology}
                                            checked={data.helpers.getTechnology(project.id, technology)}
                                            onChange={this.changeTechnology}/>
                                        <span> {technologies[technology].name} </span>
                                        <span className="small"> {technologies[technology].description} </span>
                                    </li>
                                )}
                            </ul>
                        </div>
                        <div>
                            {finish_button}
                        </div>
                    </TeamDialog>
                </Portal>

                <ul>
                    {skills_names.map((skill) => {
                        return <li key={skill}>
                            <span> {skill} {project.needs[skill]} </span>
                            {project.errors[skill] > 0 ? <span> ({project.errors[skill]}) </span> : ' '}
                             / <span> {project.needs_max[skill]} </span>
                        </li>
                    })}
                    {project.tests > 0 ? <li key="tests">tests <span>{project.tests}</span> / <span>{project.planedTasksQuantity()}</span></li> : ''}
                </ul>

                <div>
                    <span> Tasks: {project.tasksQuantity()}/{project.planedTasksQuantity()} </span>
                    <span> Bugs: {project.bugsQuantity()} </span>
                    <span> Complexity: {project.complexity} </span>
                    <span> Iteration: {project.iteration} </span>
                </div>

                <div className="small">
                    <p>Team: {team_label}</p>
                    <p>Tech: {tech_label}</p>
                </div>
            </div>
        );
    }
}

export default Project;
