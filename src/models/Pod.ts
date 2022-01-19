import {BaseModel} from "./BaseModel";

import {ERROR, SUCCEEDED, SUCCESS, TERMINATING, WARNING} from "../constants";

export class Pod extends BaseModel{
    used: boolean;
    private eventMessage: string | null = null;

    constructor(data: any) {
        super(data);
        this.used = false;
    }

    get status() {
        if (this.data.metadata.deletionTimestamp) {
            return TERMINATING;
        } else if (this.data.status.phase === 'Running') {
            let conditionStatus;
            let containerStatuses;
            let initContainerStatuses;

            if (this.data.status.conditions) {
                conditionStatus = this.data.status.conditions.filter((item : any) => item.status === 'False');
                conditionStatus.length > 0 ? (conditionStatus = true) : (conditionStatus = false);
            }
            if (this.data.status.containerStatuses) {
                containerStatuses = this.data.status.containerStatuses.filter((item: any) => item.ready === false);
                containerStatuses.length > 0 ? (containerStatuses = true) : (containerStatuses = false);
            }
            if (this.data.status.initContainerStatuses) {
                initContainerStatuses = this.data.status.initContainerStatuses.filter((item: any) => item.ready === false);
                initContainerStatuses.length > 0 ? (initContainerStatuses = true) : (initContainerStatuses = false);
            }
            if (conditionStatus || containerStatuses || initContainerStatuses) {
                return ERROR;
            } else {
                return SUCCESS;
            }
        } else {
            switch (this.data.status.phase) {
                case 'Pending':
                    return WARNING;
                case 'Succeeded':
                    return SUCCEEDED;
                case 'Failed':
                    return ERROR;
                case 'Unknown':
                    return ERROR;
                default:
                    return ERROR;
            }
        }
    }

    get color() {
        switch (this.status) {
            case ERROR:
                return 'error';
            case WARNING:
                return 'warning';
            case TERMINATING:
                return 'terminating';
            case SUCCESS:
                return 'success';
            case SUCCEEDED:
                return 'succeeded';
            default:
                return 'success';
        }
    }

    get message() {
        if (this.eventMessage) {
            return this.eventMessage;
        }

        let status = this.status;
        let data = this.data;
        let phase = this.data.status.phase;
        let message = 'Pod is ' + phase;
        if (status === ERROR) {
            if (data.status.containerStatuses) {
                let d = data.status.containerStatuses.filter((item: any) => item.ready === false)[0];
                if (d && d.state && d.state.waiting) {
                    if (d.state.waiting.message && d.state.waiting.reason) {
                        message = d.state.waiting.reason + '. ' + d.state.waiting.message;
                        return message;
                    }
                }
            } else if (data.status.conditions) {
                let d = data.status.conditions.filter(
                    (item: any) => item.ready === false || (item.type === 'PodScheduled' && item.status === 'False')
                )[0];
                if (d !== undefined) {
                    return d.message;
                }
            } else if (data.status.message) {
                return data.status.message;
            }
            return 'Undefined error';
        } else {
            if (this.data.metadata.deletionTimestamp) {
                return 'Pod is Terminating';
            } else if (phase === 'Running' || phase === 'Succeeded') {
                return 'Pod is ' + phase;
            } else {
                if (data.status.containerStatuses) {
                    let d = data.status.containerStatuses.filter((item: any) => item.ready === false)[0];
                    if (d.state.waiting.message && d.state.waiting.message.length > 0) {
                        message = d.state.waiting.message;
                    }
                } else if (data.status.conditions) {
                    let d = data.status.conditions.filter(
                        (item: any) => item.ready === false || (item.type === 'PodScheduled' && item.status === 'False')
                    )[0];
                    if (d !== undefined) {
                        message = d.message;
                    }
                } else if (data.status.message) {
                    message = data.status.message;
                }
                return message;
            }
        }
    }

    set message(msg) {
        this.eventMessage = msg;
    }
}