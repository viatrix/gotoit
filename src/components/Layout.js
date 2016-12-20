import React, { Component } from 'react';

import People from './People';
import Projects from './Projects';
import Office from './Office';
import PopupsNest from './PopupsNest';

class Layout extends Component {
    render() {
        return (
            <div>
                <div>
                    <Office data={this.props.data} />
                </div>
                <div className="App row">
                    <div className="col-md-6">
                        <People data={this.props.data}/>
                    </div>
                    <div className="col-md-6">
                        <Projects data={this.props.data} />
                    </div>
                </div>
                <PopupsNest data={this.props.data} />
            </div>
        );
    }
}

export default Layout;
