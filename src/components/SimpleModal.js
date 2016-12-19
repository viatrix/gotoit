import React, { Component } from 'react';

class SimpleModal extends Component {
    render() {
        return (
            <div className="modal-backdrop dialog-backdrop">
                <div className="modal team-dialog">
                    <div className="modal-dialog">
                        <div className="modal-content" style={{padding: '10px'}}>
                            {this.props.children}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default SimpleModal;