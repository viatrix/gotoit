import React, { Component } from 'react';

class StatsBar extends Component {
    render() {
        const stats = this.props.stats;

        //console.log(stats);

        return (
                <div className="flex-container-row">
                {Object.keys(stats).map((stat) => {
                    return <div className="small flex-element" key={stat}>
                        {stats[stat].name}: {stats[stat].val}
                    </div>
                })}
                </div>
        );
    }
}

export default StatsBar;
