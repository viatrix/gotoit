import React, { Component } from 'react';
import Portal from 'react-portal';
import _ from 'lodash';
import classNames from 'classnames';

import TeamDialog from './TeamDialog';
import StatsBar from './StatsBar';

import {skills_names, roles, education} from '../data/knowledge';
import Narrator from '../services/Narrator';

class Worker extends Component {
    constructor(props) {
        super(props);
        this.manage = this.manage.bind(this);
        this.manageAll = this.manageAll.bind(this);
        this.dismiss = this.dismiss.bind(this);
        this.changeRole = this.changeRole.bind(this);
    }

    componentDidMount() {
        if (!this.props.worker.is_player) this.refs.manage.openPortal();
    }

    manage(event) {
        this.props.data.helpers.modifyRelation(this.props.worker.id, event.target.id, event.target.checked);
    }

    manageAll(event) {
        this.props.data.helpers.modifyRelation(this.props.worker.id, null, event.target.checked);
    }

    dismiss() {
        this.props.data.helpers.dismissEmployer(this.props.worker.id);
    }

    changeRole(event) {
        this.props.data.helpers.changeRole(this.props.worker.id, event.target.id, event.target.checked);
    }

    teach(skill, source) {
        console.log(skill, source);

        switch (source) {
            case 'training':
                this.props.data.helpers.trainingProject(this.props.worker, skill);
                break;
            default:
                console.log('WTF?');
        }
    }

    render() {
        const worker = this.props.worker;

        const manage_button = <button className="btn btn-default">Manage Work</button>;
        const educate_button = <button className="btn btn-default invisible">Educate</button>;

        const stats_data = _.mapValues(worker.stats, (val, key) => {
            return {name: key, val: (worker.stats[key] + worker.expirience[key]/100).toFixed(2)};
        });

        const efficiency_data = {
            work_load: {name: 'Work Load', val: worker.workloadPenalty()},
            work_difficulty: {name: 'Task Difficulty', val: worker.difficultyPenalty()},
            education: {name: 'Education Balance', val: worker.educationPenalty()},
            collective: {name: 'Collective', val: worker.collectivePenalty()}
        };

        return (
            <div className="unit_block">
                {worker.name} {worker.is_player ? 'Player' : <span>{worker.getSalary()}$</span>}
                {worker.in_vacation ? ' in vacation! ' : ''}
                <Portal closeOnEsc closeOnOutsideClick openByClickOn={educate_button}>
                    <TeamDialog>
                        <h2>Worker Education</h2>
                        <div>
                            Which source of education {worker.name} has to use?
                            <table>
                                <thead>
                                    <tr>
                                        <th> </th>
                                        {skills_names.map((skill) => { return <th key={skill}>{skill}</th>; })}
                                    </tr>
                                </thead>
                                <tbody>
                                {Object.keys(education).map((source) =>
                                    <tr key={source}>
                                        <td>{education[source].name}</td>
                                        {skills_names.map((skill) => {
                                            return <td key={skill}><button title={education[source].description} id={source} onClick={() => this.teach(skill, source)}>{education[source].name}</button></td>;
                                        })}
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </TeamDialog>
                </Portal>

                <Portal ref="manage" closeOnEsc closeOnOutsideClick openByClickOn={manage_button}>
                    <TeamDialog>
                        <h2>{worker.name} {worker.in_vacation ? ' in vacation! ' : ''}</h2>
                        <ul>
                            <p>Hired {Math.ceil((this.props.data.date.tick - worker.facts.tick_hired)/24)} days ago.
                                {!worker.is_player ? <span>Got {worker.facts.money_earned}$ of salary. Overrate : {((1 + (worker.standing/(12*4*7*8*Math.PI))).toFixed(2)*100)-100}% </span> : ' '}
                                Finished {worker.facts.project_finished} project.
                                Done {worker.facts.tasks_done} of {worker.facts.tasks_done + worker.facts.bugs_passed} tasks.
                                Passed {worker.facts.bugs_passed} bugs.
                                Do {worker.facts.refactored} refactoring and wrote {worker.facts.tests_wrote} tests.
                            </p>
                        </ul>

                        <div className="panel panel-success text-center">
                            <div key="efficiency" className="row">
                                <div className="col-md-2">Efficiency</div>
                                <div className="col-md-9 progress">
                                    <div className={classNames('progress-bar', (100 / worker.getEfficiency() < 0.5 ? 'progress-bar-danger' : 'progress-bar-warning'))} role="progressbar"
                                         style={{width: worker.getEfficiency()+'%'}}>
                                        <label>{worker.getEfficiency()}%</label>
                                    </div>
                                </div>
                            </div>
                            <StatsBar stats={efficiency_data} data={this.props.data} />
                            <h4>{Narrator.workerFeelings(worker)}</h4>
                        </div>

                            <div className="panel panel-success text-center">
                            <StatsBar stats={stats_data} data={this.props.data} />
                            <div className="row">
                                {skills_names.map((role, i) =>
                                    <div key={role} className="checkbox col-md-3">
                                        <label>
                                            <input
                                                type="checkbox"
                                                id={role}
                                                checked={this.props.data.helpers.getRole(worker.id, role)}
                                                onChange={this.changeRole}/>
                                            <span> {roles[role].name} </span>
                                        </label>
                                    </div>
                                )}
                            </div>
                            <div>
                                {Object.keys(education).map((source) =>
                                    ((!education[source].hide)
                                        ? <div className="flex-container-row" key={source}>
                                        {skills_names.map((skill) => {
                                            return <div  className="flex-element" key={skill}>
                                                <button className="btn btn-info" title={education[source].description} id={source} onClick={() => this.teach(skill, source)}>{education[source].name}</button>
                                            </div>;
                                        })}
                                    </div>
                                        : '')
                                )}
                            </div>
                        </div>
                        <h3>Worker Projects</h3>
                        <ul>
                            Which projects {worker.name} has to work?
                            <div className="checkbox-inline">
                                <label>
                                    <input
                                        type="checkbox"
                                        id={worker.id}
                                        checked={worker.accept_default}
                                        onChange={(e) => {
                                            worker.accept_default = e.target.checked;
                                            this.manageAll(e);
                                            console.log(worker.accept_default);
                                        }}/>
                                    All
                                </label>
                            </div>
                            <div>
                                {this.props.data.projects.map((project, i) =>
                                    <div key={worker.id + project.id} className="checkbox">
                                        <label>
                                            <input
                                                type="checkbox"
                                                id={project.id || ''}
                                                checked={this.props.data.helpers.getRelation(worker.id, project.id)}
                                                onChange={this.manage}/>
                                            {project.name}
                                        </label>
                                    </div>
                                )}
                            </div>
                        </ul>
                        <div>
                            {worker.is_player ? '' :
                                <button className="btn btn-danger btn-sm" onClick={this.dismiss}>Dismiss an
                                    employee</button>}
                        </div>
                    </TeamDialog>
                </Portal>
                <StatsBar stats={stats_data} data={this.props.data} />
            </div>
        );
    }
}

export default Worker;
