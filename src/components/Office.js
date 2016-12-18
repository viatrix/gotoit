import React, { Component } from 'react';
import {FormattedDate} from 'react-intl';

class Office extends Component {
    render() {
        const date = this.props.data.date;

        var real_date = new Date();
        var game_date = new Date();
        game_date.setDate(real_date.getDate()+(date.tick/24));

        return (
            <div>
                <h4 className="text-center">Office</h4>
                <h5>Money <label>{this.props.data.money}</label></h5>
                <FormattedDate
                    value={game_date}
                    day="numeric"
                    month="long"
                    year="numeric" />
                <div>
                    <p className="flex-container-row">
                    <span className="flex-element">
                        {(date.is_working_time ?
                        <label className="label-success">Working</label> :
                        (date.day > 5) ?
                            <label className="label-default">Weekends</label> :
                            <label className="label-info">Sleeping</label>)}
                    </span>
                    <span className="flex-element">Hour: {date.hour}</span>
                    <span className="flex-element">Day: {date.day}</span>
                    <span className="flex-element">Weak: {date.weak}</span>
                    <span className="flex-element">Month: {date.month}</span>
                    <span className="flex-element">Year: {date.year}</span>
                </p>
                </div>
            </div>
        );
    }
}

export default Office;
