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
                <div>
                    <p className="row">
                        <span className="inline">
                            <FormattedDate
                            value={game_date}
                            weekday="short"
                            day="numeric"
                            month="long"
                            year="numeric"
                            hour="numeric"
                            />
                        </span> <span className="inline">
                        {(date.is_working_time ?
                            <label className="label-success">Working</label> :
                            (date.day > 5) ?
                                <label className="label-default">Weekends</label> :
                                <label className="label-info">Sleeping</label>)}
                    </span>
                </p>
                </div>
            </div>
        );
    }
}

export default Office;
