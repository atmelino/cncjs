import _ from 'lodash';
import i18n from '../../../lib/i18n';
import pubsub from 'pubsub-js';
import React from 'react';
import socket from '../../../lib/socket';
import serialport from '../../../lib/serialport';
import {
    WORKFLOW_STATE_RUNNING,
    WORKFLOW_STATE_PAUSED,
    WORKFLOW_STATE_IDLE,
    ACTIVE_STATE_IDLE
} from './constants';

class Toolbar extends React.Component {
    static propTypes = {
        port: React.PropTypes.string,
        ready: React.PropTypes.bool,
        activeState: React.PropTypes.string
    };
    state = {
        workflowState: WORKFLOW_STATE_IDLE,
        queueFinished: false
    };
    socketEventListener = {
        'gcode:queue-status': ::this.socketOnGCodeQueueStatus
    };
    pubsubTokens = [];

    componentDidMount() {
        this.addSocketEventListener();
        this.subscribe();
    }
    componentWillUnmount() {
        this.removeSocketEventListener();
        this.unsubscribe();
    }
    componentDidUpdate() {
        this.props.setWorkflowState(this.state.workflowState);
    }
    componentWillReceiveProps(nextProps) {
        let { port, activeState } = nextProps;

        if (!port) {
            this.setState({ workflowState: WORKFLOW_STATE_IDLE });
            return;
        }

        if ((this.state.queueFinished) && (activeState === ACTIVE_STATE_IDLE)) {
            socket.emit('gcode:stop', port);
            pubsub.publish('gcode:stop');
            this.setState({
                workflowState: WORKFLOW_STATE_IDLE,
                queueFinished: false
            });
        }
    }
    subscribe() {
        { // setWorkflowState
            let token = pubsub.subscribe('setWorkflowState', (msg, workflowState) => {
                this.setState({ workflowState: workflowState });
            });
            this.pubsubTokens.push(token);
        }
    }
    unsubscribe() {
        _.each(this.pubsubTokens, (token) => {
            pubsub.unsubscribe(token);
        });
        this.pubsubTokens = [];
    }
    addSocketEventListener() {
        _.each(this.socketEventListener, (callback, eventName) => {
            socket.on(eventName, callback);
        });
    }
    removeSocketEventListener() {
        _.each(this.socketEventListener, (callback, eventName) => {
            socket.off(eventName, callback);
        });
    }
    socketOnGCodeQueueStatus(data) {
        if (data.executed >= data.total) {
            this.setState({ queueFinished: true });
        }
    }
    handleRun() {
        let { workflowState } = this.state;
        console.assert(_.includes([WORKFLOW_STATE_IDLE, WORKFLOW_STATE_PAUSED], workflowState));

        if (workflowState === WORKFLOW_STATE_PAUSED) {
            socket.emit('gcode:resume', this.props.port);
            pubsub.publish('gcode:resume');
        } else {
            socket.emit('gcode:start', this.props.port);
            pubsub.publish('gcode:start');
        }

        this.setState({
            workflowState: WORKFLOW_STATE_RUNNING
        });
    }
    handlePause() {
        let { workflowState } = this.state;
        console.assert(_.includes([WORKFLOW_STATE_RUNNING], workflowState));

        socket.emit('gcode:pause', this.props.port);
        pubsub.publish('gcode:pause');

        this.setState({
            workflowState: WORKFLOW_STATE_PAUSED
        });
    }
    handleStop() {
        let { workflowState } = this.state;
        console.assert(_.includes([WORKFLOW_STATE_PAUSED], workflowState));

        socket.emit('gcode:stop', this.props.port);
        pubsub.publish('gcode:stop');

        this.setState({
            workflowState: WORKFLOW_STATE_IDLE
        });
    }
    handleClose() {
        let { workflowState } = this.state;
        console.assert(_.includes([WORKFLOW_STATE_IDLE], workflowState));

        socket.emit('gcode:unload', this.props.port);
        pubsub.publish('gcode:unload'); // Unload the G-code

        this.setState({
            workflowState: WORKFLOW_STATE_IDLE
        });
    }
    render() {
        let { port, ready } = this.props;
        let { workflowState } = this.state;
        let canClick = !!port && ready;
        let canRun = canClick && _.includes([WORKFLOW_STATE_IDLE, WORKFLOW_STATE_PAUSED], workflowState);
        let canPause = canClick && _.includes([WORKFLOW_STATE_RUNNING], workflowState);
        let canStop = canClick && _.includes([WORKFLOW_STATE_PAUSED], workflowState);
        let canClose = canClick && _.includes([WORKFLOW_STATE_IDLE], workflowState);

        return (
            <div className="btn-toolbar" role="toolbar">
                <div className="btn-group btn-group-sm" role="group">
                    <button type="button" className="btn btn-default" title={i18n._('Run')} onClick={::this.handleRun} disabled={!canRun}>
                        <i className="glyphicon glyphicon-play"></i>
                    </button>
                    <button type="button" className="btn btn-default" title={i18n._('Pause')} onClick={::this.handlePause} disabled={!canPause}>
                        <i className="glyphicon glyphicon-pause"></i>
                    </button>
                    <button type="button" className="btn btn-default" title={i18n._('Stop')} onClick={::this.handleStop} disabled={!canStop}>
                        <i className="glyphicon glyphicon-stop"></i>
                    </button>
                    <button type="button" className="btn btn-default" title={i18n._('Close')} onClick={::this.handleClose} disabled={!canClose}>
                        <i className="glyphicon glyphicon-trash"></i>
                    </button>
                </div>
            </div>
        );
    }
}

export default Toolbar;
