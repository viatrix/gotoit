import React, { Component } from 'react';
import Portal from 'react-portal';
import _ from 'lodash';

import TeamDialog from './TeamDialog';
import StatsBar from './StatsBar';

import Worker from './Worker';
import HiringAgency from './HiringAgency';

import {skills, offices} from '../data/knowledge';

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
        const data = this.props.data;
        const hire_button = <button className="btn btn-success">Hire Worker</button>;

        let unit_block_template = (candidate, type) => {
            const stats_data = _.mapValues(skills, (val, key) => {
                return { name: key, val: <span>{candidate.stats[key]}</span> };
            });

            return <div key={candidate.id} className="panel panel-info">{candidate.name} <span> {candidate.getSalary()}$</span>
                <StatsBar stats={stats_data} data={data} />
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
                {data.workers.map((x, i) =>
                    <Worker key={x.id} worker={x} data={data} />
                )}
                {(data.workers.length < data.office.space)
                    ?
                    <div className="panel panel-success">
                        <Portal closeOnEsc openByClickOn={hire_button}>
                            <TeamDialog>
                                <h3 className="text-center">Hiring</h3>
                                <div className="row">
                                    <div className="col-md-6">
                                        <h4 className="text-center fat">Resume</h4>
                                        {data.candidates.resumes.map(resumes_candidate)}
                                    </div>
                                    <div className="col-md-6">
                                        <h4 className="text-center slim-top">
                                            <button  className="btn btn-info hidden" onClick={data.helpers.agencySearch}>Search 1000$</button>
                                            <HiringAgency data={data} />
                                        </h4>

                                        {data.candidates.agency.map(agency_candidate)}
                                    </div>
                                </div>
                            </TeamDialog>
                        </Portal>
                        <div className="panel panel-warning">
                        <span>
                            {(() => { console.log(data.office, offices, data.workers.length) }) () }
                            {(() => { if(data.office.size > 1) {console.log(offices[data.office.size-1].space, data.workers.length)} }) () }
                            {(data.office.size > 1 && offices[data.office.size-1].space >= data.workers.length)
                                ? ((data.office.size === 2)
                                ? <button onClick={() => {data.helpers.downOffice();}} className="btn btn-warning">Cancel the Office</button>
                                : <button onClick={() => {data.helpers.downOffice();}} className="btn btn-warning">Downgrade the Office</button>)
                                : ''}
                        </span>
                        </div>
                    </div>
                    :
                    <div className="panel panel-warning">
                        <span>
                            {(data.office.size === 1)
                                ? <button onClick={() => {data.helpers.upOffice();}} className="btn btn-warning">Rent a Office</button>
                                : ((data.office.size < 4)
                                    ? <button onClick={() => {data.helpers.upOffice();}} className="btn btn-warning">Extend the Office</button>
                                    : '')}
                        </span>
                    </div>
                    }
            </div>
        );
    }
}

export default People;