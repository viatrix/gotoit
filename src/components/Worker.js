import React, { Component } from 'react';
import Portal from 'react-portal';
import _ from 'lodash';

import TeamDialog from './TeamDialog';
import StatsBar from './StatsBar';
import ProjectName from './ProjectName';

import {addAction} from '../components/ToastNest';

import {skills_names, roles, education} from '../data/knowledge';

class Worker extends Component {
    constructor(props) {
        super(props);
        this.manage = this.manage.bind(this);
        this.manageAll = this.manageAll.bind(this);
        this.dismiss = this.dismiss.bind(this);
        this.changeRole = this.changeRole.bind(this);
    }

    componentDidMount() {
        if (this.props.worker.is_player) {
            addAction('This is the management screen of your character. Here you can select its roles in the company. Carefully review information on this screen. Then try Training Project.', {timeOut: 15000, extendedTimeOut: 5000}, 'success');
        }
        this.refs.manage.openPortal();
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
        const data = this.props.data;
        const worker = this.props.worker;

        const manage_button = <button className="btn btn-success btn-sm">Manage</button>;

        const stats_data = _.mapValues(worker.stats, (val, key) => {
            return {name: key, val: (worker.stats[key] + worker.expirience[key]/100).toFixed(2)};
        });

        const efficiency_data = {
            work_load: {name: 'Work Load', val: worker.workloadPenalty()},
            work_difficulty: {name: 'Task Difficulty', val: worker.difficultyPenalty()},
            education: {name: 'Education Balance', val: worker.educationPenalty()},
            collective: {name: 'Collective', val: worker.collectivePenalty()}
        };

        const efficiency_bar_style = (() => {
            let ratio = worker.getEfficiency() / 100;
            switch (true) {
                case ratio <= 0.5: return 'progress-bar-danger';
                case ratio <= 0.75: return 'progress-bar-warning';
                case ratio <= 1: return 'progress-bar-success';
                default: alert('broken ratio: '+ratio);
            }
        }) ();

        return (
            <div className="well well-sm fat">
                {worker.name} {worker.is_player ? 'Player' : <span>{worker.getSalary()}$</span>}
                {worker.in_vacation ? ' in vacation! ' : ''}

                <Portal ref="manage" closeOnEsc closeOnOutsideClick openByClickOn={manage_button}>
                    <TeamDialog>
                        <h2>
                            {worker.name}
                            {worker.in_vacation ? ' in vacation! ' : ''}
                        </h2>
                        <ul>
                            <p>Hired {Math.ceil((this.props.data.date.tick - worker.facts.tick_hired)/24)} days ago.
                                {!worker.is_player ? <span>Got {worker.facts.money_earned}$ of salary
                                    . Overrate: {worker.getOverrate()}% </span> : ' '}
                                Finished {worker.facts.project_finished} project.
                                Done {worker.facts.tasks_done} of {worker.facts.tasks_done + worker.facts.bugs_passed} tasks.
                                Passed {worker.facts.bugs_passed} bugs.
                                Do {worker.facts.refactored} refactoring, wrote {worker.facts.tests_wrote} tests and retrospected {worker.facts.retrospected} tasks.
                            </p>
                        </ul>

                        <div className="panel panel-success text-center">
                            <div key="efficiency" className="row">
                                <div className="col-md-2">Efficiency</div>
                                <div className="col-md-9 progress">
                                    <div className={efficiency_bar_style} role="progressbar"
                                         style={{width: worker.getEfficiency()+'%'}}>
                                        <label>{worker.getEfficiency()}%</label>
                                    </div>
                                </div>
                            </div>
                            <StatsBar stats={efficiency_data} data={this.props.data} />
                            <h5>{worker.tellFeelings()}</h5>
                        </div>

                        <div className="panel panel-success text-center">
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
                                    Auto join new projects
                                </label>
                            </div>
                            <div className="flex-container-row slim">
                                {skills_names.map((role, i) =>
                                    <div key={role} className="checkbox flex-element slim">
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
                        </div>

                        <div className="panel panel-success text-center">
                            <StatsBar stats={stats_data} data={this.props.data} />
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
                        <div>
                            {/*    Which projects {worker.name} has to work?   */}
                            <div className="panel panel-info">
                                {data.projects.map((project) => {
                                        const stats_data = _.mapValues(project.needs, (val, skill) => {
                                            return {name: skill,
                                                val: <div key={worker.id + project.id} className="checkbox-inline">
                                                    <label style={{width: '100%'}}>
                                                        <input
                                                            type="checkbox"
                                                            id={project.id || ''}
                                                            checked={data.helpers.getRelation(worker.id, project.id, skill)}
                                                            onChange={(event) => {
                                                                data.helpers.modifyRelation(worker.id, event.target.id, event.target.checked, skill);
                                                            }}/>
                                                        {project.needs[skill] +'/'+ project.needs_max[skill]}
                                                    </label>
                                                </div>};
                                        });
                                        return <div key={worker.id + project.id}>
                                            <div><ProjectName project={project} /></div>
                                            <StatsBar stats={stats_data} data={this.props.data} />
                                        </div>
                                    }
                                )}
                            </div>
                        </div>
                        <div>
                            {worker.is_player ? '' :
                                <button className="btn btn-danger btn-sm" onClick={this.dismiss}>Dismiss an
                                    employee</button>}
                        </div>
                    </TeamDialog>
                </Portal>

                <div className="progress slim">
                    {/* <div classNames('progress-bar', (100 / worker.getEfficiency() < 0.5 ? 'progress-bar-danger' : 'progress-bar-warning')) role="progressbar"  */}
                    <div className={efficiency_bar_style} role="progressbar"
                         style={{width: worker.getEfficiency()+'%'}}>
                        <label>{worker.getEfficiency()}%</label>
                    </div>
                </div>

                <StatsBar stats={stats_data} data={this.props.data} />
            </div>
        );
    }
}

export default Worker;
