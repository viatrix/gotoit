import React, { Component } from 'react';
import Portal from 'react-portal';

import TeamDialog from './TeamDialog';
import MarketTop from './MarketTop';
import ProjectOfferBlock from './ProjectOfferBlock';

import SalesAgency from './SalesAgency';
import Project from './Project';
import ProjectReport from './ProjectReport';

class Projects extends Component {
    constructor(props) {
        super(props);
        this.state = {show_archive: true};
    }

    render() {
        const find_projects = <button className="btn btn-success">Find Projects</button>;

        let project_block_template = (candidate, type) => {
            return <ProjectOfferBlock key={candidate.id} candidate={candidate} data={this.props.data} type={type} />;
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
