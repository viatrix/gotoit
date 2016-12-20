import React, { Component } from 'react';

class TeamDialog extends Component {
    render() {
        return (
            <div className="modal-backdrop dialog-backdrop">
                <div className="modal team-dialog">
                    <div className="modal-dialog">
                        <div className="modal-content" style={{padding: '10px'}}>
                            <p><button className="btn pull-right" onClick={this.props.closePortal}>Close</button></p>
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TeamDialog;