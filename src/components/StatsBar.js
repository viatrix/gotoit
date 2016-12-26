import React, { Component } from 'react';

/***
 * KILL THIS ASAP
 */


class StatsBar extends Component {
    render() {
        const stats = this.props.stats;

        //console.log(stats);

        return (
                <div className="flex-container-row text-center">
                {Object.keys(stats).map((stat) => {
                    return <div className='flex-element' key={stat}>
                        {stats[stat].name}: <span>{stats[stat].val}</span>
                    </div>
                })}
                </div>
        );
    }
}

export default StatsBar;
