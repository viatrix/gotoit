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
                <div>
                    <p className="flex-container-row" style={{paddingLeft: 20}}>
                        <span className="flex-element">
                            <FormattedDate
                            value={game_date}
                            weekday="short"
                            day="numeric"
                            month="long"
                            year="numeric"
                            hour="numeric"
                            />
                        </span>

                        <label className="flex-element">Money {this.props.data.money}</label>

                        <span className="pull-right">
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
