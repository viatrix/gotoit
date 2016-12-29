import React, { Component } from 'react';
import Portal from 'react-portal';
import _ from 'lodash';

import TeamDialog from './TeamDialog';
import StatsBar from './StatsBar';
import MarketTop from './MarketTop';
import ProjectName from './ProjectName';

import SalesAgency from './SalesAgency';
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

    acceptOffered(event, type) {
        this.props.data.helpers.acceptOffered(event.target.id, type);
    }

    startOffered(event, type) {
        this.props.data.helpers.startOffered(event.target.id, type);
    }

    reject(event, type) {
        this.props.data.helpers.rejectOffered(event.target.id, type);
    }

    render() {
        const find_projects = <button className="btn btn-success">Find Projects</button>;

        let project_block_template = (candidate, type) => {
            const stats_data = _.mapValues(skills, (stat, key) => {
                return { name: key, val: <span>{candidate.needs[key]}</span> };
            });

            return <div key={candidate.id} className="panel panel-warning">
                <ProjectName project={candidate} />
                <div>
                    <label>Deadline: {candidate.getDeadlineText()}</label>&nbsp;
                    <label>Reward: {candidate.reward}$</label>&nbsp;
                    {candidate.penalty > 0 ? <label>Penalty: {candidate.penalty}$</label> : ''}
                </div>
                <StatsBar stats={stats_data} data={this.props.data} />
                <div className="btn-group">
                    <button className="btn btn-success" id={candidate.id} onClick={(e) => this.acceptOffered(e, type)}>Accept</button>&nbsp;
                    <button className="btn btn-warning" id={candidate.id} onClick={(e) => this.startOffered(e, type)}>Start</button>&nbsp;
                    <button className="btn btn-danger" id={candidate.id} onClick={(e) => this.reject(e, type)}>Hide</button>
                </div>
            </div>
        };

        let freelance_offered = (candidate) => { return project_block_template(candidate, 'freelance'); };
        let contract_offered  = (candidate) => { return project_block_template(candidate, 'contract'); };

        return (
            <div>
                <div className="flex-container-row">
                    <h4 className="flex-element">Current Project</h4>
                    <span className="flex-element">
                        <Portal closeOnEsc openByClickOn={find_projects}>
                            <TeamDialog>
                                <h3 className="text-center">
                                    Find Projects
                                </h3>
                                <div className="row">
                                    <div className="col-md-6">
                                        <h4 className="text-center fat">Freelance</h4>
                                        {this.props.data.offered_projects.freelance.map(freelance_offered)}
                                    </div>
                                    <div className="col-md-6">
                                        <h4 className="text-center slim-top">
                                            <button className="btn btn-info hidden" onClick={this.props.data.helpers.contractSearch}>Search 1000$</button>
                                            <SalesAgency data={this.props.data} />
                                        </h4>
                                        {this.props.data.offered_projects.contract.map(contract_offered)}
                                    </div>
                                </div>
                            </TeamDialog>
                        </Portal>
                    </span>
                    <span className="flex-element hidden"> <label> or </label> <button className="btn btn-info" onClick={this.props.data.helpers.draftProject}>Invent Startup</button></span>
                </div>
                <div>
                    {this.props.data.projects.length ?
                        <div>
                            {this.props.data.projects.map((x, i) =>
                                <Project key={x.id} project={x} data={this.props.data} />
                            )}
                        </div>
                    : <div className="text-center fat">You have not projects in work.</div> }
                </div>
                <div>
                    {this.props.data.projects_archive_reports.length > 0 ?
                        <div key='projects_archive_reports'>
                            <div className="flex-container-row">
                                <h4 className="flex-element">Archived Projects</h4>
                                <span className="flex-element">
                                    <button className="btn btn-warning" onClick={() => {this.setState({show_archive: !this.state.show_archive});}}>
                                        {this.state.show_archive ? 'Hide' : 'Show'} Archive
                                    </button>
                                </span>
                                <span className="flex-element"><MarketTop data={this.props.data} /></span>
                            </div>
                            {this.state.show_archive ?
                                <div key='archive_reports'>
                                    {this.props.data.projects_archive_reports.map((x, i) =>
                                        <ProjectReport key={x.id} project={x} data={this.props.data} />
                                    )}
                                </div>
                            : ''}
                        </div>
                    : ''}
                </div>
            </div>
        );
    }
}

export default Projects;
