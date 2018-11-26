//import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import numeral from 'numeral';
import ReactTable from 'react-table';
import './react-table.css';
//import controller from '../../lib/controller';
//import i18n from '../../lib/i18n';
import log from '../../lib/log';

class ProbingGrid extends PureComponent {
    static propTypes = {
        state: PropTypes.object,
        actions: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            probingObj: [],
            probingString: [],
            referenceZ: 0.0
        };
    }

    clearGrid = () => {
        log.error('ProbingGrid clearGrid');
        this.setState({
            probingObj: [],
            probingString: [],
            referenceZ: 0.0
        });
    };

    handleClickSave = () => {
        //var probingString = [];
        this.state.probingObj.forEach(el => {
            //probingString.push(el.x + ' ' + el.y + ' ' + el.z + '\n');
            this.state.probingString.push(el.x + ' ' + el.y + ' ' + el.z + ' ' + el.pz + '\n');
        });
        var element = document.createElement('a');
        var file = new Blob(this.state.probingString, { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = 'probedata.rpf';
        element.click();
    }

    render() {
        const colWidth = 60;
        const probingColumns = [{
            Header: 'x',
            accessor: 'x',
            width: colWidth
        }, {
            Header: 'y',
            accessor: 'y',
            width: colWidth
        }, {
            Header: 'z',
            accessor: 'z',
            width: colWidth
        }, {
            Header: 'pz',
            accessor: 'pz',
            width: colWidth
        }];

        const { state } = this.props;
        //const { state, actions } = this.props;
        //log.error('ProbingGrid :' + JSON.stringify(state));

        if (Object.prototype.hasOwnProperty.call(state, 'probingData')) {
            //log.error('ProbingGrid :' + JSON.stringify(state));
            //log.error('ProbingGrid :' + JSON.stringify(state.probingData));
            //log.error('ProbingGrid :' + JSON.stringify(state.probingData.result));
            if (state.probingData.printed === false) {
                state.probingData.printed = true;
                log.error('ProbingGrid result :' + JSON.stringify(state.probingData.result));
                let sx = state.probingData.result.x;
                let sy = state.probingData.result.y;
                let sz = state.probingData.result.z;

                // correct new z entry for autolevel plane
                var cz = numeral(0.0).format('0.000');
                if (this.state.probingObj.length > 0) {
                    log.error('ProbingGrid points: ' + this.state.probingObj.length);
                    // first point? use z as reference
                    if (this.state.probingObj.length === 1) {
                        this.state.referenceZ = Number(sz);
                    } else {
                        // same x-y position as before? Replace previous entry
                        let index = this.state.probingObj.length - 1;
                        if (sx === this.state.probingObj[index].x && sy === this.state.probingObj[index].y) {
                            log.error('ProbingGrid repeat position: ');
                            this.state.referenceZ = Number(sz);
                        }
                    }
                    log.error('ProbingGrid new reference: ' + this.state.referenceZ);
                    let PRBz = Number(sz);
                    let corz = PRBz - this.state.referenceZ; // corrected z
                    cz = numeral(corz).format('0.000');
                }

                this.state.probingObj.push({
                    x: sx,
                    y: sy,
                    z: cz,
                    pz: sz
                });
                log.error('ProbingGrid obj : ' + JSON.stringify(this.state.probingObj));
            }
        }

        return (
            <div>
                <div className="form-group">
                    <div className="row no-gutters">
                        <div>
                            <ReactTable
                                data={this.state.probingObj}
                                columns={probingColumns}
                                defaultPageSize={10}
                            />
                        </div>
                        <div>
                            <button onClick={this.clearGrid}>Clear</button>
                            <button onClick={this.handleClickSave}>Save</button>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

export default ProbingGrid;
