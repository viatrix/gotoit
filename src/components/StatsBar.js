import React, { Component } from 'react';

class StatsBar extends Component {
    render() {
        const stats = this.props.stats;

        //console.log(stats);

        return (
                <div className="flex-container-row text-center">
                {Object.keys(stats).map((stat) => {
                    return <div className='flex-element' key={stat}>
                        {stats[stat].name}: {stats[stat].val}
                    </div>
                })}
                </div>
        );
    }
}

export default StatsBar;
