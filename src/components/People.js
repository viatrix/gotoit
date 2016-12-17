import React, { Component } from 'react';
import Portal from 'react-portal';

import TeamDialog from './TeamDialog';
import Worker from './Worker';
import {skills_names} from '../data/knowledge';

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
        const hire_button = <button>Hire Worker</button>;

        let unit_block_template = (candidate, type) => {
            return <div key={candidate.id} className="unit_block">{candidate.name} <span> {candidate.getSalary()}$</span>
                <ul>
                    {skills_names.map((skill) => {
                        return <li key={skill}> <span> {skill} {candidate.stats[skill]} </span> </li>
                    })}
                </ul>
                <button id={candidate.id} onClick={(e) => this.hire(e, type)}>Hire</button>
                <button id={candidate.id} onClick={(e) => this.reject(e, type)}>Reject{type === 'agency' ? ' +900$' : ''}</button>

            </div>
        };

        let resumes_candidate = (candidate) => { return unit_block_template(candidate, 'resumes'); };
        let agency_candidate  = (candidate) => { return unit_block_template(candidate, 'agency'); };
        let stars_candidate   = (candidate) => { return unit_block_template(candidate, 'stars'); };

        return (
            <div>
                <h4>People</h4>

                <Portal closeOnEsc closeOnOutsideClick openByClickOn={hire_button}>
                    <TeamDialog>
                        <h3 className="text-center">Hiring</h3>
                        <div className="row">
                            <div className="col-md-4">
                                <h4 className="text-center">Resume</h4>
                                {this.props.data.candidates.resumes.map(resumes_candidate)}
                            </div>
                            <div className="col-md-4">
                                <h4 className="text-center">Agency</h4>
                                <button onClick={this.props.data.helpers.agencySearch}>Search 1000$</button>
                                {this.props.data.candidates.agency.map(agency_candidate)}
                            </div>
                            <div className="col-md-4">
                                <h4 className="text-center">Stars</h4>
                                {this.props.data.candidates.stars.map(stars_candidate)}
                            </div>
                        </div>
                    </TeamDialog>
                </Portal>

                {this.props.data.workers.map((x, i) =>
                    <Worker key={x.id} worker={x} data={this.props.data} />
                )}
            </div>
        );
    }
}

export default People;