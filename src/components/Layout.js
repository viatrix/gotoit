import React, { Component } from 'react';

import Office from './Office';
import People from './People';
import Projects from './Projects';
import Chat from './Chat';
import PopupsNest from './PopupsNest';
import ToastNest from './ToastNest';

class Layout extends Component {
    render() {
        return (
            <div>
                <div className="App row slim-top">
                    <div className="col-md-3 slim">
                        <People data={this.props.data}/>
                    </div>
                    <div className="col-md-6 ">
                        <Office data={this.props.data} />
                        <Projects data={this.props.data} />
                    </div>
                    <div className="col-md-3 slim">
                        <Chat data={this.props.data}/>
                    </div>
                </div>
                <PopupsNest data={this.props.data} />
                <ToastNest data={this.props.data} />
            </div>
        );
    }
}

export default Layout;
