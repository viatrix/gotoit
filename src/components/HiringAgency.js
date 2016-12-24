import React, { Component } from 'react';
import Portal from 'react-portal';
import _ from 'lodash';

import ReactBootstrapSlider from 'react-bootstrap-slider';
import '../../node_modules/bootstrap-slider/dist/css/bootstrap-slider.min.css';

import TeamDialog from './TeamDialog';

import WorkerModel from '../models/WorkerModel';
import {skills_names, skills} from '../data/knowledge';


class HiringAgency extends Component {
    constructor(props) {
        super(props);

        let max = JSON.parse(JSON.stringify(skills));
        _.keys(max).forEach((skill) => {
            max[skill] = 1;
        });
        let min = JSON.parse(JSON.stringify(skills));
        _.keys(max).forEach((skill) => {
            max[skill] = 10;
        });

        this.state = {
            candidate_blank: WorkerModel.generateBlank(),
            min_stats: JSON.parse(JSON.stringify(min)),
            max_stats: JSON.parse(JSON.stringify(max)),
            min_salary: 25,
            max_salary: 50,
        };

        this.calcCost = this.calcCost.bind(this);
        this.search = this.search.bind(this);
    }

    calcCost() {
        let s = this.state;

        let min_sum = Math.pow(_.sum(_.values(s.min_stats)), 1.6);
        let max_sum = Math.pow((_.sum(_.values(s.max_stats))), 1.8);
        let pike_factor = Math.pow(_.max(_.values(s.max_stats)), 2);
        let salary_factor = s.min_salary + (s.max_salary * 2);

        return Math.floor((1000 + min_sum + max_sum + pike_factor) / (0.005 * (100 + salary_factor)));
    }

    search() {
        this.props.data.helpers.agencySearch(this.state, this.calcCost());
        this.refs.agency.closePortal();
    }

    render() {
        const data = this.props.data;

        const search_button = <button className="btn btn-info">Search</button>;

        const draw_row = (name, child) => {
            return <div key={name} className="row">
                <div className="col-md-2">{name}</div>
                <div className="col-md-10 ">
                    <div style={{padding: '8px'}}>
                        {child}
                    </div>
                </div>
            </div>
        };

        return (
            <Portal ref="agency" closeOnEsc openByClickOn={search_button}>
                <TeamDialog>
                    <div className="text-center">
                        <h3 className="text-center">Hiring Agency</h3>
                        {skills_names.map((skill) => {
                            return draw_row(skill, <ReactBootstrapSlider
                                        value={[this.state.min_stats[skill], this.state.max_stats[skill]]}
                                        change={(e) => {
                                            let state = this.state;
                                            state.min_stats[skill] = e.target.value[0];
                                            state.max_stats[skill] = e.target.value[1];
                                            this.setState(state);
                                        }}
                                        step={1}
                                        max={100}
                                        min={1}/>)
                        })}
                        {draw_row('Salary overrate', <ReactBootstrapSlider
                            value={[this.state.min_salary, this.state.max_salary]}
                            change={(e) => {
                                console.log(e);
                                let state = this.state;
                                state.min_salary = e.target.value[0];
                                state.max_salary = e.target.value[1];
                                this.setState(state);
                            }}
                            step={1}
                            max={100}
                            min={0}/>)}
                        <button className={this.calcCost() < data.money ? "btn btn-success" : "btn btn-success disabled"} onClick={() => { if (this.calcCost() < data.money) { this.search() } }}>Search {this.calcCost()}</button>
                    </div>
                </TeamDialog>
            </Portal>
        );
    }
}

export default HiringAgency;