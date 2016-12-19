import React, { Component } from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import StatsBar from './StatsBar';

import {skills, technologies} from '../data/knowledge';


class Project extends Component {

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

        let label = (id, text) => { return <span key={id}> <label className="label-info small"> {text}</label></span>; };

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


        return (
            <div className="unit_block">
                {project.name} ({project.reward}$)

                {project.deadline > 0 ?
                    <div className="progress">
                        <div className={classNames('progress-bar', (project.deadline / project.deadline_max < 0.1 ? 'progress-bar-danger' : 'progress-bar-warning'))} role="progressbar"
                             style={{width: (100-(project.deadline / project.deadline_max * 100))+'%'}}>
                            <label>{project.deadline_max - project.deadline} gone</label>
                        </div>
                        <div className="progress-bar progress-bar-success" role="progressbar"
                             style={{width: (project.deadline / project.deadline_max * 100)+'%'}}>
                            <label>{project.deadline} to deadline</label>
                        </div>
                    </div> : ''}


                <p className="small">
                    Project is {project.stage}ed with team {team_label}{tech.length ? <span className="small"> and tech {tech_label}</span> : ''}. Spent {project.facts.money_spent}$ for salary.
                    Done {project.facts.tasks_done} tasks. Passed {project.facts.bugs_passed} bugs.
                    Do {project.facts.refactored} refactoring and wrote {project.facts.tests_wrote} tests.
                </p>
                    
                <StatsBar stats={stats_data} data={this.props.data} />

                <div className="flex-container-row">
                    <div className="flex-element"> Tasks: {project.tasksQuantity()}/{project.planedTasksQuantity()} </div>
                    <div className="flex-element"> Bugs: <label className="text-danger">{project.bugsQuantity()}</label> </div>
                    <div className="flex-element"> Complexity: {project.complexity} </div>
                    <div className="flex-element"> Iteration: {project.iteration} </div>
                </div>

            </div>
        );
    }
}

export default Project;
