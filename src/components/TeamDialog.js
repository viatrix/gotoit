import React, { Component } from 'react';

class TeamDialog extends Component {
    render() {
        return (
            <div className="modal-backdrop">
                <div className="modal team-dialog">
                    <div className="modal-dialog">
                        <div className="modal-content" style={{padding: '10px'}}>
                            <p><button onClick={this.props.closePortal}>Close</button></p>
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TeamDialog;