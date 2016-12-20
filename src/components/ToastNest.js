import React, { Component } from 'react';
import _ from 'lodash';

import {ToastContainer, ToastMessage} from "react-toastr";
const ToastMessageFactory = React.createFactory(ToastMessage.animation);

class ToastNest extends Component {
    constructor(props) {
        super(props);
        this.addAlert = this.addAlert.bind(this);
        this.clearAlert = this.clearAlert.bind(this);
    }

    addAlert(text) {
        this.refs.toast.success(text, ``, {
            closeButton: true,
            preventDuplicates: false,
            timeOut: 2000,
            extendedTimeOut: 1000
        });
    }

    clearAlert() {
        this.refs.toast.clear();
    }

    componentDidMount() {
        this.props.data.helpers.addMessage = this.addAlert;
    }

    render() {
        return (
            <div className="toast-nest">
                <div>
                    <ToastContainer ref="toast"
                                    toastMessageFactory={ToastMessageFactory}
                                    className="toast-bottom-right" />
                    <button onClick={this.addAlert}>GGininder</button>
                </div>
            </div>
        );
    }
}

export default ToastNest;