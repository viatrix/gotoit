import React, { Component } from 'react';
import Portal from 'react-portal';
import _ from 'lodash';

import TeamDialog from './TeamDialog';
import StatsBar from './StatsBar';
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
    }

    render() {
        const worker = this.props.worker;

        const manage_button = <button className="btn">Manage Work</button>;
        const educate_button = <button className="btn invisible">Educate</button>;

        const stats_data = _.mapValues(worker.stats, (stat, key) => {
            return {name: key, val: (worker.stats[key] + worker.expirience[key]/100).toFixed(2)};
        });

        return (
            <div className="unit_block">
                {worker.name} {worker.is_player ? 'Player' : <span>{worker.getSalary()}$</span>}
                <Portal closeOnEsc closeOnOutsideClick openByClickOn={educate_button}>
                    <TeamDialog>
                        <h2>Worker Education</h2>
                        <div>
                            Which source of education {worker.name} has to use?
                            <table>
                                <thead>
                                    <tr>
                                        <th></th>
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
                        <h2>Worker Projects</h2>
                        <div>
                            Which projects {worker.name} has to work?
                            <input
                                type="checkbox"
                                id={worker.id}
                                checked={worker.accept_default}
                                onChange={(e) => { worker.accept_default = e.target.checked; this.manageAll(e); console.log(worker.accept_default); }}/> All
                            <ul>
                                {this.props.data.projects.map((project, i) =>
                                    <li key={worker.id + project.id}>
                                        <input
                                            type="checkbox"
                                            id={project.id || ''}
                                            checked={this.props.data.helpers.getRelation(worker.id, project.id)}
                                            onChange={this.manage}/>
                                        {project.name}
                                    </li>
                                )}
                            </ul>
                        </div>
                        <h2>Roles</h2>
                        <div>
                            Which roles {worker.name} has to perform?
                            <ul>
                                {skills_names.map((role, i) =>
                                    <li key={role}>
                                        <input
                                            type="checkbox"
                                            id={role}
                                            checked={this.props.data.helpers.getRole(worker.id, role)}
                                            onChange={this.changeRole}/>
                                        <span> {roles[role].name} </span>
                                        <span className="small"> {roles[role].description} </span>
                                    </li>
                                )}
                            </ul>
                        </div>
                        <div>
                            {worker.is_player ? '' : <button className="small btn-danger" onClick={this.dismiss}>Dismiss an employee</button>}
                        </div>
                    </TeamDialog>
                </Portal>

                <StatsBar stats={stats_data} data={this.props.data} />
            </div>
        );
    }
}

export default Worker;
