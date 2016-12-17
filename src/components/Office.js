import React, { Component } from 'react';

class Office extends Component {
    render() {
        const date = this.props.data.date;

        return (
            <div>
                <h4 className="text-center">Office</h4>
                <h5>Money <label>{this.props.data.money}</label></h5>
                <div>
                    <p className="row">
                    <span className="col-sm-2 col-md-2">
                        {(date.is_working_time ?
                        <label className="label-success">Working time</label> :
                        (date.day > 5) ?
                            <label className="label-info">Weekend time</label> :
                            <label className="label-info">Sleeping time</label>)}
                    </span>
                    <span className="col-sm-2 col-md-2">Hour: {date.hour}</span>
                    <span className="col-sm-2 col-md-2">Day: {date.day}</span>
                    <span className="col-sm-2 col-md-2">Weak: {date.weak}</span>
                    <span className="col-sm-2 col-md-2">Month: {date.month}</span>
                    <span className="col-sm-2 col-md-2">Year: {date.year}</span>
                </p>

                </div>
            </div>
        );
    }
}

export default Office;
