import React, { Component } from 'react';
import Portal from 'react-portal';
import _ from 'lodash';

import ReactBootstrapSlider from 'react-bootstrap-slider';
import '../../node_modules/bootstrap-slider/dist/css/bootstrap-slider.min.css';

import TeamDialog from './TeamDialog';

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

        this.state = Object.assign({
            min_stats: JSON.parse(JSON.stringify(min)),
            max_stats: JSON.parse(JSON.stringify(max)),
            min_salary: 25,
            max_salary: 50,
        }, this.props.data.hiring_agency_state);

        this.calcCost = this.calcCost.bind(this);
        this.search = this.search.bind(this);
    }

    calcCost() {
        let s = this.state;

        let min_sum = _.sum(_.values(s.min_stats));
        let max_sum = _.sum(_.values(s.max_stats));
        let min_sum_factor = Math.pow(min_sum, 2.8);
        let max_sum_factor = Math.pow(max_sum, 2.4);
        let pike_factor = Math.pow((_.max(_.values(s.min_stats)) + _.max(_.values(s.max_stats))), 2.5);
        //let salary_factor = s.min_salary + (s.max_salary * 2);
        //let salary_factor = Math.pow(s.max_salary, 2);
        let min_salary_factor = Math.pow(s.min_salary, 1.8);
        let max_salary_factor = Math.pow(s.max_salary, 1.6);
        let sum_control_factor = Math.pow(max_sum - min_sum, 2)
            / (1+(max_sum - min_sum));
        let salary_control_factor = Math.pow(s.max_salary - s.min_salary, 2)
            / (201 - s.min_salary - s.max_salary);

        console.log(min_sum_factor, max_sum_factor, pike_factor);
        console.log(min_salary_factor, max_salary_factor, sum_control_factor, salary_control_factor);

        return Math.floor((1000 + min_sum_factor + max_sum_factor + pike_factor)
            / (0.0005 * (1000 + min_salary_factor + max_salary_factor + sum_control_factor + salary_control_factor)));
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
                    <div style={{padding: '18px'}}>
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
                                        tooltip='always'
                                        step={1}
                                        max={50}
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
                            tooltip='always'
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