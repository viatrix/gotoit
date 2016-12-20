import React, { Component } from 'react';
import Portal from 'react-portal';
import _ from 'lodash';

import TeamDialog from './TeamDialog';
import StatsBar from './StatsBar';

import Project from './Project';
import ProjectReport from './ProjectReport';
import ProjectModel from '../models/ProjectModel';
import {skills} from '../data/knowledge';

class Projects extends Component {
    constructor(props) {
        super(props);
        this.state = {show_archive: true};
        this.findProjects = this.findProjects.bind(this);
    }

    findProjects() {
        this.props.data.helpers.startProject(ProjectModel.generate());
    }

    startOffered(event, type) {
        this.props.data.helpers.startOffered(event.target.id, type);
    }

    reject(event, type) {
        this.props.data.helpers.rejectOffered(event.target.id, type);
    }

    render() {
        const find_projects = <button className="btn btn-default">Find Projects</button>;

        let project_block_template = (candidate, type) => {
            const stats_data = _.mapValues(skills, (stat, key) => {
                return { name: key, val: <span>{candidate.needs[key]}</span> };
            });

            return <div key={candidate.id} className="unit_block">{candidate.name}
                <div>deadline: {candidate.getDeadlineText()}</div>
                <StatsBar stats={stats_data} data={this.props.data} />
                <button className="btn btn-success" id={candidate.id} onClick={(e) => this.startOffered(e, type)}>Start</button>
                <button className="btn btn-danger" id={candidate.id} onClick={(e) => this.reject(e, type)}>Reject{type === 'contract' ? ' +900$' : ''}</button>
                {candidate.reward}$
            </div>
        };

        let freelance_offered = (candidate) => { return project_block_template(candidate, 'freelance'); };
        let contract_offered  = (candidate) => { return project_block_template(candidate, 'contract'); };
        let bigdeal_offered   = (candidate) => { return project_block_template(candidate, 'bigdeal'); };

        return (
            <div>
                <h4 className="text-center">Projects</h4>

                <Portal closeOnEsc closeOnOutsideClick openByClickOn={find_projects}>
                    <TeamDialog>
                        <h3 className="text-center">Find Projects</h3>
                        <div className="row">
                            <div className="col-md-4">
                                <h4 className="text-center">Freelance</h4>
                                {this.props.data.offered_projects.freelance.map(freelance_offered)}
                            </div>
                            <div className="col-md-4">
                                <h4 className="text-center">Contract</h4>
                                <button className="btn btn-info" onClick={this.props.data.helpers.contractSearch}>Search 1000$</button>
                                {this.props.data.offered_projects.contract.map(contract_offered)}
                            </div>
                            <div className="col-md-4">
                                <h4 className="text-center">Big Deal</h4>
                                {this.props.data.offered_projects.bigdeal.map(bigdeal_offered)}
                            </div>
                        </div>
                    </TeamDialog>
                </Portal>

                <button className="btn btn-warning" onClick={() => {this.setState({show_archive: !this.state.show_archive});}}>{this.state.show_archive ? 'Hide' : 'Show'} Archive</button>

                <div>
                    <h3>Current Project</h3>
                    <div>
                        {this.props.data.projects.length ?
                            <div>
                                {this.props.data.projects.map((x, i) =>
                                    <Project key={x.id} project={x} data={this.props.data} />
                                )}
                            </div>
                     : 'You have not projects in work.'}
                     </div>
                </div>

                {this.state.show_archive ?
                <div>
                    <h3>Archived Project</h3>
                    <div>
                        {this.props.data.projects_reports.map((x, i) =>
                            <ProjectReport key={x.id} project={x} data={this.props.data} />
                        )}
                    </div>
                </div> : ''}
            </div>
        );
    }
}

export default Projects;
