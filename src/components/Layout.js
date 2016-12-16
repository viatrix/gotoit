import React, { Component } from 'react';

import People from './People';
import Projects from './Projects';
import Office from './Office';

class Layout extends Component {
    render() {
        return (
        <div className="row">
            <div className="col-md-4">
                <People data={this.props.data}/>
            </div>
            <div className="col-md-4">
                <Projects data={this.props.data} />
            </div>
            <div className="col-md-4">
                <Office data={this.props.data} />
            </div>
        </div>
        );
    }
}

export default Layout;
