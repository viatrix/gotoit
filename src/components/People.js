import React, { Component } from 'react';
import Portal from 'react-portal';
import _ from 'lodash';

import TeamDialog from './TeamDialog';
import StatsBar from './StatsBar';

import Worker from './Worker';
import HiringAgency from './HiringAgency';

import {skills} from '../data/knowledge';

class People extends Component {
    constructor(props) {
        super(props);

        this.hire = this.hire.bind(this);
        this.reject = this.reject.bind(this);
    }

    hire(event, type) {
        this.props.data.helpers.hireCandidate(event.target.id, type);
    }

    reject(event, type) {
        this.props.data.helpers.rejectCandidate(event.target.id, type);
    }

    render() {
        const hire_button = <button className="btn btn-success">Hire Worker</button>;

        let unit_block_template = (candidate, type) => {
            const stats_data = _.mapValues(skills, (val, key) => {
                return { name: key, val: <span>{candidate.stats[key]}</span> };
            });

            return <div key={candidate.id} className="panel panel-info">{candidate.name} <span> {candidate.getSalary()}$</span>
                <StatsBar stats={stats_data} data={this.props.data} />
                <button className="btn btn-success" id={candidate.id} onClick={(e) => this.hire(e, type)}>Hire</button>
                <button className="btn btn-danger" id={candidate.id} onClick={(e) => this.reject(e, type)}>Hide</button>

            </div>
        };

        let resumes_candidate = (candidate) => { return unit_block_template(candidate, 'resumes'); };
        let agency_candidate  = (candidate) => { return unit_block_template(candidate, 'agency'); };

        return (
            <div>
                <h4 className="text-center slim-top"><label> Your Team </label>
                </h4>
                {this.props.data.workers.map((x, i) =>
                    <Worker key={x.id} worker={x} data={this.props.data} />
                )}
                {(this.props.data.workers.length < this.props.data.office.space)
                    ?
                    <div className="panel panel-success">
                        <Portal closeOnEsc openByClickOn={hire_button}>
                            <TeamDialog>
                                <h3 className="text-center">Hiring</h3>
                                <div className="row">
                                    <div className="col-md-6">
                                        <h4 className="text-center">Resume</h4>
                                        {this.props.data.candidates.resumes.map(resumes_candidate)}
                                    </div>
                                    <div className="col-md-6">
                                        <h4 className="text-center">Agency
                                        <button  className="btn btn-info hidden" onClick={this.props.data.helpers.agencySearch}>Search 1000$</button></h4>
                                        <HiringAgency data={this.props.data} />
                                        {this.props.data.candidates.agency.map(agency_candidate)}
                                    </div>
                                </div>
                            </TeamDialog>
                        </Portal>
                    </div>
                    :
                    <div className="panel panel-warning">
                        {(this.props.data.office.size === 1)
                            ? <button onClick={() => {this.props.data.helpers.upOffice(2);}} className="btn btn-warning">Rent a Office</button>
                            : ((this.props.data.office.size < 4)
                                ? <button onClick={() => {this.props.data.helpers.upOffice(this.props.data.office.size+1);}} className="btn btn-warning">Extend the Office</button>
                                : '')}
                    </div>
                    }
            </div>
        );
    }
}

export default People;